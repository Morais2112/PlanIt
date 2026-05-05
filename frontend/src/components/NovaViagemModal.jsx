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
  const [erro, setErro] = useState("")

  const [sugestoes, setSugestoes] = useState([])
  const [buscando, setBuscando] = useState(false)

  async function buscarCidades(texto) {
    setDestino(texto)
    if (texto.length < 3) {
      setSugestoes([])
      return
    }
    try {
      setBuscando(true)
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
          texto
        )}&format=json&limit=5&featuretype=city`
      )
      const data = await res.json()
      setSugestoes(Array.isArray(data) ? data : [])
    } catch {
      setSugestoes([])
    } finally {
      setBuscando(false)
    }
  }

  function selecionarCidade(nome) {
    setDestino(nome)
    setSugestoes([])
  }

  function handleSubmit(e) {
    e.preventDefault()
    setErro("")

    if (dataVolta && dataIda && dataVolta < dataIda) {
      setErro("A data de volta deve ser posterior a data de ida.")
      return
    }
    const numPessoas = Math.max(1, parseInt(pessoas, 10) || 1)

    onSalvar({
      destino: destino.trim(),
      dataIda,
      dataVolta,
      descricao: descricao.trim(),
      pessoas: numPessoas,
    })
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-800">
            {editando ? "Editar Viagem" : "Nova Viagem"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl"
            aria-label="Fechar"
          >
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Destino
            </label>
            <input
              list="lista-destinos"
              value={destino}
              onChange={(e) => buscarCidades(e.target.value)}
              type="text"
              placeholder="Ex: Paris, Franca"
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
            <datalist id="lista-destinos">
              {listaDestinos.map((d) => (
                <option key={d} value={d} />
              ))}
            </datalist>

            {sugestoes.length > 0 && (
              <ul className="absolute z-10 bg-white border border-gray-200 rounded-lg w-full mt-1 shadow-lg max-h-48 overflow-y-auto">
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

            <p className="text-xs text-gray-400 mt-1">
              {buscando
                ? "Buscando..."
                : "Use o catalogo (capitais com passeios sugeridos) ou digite outra cidade."}
            </p>
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Data de Ida
              </label>
              <input
                value={dataIda}
                onChange={(e) => setDataIda(e.target.value)}
                type="date"
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Data de Volta
              </label>
              <input
                value={dataVolta}
                onChange={(e) => setDataVolta(e.target.value)}
                type="date"
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Numero de viajantes
            </label>
            <input
              value={pessoas}
              onChange={(e) => setPessoas(e.target.value)}
              type="number"
              min="1"
              max="50"
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
            <p className="text-xs text-gray-400 mt-1">
              O custo total dos passeios sera multiplicado por este numero.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descricao
            </label>
            <textarea
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              placeholder="Ex: Viagem de ferias em familia..."
              rows={3}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none"
            />
          </div>

          {erro && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-2">
              {erro}
            </p>
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
              {editando ? "Salvar alteracoes" : "Criar viagem"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default NovaViagemModal
