import { useState } from "react"
import { listaDestinos } from "../data/destinos"

function NovaViagemModal({ onClose, onSalvar, viagemEditando }) {
  const editando = Boolean(viagemEditando)

  const [destino, setDestino] = useState(viagemEditando?.destino || "")
  const [dataIda, setDataIda] = useState(viagemEditando?.dataIda || "")
  const [dataVolta, setDataVolta] = useState(viagemEditando?.dataVolta || "")
  const [descricao, setDescricao] = useState(viagemEditando?.descricao || "")
  const [pessoas, setPessoas] = useState(
    viagemEditando?.pessoas ? String(viagemEditando.pessoas) : "1"
  )
  const [orcamento, setOrcamento] = useState(
    viagemEditando?.orcamento ? String(viagemEditando.orcamento) : ""
  )
  const [erro, setErro] = useState("")

  function handleSubmit(e) {
    e.preventDefault()
    setErro("")
    if (dataVolta && dataIda && dataVolta < dataIda) {
      setErro("A data de volta deve ser posterior à data de ida.")
      return
    }
    const numPessoas = Math.max(1, parseInt(pessoas, 10) || 1)
    const numOrcamento =
      orcamento.trim() === "" ? null : Number(orcamento) || null

    onSalvar({
      destino: destino.trim(),
      dataIda,
      dataVolta,
      descricao: descricao.trim(),
      pessoas: numPessoas,
      orcamento: numOrcamento,
    })
    onClose()
  }

  const inputCls =
    "w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 placeholder:text-gray-400 dark:placeholder:text-gray-500"
  const labelCls =
    "block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1"

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">
            {editando ? "Editar Viagem ✏️" : "Nova Viagem ✈️"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 text-2xl"
            aria-label="Fechar"
          >
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className={labelCls}>Destino</label>
            <input
              list="lista-destinos"
              value={destino}
              onChange={(e) => setDestino(e.target.value)}
              type="text"
              placeholder="Ex: Paris, França"
              required
              className={inputCls}
            />
            <datalist id="lista-destinos">
              {listaDestinos.map((d) => (
                <option key={d} value={d} />
              ))}
            </datalist>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
              Escolha uma capital sugerida (vem com pontos turísticos prontos) ou digite outra cidade.
            </p>
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <label className={labelCls}>Data de Ida</label>
              <input
                value={dataIda}
                onChange={(e) => setDataIda(e.target.value)}
                type="date"
                required
                className={inputCls}
              />
            </div>
            <div className="flex-1">
              <label className={labelCls}>Data de Volta</label>
              <input
                value={dataVolta}
                onChange={(e) => setDataVolta(e.target.value)}
                type="date"
                required
                className={inputCls}
              />
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <label className={labelCls}>Número de viajantes</label>
              <input
                value={pessoas}
                onChange={(e) => setPessoas(e.target.value)}
                type="number"
                min="1"
                max="50"
                required
                className={inputCls}
              />
            </div>
            <div className="flex-1">
              <label className={labelCls}>Orçamento (opcional)</label>
              <input
                value={orcamento}
                onChange={(e) => setOrcamento(e.target.value)}
                type="number"
                min="0"
                step="0.01"
                placeholder="R$ 3000,00"
                className={inputCls}
              />
            </div>
          </div>
          <p className="text-xs text-gray-400 dark:text-gray-500 -mt-2">
            Deixe o orçamento em branco se não quiser definir um limite. Só serve de referência, não bloqueia gastos.
          </p>

          <div>
            <label className={labelCls}>Descrição</label>
            <textarea
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              placeholder="Ex: Viagem de férias em família..."
              rows={3}
              className={`${inputCls} resize-none`}
            />
          </div>

          {erro && (
            <p className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg p-2">
              {erro}
            </p>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 py-2 rounded-lg font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 bg-indigo-600 text-white py-2 rounded-lg font-semibold hover:bg-indigo-700 transition"
            >
              {editando ? "Salvar alterações" : "Criar viagem"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default NovaViagemModal
