import { useMemo, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import NovaViagemModal from "../components/NovaViagemModal"
import ConfirmModal from "../components/ConfirmModal"
import { useViagens } from "../hooks/useViagens"
import { useCotacoes } from "../hooks/useCotacoes"
import { useAuth } from "../contexts/AuthContext"
import { useTheme } from "../hooks/useTheme"
import { destinos, formatarBRL, converterParaBRL } from "../data/destinos"

// Calcula dias entre hoje e a data de ida (negativo se passou).
// Retorna { texto, cor } pra renderizar o badge.
function statusViagem(dataIda, dataVolta) {
  if (!dataIda) return null
  const hoje = new Date()
  hoje.setHours(0, 0, 0, 0)
  const ida = new Date(`${dataIda}T12:00:00`)
  ida.setHours(0, 0, 0, 0)
  const volta = dataVolta ? new Date(`${dataVolta}T12:00:00`) : ida
  volta.setHours(0, 0, 0, 0)

  const MS_DIA = 24 * 60 * 60 * 1000
  const diasAteIda = Math.round((ida - hoje) / MS_DIA)
  const diasAteVolta = Math.round((volta - hoje) / MS_DIA)

  if (diasAteVolta < 0) {
    return { texto: "✓ Concluída", cor: "bg-gray-100 text-gray-600" }
  }
  if (diasAteIda <= 0 && diasAteVolta >= 0) {
    return { texto: "🌴 Em andamento", cor: "bg-emerald-50 text-emerald-700" }
  }
  if (diasAteIda === 1) {
    return { texto: "🚀 Amanhã!", cor: "bg-orange-50 text-orange-700" }
  }
  if (diasAteIda <= 7) {
    return { texto: `🔥 Faltam ${diasAteIda} dias`, cor: "bg-orange-50 text-orange-700" }
  }
  if (diasAteIda <= 30) {
    return { texto: `🕐 Faltam ${diasAteIda} dias`, cor: "bg-amber-50 text-amber-700" }
  }
  return { texto: `🗓️ Em ${diasAteIda} dias`, cor: "bg-blue-50 text-blue-700" }
}

function Dashboard() {
  const {
    viagens,
    adicionarViagem,
    atualizarViagem,
    removerViagem,
    substituirViagens,
    mesclarViagens,
  } = useViagens()
  const cotacoes = useCotacoes()
  const { user, logout } = useAuth()
  const { tema, alternar } = useTheme()

  const [modalAberto, setModalAberto] = useState(false)
  const [viagemEditando, setViagemEditando] = useState(null)
  const [viagemParaExcluir, setViagemParaExcluir] = useState(null)
  const [busca, setBusca] = useState("")
  const [importarModal, setImportarModal] = useState(null)
  const [mensagem, setMensagem] = useState(null)
  const inputFileRef = useRef(null)

  const navigate = useNavigate()

  function abrirNova() { setViagemEditando(null); setModalAberto(true) }
  function abrirEdicao(viagem) { setViagemEditando(viagem); setModalAberto(true) }
  function fecharModal() { setModalAberto(false); setViagemEditando(null) }
  function salvarViagem(dados) {
    if (viagemEditando) atualizarViagem(viagemEditando.id, dados)
    else adicionarViagem(dados)
  }
  function confirmarExclusao() {
    if (viagemParaExcluir) {
      removerViagem(viagemParaExcluir.id)
      setViagemParaExcluir(null)
    }
  }

  function exportarTudo() {
    if (viagens.length === 0) {
      mostrarMensagem("aviso", "Você ainda não tem viagens para exportar.")
      return
    }
    const conteudo = {
      app: "PlanIt", versao: 1,
      exportadoEm: new Date().toISOString(),
      viagens,
    }
    const blob = new Blob([JSON.stringify(conteudo, null, 2)], {
      type: "application/json",
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `planit-backup-${new Date().toISOString().slice(0, 10)}.json`
    document.body.appendChild(a); a.click(); document.body.removeChild(a)
    URL.revokeObjectURL(url)
    mostrarMensagem("sucesso", `Backup com ${viagens.length} viagem(ns) baixado!`)
  }

  function abrirImportar() { inputFileRef.current?.click() }

  function onArquivoSelecionado(e) {
    const arquivo = e.target.files?.[0]
    e.target.value = ""
    if (!arquivo) return
    const leitor = new FileReader()
    leitor.onload = () => {
      try {
        const conteudo = JSON.parse(String(leitor.result))
        const lista = Array.isArray(conteudo)
          ? conteudo
          : Array.isArray(conteudo.viagens) ? conteudo.viagens : null
        if (!lista) {
          mostrarMensagem("erro", "Arquivo não parece ser um backup do PlanIt.")
          return
        }
        const validas = lista.filter((v) => v && typeof v === "object" && v.destino)
        if (validas.length === 0) {
          mostrarMensagem("erro", "Nenhuma viagem válida encontrada no arquivo.")
          return
        }
        setImportarModal({ viagens: validas })
      } catch {
        mostrarMensagem("erro", "Não consegui ler o arquivo. JSON inválido?")
      }
    }
    leitor.readAsText(arquivo)
  }

  function importarSubstituindo() {
    if (!importarModal) return
    substituirViagens(importarModal.viagens)
    mostrarMensagem("sucesso", `${importarModal.viagens.length} viagem(ns) importada(s). Suas viagens anteriores foram substituídas.`)
    setImportarModal(null)
  }

  function importarMesclando() {
    if (!importarModal) return
    mesclarViagens(importarModal.viagens)
    mostrarMensagem("sucesso", `${importarModal.viagens.length} viagem(ns) adicionada(s) ao seu painel.`)
    setImportarModal(null)
  }

  function mostrarMensagem(tipo, texto) {
    setMensagem({ tipo, texto })
    setTimeout(() => setMensagem(null), 4500)
  }

  function handleLogout() {
    logout()
    navigate("/")
  }

  const viagensFiltradas = useMemo(() => {
    if (!busca.trim()) return viagens
    const termo = busca.toLowerCase()
    return viagens.filter((v) => (v.destino || "").toLowerCase().includes(termo))
  }, [viagens, busca])

  function calcularTotal(viagem) {
    const pessoas = Math.max(1, Number(viagem.pessoas) || 1)
    const soma = (viagem.pontosTuristicos || []).reduce(
      (acc, p) => acc + converterParaBRL(p.valor, p.moeda || "BRL", cotacoes),
      0
    )
    return soma * pessoas
  }

  function bandeira(destino) { return destinos[destino]?.bandeira || "📍" }

  const nomeUser = user?.nome || user?.email?.split("@")[0] || "viajante"

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 dark:text-gray-100">
      <header className="bg-white dark:bg-gray-800 shadow-sm px-6 py-4 flex items-center justify-between">
        <h1 className="text-xl font-bold text-indigo-600">✈️ PlanIt</h1>
        <div className="flex items-center gap-4">
          <span className="text-gray-500 text-sm">Olá, {nomeUser} 👋</span>
          <button
            onClick={alternar}
            className="text-xs bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 px-3 py-1.5 rounded-md transition"
            title={tema === "escuro" ? "Tema claro" : "Tema escuro"}
          >
            {tema === "escuro" ? "☀️" : "🌙"}
          </button>
          <button
            onClick={handleLogout}
            className="text-xs bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 px-3 py-1.5 rounded-md transition"
            title="Sair"
          >
            Sair
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Minhas Viagens</h2>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={abrirImportar}
              className="text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg font-medium transition"
              title="Importar viagens de um arquivo .json"
            >📤 Importar</button>
            <button
              onClick={exportarTudo}
              className="text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg font-medium transition"
              title="Baixar backup de todas as viagens"
            >📥 Exportar</button>
            <button
              onClick={abrirNova}
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-indigo-700 transition"
            >+ Nova Viagem</button>
          </div>
        </div>

        <input
          ref={inputFileRef}
          type="file"
          accept="application/json,.json"
          className="hidden"
          onChange={onArquivoSelecionado}
        />

        {mensagem && (
          <div className={`mb-4 rounded-lg px-4 py-2 text-sm border ${
            mensagem.tipo === "sucesso" ? "bg-green-50 text-green-800 border-green-200"
            : mensagem.tipo === "erro" ? "bg-red-50 text-red-800 border-red-200"
            : "bg-yellow-50 text-yellow-800 border-yellow-200"
          }`}>{mensagem.texto}</div>
        )}

        {viagens.length > 0 && (
          <div className="mb-4">
            <input
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              type="text"
              placeholder="🔎 Buscar por destino..."
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>
        )}

        {viagens.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-12 text-center text-gray-400 dark:text-gray-500">
            <p className="text-5xl mb-4">🗺️</p>
            <p className="text-lg font-medium">Nenhuma viagem ainda</p>
            <p className="text-sm mt-1">Clique em "Nova Viagem" para começar!</p>
          </div>
        ) : viagensFiltradas.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-8 text-center text-gray-400 dark:text-gray-500">
            <p className="text-3xl mb-2">🔍</p>
            <p>Nenhuma viagem encontrada para "{busca}".</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {viagensFiltradas.map((viagem) => {
              const pessoas = Math.max(1, Number(viagem.pessoas) || 1)
              const total = calcularTotal(viagem)
              const qtd = (viagem.pontosTuristicos || []).length
              const orcamento = Number(viagem.orcamento) || 0
              const temOrcamento = orcamento > 0
              const excedeu = temOrcamento && total > orcamento
              const percUsado = temOrcamento ? (total / orcamento) * 100 : 0
              const status = statusViagem(viagem.dataIda, viagem.dataVolta)

              return (
                <div
                  key={viagem.id}
                  className="bg-white dark:bg-gray-800 rounded-2xl shadow p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 truncate">
                        {bandeira(viagem.destino)} {viagem.destino}
                      </h3>
                      {status && (
                        <span className={`text-xs px-2 py-0.5 rounded-full ${status.cor}`}>
                          {status.texto}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      {viagem.dataIda} → {viagem.dataVolta}
                    </p>
                    {viagem.descricao && (
                      <p className="text-sm text-gray-400 mt-1 line-clamp-2">
                        {viagem.descricao}
                      </p>
                    )}
                    <div className="flex flex-wrap gap-2 mt-2 text-xs">
                      <span className="bg-indigo-50 text-indigo-700 px-2 py-1 rounded-full">
                        🎟️ {qtd} {qtd === 1 ? "passeio" : "passeios"}
                      </span>
                      <span className="bg-purple-50 text-purple-700 px-2 py-1 rounded-full">
                        👥 {pessoas} {pessoas === 1 ? "pessoa" : "pessoas"}
                      </span>
                      <span className="bg-green-50 text-green-700 px-2 py-1 rounded-full">
                        💰 {formatarBRL(total)}
                      </span>
                      {temOrcamento && (
                        <span className={`px-2 py-1 rounded-full ${
                          excedeu ? "bg-red-50 text-red-700"
                          : percUsado >= 70 ? "bg-yellow-50 text-yellow-700"
                          : "bg-blue-50 text-blue-700"
                        }`} title={`Orçamento: ${formatarBRL(orcamento)}`}>
                          💼 {percUsado.toFixed(0)}% do orçamento
                          {excedeu && " ⚠️"}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex sm:flex-col gap-2 sm:items-end">
                    <button
                      onClick={() => navigate(`/viagem/${viagem.id}`)}
                      className="text-indigo-600 font-semibold text-sm cursor-pointer hover:underline"
                    >Ver detalhes →</button>
                    <div className="flex gap-2">
                      <button
                        onClick={() => abrirEdicao(viagem)}
                        className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-2 py-1 rounded-md transition"
                      >✏️ Editar</button>
                      <button
                        onClick={() => setViagemParaExcluir(viagem)}
                        className="text-xs bg-red-50 hover:bg-red-100 text-red-700 px-2 py-1 rounded-md transition"
                      >🗑️ Excluir</button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </main>

      {modalAberto && (
        <NovaViagemModal
          onClose={fecharModal}
          onSalvar={salvarViagem}
          viagemEditando={viagemEditando}
        />
      )}

      {viagemParaExcluir && (
        <ConfirmModal
          titulo="Excluir viagem?"
          mensagem={`A viagem para "${viagemParaExcluir.destino}" será removida permanentemente.`}
          textoConfirmar="Excluir"
          perigo
          onConfirmar={confirmarExclusao}
          onCancelar={() => setViagemParaExcluir(null)}
        />
      )}

      {importarModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-bold text-gray-800 mb-2">
              Importar {importarModal.viagens.length} viagem(ns)
            </h3>
            <p className="text-sm text-gray-600 mb-5">
              Você já tem <strong>{viagens.length}</strong> viagem(ns) salva(s). O que prefere fazer?
            </p>
            <div className="space-y-2">
              <button
                onClick={importarMesclando}
                className="w-full text-left bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-lg p-3 transition"
              >
                <p className="font-semibold text-indigo-800 text-sm">➕ Adicionar às minhas viagens</p>
                <p className="text-xs text-indigo-700 mt-0.5">Mantém as atuais e acrescenta as importadas.</p>
              </button>
              <button
                onClick={importarSubstituindo}
                className="w-full text-left bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg p-3 transition"
              >
                <p className="font-semibold text-red-800 text-sm">🔁 Substituir tudo</p>
                <p className="text-xs text-red-700 mt-0.5">Apaga as atuais e usa só as importadas.</p>
              </button>
              <button
                onClick={() => setImportarModal(null)}
                className="w-full border border-gray-300 text-gray-700 py-2 rounded-lg font-semibold hover:bg-gray-50 transition mt-2"
              >Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Dashboard
