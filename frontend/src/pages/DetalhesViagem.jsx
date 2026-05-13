import { useMemo, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useViagens } from "../hooks/useViagens"
import { useCotacoes } from "../hooks/useCotacoes"
import {
  destinos,
  formatarBRL,
  formatarMoeda,
  converterParaBRL,
  converterEntreMoedas,
  calcularDiasViagem,
} from "../data/destinos"
import PontoTuristicoModal from "../components/PontoTuristicoModal"
import ConfirmModal from "../components/ConfirmModal"
import HospedagemBlock from "../components/HospedagemBlock"
import VoosBlock from "../components/VoosBlock"
import ChecklistBlock from "../components/ChecklistBlock"

function ordenarPorHora(lista) {
  return [...lista].sort((a, b) => {
    const ha = a.hora || ""
    const hb = b.hora || ""
    if (!ha && !hb) return 0
    if (!ha) return 1
    if (!hb) return -1
    return ha.localeCompare(hb)
  })
}

function DetalhesViagem() {
  const { id } = useParams()
  const navigate = useNavigate()
  const cotacoes = useCotacoes()
  const {
    viagens,
    adicionarPonto, atualizarPonto, removerPonto, atualizarNotaDia,
    atualizarHospedagem, removerHospedagem,
    adicionarVoo, atualizarVoo, removerVoo,
    adicionarChecklistItem, atualizarChecklistItem, removerChecklistItem, carregarTemplateChecklist,
  } = useViagens()

  const viagem = viagens.find((v) => v.id === id)
  const pessoas = Math.max(1, Number(viagem?.pessoas) || 1)
  const orcamento = Number(viagem?.orcamento) || 0
  const temOrcamento = orcamento > 0
  const moedaLocal = destinos[viagem?.destino]?.moedaLocal || null

  const [modalAberto, setModalAberto] = useState(false)
  const [pontoEditando, setPontoEditando] = useState(null)
  const [diaInicialModal, setDiaInicialModal] = useState(null)
  const [pontoParaExcluir, setPontoParaExcluir] = useState(null)
  const [overDia, setOverDia] = useState(null)

  const dias = useMemo(
    () => (viagem ? calcularDiasViagem(viagem.dataIda, viagem.dataVolta) : []),
    [viagem]
  )

  const pontosPorDia = useMemo(() => {
    const grupos = { sem: [] }
    dias.forEach((d) => { grupos[d.numero] = [] })
    if (viagem) {
      ;(viagem.pontosTuristicos || []).forEach((p) => {
        const chave = p.dia != null && grupos[p.dia] !== undefined ? p.dia : "sem"
        grupos[chave].push(p)
      })
      Object.keys(grupos).forEach((k) => { grupos[k] = ordenarPorHora(grupos[k]) })
    }
    return grupos
  }, [viagem, dias])

  const sugeridos = useMemo(() => {
    if (!viagem) return []
    const dest = destinos[viagem.destino]
    if (!dest) return []
    const nomesAdicionados = new Set((viagem.pontosTuristicos || []).map((p) => p.nome))
    return dest.pontosTuristicos.map((s) => ({ ...s, jaAdicionado: nomesAdicionados.has(s.nome) }))
  }, [viagem])

  function valorPontoEmBRL(p) {
    return converterParaBRL(p.valor, p.moeda || "BRL", cotacoes)
  }

  const totaisExtras = useMemo(() => {
    if (!viagem) return 0
    let extras = 0
    if (viagem.hospedagem?.valor) {
      extras += converterParaBRL(viagem.hospedagem.valor, viagem.hospedagem.moeda || "BRL", cotacoes)
    }
    ;(viagem.voos || []).forEach((v) => {
      if (v.valor) extras += converterParaBRL(v.valor, v.moeda || "BRL", cotacoes)
    })
    return extras
  }, [viagem, cotacoes])

  const subtotalIndividualBRL = useMemo(() => {
    if (!viagem) return 0
    return (viagem.pontosTuristicos || []).reduce((acc, p) => acc + valorPontoEmBRL(p), 0)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [viagem, cotacoes])

  const totalPasseios = subtotalIndividualBRL * pessoas
  const total = totalPasseios + totaisExtras
  const totalMoedaLocal = moedaLocal && moedaLocal !== "BRL"
    ? converterEntreMoedas(total, "BRL", moedaLocal, cotacoes) : null

  const percentualUsado = temOrcamento ? (total / orcamento) * 100 : 0
  const restante = temOrcamento ? orcamento - total : 0
  const excedeu = temOrcamento && total > orcamento

  let corBarra = "bg-green-500", corTexto = "text-green-700 dark:text-green-300", corBg = "bg-green-50 dark:bg-green-900/30"
  if (excedeu || percentualUsado >= 95) {
    corBarra = "bg-red-500"; corTexto = "text-red-700 dark:text-red-300"; corBg = "bg-red-50 dark:bg-red-900/30"
  } else if (percentualUsado >= 70) {
    corBarra = "bg-yellow-500"; corTexto = "text-yellow-700 dark:text-yellow-300"; corBg = "bg-yellow-50 dark:bg-yellow-900/30"
  }

  if (!viagem) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col items-center justify-center p-6">
        <p className="text-5xl mb-4">🤷</p>
        <p className="text-gray-600 dark:text-gray-300 mb-4">Viagem não encontrada.</p>
        <button onClick={() => navigate("/dashboard")}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-indigo-700">
          Voltar para o painel
        </button>
      </div>
    )
  }

  function abrirNovoPasseio(diaPadrao = null) { setPontoEditando(null); setDiaInicialModal(diaPadrao); setModalAberto(true) }
  function abrirEdicaoPasseio(p) { setPontoEditando(p); setDiaInicialModal(null); setModalAberto(true) }
  function fecharModal() { setModalAberto(false); setPontoEditando(null); setDiaInicialModal(null) }
  function salvarPasseio(dados) {
    if (pontoEditando) atualizarPonto(viagem.id, pontoEditando.id, dados)
    else adicionarPonto(viagem.id, dados)
  }
  function adicionarSugerido(s) {
    if (s.jaAdicionado) return
    adicionarPonto(viagem.id, { nome: s.nome, valor: s.valor, moeda: "BRL", categoria: s.categoria, dia: null, hora: "" })
  }
  function moverParaDia(p, novoDia) {
    atualizarPonto(viagem.id, p.id, { dia: novoDia === "" || novoDia == null ? null : Number(novoDia) })
  }
  function confirmarExclusaoPonto() {
    if (pontoParaExcluir) { removerPonto(viagem.id, pontoParaExcluir.id); setPontoParaExcluir(null) }
  }
  function handleDragStart(e, p) { e.dataTransfer.setData("text/planit-ponto", p.id); e.dataTransfer.effectAllowed = "move" }
  function handleDragOver(e, k) { e.preventDefault(); e.dataTransfer.dropEffect = "move"; if (overDia !== k) setOverDia(k) }
  function handleDragLeave() { setOverDia(null) }
  function handleDrop(e, k) {
    e.preventDefault()
    const pid = e.dataTransfer.getData("text/planit-ponto")
    if (pid) atualizarPonto(viagem.id, pid, { dia: k === "sem" ? null : Number(k) })
    setOverDia(null)
  }

  const bandeira = destinos[viagem.destino]?.bandeira || "📍"

  function subtotalDiaBRL(lista) {
    return lista.reduce((acc, p) => acc + valorPontoEmBRL(p), 0) * pessoas
  }

  function PontoCard({ ponto }) {
    const m = ponto.moeda || "BRL"
    const vo = Number(ponto.valor) || 0
    const vBRL = valorPontoEmBRL(ponto)
    const mostrarBRL = m !== "BRL" && vo > 0
    const mostrarLocal = moedaLocal && moedaLocal !== "BRL" && moedaLocal !== m && vo > 0
    const vLocal = mostrarLocal ? converterEntreMoedas(vo, m, moedaLocal, cotacoes) : 0
    return (
      <li draggable onDragStart={(e) => handleDragStart(e, ponto)}
        className="py-3 flex items-center justify-between gap-3 cursor-move group" title="Arraste para outro dia">
        <div className="min-w-0 flex-1 flex items-center gap-2">
          <span className="text-gray-300 dark:text-gray-600 group-hover:text-gray-500 select-none no-print">⋮⋮</span>
          <div className="min-w-0 flex-1">
            <p className="font-medium text-gray-800 dark:text-gray-100 truncate">
              {ponto.hora && <span className="text-indigo-600 dark:text-indigo-400 mr-2 font-mono text-sm">{ponto.hora}</span>}
              {ponto.nome}
            </p>
            <div className="flex flex-wrap items-center gap-2 mt-1 text-xs">
              <span className="bg-indigo-50 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 px-2 py-0.5 rounded-full">{ponto.categoria}</span>
              <span className="text-gray-500 dark:text-gray-400">{vo > 0 ? `${formatarMoeda(vo, m)} / pessoa` : "Gratuito"}</span>
              {mostrarBRL && <span className="text-gray-400 dark:text-gray-500">≈ {formatarBRL(vBRL)}</span>}
              {mostrarLocal && <span className="text-emerald-600 dark:text-emerald-400">≈ {formatarMoeda(vLocal, moedaLocal)}</span>}
              {vBRL > 0 && pessoas > 1 && <span className="text-gray-400 dark:text-gray-500">· total {formatarBRL(vBRL * pessoas)}</span>}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 no-print">
          {dias.length > 0 && (
            <select value={ponto.dia ?? ""} onChange={(e) => moverParaDia(ponto, e.target.value)}
              className="text-xs border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 rounded-md px-1 py-1 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400">
              <option value="">Sem dia</option>
              {dias.map((d) => <option key={d.numero} value={d.numero}>Dia {d.numero}</option>)}
            </select>
          )}
          <button onClick={() => abrirEdicaoPasseio(ponto)}
            className="text-xs bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 px-2 py-1 rounded-md">✏️</button>
          <button onClick={() => setPontoParaExcluir(ponto)}
            className="text-xs bg-red-50 hover:bg-red-100 text-red-700 px-2 py-1 rounded-md">🗑️</button>
        </div>
      </li>
    )
  }

  function NotaDoDia({ chave }) {
    const valorAtual = viagem.notasPorDia?.[String(chave)] ?? ""
    const [texto, setTexto] = useState(valorAtual)
    return (
      <textarea value={texto} onChange={(e) => setTexto(e.target.value)}
        onBlur={() => { if (texto !== valorAtual) atualizarNotaDia(viagem.id, chave === "sem" ? null : chave, texto) }}
        placeholder="Notas do dia: lembretes, reservas, restaurantes..." rows={2}
        className="w-full text-sm border border-gray-200 dark:border-gray-700 dark:bg-gray-700/50 dark:text-gray-100 rounded-lg px-3 py-2 mt-3 focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none bg-gray-50/50 print:border-0 print:bg-transparent" />
    )
  }

  const pontosSemDia = pontosPorDia.sem || []

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 dark:text-gray-100 print:bg-white">
      <header className="bg-white dark:bg-gray-800 shadow-sm px-6 py-4 flex items-center justify-between no-print">
        <h1 className="text-xl font-bold text-indigo-600">✈️ PlanIt</h1>
        <div className="flex items-center gap-3">
          <button onClick={() => window.print()}
            className="text-sm bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 px-3 py-1.5 rounded-md">🖨️ Imprimir</button>
          <button onClick={() => navigate("/dashboard")}
            className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline">← Voltar</button>
        </div>
      </header>

      <main className="max-w-3xl mx-auto p-6 space-y-6 print:p-0 print:space-y-3">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-8 print:shadow-none print:p-2">
          <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2">{bandeira} {viagem.destino}</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6">{viagem.dataIda} → {viagem.dataVolta}</p>

          {viagem.descricao && (
            <div className="bg-indigo-50 dark:bg-indigo-900/30 rounded-xl p-4 mb-6 print:bg-transparent print:p-0">
              <p className="text-gray-700 dark:text-gray-200">{viagem.descricao}</p>
            </div>
          )}

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 text-center">
              <p className="text-2xl mb-1">📅</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Duração</p>
              <p className="font-semibold text-gray-800 dark:text-gray-100 text-sm">{dias.length} {dias.length === 1 ? "dia" : "dias"}</p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 text-center">
              <p className="text-2xl mb-1">👥</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Viajantes</p>
              <p className="font-semibold text-gray-800 dark:text-gray-100 text-sm">{pessoas} {pessoas === 1 ? "pessoa" : "pessoas"}</p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 text-center">
              <p className="text-2xl mb-1">🎟️</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Passeios/pessoa</p>
              <p className="font-semibold text-gray-800 dark:text-gray-100 text-sm">{formatarBRL(subtotalIndividualBRL)}</p>
            </div>
            <div className="bg-green-50 dark:bg-green-900/30 rounded-xl p-4 text-center">
              <p className="text-2xl mb-1">💰</p>
              <p className="text-sm text-green-700 dark:text-green-300">Total</p>
              <p className="font-bold text-green-800 dark:text-green-200 text-sm">{formatarBRL(total)}</p>
              {totalMoedaLocal != null && (
                <p className="text-xs text-emerald-700 dark:text-emerald-400 mt-0.5">≈ {formatarMoeda(totalMoedaLocal, moedaLocal)}</p>
              )}
            </div>
          </div>

          {totaisExtras > 0 && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">
              Total inclui passeios ({formatarBRL(totalPasseios)}) + hospedagem/voos ({formatarBRL(totaisExtras)}).
            </p>
          )}

          {temOrcamento && (
            <div className={`mt-4 ${corBg} rounded-xl p-4 border ${
              excedeu ? "border-red-200 dark:border-red-800"
              : percentualUsado >= 70 ? "border-yellow-200 dark:border-yellow-800"
              : "border-green-200 dark:border-green-800"
            }`}>
              <div className="flex items-center justify-between mb-2">
                <p className={`text-sm font-semibold ${corTexto}`}>💼 Orçamento: {formatarBRL(orcamento)}</p>
                <p className={`text-sm font-bold ${corTexto}`}>{percentualUsado.toFixed(0)}%</p>
              </div>
              <div className="w-full bg-white/60 dark:bg-gray-700/60 rounded-full h-3 overflow-hidden">
                <div className={`${corBarra} h-3 transition-all duration-500`}
                  style={{ width: `${Math.min(100, percentualUsado)}%` }} />
              </div>
              <p className={`text-xs mt-2 ${corTexto}`}>
                {excedeu ? (<>⚠️ Você excedeu o orçamento em {formatarBRL(-restante)} — sem stress!</>)
                : percentualUsado >= 95 ? (<>🚨 Quase no limite! Restam {formatarBRL(restante)}.</>)
                : percentualUsado >= 70 ? (<>⚠️ Já usou {percentualUsado.toFixed(0)}% do orçamento. Restam {formatarBRL(restante)}.</>)
                : (<>✅ Tranquilo, ainda restam {formatarBRL(restante)} no orçamento.</>)}
              </p>
            </div>
          )}
        </div>

        <HospedagemBlock hospedagem={viagem.hospedagem}
          onSalvar={(d) => atualizarHospedagem(viagem.id, d)}
          onRemover={() => removerHospedagem(viagem.id)} />

        <VoosBlock voos={viagem.voos}
          onAdicionar={(v) => adicionarVoo(viagem.id, v)}
          onAtualizar={(vid, d) => atualizarVoo(viagem.id, vid, d)}
          onRemover={(vid) => removerVoo(viagem.id, vid)} />

        <ChecklistBlock checklist={viagem.checklist}
          onAdicionar={(i) => adicionarChecklistItem(viagem.id, i)}
          onAtualizar={(id, d) => atualizarChecklistItem(viagem.id, id, d)}
          onRemover={(id) => removerChecklistItem(viagem.id, id)}
          onCarregarTemplate={(itens) => carregarTemplateChecklist(viagem.id, itens)} />

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-6 print:shadow-none print:p-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">📅 Roteiro</h3>
            <button onClick={() => abrirNovoPasseio(null)}
              className="bg-indigo-600 text-white px-3 py-2 rounded-lg text-sm font-semibold hover:bg-indigo-700 no-print">+ Novo passeio</button>
          </div>

          {dias.length === 0 ? (
            <p className="text-sm text-gray-400 dark:text-gray-500 italic text-center py-6">
              Defina as datas de ida e volta para montar o roteiro por dia.
            </p>
          ) : (
            <div className="space-y-4">
              <p className="text-xs text-gray-400 dark:text-gray-500 italic no-print">💡 Dica: arraste os passeios entre os dias para reorganizar.</p>
              {dias.map((d) => {
                const lista = pontosPorDia[d.numero] || []
                const hover = overDia === d.numero
                return (
                  <div key={d.numero}
                    onDragOver={(e) => handleDragOver(e, d.numero)}
                    onDragLeave={handleDragLeave}
                    onDrop={(e) => handleDrop(e, d.numero)}
                    className={`border rounded-xl p-4 transition print:border-gray-300 ${
                      hover ? "border-indigo-500 bg-indigo-50/40 dark:bg-indigo-900/30 ring-2 ring-indigo-200"
                      : "border-gray-200 dark:border-gray-700"
                    }`}>
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <p className="font-bold text-gray-800 dark:text-gray-100">
                          Dia {d.numero}
                          <span className="font-normal text-gray-500 dark:text-gray-400 text-sm ml-2">{d.dataFormatada} ({d.diaSemana})</span>
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {lista.length} {lista.length === 1 ? "passeio" : "passeios"} · {formatarBRL(subtotalDiaBRL(lista))}
                        </p>
                      </div>
                      <button onClick={() => abrirNovoPasseio(d.numero)}
                        className="text-xs bg-indigo-50 dark:bg-indigo-900/40 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 px-3 py-1 rounded-md font-medium whitespace-nowrap no-print">+ Adicionar</button>
                    </div>

                    {lista.length === 0 ? (
                      <p className="text-xs text-gray-400 dark:text-gray-500 italic mt-2">Nenhum passeio programado.</p>
                    ) : (
                      <ul className="divide-y divide-gray-100 dark:divide-gray-700">
                        {lista.map((p) => <PontoCard key={p.id} ponto={p} />)}
                      </ul>
                    )}
                    <NotaDoDia chave={d.numero} />
                  </div>
                )
              })}

              {pontosSemDia.length > 0 && (
                <div onDragOver={(e) => handleDragOver(e, "sem")}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, "sem")}
                  className={`border rounded-xl p-4 transition ${
                    overDia === "sem" ? "border-amber-500 bg-amber-100/40 ring-2 ring-amber-200"
                    : "border-amber-200 bg-amber-50/50 dark:bg-amber-900/20 dark:border-amber-800"
                  }`}>
                  <div className="mb-2">
                    <p className="font-bold text-amber-800 dark:text-amber-300">⏳ Sem dia definido</p>
                    <p className="text-xs text-amber-700 dark:text-amber-400">
                      {pontosSemDia.length} {pontosSemDia.length === 1 ? "passeio" : "passeios"} · {formatarBRL(subtotalDiaBRL(pontosSemDia))}
                    </p>
                  </div>
                  <ul className="divide-y divide-amber-100 dark:divide-amber-900">
                    {pontosSemDia.map((p) => <PontoCard key={p.id} ponto={p} />)}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>

        {sugeridos.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-6 no-print">
            <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-1">✨ Pontos turísticos em {viagem.destino}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Toque para adicionar à sua viagem.</p>
            <div className="grid sm:grid-cols-2 gap-3">
              {sugeridos.map((s) => (
                <button key={s.nome} onClick={() => adicionarSugerido(s)} disabled={s.jaAdicionado}
                  className={`text-left p-3 rounded-xl border transition ${
                    s.jaAdicionado
                      ? "bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-800 cursor-not-allowed opacity-70"
                      : "border-gray-200 dark:border-gray-700 hover:border-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30"
                  }`}>
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-medium text-gray-800 dark:text-gray-100 text-sm">{s.nome}</p>
                    {s.jaAdicionado && <span className="text-green-700 dark:text-green-400 text-xs">✓ adicionado</span>}
                  </div>
                  <div className="flex items-center gap-2 mt-1 text-xs">
                    <span className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 px-2 py-0.5 rounded-full">{s.categoria}</span>
                    <span className="text-gray-500 dark:text-gray-400">{s.valor > 0 ? formatarBRL(s.valor) : "Gratuito"}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </main>

      {modalAberto && (
        <PontoTuristicoModal onClose={fecharModal} onSalvar={salvarPasseio}
          pontoEditando={pontoEditando} dias={dias} diaInicial={diaInicialModal} />
      )}
      {pontoParaExcluir && (
        <ConfirmModal titulo="Remover passeio?"
          mensagem={`O passeio "${pontoParaExcluir.nome}" será removido desta viagem.`}
          textoConfirmar="Remover" perigo onConfirmar={confirmarExclusaoPonto}
          onCancelar={() => setPontoParaExcluir(null)} />
      )}
    </div>
  )
}

export default DetalhesViagem
