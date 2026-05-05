import { useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import NovaViagemModal from "../components/NovaViagemModal"
import ConfirmModal from "../components/ConfirmModal"
import { useViagens } from "../hooks/useViagens"
import { destinos, formatarBRL } from "../data/destinos"

function Dashboard() {
  const {
    viagens,
    adicionarViagem,
    atualizarViagem,
    removerViagem,
  } = useViagens()

  const [modalAberto, setModalAberto] = useState(false)
  const [viagemEditando, setViagemEditando] = useState(null)
  const [viagemParaExcluir, setViagemParaExcluir] = useState(null)
  const [busca, setBusca] = useState("")

  const navigate = useNavigate()

  function abrirNova() {
    setViagemEditando(null)
    setModalAberto(true)
  }

  function abrirEdicao(viagem) {
    setViagemEditando(viagem)
    setModalAberto(true)
  }

  function fecharModal() {
    setModalAberto(false)
    setViagemEditando(null)
  }

  function salvarViagem(dados) {
    if (viagemEditando) {
      atualizarViagem(viagemEditando.id, dados)
    } else {
      adicionarViagem(dados)
    }
  }

  function confirmarExclusao() {
    if (viagemParaExcluir) {
      removerViagem(viagemParaExcluir.id)
      setViagemParaExcluir(null)
    }
  }

  // Filtra viagens pelo destino
  const viagensFiltradas = useMemo(() => {
    if (!busca.trim()) return viagens
    const termo = busca.toLowerCase()
    return viagens.filter((v) =>
      (v.destino || "").toLowerCase().includes(termo)
    )
  }, [viagens, busca])

  function calcularTotal(viagem) {
    return (viagem.pontosTuristicos || []).reduce(
      (acc, p) => acc + (Number(p.valor) || 0),
      0
    )
  }

  function bandeira(destino) {
    return destinos[destino]?.bandeira || "📍"
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm px-6 py-4 flex items-center justify-between">
        <h1 className="text-xl font-bold text-indigo-600">✈️ PlanIt</h1>
        <span className="text-gray-500 text-sm">Olá, Mateus 👋</span>
      </header>

      <main className="max-w-4xl mx-auto p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Minhas Viagens</h2>
          <button
            onClick={abrirNova}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-indigo-700 transition"
          >
            + Nova Viagem
          </button>
        </div>

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
          <div className="bg-white rounded-2xl shadow p-12 text-center text-gray-400">
            <p className="text-5xl mb-4">🗺️</p>
            <p className="text-lg font-medium">Nenhuma viagem ainda</p>
            <p className="text-sm mt-1">
              Clique em "Nova Viagem" para começar!
            </p>
          </div>
        ) : viagensFiltradas.length === 0 ? (
          <div className="bg-white rounded-2xl shadow p-8 text-center text-gray-400">
            <p className="text-3xl mb-2">🔍</p>
            <p>Nenhuma viagem encontrada para "{busca}".</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {viagensFiltradas.map((viagem) => {
              const total = calcularTotal(viagem)
              const qtd = (viagem.pontosTuristicos || []).length
              return (
                <div
                  key={viagem.id}
                  className="bg-white rounded-2xl shadow p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
                >
                  <div className="min-w-0 flex-1">
                    <h3 className="text-lg font-bold text-gray-800 truncate">
                      {bandeira(viagem.destino)} {viagem.destino}
                    </h3>
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
                      <span className="bg-green-50 text-green-700 px-2 py-1 rounded-full">
                        💰 {formatarBRL(total)}
                      </span>
                    </div>
                  </div>

                  <div className="flex sm:flex-col gap-2 sm:items-end">
                    <button
                      onClick={() => navigate(`/viagem/${viagem.id}`)}
                      className="text-indigo-600 font-semibold text-sm cursor-pointer hover:underline"
                    >
                      Ver detalhes →
                    </button>
                    <div className="flex gap-2">
                      <button
                        onClick={() => abrirEdicao(viagem)}
                        title="Editar"
                        className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-2 py-1 rounded-md transition"
                      >
                        ✏️ Editar
                      </button>
                      <button
                        onClick={() => setViagemParaExcluir(viagem)}
                        title="Excluir"
                        className="text-xs bg-red-50 hover:bg-red-100 text-red-700 px-2 py-1 rounded-md transition"
                      >
                        🗑️ Excluir
                      </button>
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
    </div>
  )
}

export default Dashboard
