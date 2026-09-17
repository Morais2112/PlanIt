import { useEffect, useRef, useState } from "react"
import { moedas, formatarMoeda } from "../data/destinos"

// Cache de buscas em memória nesta sessão
const cacheSugestoes = new Map()

async function buscarHoteis(consulta, viewbox) {
  if (!consulta || consulta.length < 3) return []
  const chave = consulta + "|" + (viewbox || "")
  if (cacheSugestoes.has(chave)) return cacheSugestoes.get(chave)
  try {
    const params = new URLSearchParams({
      format: "json",
      limit: "6",
      addressdetails: "1",
      q: consulta,
    })
    if (viewbox) {
      // viewbox: lonMin,latMin,lonMax,latMax — Nominatim prioriza resultados dentro
      params.append("viewbox", viewbox)
      params.append("bounded", "0") // 0 = só prioriza, não restringe
    }
    const res = await fetch(`https://nominatim.openstreetmap.org/search?${params}`, {
      headers: { Accept: "application/json" },
    })
    const data = await res.json()
    const lista = Array.isArray(data) ? data.slice(0, 6) : []
    cacheSugestoes.set(chave, lista)
    return lista
  } catch {
    return []
  }
}

// Bounding box em volta de uma coord (~50km)
function viewboxDe(coords) {
  if (!coords) return null
  const d = 0.5 // ~50km em latitude
  return `${coords.lng - d},${coords.lat - d},${coords.lng + d},${coords.lat + d}`
}

function HospedagemBlock({ hospedagem, onSalvar, onRemover, destino, destinoCoords }) {
  const [editando, setEditando] = useState(!hospedagem)
  const [nome, setNome] = useState(hospedagem?.nome || "")
  const [checkIn, setCheckIn] = useState(hospedagem?.checkIn || "")
  const [checkOut, setCheckOut] = useState(hospedagem?.checkOut || "")
  const [valor, setValor] = useState(
    hospedagem?.valor !== undefined ? String(hospedagem.valor) : ""
  )
  const [moeda, setMoeda] = useState(hospedagem?.moeda || "BRL")
  const [endereco, setEndereco] = useState(hospedagem?.endereco || "")
  const [coords, setCoords] = useState(hospedagem?.coords || null)

  // Autocomplete
  const [sugestoes, setSugestoes] = useState([])
  const [buscando, setBuscando] = useState(false)
  const [mostrarSugestoes, setMostrarSugestoes] = useState(false)
  const debounceRef = useRef(null)
  const inputWrapperRef = useRef(null)

  // Debounce do autocomplete: agendado no onChange do input
  function agendarBusca(valorInput) {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    if (!valorInput || valorInput.length < 3) {
      setSugestoes([])
      return
    }
    debounceRef.current = setTimeout(async () => {
      setBuscando(true)
      const consulta = destino ? `${valorInput}, ${destino}` : valorInput
      const vbox = viewboxDe(destinoCoords)
      const resultados = await buscarHoteis(consulta, vbox)
      setSugestoes(resultados)
      setMostrarSugestoes(true)
      setBuscando(false)
    }, 350)
  }

  // Cleanup do timer ao desmontar
  useEffect(() => {
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current) }
  }, [])

  // Fecha dropdown se clicar fora
  useEffect(() => {
    function handleClickFora(e) {
      if (inputWrapperRef.current && !inputWrapperRef.current.contains(e.target)) {
        setMostrarSugestoes(false)
      }
    }
    document.addEventListener("mousedown", handleClickFora)
    return () => document.removeEventListener("mousedown", handleClickFora)
  }, [])

  function selecionarSugestao(s) {
    // Nome curto: primeira parte do display_name antes da vírgula
    const partes = s.display_name.split(",")
    setNome(partes[0].trim())
    setEndereco(s.display_name)
    setCoords({ lat: parseFloat(s.lat), lng: parseFloat(s.lon) })
    setSugestoes([])
    setMostrarSugestoes(false)
  }

  function salvar() {
    if (!nome.trim()) return
    onSalvar({
      nome: nome.trim(),
      checkIn, checkOut,
      valor: Number(valor) || 0,
      moeda,
      endereco: endereco.trim(),
      coords: coords || hospedagem?.coords || null,
    })
    setEditando(false)
  }

  const inputCls =
    "w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 placeholder:text-gray-400 dark:placeholder:text-gray-500"

  if (!editando && hospedagem) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">🏨 Hospedagem</h3>
          <div className="flex gap-2 no-print">
            <button onClick={() => setEditando(true)}
              className="text-xs bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 px-2 py-1 rounded-md">✏️ Editar</button>
            <button onClick={onRemover}
              className="text-xs bg-red-50 hover:bg-red-100 text-red-700 px-2 py-1 rounded-md">🗑️</button>
          </div>
        </div>
        <p className="font-semibold text-gray-800 dark:text-gray-100">{hospedagem.nome}</p>
        {hospedagem.endereco && (
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">📍 {hospedagem.endereco}</p>
        )}
        {hospedagem.coords && (
          <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1">
            ✓ Localização no mapa
          </p>
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

        <div ref={inputWrapperRef} className="relative">
          <label className="text-xs text-gray-500 dark:text-gray-400">Nome do hotel ou Airbnb</label>
          <input
            value={nome}
            onChange={(e) => {
              const v = e.target.value
              setNome(v)
              if (coords) setCoords(null)
              agendarBusca(v)
            }}
            onFocus={() => sugestoes.length > 0 && setMostrarSugestoes(true)}
            placeholder="Ex: Ouro Minas, BH"
            autoComplete="off"
            className={inputCls}
          />
          {mostrarSugestoes && (sugestoes.length > 0 || buscando) && (
            <ul className="absolute z-20 left-0 right-0 mt-1 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg max-h-64 overflow-y-auto">
              {buscando && (
                <li className="px-3 py-2 text-xs text-gray-500 dark:text-gray-400 italic">
                  Buscando...
                </li>
              )}
              {sugestoes.map((s) => (
                <li
                  key={s.place_id}
                  onClick={() => selecionarSugestao(s)}
                  className="px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-indigo-50 dark:hover:bg-indigo-900/40 cursor-pointer border-b border-gray-100 dark:border-gray-600 last:border-b-0"
                >
                  <p className="font-medium truncate">{s.display_name.split(",")[0]}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{s.display_name}</p>
                </li>
              ))}
            </ul>
          )}
          {coords && (
            <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1">
              ✓ Localização capturada — vai aparecer no mapa
            </p>
          )}
          {!coords && nome.length >= 3 && (
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
              💡 Selecione uma sugestão acima para fixar no mapa
            </p>
          )}
        </div>

        <div>
          <label className="text-xs text-gray-500 dark:text-gray-400">Endereço (opcional)</label>
          <input value={endereco} onChange={(e) => setEndereco(e.target.value)}
            placeholder="Será preenchido automaticamente ao escolher uma sugestão"
            className={inputCls} />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-gray-500 dark:text-gray-400">Check-in</label>
            <input value={checkIn} onChange={(e) => setCheckIn(e.target.value)} type="date" className={inputCls} />
          </div>
          <div>
            <label className="text-xs text-gray-500 dark:text-gray-400">Check-out</label>
            <input value={checkOut} onChange={(e) => setCheckOut(e.target.value)} type="date" className={inputCls} />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="col-span-2">
            <label className="text-xs text-gray-500 dark:text-gray-400">Valor total</label>
            <input value={valor} onChange={(e) => setValor(e.target.value)} type="number" min="0" step="0.01" placeholder="0,00" className={inputCls} />
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
