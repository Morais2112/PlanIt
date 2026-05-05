import { useEffect, useState } from "react"

const STORAGE_KEY = "planit:viagens"

// Hook customizado: CRUD completo de viagens persistido em localStorage.
// Schema da viagem:
// {
//   id, destino, dataIda, dataVolta, descricao,
//   pessoas: number,
//   pontosTuristicos: [{ id, nome, valor, categoria, dia, hora }],
//   notasPorDia: { [diaNum]: string, "sem": string }
// }
export function useViagens() {
  const [viagens, setViagens] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      return raw ? JSON.parse(raw) : []
    } catch {
      return []
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(viagens))
    } catch {
      // ignora se localStorage estiver indisponivel
    }
  }, [viagens])

  function gerarId() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 8)
  }

  function adicionarViagem(dados) {
    const nova = {
      id: gerarId(),
      pessoas: 1,
      pontosTuristicos: [],
      notasPorDia: {},
      ...dados,
    }
    setViagens((atuais) => [...atuais, nova])
    return nova
  }

  function atualizarViagem(id, dados) {
    setViagens((atuais) =>
      atuais.map((v) => (v.id === id ? { ...v, ...dados } : v))
    )
  }

  function removerViagem(id) {
    setViagens((atuais) => atuais.filter((v) => v.id !== id))
  }

  function obterViagem(id) {
    return viagens.find((v) => v.id === id)
  }

  function adicionarPonto(viagemId, ponto) {
    const novoPonto = {
      id: gerarId(),
      hora: "",
      ...ponto,
      valor: Number(ponto.valor) || 0,
    }
    setViagens((atuais) =>
      atuais.map((v) =>
        v.id === viagemId
          ? {
              ...v,
              pontosTuristicos: [...(v.pontosTuristicos || []), novoPonto],
            }
          : v
      )
    )
    return novoPonto
  }

  function atualizarPonto(viagemId, pontoId, dados) {
    setViagens((atuais) =>
      atuais.map((v) =>
        v.id === viagemId
          ? {
              ...v,
              pontosTuristicos: (v.pontosTuristicos || []).map((p) =>
                p.id === pontoId
                  ? {
                      ...p,
                      ...dados,
                      valor: Number(dados.valor ?? p.valor) || 0,
                    }
                  : p
              ),
            }
          : v
      )
    )
  }

  function removerPonto(viagemId, pontoId) {
    setViagens((atuais) =>
      atuais.map((v) =>
        v.id === viagemId
          ? {
              ...v,
              pontosTuristicos: (v.pontosTuristicos || []).filter(
                (p) => p.id !== pontoId
              ),
            }
          : v
      )
    )
  }

  function atualizarNotaDia(viagemId, dia, texto) {
    const chave = dia == null ? "sem" : String(dia)
    setViagens((atuais) =>
      atuais.map((v) =>
        v.id === viagemId
          ? {
              ...v,
              notasPorDia: {
                ...(v.notasPorDia || {}),
                [chave]: texto,
              },
            }
          : v
      )
    )
  }

  return {
    viagens,
    adicionarViagem,
    atualizarViagem,
    removerViagem,
    obterViagem,
    adicionarPonto,
    atualizarPonto,
    removerPonto,
    atualizarNotaDia,
  }
}
