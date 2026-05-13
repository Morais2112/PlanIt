import { BrowserRouter, Route, Routes } from "react-router-dom"
import { AuthProvider } from "./contexts/AuthContext"
import RotaProtegida from "./components/RotaProtegida"
import Cadastro from "./pages/Cadastro"
import Dashboard from "./pages/Dashboard"
import DetalhesViagem from "./pages/DetalhesViagem"
import Login from "./pages/Login"

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/cadastro" element={<Cadastro />} />
          <Route
            path="/dashboard"
            element={
              <RotaProtegida>
                <Dashboard />
              </RotaProtegida>
            }
          />
          <Route
            path="/viagem/:id"
            element={
              <RotaProtegida>
                <DetalhesViagem />
              </RotaProtegida>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
