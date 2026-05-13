import { useState } from "react"
import { templatesChecklist } from "../data/destinos"

function ChecklistBlock({ checklist, onAdicionar, onAtualizar, onRemover, onCarregarTemplate }) {
  const [novoItem, setNovoItem] = useState("")
  const [mostrarTemplates, setMostrarTemplates] = useState(false)

  const itens = checklist || []
  const total = itens.length
  const concluidos = itens.filter((i) => i.marcado).length
  const percentual = total > 0 ? Math.round((concluidos / total) * 100) : 0

  function adicionar(e) {
    e.preventDefault()
    if (!novoItem.trim()) return
    onAdicionar({ texto: novoItem.trim() })
    setNovoItem("")
  }

  function aplicarTemplate(nome) {
    onCarregarTemplate(templatesChecklist[nome] || [])
    setMostrarTemplates(false)
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-6">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">
          ✅ Checklist
          {total > 0 && (
            <span className="ml-2 text-sm font-normal text-gray-500 dark:text-gray-400">
              {concluidos}/{total} ({percentual}%)
            </span>
          )}
        </h3>
        <button onClick={() => setMostrarTemplates((v) => !v)}
          className="text-xs bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 px-3 py-1 rounded-md no-print">
          📋 Templates
        </button>
      </div>

      {total > 0 && (
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 mb-4 overflow-hidden">
          <div className="bg-emerald-500 h-1.5 transition-all duration-300"
            style={{ width: `${percentual}%` }} />
        </div>
      )}

      {mostrarTemplates && (
        <div className="bg-gray-50 dark:bg-gray-900/40 rounded-lg p-3 mb-3 no-print">
          <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
            Carregar itens prontos (adiciona aos existentes):
          </p>
          <div className="flex flex-wrap gap-2">
            {Object.keys(templatesChecklist).map((nome) => (
              <button key={nome} onClick={() => aplicarTemplate(nome)}
                className="text-xs bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 hover:border-indigo-400 text-gray-700 dark:text-gray-200 px-3 py-1 rounded-full">
                {nome}
              </button>
            ))}
          </div>
        </div>
      )}

      {itens.length === 0 ? (
        <p className="text-sm text-gray-400 dark:text-gray-500 italic text-center py-4">
          Lista vazia. Adicione itens manualmente ou use um template.
        </p>
      ) : (
        <ul className="space-y-1">
          {itens.map((item) => (
            <li key={item.id} className="flex items-center gap-2 group">
              <input
                type="checkbox"
                checked={!!item.marcado}
                onChange={(e) => onAtualizar(item.id, { marcado: e.target.checked })}
                className="w-4 h-4 accent-indigo-600 cursor-pointer"
              />
              <span className={`flex-1 text-sm ${
                item.marcado
                  ? "line-through text-gray-400 dark:text-gray-500"
                  : "text-gray-800 dark:text-gray-200"
              }`}>{item.texto}</span>
              <button onClick={() => onRemover(item.id)}
                className="text-xs text-red-500 opacity-0 group-hover:opacity-100 transition no-print">🗑️</button>
            </li>
          ))}
        </ul>
      )}

      <form onSubmit={adicionar} className="flex gap-2 mt-4 no-print">
        <input
          value={novoItem}
          onChange={(e) => setNovoItem(e.target.value)}
          placeholder="+ Novo item..."
          className="flex-1 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
        <button type="submit"
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-indigo-700">
          Adicionar
        </button>
      </form>
    </div>
  )
}

export default ChecklistBlock
