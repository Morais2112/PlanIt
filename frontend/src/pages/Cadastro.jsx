import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import CampoSenha from "../components/CampoSenha"

function Cadastro() {
  const navigate = useNavigate()
  const { register, carregando } = useAuth()
  const [nome, setNome] = useState("")
  const [email, setEmail] = useState("")
  const [senha, setSenha] = useState("")
  const [confirmaSenha, setConfirmaSenha] = useState("")
  const [erro, setErro] = useState("")

  async function handleSubmit(e) {
    e.preventDefault()
    setErro("")
    if (senha !== confirmaSenha) {
      setErro("As senhas não coincidem.")
      return
    }
    if (senha.length < 6) {
      setErro("A senha precisa ter pelo menos 6 caracteres.")
      return
    }
    try {
      await register(email, senha, nome)
      navigate("/dashboard")
    } catch (err) {
      setErro(err.message || "Falha ao cadastrar.")
    }
  }

  const inputCls =
    "w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 placeholder:text-gray-400 dark:placeholder:text-gray-500"
  const labelCls = "block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1"

  const senhasIguais = confirmaSenha === "" || senha === confirmaSenha

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">✈️ PlanIt</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Crie sua conta para começar</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className={labelCls}>Nome</label>
            <input
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              type="text"
              placeholder="Como podemos te chamar?"
              className={inputCls}
            />
          </div>

          <div>
            <label className={labelCls}>Email</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              required
              placeholder="seu@email.com"
              className={inputCls}
            />
          </div>

          <CampoSenha
            label="Senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            placeholder="Mínimo 6 caracteres"
            required
            minLength={6}
          />

          <div>
            <CampoSenha
              label="Confirmar senha"
              value={confirmaSenha}
              onChange={(e) => setConfirmaSenha(e.target.value)}
              placeholder="••••••••"
              required
            />
            {!senhasIguais && (
              <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                As senhas não coincidem.
              </p>
            )}
            {senhasIguais && confirmaSenha !== "" && senha.length >= 6 && (
              <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                ✓ Senhas iguais
              </p>
            )}
          </div>

          {erro && (
            <p className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg p-2">
              {erro}
            </p>
          )}

          <button
            type="submit"
            disabled={carregando}
            className="w-full bg-indigo-600 text-white py-2 rounded-lg font-semibold hover:bg-indigo-700 transition disabled:opacity-60"
          >
            {carregando ? "Criando conta..." : "Criar conta"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
          Já tem conta?{" "}
          <span
            onClick={() => navigate("/")}
            className="text-indigo-600 dark:text-indigo-400 cursor-pointer hover:underline"
          >
            Faça login
          </span>
        </p>
      </div>
    </div>
  )
}

export default Cadastro
