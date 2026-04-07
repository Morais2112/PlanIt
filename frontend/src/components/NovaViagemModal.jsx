function NovaViagemModal({ onClose, onSalvar }) {
  function handleSubmit(e) {
    e.preventDefault()
    const dados = {
      destino: e.target.destino.value,
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
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Destino</label>
            <input
              name="destino"
              type="text"
              placeholder="Ex: Paris, França"
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
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