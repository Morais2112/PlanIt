import { useEffect, useRef, useState } from "react"
import { api } from "../lib/api"
import { useAuth } from "../contexts/AuthContext"

// Hook customizado: CRUD completo de viagens.
// - Persiste em localStorage (cache local por usuário)
// - Sincroniza com o backend quando logado (carga inicial + save com debounce)
export function useViagens() {
  const { token, user } = useAuth()
  const chave = user ? `planit:viagens:${user.id}` : "planit:viagens"

  const [viagens, setViagens] = useState(() => {
    try {
      const raw = localStorage.getItem(chave)
      return raw ? JSON.parse(raw) : []
    } catch {
      return []
    }
  })

  const carregadoDoServidor = useRef(false)

  useEffect(() => {
    if (!token) return
    let cancelado = false
    api.getViagens(token)
      .then((arr) => {
        if (cancelado) return
        if (Array.isArray(arr)) {
          carregadoDoServidor.current = true
          setViagens(arr)
        }
      })
      .catch(() => { /* offline ok */ })
    return () => { cancelado = true }
  }, [token])

  useEffect(() => {
    try { localStorage.setItem(chave, JSON.stringify(viagens)) } catch { /* ignore */ }
    if (!token) return
    const timer = setTimeout(() => {
      api.setViagens(token, viagens).catch(() => { /* sync falhou */ })
    }, 600)
    return () => clearTimeout(timer)
  }, [viagens, token, chave])

  function gerarId() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 8)
  }

  // ===== Viagens =====
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
    setViagens((atuais) => atuais.map((v) => (v.id === id ? { ...v, ...dados } : v)))
  }
  function removerViagem(id) {
    setViagens((atuais) => atuais.filter((v) => v.id !== id))
  }
  function obterViagem(id) {
    return viagens.find((v) => v.id === id)
  }

  // ===== Pontos turísticos =====
  function adicionarPonto(viagemId, ponto) {
    const novoPonto = {
      id: gerarId(), hora: "", moeda: "BRL", ...ponto,
      valor: Number(ponto.valor) || 0,
    }
    setViagens((atuais) => atuais.map((v) =>
      v.id === viagemId
        ? { ...v, pontosTuristicos: [...(v.pontosTuristicos || []), novoPonto] }
        : v
    ))
    return novoPonto
  }
  function atualizarPonto(viagemId, pontoId, dados) {
    setViagens((atuais) => atuais.map((v) =>
      v.id === viagemId
        ? {
            ...v,
            pontosTuristicos: (v.pontosTuristicos || []).map((p) =>
              p.id === pontoId ? { ...p, ...dados, valor: Number(dados.valor ?? p.valor) || 0 } : p
            ),
          }
        : v
    ))
  }
  function removerPonto(viagemId, pontoId) {
    setViagens((atuais) => atuais.map((v) =>
      v.id === viagemId
        ? { ...v, pontosTuristicos: (v.pontosTuristicos || []).filter((p) => p.id !== pontoId) }
        : v
    ))
  }

  // ===== Notas =====
  function atualizarNotaDia(viagemId, dia, texto) {
    const chaveNota = dia == null ? "sem" : String(dia)
    setViagens((atuais) => atuais.map((v) =>
      v.id === viagemId
        ? { ...v, notasPorDia: { ...(v.notasPorDia || {}), [chaveNota]: texto } }
        : v
    ))
  }

  // ===== Import / Export =====
  function substituirViagens(novas) {
    setViagens(Array.isArray(novas) ? novas : [])
  }
  function mesclarViagens(novas) {
    if (!Array.isArray(novas)) return
    setViagens((atuais) => {
      const idsExistentes = new Set(atuais.map((v) => v.id))
      const importadas = novas.map((v) => {
        if (!v.id || idsExistentes.has(v.id)) return { ...v, id: gerarId() }
        return v
      })
      return [...atuais, ...importadas]
    })
  }

  // ===== Hospedagem =====
  function atualizarHospedagem(viagemId, dados) {
    setViagens((atuais) => atuais.map((v) =>
      v.id === viagemId ? { ...v, hospedagem: { ...(v.hospedagem || {}), ...dados } } : v
    ))
  }
  function removerHospedagem(viagemId) {
    setViagens((atuais) => atuais.map((v) =>
      v.id === viagemId ? { ...v, hospedagem: null } : v
    ))
  }

  // ===== Voos =====
  function adicionarVoo(viagemId, voo) {
    const novo = { id: gerarId(), tipo: "ida", valor: 0, moeda: "BRL", ...voo }
    setViagens((atuais) => atuais.map((v) =>
      v.id === viagemId ? { ...v, voos: [...(v.voos || []), novo] } : v
    ))
    return novo
  }
  function atualizarVoo(viagemId, vooId, dados) {
    setViagens((atuais) => atuais.map((v) =>
      v.id === viagemId
        ? { ...v, voos: (v.voos || []).map((x) => x.id === vooId ? { ...x, ...dados } : x) }
        : v
    ))
  }
  function removerVoo(viagemId, vooId) {
    setViagens((atuais) => atuais.map((v) =>
      v.id === viagemId ? { ...v, voos: (v.voos || []).filter((x) => x.id !== vooId) } : v
    ))
  }

  // ===== Checklist =====
  function adicionarChecklistItem(viagemId, item) {
    const novo = { id: gerarId(), marcado: false, ...item }
    setViagens((atuais) => atuais.map((v) =>
      v.id === viagemId ? { ...v, checklist: [...(v.checklist || []), novo] } : v
    ))
    return novo
  }
  function atualizarChecklistItem(viagemId, itemId, dados) {
    setViagens((atuais) => atuais.map((v) =>
      v.id === viagemId
        ? { ...v, checklist: (v.checklist || []).map((x) => x.id === itemId ? { ...x, ...dados } : x) }
        : v
    ))
  }
  function removerChecklistItem(viagemId, itemId) {
    setViagens((atuais) => atuais.map((v) =>
      v.id === viagemId ? { ...v, checklist: (v.checklist || []).filter((x) => x.id !== itemId) } : v
    ))
  }
  function carregarTemplateChecklist(viagemId, itens) {
    const novos = (itens || []).map((texto) => ({ id: gerarId(), texto, marcado: false }))
    setViagens((atuais) => atuais.map((v) =>
      v.id === viagemId ? { ...v, checklist: [...(v.checklist || []), ...novos] } : v
    ))
  }

  return {
    viagens,
    adicionarViagem, atualizarViagem, removerViagem, obterViagem,
    adicionarPonto, atualizarPonto, removerPonto,
    atualizarNotaDia,
    substituirViagens, mesclarViagens,
    atualizarHospedagem, removerHospedagem,
    adicionarVoo, atualizarVoo, removerVoo,
    adicionarChecklistItem, atualizarChecklistItem, removerChecklistItem,
    carregarTemplateChecklist,
  }
}
