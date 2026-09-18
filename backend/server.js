// PlanIt backend — Express + JWT + persistência em arquivo JSON
//
// Endpoints:
//  GET  /api/health                               -> { ok: true }
//  POST /api/register   { email, senha, nome? }   -> { token, user }
//  POST /api/login      { email, senha }          -> { token, user }
//  GET  /api/me                                   -> { user }
//  GET  /api/viagens                              -> [viagens]
//  PUT  /api/viagens    [viagens]                 -> { ok: true, qtd }

import express from "express"
import cors from "cors"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const DB_PATH = path.join(__dirname, "planit-db.json")

// ===================== Variáveis de ambiente =====================

// Carrega o .env local, se existir. Em produção (Render, Railway, etc.) as
// variáveis vêm do próprio ambiente e este arquivo nem precisa existir.
// São poucas linhas para o caso de uso — não justificava somar o dotenv
// às dependências. Precisa rodar antes de qualquer leitura de process.env.
function carregarEnv() {
  const caminho = path.join(__dirname, ".env")
  if (!fs.existsSync(caminho)) return
  for (const linha of fs.readFileSync(caminho, "utf8").split("\n")) {
    const texto = linha.trim()
    if (!texto || texto.startsWith("#")) continue
    const corte = texto.indexOf("=")
    if (corte === -1) continue
    const chave = texto.slice(0, corte).trim()
    // Quem já está definido no ambiente tem prioridade sobre o arquivo.
    if (process.env[chave] !== undefined) continue
    process.env[chave] = texto.slice(corte + 1).trim().replace(/^["']|["']$/g, "")
  }
}
carregarEnv()

const PORT = process.env.PORT || 3001
const PRODUCAO = process.env.NODE_ENV === "production"

// O segredo do JWT precisa vir do ambiente em produção. Aceitar um valor
// padrão que está publicado no repositório permitiria que qualquer pessoa
// forjasse um token válido para qualquer conta.
const SECRET = (() => {
  if (process.env.JWT_SECRET) return process.env.JWT_SECRET
  if (PRODUCAO) {
    console.error("FATAL: defina JWT_SECRET no ambiente antes de subir em produção.")
    console.error('Gere uma: node -e "console.log(require(\'crypto\').randomBytes(48).toString(\'hex\'))"')
    process.exit(1)
  }
  console.warn("⚠️  JWT_SECRET não definido — usando chave de desenvolvimento.")
  return "planit-dev-secret-change-me"
})()

// Origens liberadas no CORS. O padrão cobre o dev server e o preview do Vite;
// em produção, defina CORS_ORIGIN com o domínio do frontend.
const ORIGENS_PERMITIDAS = (
  process.env.CORS_ORIGIN || "http://localhost:5173,http://localhost:4173"
)
  .split(",")
  .map((origem) => origem.trim())
  .filter(Boolean)

// Tetos de payload. Os valores são folgados para uso real (uma viagem comum
// tem algumas dezenas de passeios) e existem para evitar que alguém use a
// conta como armazenamento arbitrário.
const LIMITES = {
  viagensPorConta: 100,
  itensPorLista: 300,
}

// ===================== "Banco" via arquivo JSON =====================

function loadDb() {
  try {
    return JSON.parse(fs.readFileSync(DB_PATH, "utf8"))
  } catch {
    return { users: [], nextId: 1 }
  }
}

function saveDb(db) {
  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2))
}

// ===================== Helpers =====================

function gerarToken(user) {
  return jwt.sign({ id: user.id, email: user.email }, SECRET, { expiresIn: "30d" })
}

function publicUser(user) {
  return { id: user.id, email: user.email, nome: user.nome || "" }
}

// Limitador de taxa em memória, por IP.
//
// Suficiente para uma instância única, que é a arquitetura atual (o "banco"
// é um arquivo no disco local, então rodar réplicas já não funcionaria).
// Se um dia o backend escalar horizontalmente, este contador precisa sair
// da memória do processo e ir para um Redis — senão cada réplica conta
// separado e o limite efetivo vira N vezes o configurado.
function rateLimit({ janelaMs, maximo, mensagem }) {
  const registros = new Map()

  // Descarta janelas vencidas para o Map não crescer sem limite.
  // unref() evita que o timer segure o processo vivo no shutdown.
  const limpeza = setInterval(() => {
    const agora = Date.now()
    for (const [chave, registro] of registros) {
      if (agora > registro.expiraEm) registros.delete(chave)
    }
  }, janelaMs)
  limpeza.unref()

  return function limitador(req, res, next) {
    const chave = req.ip
    const agora = Date.now()
    const registro = registros.get(chave)

    if (!registro || agora > registro.expiraEm) {
      registros.set(chave, { contagem: 1, expiraEm: agora + janelaMs })
      return next()
    }

    registro.contagem += 1
    if (registro.contagem > maximo) {
      const segundos = Math.ceil((registro.expiraEm - agora) / 1000)
      res.setHeader("Retry-After", String(segundos))
      return res.status(429).json({ erro: mensagem, tentarEmSegundos: segundos })
    }
    next()
  }
}

// Valida o array de viagens vindo do cliente.
//
// A checagem é deliberadamente estrutural, e não um schema campo a campo:
// o import de backup aceita arquivos gerados por versões anteriores, e uma
// validação rígida rejeitaria dados legítimos a cada campo novo. O que
// importa aqui é barrar lixo e conter o tamanho.
//
// Retorna null quando está tudo certo, ou a mensagem de erro.
function validarViagens(dados) {
  if (!Array.isArray(dados)) {
    return "O corpo da requisição deve ser um array de viagens."
  }
  if (dados.length > LIMITES.viagensPorConta) {
    return `Máximo de ${LIMITES.viagensPorConta} viagens por conta.`
  }

  const idsVistos = new Set()

  for (const viagem of dados) {
    if (!viagem || typeof viagem !== "object" || Array.isArray(viagem)) {
      return "Cada viagem deve ser um objeto."
    }
    if (typeof viagem.id !== "string" && typeof viagem.id !== "number") {
      return "Toda viagem precisa de um id."
    }
    if (idsVistos.has(viagem.id)) {
      return `Existe mais de uma viagem com o id ${viagem.id}.`
    }
    idsVistos.add(viagem.id)

    for (const campo of ["pontosTuristicos", "voos", "checklist"]) {
      const lista = viagem[campo]
      if (lista == null) continue
      if (!Array.isArray(lista)) {
        return `O campo "${campo}" deve ser uma lista.`
      }
      if (lista.length > LIMITES.itensPorLista) {
        return `Máximo de ${LIMITES.itensPorLista} itens em "${campo}".`
      }
    }
  }

  return null
}

// ===================== App =====================

const app = express()

// Atrás de um proxy (Render, Railway, Nginx) o IP real chega no
// X-Forwarded-For. Sem isto, req.ip seria o IP do proxy para todo mundo
// e o rate limit trataria todos os usuários como um só.
if (PRODUCAO) app.set("trust proxy", 1)

app.use(
  cors({
    origin(origin, callback) {
      // Requisição sem header Origin: curl, health check do provedor,
      // app nativo. Não é contexto de navegador, então não há credencial
      // de outro site em risco aqui.
      if (!origin) return callback(null, true)
      // Nega sem lançar exceção: o middleware simplesmente não devolve os
      // headers de CORS e o navegador bloqueia, em vez de virar um 500.
      callback(null, ORIGENS_PERMITIDAS.includes(origin))
    },
  })
)

app.use(express.json({ limit: "2mb" }))

// Brute force em senha é o ataque mais barato contra este backend.
const limiteLogin = rateLimit({
  janelaMs: 15 * 60 * 1000,
  maximo: 10,
  mensagem: "Muitas tentativas de login. Tente novamente em alguns minutos.",
})

// Cadastro é mais restrito: ninguém cria 5 contas por hora de boa-fé.
const limiteCadastro = rateLimit({
  janelaMs: 60 * 60 * 1000,
  maximo: 5,
  mensagem: "Muitas contas criadas a partir deste endereço. Tente mais tarde.",
})

// Middleware: extrai o usuário do header Authorization
function autenticar(req, res, next) {
  const auth = req.headers.authorization || ""
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : null
  if (!token) return res.status(401).json({ erro: "Faltou o token." })
  try {
    const payload = jwt.verify(token, SECRET)
    const db = loadDb()
    const user = db.users.find((u) => u.id === payload.id)
    if (!user) return res.status(401).json({ erro: "Usuário não existe mais." })
    req.user = user
    req.db = db
    next()
  } catch {
    return res.status(401).json({ erro: "Token inválido ou expirado." })
  }
}

// ===================== Rotas =====================

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, app: "PlanIt", versao: 1 })
})

app.post("/api/register", limiteCadastro, async (req, res) => {
  const { email, senha, nome } = req.body || {}
  if (!email || !senha) {
    return res.status(400).json({ erro: "Email e senha são obrigatórios." })
  }
  if (typeof email !== "string" || typeof senha !== "string") {
    return res.status(400).json({ erro: "Email e senha devem ser texto." })
  }
  if (senha.length < 6) {
    return res.status(400).json({ erro: "A senha precisa ter pelo menos 6 caracteres." })
  }
  if (senha.length > 200) {
    return res.status(400).json({ erro: "Senha longa demais." })
  }
  const emailNorm = email.trim().toLowerCase()
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailNorm)) {
    return res.status(400).json({ erro: "Email inválido." })
  }

  const db = loadDb()
  if (db.users.find((u) => u.email === emailNorm)) {
    return res.status(409).json({ erro: "Esse email já está cadastrado." })
  }

  const senhaHash = await bcrypt.hash(senha, 10)
  const novoUser = {
    id: db.nextId++,
    email: emailNorm,
    senhaHash,
    nome: String(nome || "").trim().slice(0, 100),
    viagens: [],
    criadoEm: new Date().toISOString(),
  }
  db.users.push(novoUser)
  saveDb(db)

  res.status(201).json({ token: gerarToken(novoUser), user: publicUser(novoUser) })
})

app.post("/api/login", limiteLogin, async (req, res) => {
  const { email, senha } = req.body || {}
  if (!email || !senha) {
    return res.status(400).json({ erro: "Email e senha são obrigatórios." })
  }
  if (typeof email !== "string" || typeof senha !== "string") {
    return res.status(400).json({ erro: "Email e senha devem ser texto." })
  }

  const db = loadDb()
  const emailNorm = email.trim().toLowerCase()
  const user = db.users.find((u) => u.email === emailNorm)

  // A mensagem é a mesma para email inexistente e senha errada, de propósito:
  // distinguir os dois casos entregaria de graça quais emails têm conta aqui.
  const generico = { erro: "Email ou senha incorretos." }
  if (!user) return res.status(401).json(generico)

  const ok = await bcrypt.compare(senha, user.senhaHash)
  if (!ok) return res.status(401).json(generico)

  res.json({ token: gerarToken(user), user: publicUser(user) })
})

app.get("/api/me", autenticar, (req, res) => {
  res.json({ user: publicUser(req.user) })
})

app.get("/api/viagens", autenticar, (req, res) => {
  res.json(req.user.viagens || [])
})

app.put("/api/viagens", autenticar, (req, res) => {
  const erro = validarViagens(req.body)
  if (erro) return res.status(400).json({ erro })

  const db = req.db
  const idx = db.users.findIndex((u) => u.id === req.user.id)
  if (idx === -1) return res.status(404).json({ erro: "Usuário não encontrado." })

  db.users[idx].viagens = req.body
  saveDb(db)
  res.json({ ok: true, qtd: req.body.length })
})

// Body maior que o limite do express.json vem parar aqui como erro 413.
// Sem este handler, o cliente receberia um HTML de stack trace.
app.use((err, _req, res, _next) => {
  if (err?.type === "entity.too.large") {
    return res.status(413).json({ erro: "Os dados enviados são grandes demais." })
  }
  if (err instanceof SyntaxError && "body" in err) {
    return res.status(400).json({ erro: "JSON inválido." })
  }
  console.error("Erro não tratado:", err)
  res.status(500).json({ erro: "Erro interno no servidor." })
})

app.listen(PORT, () => {
  console.log(`🛫 PlanIt backend rodando em http://localhost:${PORT}`)
  console.log(`   DB:      ${DB_PATH}`)
  console.log(`   Origens: ${ORIGENS_PERMITIDAS.join(", ")}`)
})
