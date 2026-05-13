import { useState } from "react"
import { categorias, moedas } from "../data/destinos"

function PontoTuristicoModal({
  onClose,
  onSalvar,
  pontoEditando,
  dias = [],
  diaInicial = null,
}) {
  const editando = Boolean(pontoEditando)

  const [nome, setNome] = useState(pontoEditando?.nome || "")
  const [valor, setValor] = useState(
    pontoEditando?.valor !== undefined ? String(pontoEditando.valor) : ""
  )
  const [moeda, setMoeda] = useState(pontoEditando?.moeda || "BRL")
  const [categoria, setCategoria] = useState(pontoEditando?.categoria || "Outro")
  const [hora, setHora] = useState(pontoEditando?.hora || "")
  const [dia, setDia] = useState(() => {
    const inicial = pontoEditando?.dia ?? diaInicial
    return inicial == null ? "" : String(inicial)
  })

  function handleSubmit(e) {
    e.preventDefault()
    onSalvar({
      nome: nome.trim(),
      valor: Number(valor) || 0,
      moeda,
      categoria,
      hora,
      dia: dia === "" ? null : Number(dia),
    })
    onClose()
  }

  const inputCls =
    "w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 placeholder:text-gray-400 dark:placeholder:text-gray-500"
  const selectCls =
    "w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 bg-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
  const labelCls =
    "block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1"

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">
            {editando ? "Editar passeio" : "Novo passeio"}
          </h3>
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
            <label className={labelCls}>Nome do passeio</label>
            <input
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              type="text"
              placeholder="Ex: Tour pela cidade"
              required
              className={inputCls}
            />
          </div>

          <div className="flex gap-3">
            <div className="flex-1">
              <label className={labelCls}>Valor por pessoa</label>
              <input
                value={valor}
                onChange={(e) => setValor(e.target.value)}
                type="number"
                min="0"
                step="0.01"
                placeholder="0,00"
                className={inputCls}
              />
            </div>
            <div className="w-32">
              <label className={labelCls}>Moeda</label>
              <select
                value={moeda}
                onChange={(e) => setMoeda(e.target.value)}
                className={selectCls}
              >
                {moedas.map((m) => (
                  <option key={m.codigo} value={m.codigo}>
                    {m.simbolo} {m.codigo}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className={labelCls}>Categoria</label>
            <select
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
              className={selectCls}
            >
              {categorias.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div className="flex gap-3">
            {dias.length > 0 && (
              <div className="flex-1">
                <label className={labelCls}>Dia</label>
                <select
                  value={dia}
                  onChange={(e) => setDia(e.target.value)}
                  className={selectCls}
                >
                  <option value="">Sem dia definido</option>
                  {dias.map((d) => (
                    <option key={d.numero} value={d.numero}>
                      Dia {d.numero} — {d.dataFormatada}
                    </option>
                  ))}
                </select>
              </div>
            )}
            <div className="flex-1">
              <label className={labelCls}>Horário</label>
              <input
                value={hora}
                onChange={(e) => setHora(e.target.value)}
                type="time"
                className={inputCls}
              />
            </div>
          </div>

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
              {editando ? "Salvar" : "Adicionar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default PontoTuristicoModal
