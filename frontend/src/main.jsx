import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Aplica o tema salvo (ou preferência do sistema) ANTES do React montar,
// para evitar flash de tema claro nas páginas de login/cadastro.
try {
  const salvo = localStorage.getItem("planit:tema")
  const preferescuro =
    salvo === "escuro" ||
    (!salvo &&
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-color-scheme: dark)").matches)
  if (preferescuro) document.documentElement.classList.add("dark")
} catch {
  /* ignore */
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
