import { useEffect, useState } from "react"

const KEY = "planit:tema"

// Aplica/remove classe "dark" no <html> com base no tema atual.
function aplicar(tema) {
  const root = document.documentElement
  if (tema === "escuro") root.classList.add("dark")
  else root.classList.remove("dark")
}

export function useTheme() {
  const [tema, setTema] = useState(() => {
    try {
      const salvo = localStorage.getItem(KEY)
      if (salvo === "escuro" || salvo === "claro") return salvo
    } catch { /* ignore */ }
    // padrão: respeita preferência do sistema na primeira vez
    if (typeof window !== "undefined" && window.matchMedia?.("(prefers-color-scheme: dark)").matches) {
      return "escuro"
    }
    return "claro"
  })

  useEffect(() => {
    aplicar(tema)
    try { localStorage.setItem(KEY, tema) } catch { /* ignore */ }
  }, [tema])

  function alternar() {
    setTema((t) => (t === "escuro" ? "claro" : "escuro"))
  }

  return { tema, alternar, setTema }
}
