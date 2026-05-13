import { useState } from "react"
import { moedas, formatarMoeda } from "../data/destinos"

// Bloco editável de hospedagem (1 por viagem)
function HospedagemBlock({ hospedagem, onSalvar, onRemover }) {
  const [editando, setEditando] = useState(!hospedagem)
  const [nome, setNome] = useState(hospedagem?.nome || "")
  const [checkIn, setCheckIn] = useState(hospedagem?.checkIn || "")
  const [checkOut, setCheckOut] = useState(hospedagem?.checkOut || "")
  const [valor, setValor] = useState(
    hospedagem?.valor !== undefined ? String(hospedagem.valor) : ""
  )
  const [moeda, setMoeda] = useState(hospedagem?.moeda || "BRL")
  const [endereco, setEndereco] = useState(hospedagem?.endereco || "")

  function salvar() {
    if (!nome.trim()) return
    onSalvar({
      nome: nome.trim(),
      checkIn, checkOut,
      valor: Number(valor) || 0,
      moeda,
      endereco: endereco.trim(),
    })
    setEditando(false)
  }

  if (!editando && hospedagem) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">
            🏨 Hospedagem
          </h3>
          <div className="flex gap-2 no-print">
            <button
              onClick={() => setEditando(true)}
              className="text-xs bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 px-2 py-1 rounded-md"
            >✏️ Editar</button>
            <button
              onClick={onRemover}
              className="text-xs bg-red-50 hover:bg-red-100 text-red-700 px-2 py-1 rounded-md"
            >🗑️</button>
          </div>
        </div>
        <p className="font-semibold text-gray-800 dark:text-gray-100">{hospedagem.nome}</p>
        {hospedagem.endereco && (
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">📍 {hospedagem.endereco}</p>
        )}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-3 text-sm">
          {hospedagem.checkIn && (
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Check-in</p>
              <p className="font-medium text-gray-800 dark:text-gray-200">{hospedagem.checkIn}</p>
            </div>
          )}
          {hospedagem.checkOut && (
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Check-out</p>
              <p className="font-medium text-gray-800 dark:text-gray-200">{hospedagem.checkOut}</p>
            </div>
          )}
          {hospedagem.valor > 0 && (
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Valor</p>
              <p className="font-medium text-gray-800 dark:text-gray-200">
                {formatarMoeda(hospedagem.valor, hospedagem.moeda || "BRL")}
              </p>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-6">
      <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-3">🏨 Hospedagem</h3>
      <div className="space-y-3">
        <input
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          placeholder="Nome do hotel ou Airbnb"
          className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
        <input
          value={endereco}
          onChange={(e) => setEndereco(e.target.value)}
          placeholder="Endereço (opcional)"
          className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-gray-500 dark:text-gray-400">Check-in</label>
            <input value={checkIn} onChange={(e) => setCheckIn(e.target.value)} type="date"
              className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400" />
          </div>
          <div>
            <label className="text-xs text-gray-500 dark:text-gray-400">Check-out</label>
            <input value={checkOut} onChange={(e) => setCheckOut(e.target.value)} type="date"
              className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400" />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <div className="col-span-2">
            <label className="text-xs text-gray-500 dark:text-gray-400">Valor total</label>
            <input value={valor} onChange={(e) => setValor(e.target.value)} type="number" min="0" step="0.01" placeholder="0,00"
              className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400" />
          </div>
          <div>
            <label className="text-xs text-gray-500 dark:text-gray-400">Moeda</label>
            <select value={moeda} onChange={(e) => setMoeda(e.target.value)}
              className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-lg px-2 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400">
              {moedas.map((m) => <option key={m.codigo} value={m.codigo}>{m.codigo}</option>)}
            </select>
          </div>
        </div>
        <div className="flex gap-2 pt-1">
          {hospedagem && (
            <button onClick={() => setEditando(false)}
              className="flex-1 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 py-2 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-700">Cancelar</button>
          )}
          <button onClick={salvar}
            className="flex-1 bg-indigo-600 text-white py-2 rounded-lg font-semibold hover:bg-indigo-700">Salvar</button>
        </div>
      </div>
    </div>
  )
}

export default HospedagemBlock
