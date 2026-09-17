import { useEffect, useRef, useState } from "react"

const LEAFLET_CSS = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
const LEAFLET_JS = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"

// Cache em memória de coords ja geocodificadas nesta sessao
const cacheGeocoding = new Map()

async function geocodificar(consulta) {
  if (!consulta) return null
  if (cacheGeocoding.has(consulta)) return cacheGeocoding.get(consulta)
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(consulta)}`,
      { headers: { Accept: "application/json" } }
    )
    const data = await res.json()
    if (data?.[0]) {
      const coords = { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) }
      cacheGeocoding.set(consulta, coords)
      return coords
    }
  } catch {
    // ignore
  }
  cacheGeocoding.set(consulta, null)
  return null
}

function carregarLeaflet() {
  return new Promise((resolve) => {
    if (window.L) return resolve(window.L)
    if (!document.querySelector(`link[href="${LEAFLET_CSS}"]`)) {
      const link = document.createElement("link")
      link.rel = "stylesheet"
      link.href = LEAFLET_CSS
      document.head.appendChild(link)
    }
    let script = document.querySelector(`script[src="${LEAFLET_JS}"]`)
    if (!script) {
      script = document.createElement("script")
      script.src = LEAFLET_JS
      document.head.appendChild(script)
    }
    script.addEventListener("load", () => resolve(window.L))
    if (window.L) resolve(window.L)
  })
}

// Cor por categoria para o marker
function corCategoria(cat) {
  const mapa = {
    "Histórico": "#a16207",
    "Museu": "#7c3aed",
    "Religioso": "#0891b2",
    "Mirante": "#16a34a",
    "Natureza": "#15803d",
    "Praia": "#0284c7",
    "Cultural": "#db2777",
    "Gastronomia": "#dc2626",
    "Diversão": "#f59e0b",
    "Esporte": "#65a30d",
    "Aventura": "#ea580c",
    "Passeio": "#4f46e5",
  }
  return mapa[cat] || "#6366f1"
}

function criarIconePersonalizado(L, cor, label) {
  const html = `
    <div style="
      background: ${cor}; color: white; border-radius: 50%;
      width: 28px; height: 28px; display: flex; align-items: center;
      justify-content: center; font-size: 14px; font-weight: bold;
      border: 2px solid white; box-shadow: 0 1px 4px rgba(0,0,0,0.4);
    ">${label}</div>`
  return L.divIcon({
    html, className: "", iconSize: [28, 28], iconAnchor: [14, 14],
  })
}

function MapaBlock({ destino, centroBase, pontos = [], hospedagem }) {
  const containerRef = useRef(null)
  const mapaRef = useRef(null)
  const markersRef = useRef([])
  const [pontosResolvidos, setPontosResolvidos] = useState([])
  const [carregandoMapa, setCarregandoMapa] = useState(true)

  // 1) Geocodifica pontos que não têm coords (1 req/s pra não bater no rate limit)
  useEffect(() => {
    let cancelado = false
    async function resolver() {
      const novos = []
      for (const p of pontos) {
        if (p.coords) {
          novos.push(p)
          continue
        }
        const consulta = `${p.nome}, ${destino}`
        const coords = await geocodificar(consulta)
        if (cancelado) return
        novos.push(coords ? { ...p, coords } : p)
        // pequena pausa pra respeitar rate limit do Nominatim
        await new Promise((r) => setTimeout(r, 300))
      }
      if (!cancelado) setPontosResolvidos(novos)
    }
    resolver()
    return () => { cancelado = true }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pontos.length, destino])

  // 2) Carrega Leaflet e monta o mapa
  useEffect(() => {
    let destruido = false
    let mapa

    async function montar() {
      const L = await carregarLeaflet()
      if (destruido || !containerRef.current) return

      const centro = centroBase || pontos[0]?.coords || { lat: -15.78, lng: -47.92 }
      mapa = L.map(containerRef.current, {
        center: [centro.lat, centro.lng], zoom: 12,
        scrollWheelZoom: false,
      })
      mapaRef.current = mapa

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19,
      }).addTo(mapa)

      setCarregandoMapa(false)
    }
    montar()

    return () => {
      destruido = true
      if (mapa) mapa.remove()
      mapaRef.current = null
      markersRef.current = []
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // 3) Sincroniza markers sempre que pontosResolvidos mudar
  useEffect(() => {
    if (!mapaRef.current || !window.L) return
    const L = window.L
    const mapa = mapaRef.current

    // Limpa markers antigos
    markersRef.current.forEach((m) => mapa.removeLayer(m))
    markersRef.current = []

    const novosMarkers = []

    // Marker do destino central
    if (centroBase) {
      const m = L.marker([centroBase.lat, centroBase.lng], {
        icon: criarIconePersonalizado(L, "#1e40af", "📍"),
      })
        .bindPopup(`<strong>${destino}</strong><br/><span style="color:#666">Centro da cidade</span>`)
        .addTo(mapa)
      novosMarkers.push(m)
    }

    // Hospedagem
    if (hospedagem && hospedagem.coords) {
      const m = L.marker([hospedagem.coords.lat, hospedagem.coords.lng], {
        icon: criarIconePersonalizado(L, "#0f766e", "🏨"),
      })
        .bindPopup(`<strong>🏨 ${hospedagem.nome}</strong><br/>${hospedagem.endereco || ""}`)
        .addTo(mapa)
      novosMarkers.push(m)
    }

    // Pontos turísticos
    pontosResolvidos.forEach((p, i) => {
      if (!p.coords) return
      const cor = corCategoria(p.categoria)
      const m = L.marker([p.coords.lat, p.coords.lng], {
        icon: criarIconePersonalizado(L, cor, String(i + 1)),
      })
        .bindPopup(`<strong>${p.nome}</strong><br/><span style="color:#666">${p.categoria}</span>`)
        .addTo(mapa)
      novosMarkers.push(m)
    })

    markersRef.current = novosMarkers

    // Auto-fit nos markers
    if (novosMarkers.length > 1) {
      const grupo = L.featureGroup(novosMarkers)
      mapa.fitBounds(grupo.getBounds().pad(0.2))
    }
  }, [pontosResolvidos, centroBase, hospedagem, destino])

  const totalComCoords = pontosResolvidos.filter((p) => p.coords).length
  const totalSemCoords = pontosResolvidos.filter((p) => !p.coords).length

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-6 no-print">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">🗺️ Mapa</h3>
        <span className="text-xs text-gray-500 dark:text-gray-400">
          {totalComCoords} de {pontos.length} pontos localizados
          {totalSemCoords > 0 && ` (${totalSemCoords} sem coordenadas)`}
        </span>
      </div>

      <div
        ref={containerRef}
        className="w-full h-96 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-900"
      />

      {carregandoMapa && (
        <p className="text-xs text-gray-400 dark:text-gray-500 italic mt-2 text-center">
          Carregando mapa...
        </p>
      )}
      {!carregandoMapa && totalSemCoords > 0 && pontosResolvidos.length === pontos.length && (
        <p className="text-xs text-gray-400 dark:text-gray-500 italic mt-2">
          ⚠️ Alguns pontos não foram localizados automaticamente. Tente nomes mais específicos no passeio (ex: "Coliseu, Roma").
        </p>
      )}
      {!carregandoMapa && pontosResolvidos.length < pontos.length && (
        <p className="text-xs text-gray-400 dark:text-gray-500 italic mt-2">
          🔍 Buscando coordenadas dos passeios...
        </p>
      )}
    </div>
  )
}

export default MapaBlock
