import { Navigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"

// Wrapper que redireciona pra "/" se o usuário não estiver logado.
function RotaProtegida({ children }) {
  const { token } = useAuth()
  if (!token) return <Navigate to="/" replace />
  return children
}

export default RotaProtegida
