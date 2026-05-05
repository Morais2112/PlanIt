import { useState } from "react"
import { categorias } from "../data/destinos"

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
  const [categoria, setCategoria] = useState(
    pontoEditando?.categoria || "Outro"
  )
  const [dia, setDia] = useState(() => {
    const inicial = pontoEditando?.dia ?? diaInicial
    return inicial == null ? "" : String(inicial)
  })

  function handleSubmit(e) {
    e.preventDefault()
    onSalvar({
      nome: nome.trim(),
      valor: Number(valor) || 0,
      categoria,
      dia: dia === "" ? null : Number(dia),
    })
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-bold text-gray-800">
            {editando ? "Editar passeio" : "Novo passeio"}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl"
            aria-label="Fechar"
          >
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nome do passeio
            </label>
            <input
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              type="text"
              placeholder="Ex: Tour pela cidade"
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          <div className="flex gap-3">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Valor (R$)
              </label>
              <input
                value={valor}
                onChange={(e) => setValor(e.target.value)}
                type="number"
                min="0"
                step="0.01"
                placeholder="0,00"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Categoria
              </label>
              <select
                value={categoria}
                onChange={(e) => setCategoria(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white"
              >
                {categorias.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {dias.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Programar para qual dia?
              </label>
              <select
                value={dia}
                onChange={(e) => setDia(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white"
              >
                <option value="">Sem dia definido</option>
                {dias.map((d) => (
                  <option key={d.numero} value={d.numero}>
                    Dia {d.numero} - {d.dataFormatada} ({d.diaSemana})
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg font-semibold hover:bg-gray-50 transition"
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
