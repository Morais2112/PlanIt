import { useState } from "react"
import { useNavigate } from "react-router-dom"
import NovaViagemModal from "../components/NovaViagemModal"

function Dashboard() {
  const navigate = useNavigate()

  const [modalAberto, setModalAberto] = useState(false)
  const [viagemEditando, setViagemEditando] = useState(null)
  const [indexEditando, setIndexEditando] = useState(null)
  const [viagens, setViagens] = useState(() => {
    const salvas = localStorage.getItem("viagens")
    return salvas ? JSON.parse(salvas) : []
  })

  function salvarNoStorage(novasViagens) {
    setViagens(novasViagens)
    localStorage.setItem("viagens", JSON.stringify(novasViagens))
  }

  function salvarViagem(dados) {
    salvarNoStorage([...viagens, dados])
  }

  function deletarViagem(index) {
    salvarNoStorage(viagens.filter((_, i) => i !== index))
  }

  function abrirEdicao(index) {
    setViagemEditando(viagens[index])
    setIndexEditando(index)
  }

  function salvarEdicao(dados) {
    salvarNoStorage(viagens.map((v, i) => (i === indexEditando ? dados : v)))
    setViagemEditando(null)
    setIndexEditando(null)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm px-6 py-4 flex items-center justify-between">
        <h1 className="text-xl font-bold text-indigo-600">✈️ PlanIt</h1>
        <span className="text-gray-500 text-sm">Olá, Mateus 👋</span>
      </header>

      <main className="max-w-4xl mx-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Minhas Viagens</h2>
          <button
            onClick={() => setModalAberto(true)}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-indigo-700 transition"
          >
            + Nova Viagem
          </button>
        </div>

        {viagens.length === 0 ? (
          <div className="bg-white rounded-2xl shadow p-12 text-center text-gray-400">
            <p className="text-5xl mb-4">🗺️</p>
            <p className="text-lg font-medium">Nenhuma viagem ainda</p>
            <p className="text-sm mt-1">Clique em "Nova Viagem" para começar!</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {viagens.map((viagem, index) => (
              <div key={index} className="bg-white rounded-2xl shadow p-6 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-gray-800">📍 {viagem.destino}</h3>
                  <p className="text-sm text-gray-500 mt-1">{viagem.dataIda} → {viagem.dataVolta}</p>
                  {viagem.descricao && (
                    <p className="text-sm text-gray-400 mt-1">{viagem.descricao}</p>
                  )}
                </div>

                <div className="flex gap-3 items-center">
                  <span
                    onClick={() => navigate("/viagem", { state: { viagem } })}
                    className="text-indigo-500 font-semibold text-sm cursor-pointer hover:underline"
                  >
                    Ver detalhes →
                  </span>
                  <button
                    onClick={() => abrirEdicao(index)}
                    className="text-yellow-500 hover:text-yellow-600 text-sm font-semibold"
                  >
                    ✏️ Editar
                  </button>
                  <button
                    onClick={() => deletarViagem(index)}
                    className="text-red-400 hover:text-red-600 text-sm font-semibold"
                  >
                    🗑️ Excluir
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {modalAberto && (
        <NovaViagemModal
          onClose={() => setModalAberto(false)}
          onSalvar={salvarViagem}
        />
      )}

      {viagemEditando && (
        <NovaViagemModal
          onClose={() => setViagemEditando(null)}
          onSalvar={salvarEdicao}
          viagemInicial={viagemEditando}
        />
      )}
    </div>
  )
}

export default Dashboard