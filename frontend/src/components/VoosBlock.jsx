import { useState } from "react"
import { moedas, formatarMoeda } from "../data/destinos"

function VooForm({ voo, onSalvar, onCancelar }) {
  const [tipo, setTipo] = useState(voo?.tipo || "ida")
  const [companhia, setCompanhia] = useState(voo?.companhia || "")
  const [numero, setNumero] = useState(voo?.numero || "")
  const [origem, setOrigem] = useState(voo?.origem || "")
  const [destino, setDestino] = useState(voo?.destino || "")
  const [dataHora, setDataHora] = useState(voo?.dataHora || "")
  const [valor, setValor] = useState(voo?.valor !== undefined ? String(voo.valor) : "")
  const [moeda, setMoeda] = useState(voo?.moeda || "BRL")

  function salvar() {
    onSalvar({
      tipo, companhia: companhia.trim(), numero: numero.trim(),
      origem: origem.trim(), destino: destino.trim(),
      dataHora, valor: Number(valor) || 0, moeda,
    })
  }

  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-4 space-y-3">
      <div className="flex gap-2">
        {["ida", "volta", "conexão"].map((t) => (
          <button key={t} type="button" onClick={() => setTipo(t)}
            className={`text-xs px-3 py-1 rounded-full transition ${
              tipo === t
                ? "bg-indigo-600 text-white"
                : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200"
            }`}>{t}</button>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-2">
        <input value={companhia} onChange={(e) => setCompanhia(e.target.value)} placeholder="Companhia (Latam, Gol...)"
          className="border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" />
        <input value={numero} onChange={(e) => setNumero(e.target.value)} placeholder="Número (LA8084)"
          className="border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" />
        <input value={origem} onChange={(e) => setOrigem(e.target.value)} placeholder="Origem (GRU)"
          className="border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" />
        <input value={destino} onChange={(e) => setDestino(e.target.value)} placeholder="Destino (CDG)"
          className="border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" />
        <input value={dataHora} onChange={(e) => setDataHora(e.target.value)} type="datetime-local"
          className="border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 col-span-2" />
        <input value={valor} onChange={(e) => setValor(e.target.value)} type="number" min="0" step="0.01" placeholder="Valor"
          className="border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" />
        <select value={moeda} onChange={(e) => setMoeda(e.target.value)}
          className="border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400">
          {moedas.map((m) => <option key={m.codigo} value={m.codigo}>{m.codigo}</option>)}
        </select>
      </div>
      <div className="flex gap-2">
        <button onClick={onCancelar}
          className="flex-1 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 py-1.5 rounded-md text-sm hover:bg-gray-50 dark:hover:bg-gray-700">Cancelar</button>
        <button onClick={salvar}
          className="flex-1 bg-indigo-600 text-white py-1.5 rounded-md text-sm font-semibold hover:bg-indigo-700">Salvar</button>
      </div>
    </div>
  )
}

function VoosBlock({ voos, onAdicionar, onAtualizar, onRemover }) {
  const [formAberto, setFormAberto] = useState(false)
  const [editandoId, setEditandoId] = useState(null)

  function salvarNovo(dados) {
    onAdicionar(dados)
    setFormAberto(false)
  }
  function salvarEdicao(dados) {
    onAtualizar(editandoId, dados)
    setEditandoId(null)
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-6">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">✈️ Voos</h3>
        <button onClick={() => { setFormAberto(true); setEditandoId(null) }}
          className="text-xs bg-indigo-50 dark:bg-indigo-900/40 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 px-3 py-1 rounded-md font-medium no-print">
          + Adicionar voo
        </button>
      </div>

      {(!voos || voos.length === 0) && !formAberto && (
        <p className="text-sm text-gray-400 dark:text-gray-500 italic text-center py-4">
          Nenhum voo cadastrado. Clique em "+ Adicionar voo" para começar.
        </p>
      )}

      <ul className="space-y-2">
        {(voos || []).map((v) => (
          editandoId === v.id ? (
            <li key={v.id}>
              <VooForm voo={v} onSalvar={salvarEdicao} onCancelar={() => setEditandoId(null)} />
            </li>
          ) : (
            <li key={v.id} className="border border-gray-200 dark:border-gray-700 rounded-xl p-3 flex items-center justify-between gap-2">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs bg-indigo-50 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 px-2 py-0.5 rounded-full capitalize">
                    {v.tipo}
                  </span>
                  <p className="font-medium text-gray-800 dark:text-gray-100 text-sm">
                    {v.companhia} {v.numero && `· ${v.numero}`}
                  </p>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {v.origem} → {v.destino}
                  {v.dataHora && ` · ${v.dataHora.replace("T", " ")}`}
                </p>
                {v.valor > 0 && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    {formatarMoeda(v.valor, v.moeda || "BRL")}
                  </p>
                )}
              </div>
              <div className="flex gap-1 no-print">
                <button onClick={() => setEditandoId(v.id)}
                  className="text-xs bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 px-2 py-1 rounded-md">✏️</button>
                <button onClick={() => onRemover(v.id)}
                  className="text-xs bg-red-50 hover:bg-red-100 text-red-700 px-2 py-1 rounded-md">🗑️</button>
              </div>
            </li>
          )
        ))}
        {formAberto && (
          <li>
            <VooForm onSalvar={salvarNovo} onCancelar={() => setFormAberto(false)} />
          </li>
        )}
      </ul>
    </div>
  )
}

export default VoosBlock
