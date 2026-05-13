import { createContext, useContext, useEffect, useState } from "react"
import { api } from "../lib/api"

const TOKEN_KEY = "planit:token"
const USER_KEY = "planit:user"

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => {
    try { return localStorage.getItem(TOKEN_KEY) } catch { return null }
  })
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem(USER_KEY)
      return raw ? JSON.parse(raw) : null
    } catch { return null }
  })
  const [carregando, setCarregando] = useState(false)

  // Valida o token (se existir) ao montar
  useEffect(() => {
    if (!token) return
    api.me(token)
      .then(({ user }) => salvarUsuario(user))
      .catch(() => logout())
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function salvarUsuario(u) {
    setUser(u)
    try { localStorage.setItem(USER_KEY, JSON.stringify(u)) } catch { /* ignore */ }
  }

  async function login(email, senha) {
    setCarregando(true)
    try {
      const { token: novoToken, user: u } = await api.login({ email, senha })
      try { localStorage.setItem(TOKEN_KEY, novoToken) } catch { /* ignore */ }
      setToken(novoToken)
      salvarUsuario(u)
      return u
    } finally {
      setCarregando(false)
    }
  }

  async function register(email, senha, nome) {
    setCarregando(true)
    try {
      const { token: novoToken, user: u } = await api.register({ email, senha, nome })
      try { localStorage.setItem(TOKEN_KEY, novoToken) } catch { /* ignore */ }
      setToken(novoToken)
      salvarUsuario(u)
      return u
    } finally {
      setCarregando(false)
    }
  }

  function logout() {
    setToken(null)
    setUser(null)
    try {
      localStorage.removeItem(TOKEN_KEY)
      localStorage.removeItem(USER_KEY)
    } catch { /* ignore */ }
  }

  return (
    <AuthContext.Provider value={{ token, user, carregando, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth precisa estar dentro de <AuthProvider>")
  return ctx
}
