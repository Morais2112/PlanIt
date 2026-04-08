import { useState } from "react"

function NovaViagemModal({ onClose, onSalvar }) {
  const [sugestoes, setSugestoes] = useState([])
  const [destino, setDestino] = useState("")

  async function buscarCidades(texto) {
    setDestino(texto)
    if (texto.length < 3) {
      setSugestoes([])
      return
    }
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${texto}&format=json&limit=5&featuretype=city`
    )
    const data = await res.json()
    setSugestoes(data)
  }

  function selecionarCidade(nome) {
    setDestino(nome)
    setSugestoes([])
  }

  function handleSubmit(e) {
    e.preventDefault()
    const dados = {
      destino,
      dataIda: e.target.dataIda.value,
      dataVolta: e.target.dataVolta.value,
      descricao: e.target.descricao.value,
    }
    onSalvar(dados)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">

        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-800">Nova Viagem ✈️</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">Destino</label>
            <input
              type="text"
              value={destino}
              onChange={(e) => buscarCidades(e.target.value)}
              placeholder="Ex: Paris, França"
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
            {sugestoes.length > 0 && (
              <ul className="absolute z-10 bg-white border border-gray-200 rounded-lg w-full mt-1 shadow-lg">
                {sugestoes.map((s, i) => (
                  <li
                    key={i}
                    onClick={() => selecionarCidade(s.display_name)}
                    className="px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 cursor-pointer"
                  >
                    {s.display_name}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Data de Ida</label>
              <input
                name="dataIda"
                type="date"
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Data de Volta</label>
              <input
                name="dataVolta"
                type="date"
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
            <textarea
              name="descricao"
              placeholder="Ex: Viagem de férias em família..."
              rows={3}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 rounded-lg font-semibold hover:bg-indigo-700 transition"
          >
            Salvar Viagem
          </button>
        </form>

      </div>
    </div>
  )
}

export default NovaViagemModal