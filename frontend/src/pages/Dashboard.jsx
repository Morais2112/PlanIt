import { useState } from "react"
import NovaViagemModal from "../components/NovaViagemModal"

function Dashboard() {
    const [modalAberto, setModalAberto] = useState(false)
    const [viagens, setViagens] = useState([])

    function salvarViagem(dados) {
    setViagens([...viagens, dados])
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
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-indigo-700 transition">
            + Nova Viagem
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow p-12 text-center text-gray-400">
          <p className="text-5xl mb-4">🗺️</p>
          <p className="text-lg font-medium">Nenhuma viagem ainda</p>
          <p className="text-sm mt-1">Clique em "Nova Viagem" para começar!</p>
        </div>
      </main>
      {modalAberto && (
    <NovaViagemModal
        onClose={() => setModalAberto(false)}
        onSalvar={salvarViagem}
    />
)}
    </div>
  )
}

export default Dashboard