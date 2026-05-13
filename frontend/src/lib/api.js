// Cliente HTTP simples pro backend do PlanIt
const API_URL = "http://localhost:3001/api"

async function request(metodo, caminho, { token, body } = {}) {
  const headers = { "Content-Type": "application/json" }
  if (token) headers.Authorization = `Bearer ${token}`

  let res
  try {
    res = await fetch(`${API_URL}${caminho}`, {
      method: metodo,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    })
  } catch {
    throw new Error("Sem conexão com o servidor. O backend está rodando?")
  }

  let dados = null
  try { dados = await res.json() } catch { /* sem body */ }

  if (!res.ok) {
    const msg = dados?.erro || `Erro ${res.status}`
    const err = new Error(msg)
    err.status = res.status
    throw err
  }
  return dados
}

export const api = {
  register: (dados) => request("POST", "/register", { body: dados }),
  login:    (dados) => request("POST", "/login",    { body: dados }),
  me:       (token) => request("GET",  "/me",       { token }),
  getViagens: (token) => request("GET", "/viagens", { token }),
  setViagens: (token, viagens) => request("PUT", "/viagens", { token, body: viagens }),
}
