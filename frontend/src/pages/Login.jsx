import { useNavigate } from "react-router-dom"

function Login() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-indigo-600">✈️ PlanIt</h1>
          <p className="text-gray-500 mt-1">Organize suas viagens com facilidade</p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              placeholder="seu@email.com"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Senha</label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          <button
            onClick={() => navigate("/dashboard")}
            className="w-full bg-indigo-600 text-white py-2 rounded-lg font-semibold hover:bg-indigo-700 transition"
          >
            Entrar
          </button>
        </div>

        <p className="text-center text-sm text-gray-500 mt-6">
          Não tem conta?{" "}
          <span
            onClick={() => navigate("/cadastro")}
            className="text-indigo-600 cursor-pointer hover:underline"
          >
            Cadastre-se
          </span>
        </p>

      </div>
    </div>
  )
}

export default Login