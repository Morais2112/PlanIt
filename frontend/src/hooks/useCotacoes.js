import { useEffect, useState } from "react"

const CACHE_KEY = "planit:cotacoes"
const CACHE_TTL_MS = 60 * 60 * 1000 // 1 hora

const COTACOES_FALLBACK = {
  USD: 5.5, EUR: 6.0, GBP: 7.0, JPY: 0.037,
  ARS: 0.005, CHF: 6.2, AUD: 3.6, MXN: 0.27,
}

function lerCache() {
  try {
    const raw = sessionStorage.getItem(CACHE_KEY)
    if (!raw) return null
    const { dados, timestamp } = JSON.parse(raw)
    if (Date.now() - timestamp < CACHE_TTL_MS) return dados
  } catch {
    // ignore
  }
  return null
}

export function useCotacoes() {
  const [cotacoes, setCotacoes] = useState(
    () => lerCache() || COTACOES_FALLBACK
  )

  useEffect(() => {
    if (lerCache()) return
    let cancelado = false
    async function buscar() {
      try {
        const res = await fetch(
          "https://economia.awesomeapi.com.br/last/USD-BRL,EUR-BRL,GBP-BRL,JPY-BRL,ARS-BRL,CHF-BRL,AUD-BRL,MXN-BRL"
        )
        if (!res.ok) throw new Error("api error")
        const data = await res.json()
        const novo = { ...COTACOES_FALLBACK }
        const pares = [
          ["USDBRL", "USD"], ["EURBRL", "EUR"], ["GBPBRL", "GBP"],
          ["JPYBRL", "JPY"], ["ARSBRL", "ARS"], ["CHFBRL", "CHF"],
          ["AUDBRL", "AUD"], ["MXNBRL", "MXN"],
        ]
        pares.forEach(([chave, codigo]) => {
          if (data[chave]?.bid) novo[codigo] = parseFloat(data[chave].bid)
        })
        if (!cancelado) {
          setCotacoes(novo)
          try {
            sessionStorage.setItem(
              CACHE_KEY,
              JSON.stringify({ dados: novo, timestamp: Date.now() })
            )
          } catch {
            // ignore
          }
        }
      } catch {
        // mantém fallback
      }
    }
    buscar()
    return () => { cancelado = true }
  }, [])

  return cotacoes
}
