// PlanIt backend — Express + JWT + JSON file storage
// Endpoints:
//  POST /api/register   { email, senha, nome? }   -> { token, user }
//  POST /api/login      { email, senha }          -> { token, user }
//  GET  /api/me                                   -> { user }
//  GET  /api/viagens                              -> [viagens]
//  PUT  /api/viagens    [viagens]                 -> { ok: true }

import express from "express"
import cors from "cors"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const DB_PATH = path.join(__dirname, "planit-db.json")
const SECRET = process.env.JWT_SECRET || "planit-dev-secret-change-me"
const PORT = process.env.PORT || 3001

// ===== "Banco" via JSON file =====
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

// ===== Helpers =====
function gerarToken(user) {
  return jwt.sign({ id: user.id, email: user.email }, SECRET, {
    expiresIn: "30d",
  })
}
function publicUser(user) {
  return { id: user.id, email: user.email, nome: user.nome || "" }
}

// ===== App =====
const app = express()
app.use(cors())
app.use(express.json({ limit: "5mb" }))

// Middleware: extrai user do Authorization header
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

// ===== Rotas =====

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, app: "PlanIt", versao: 1 })
})

app.post("/api/register", async (req, res) => {
  const { email, senha, nome } = req.body || {}
  if (!email || !senha) {
    return res.status(400).json({ erro: "Email e senha são obrigatórios." })
  }
  if (senha.length < 6) {
    return res.status(400).json({ erro: "A senha precisa ter pelo menos 6 caracteres." })
  }
  const db = loadDb()
  const emailNorm = String(email).trim().toLowerCase()
  if (db.users.find((u) => u.email === emailNorm)) {
    return res.status(409).json({ erro: "Esse email já está cadastrado." })
  }
  const senhaHash = await bcrypt.hash(senha, 10)
  const novoUser = {
    id: db.nextId++,
    email: emailNorm,
    senhaHash,
    nome: (nome || "").trim(),
    viagens: [],
    criadoEm: new Date().toISOString(),
  }
  db.users.push(novoUser)
  saveDb(db)
  const token = gerarToken(novoUser)
  res.status(201).json({ token, user: publicUser(novoUser) })
})

app.post("/api/login", async (req, res) => {
  const { email, senha } = req.body || {}
  if (!email || !senha) {
    return res.status(400).json({ erro: "Email e senha são obrigatórios." })
  }
  const db = loadDb()
  const emailNorm = String(email).trim().toLowerCase()
  const user = db.users.find((u) => u.email === emailNorm)
  if (!user) {
    return res.status(401).json({ erro: "Email ou senha incorretos." })
  }
  const ok = await bcrypt.compare(senha, user.senhaHash)
  if (!ok) {
    return res.status(401).json({ erro: "Email ou senha incorretos." })
  }
  const token = gerarToken(user)
  res.json({ token, user: publicUser(user) })
})

app.get("/api/me", autenticar, (req, res) => {
  res.json({ user: publicUser(req.user) })
})

app.get("/api/viagens", autenticar, (req, res) => {
  res.json(req.user.viagens || [])
})

app.put("/api/viagens", autenticar, (req, res) => {
  const viagens = Array.isArray(req.body) ? req.body : null
  if (!viagens) {
    return res.status(400).json({ erro: "Body deve ser um array de viagens." })
  }
  const db = req.db
  const idx = db.users.findIndex((u) => u.id === req.user.id)
  if (idx === -1) return res.status(404).json({ erro: "Usuário não encontrado." })
  db.users[idx].viagens = viagens
  saveDb(db)
  res.json({ ok: true, qtd: viagens.length })
})

app.listen(PORT, () => {
  console.log(`🛫 PlanIt backend rodando em http://localhost:${PORT}`)
  console.log(`   DB: ${DB_PATH}`)
})
