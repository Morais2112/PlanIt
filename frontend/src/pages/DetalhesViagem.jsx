import { useMemo, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useViagens } from "../hooks/useViagens"
import {
  destinos,
  formatarBRL,
  calcularDiasViagem,
} from "../data/destinos"
import PontoTuristicoModal from "../components/PontoTuristicoModal"
import ConfirmModal from "../components/ConfirmModal"

// Ordena pontos por hora (sem hora vai pro fim)
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
  const {
    viagens,
    adicionarPonto,
    atualizarPonto,
    removerPonto,
    atualizarNotaDia,
  } = useViagens()

  const viagem = viagens.find((v) => v.id === id)
  const pessoas = Math.max(1, Number(viagem?.pessoas) || 1)

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
    dias.forEach((d) => {
      grupos[d.numero] = []
    })
    if (viagem) {
      ;(viagem.pontosTuristicos || []).forEach((p) => {
        const chave =
          p.dia != null && grupos[p.dia] !== undefined ? p.dia : "sem"
        grupos[chave].push(p)
      })
      // ordena cada grupo por hora
      Object.keys(grupos).forEach((k) => {
        grupos[k] = ordenarPorHora(grupos[k])
      })
    }
    return grupos
  }, [viagem, dias])

  const sugeridos = useMemo(() => {
    if (!viagem) return []
    const dest = destinos[viagem.destino]
    if (!dest) return []
    const nomesAdicionados = new Set(
      (viagem.pontosTuristicos || []).map((p) => p.nome)
    )
    return dest.pontosTuristicos.map((s) => ({
      ...s,
      jaAdicionado: nomesAdicionados.has(s.nome),
    }))
  }, [viagem])

  const subtotalIndividual = useMemo(() => {
    if (!viagem) return 0
    return (viagem.pontosTuristicos || []).reduce(
      (acc, p) => acc + (Number(p.valor) || 0),
      0
    )
  }, [viagem])

  const total = subtotalIndividual * pessoas

  if (!viagem) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
        <p className="text-5xl mb-4">🤷</p>
        <p className="text-gray-600 mb-4">Viagem nao encontrada.</p>
        <button
          onClick={() => navigate("/dashboard")}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-indigo-700 transition"
        >
          Voltar para o painel
        </button>
      </div>
    )
  }

  function abrirNovoPasseio(diaPadrao = null) {
    setPontoEditando(null)
    setDiaInicialModal(diaPadrao)
    setModalAberto(true)
  }

  function abrirEdicaoPasseio(ponto) {
    setPontoEditando(ponto)
    setDiaInicialModal(null)
    setModalAberto(true)
  }

  function fecharModal() {
    setModalAberto(false)
    setPontoEditando(null)
    setDiaInicialModal(null)
  }

  function salvarPasseio(dados) {
    if (pontoEditando) {
      atualizarPonto(viagem.id, pontoEditando.id, dados)
    } else {
      adicionarPonto(viagem.id, dados)
    }
  }

  function adicionarSugerido(sugerido) {
    if (sugerido.jaAdicionado) return
    adicionarPonto(viagem.id, {
      nome: sugerido.nome,
      valor: sugerido.valor,
      categoria: sugerido.categoria,
      dia: null,
      hora: "",
    })
  }

  function moverParaDia(ponto, novoDia) {
    atualizarPonto(viagem.id, ponto.id, {
      dia: novoDia === "" || novoDia == null ? null : Number(novoDia),
    })
  }

  function confirmarExclusaoPonto() {
    if (pontoParaExcluir) {
      removerPonto(viagem.id, pontoParaExcluir.id)
      setPontoParaExcluir(null)
    }
  }

  // Drag and drop handlers
  function handleDragStart(e, ponto) {
    e.dataTransfer.setData("text/planit-ponto", ponto.id)
    e.dataTransfer.effectAllowed = "move"
  }

  function handleDragOver(e, chaveDia) {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
    if (overDia !== chaveDia) setOverDia(chaveDia)
  }

  function handleDragLeave() {
    setOverDia(null)
  }

  function handleDrop(e, chaveDia) {
    e.preventDefault()
    const pontoId = e.dataTransfer.getData("text/planit-ponto")
    if (pontoId) {
      const novoDia = chaveDia === "sem" ? null : Number(chaveDia)
      atualizarPonto(viagem.id, pontoId, { dia: novoDia })
    }
    setOverDia(null)
  }

  const bandeira = destinos[viagem.destino]?.bandeira || "📍"

  function subtotalDia(lista) {
    const soma = lista.reduce((acc, p) => acc + (Number(p.valor) || 0), 0)
    return soma * pessoas
  }

  function PontoCard({ ponto }) {
    return (
      <li
        draggable
        onDragStart={(e) => handleDragStart(e, ponto)}
        className="py-3 flex items-center justify-between gap-3 cursor-move group"
        title="Arraste para outro dia"
      >
        <div className="min-w-0 flex-1 flex items-center gap-2">
          <span className="text-gray-300 group-hover:text-gray-500 select-none">
            ⋮⋮
          </span>
          <div className="min-w-0 flex-1">
            <p className="font-medium text-gray-800 truncate">
              {ponto.hora && (
                <span className="text-indigo-600 mr-2 font-mono text-sm">
                  {ponto.hora}
                </span>
              )}
              {ponto.nome}
            </p>
            <div className="flex flex-wrap items-center gap-2 mt-1 text-xs">
              <span className="bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full">
                {ponto.categoria}
              </span>
              <span className="text-gray-500">
                {ponto.valor > 0
                  ? `${formatarBRL(ponto.valor)} / pessoa`
                  : "Gratuito"}
              </span>
              {ponto.valor > 0 && pessoas > 1 && (
                <span className="text-gray-400">
                  = {formatarBRL(ponto.valor * pessoas)}
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {dias.length > 0 && (
            <select
              value={ponto.dia ?? ""}
              onChange={(e) => moverParaDia(ponto, e.target.value)}
              title="Mover para outro dia"
              className="text-xs border border-gray-200 rounded-md px-1 py-1 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
            >
              <option value="">Sem dia</option>
              {dias.map((d) => (
                <option key={d.numero} value={d.numero}>
                  Dia {d.numero}
                </option>
              ))}
            </select>
          )}
          <button
            onClick={() => abrirEdicaoPasseio(ponto)}
            className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-2 py-1 rounded-md transition"
            title="Editar"
          >
            ✏️
          </button>
          <button
            onClick={() => setPontoParaExcluir(ponto)}
            className="text-xs bg-red-50 hover:bg-red-100 text-red-700 px-2 py-1 rounded-md transition"
            title="Remover"
          >
            🗑️
          </button>
        </div>
      </li>
    )
  }

  function NotaDoDia({ chave }) {
    const valorAtual = viagem.notasPorDia?.[String(chave)] ?? ""
    const [texto, setTexto] = useState(valorAtual)
    return (
      <textarea
        value={texto}
        onChange={(e) => setTexto(e.target.value)}
        onBlur={() => {
          if (texto !== valorAtual) {
            atualizarNotaDia(
              viagem.id,
              chave === "sem" ? null : chave,
              texto
            )
          }
        }}
        placeholder="Notas do dia: lembretes, reservas, restaurantes..."
        rows={2}
        className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 mt-3 focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none bg-gray-50/50"
      />
    )
  }

  const pontosSemDia = pontosPorDia.sem || []

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm px-6 py-4 flex items-center justify-between">
        <h1 className="text-xl font-bold text-indigo-600">✈️ PlanIt</h1>
        <button
          onClick={() => navigate("/dashboard")}
          className="text-sm text-indigo-600 hover:underline"
        >
          ← Voltar
        </button>
      </header>

      <main className="max-w-3xl mx-auto p-6 space-y-6">
        <div className="bg-white rounded-2xl shadow p-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            {bandeira} {viagem.destino}
          </h2>
          <p className="text-gray-500 mb-6">
            {viagem.dataIda} → {viagem.dataVolta}
          </p>

          {viagem.descricao && (
            <div className="bg-indigo-50 rounded-xl p-4 mb-6">
              <p className="text-gray-700">{viagem.descricao}</p>
            </div>
          )}

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-gray-50 rounded-xl p-4 text-center">
              <p className="text-2xl mb-1">📅</p>
              <p className="text-sm text-gray-500">Duracao</p>
              <p className="font-semibold text-gray-800 text-sm">
                {dias.length} {dias.length === 1 ? "dia" : "dias"}
              </p>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 text-center">
              <p className="text-2xl mb-1">👥</p>
              <p className="text-sm text-gray-500">Viajantes</p>
              <p className="font-semibold text-gray-800 text-sm">
                {pessoas} {pessoas === 1 ? "pessoa" : "pessoas"}
              </p>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 text-center">
              <p className="text-2xl mb-1">🎟️</p>
              <p className="text-sm text-gray-500">Por pessoa</p>
              <p className="font-semibold text-gray-800 text-sm">
                {formatarBRL(subtotalIndividual)}
              </p>
            </div>
            <div className="bg-green-50 rounded-xl p-4 text-center">
              <p className="text-2xl mb-1">💰</p>
              <p className="text-sm text-green-700">Total</p>
              <p className="font-bold text-green-800 text-sm">
                {formatarBRL(total)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-gray-800">📅 Roteiro</h3>
            <button
              onClick={() => abrirNovoPasseio(null)}
              className="bg-indigo-600 text-white px-3 py-2 rounded-lg text-sm font-semibold hover:bg-indigo-700 transition"
            >
              + Novo passeio
            </button>
          </div>

          {dias.length === 0 ? (
            <p className="text-sm text-gray-400 italic text-center py-6">
              Defina as datas de ida e volta da viagem para montar o roteiro por dia.
            </p>
          ) : (
            <div className="space-y-4">
              <p className="text-xs text-gray-400 italic">
                💡 Dica: arraste os passeios entre os dias para reorganizar.
              </p>
              {dias.map((d) => {
                const lista = pontosPorDia[d.numero] || []
                const hover = overDia === d.numero
                return (
                  <div
                    key={d.numero}
                    onDragOver={(e) => handleDragOver(e, d.numero)}
                    onDragLeave={handleDragLeave}
                    onDrop={(e) => handleDrop(e, d.numero)}
                    className={`border rounded-xl p-4 transition ${
                      hover
                        ? "border-indigo-500 bg-indigo-50/40 ring-2 ring-indigo-200"
                        : "border-gray-200"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <p className="font-bold text-gray-800">
                          Dia {d.numero}
                          <span className="font-normal text-gray-500 text-sm ml-2">
                            {d.dataFormatada} ({d.diaSemana})
                          </span>
                        </p>
                        <p className="text-xs text-gray-500">
                          {lista.length}{" "}
                          {lista.length === 1 ? "passeio" : "passeios"} ·{" "}
                          {formatarBRL(subtotalDia(lista))}
                        </p>
                      </div>
                      <button
                        onClick={() => abrirNovoPasseio(d.numero)}
                        className="text-xs bg-indigo-50 hover:bg-indigo-100 text-indigo-700 px-3 py-1 rounded-md font-medium transition whitespace-nowrap"
                      >
                        + Adicionar
                      </button>
                    </div>

                    {lista.length === 0 ? (
                      <p className="text-xs text-gray-400 italic mt-2">
                        Nenhum passeio programado. Arraste um para ca ou clique em "+ Adicionar".
                      </p>
                    ) : (
                      <ul className="divide-y divide-gray-100">
                        {lista.map((p) => (
                          <PontoCard key={p.id} ponto={p} />
                        ))}
                      </ul>
                    )}

                    <NotaDoDia chave={d.numero} />
                  </div>
                )
              })}

              {pontosSemDia.length > 0 && (
                <div
                  onDragOver={(e) => handleDragOver(e, "sem")}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, "sem")}
                  className={`border rounded-xl p-4 transition ${
                    overDia === "sem"
                      ? "border-amber-500 bg-amber-100/40 ring-2 ring-amber-200"
                      : "border-amber-200 bg-amber-50/50"
                  }`}
                >
                  <div className="mb-2">
                    <p className="font-bold text-amber-800">
                      ⏳ Sem dia definido
                    </p>
                    <p className="text-xs text-amber-700">
                      {pontosSemDia.length}{" "}
                      {pontosSemDia.length === 1 ? "passeio" : "passeios"} ·{" "}
                      {formatarBRL(subtotalDia(pontosSemDia))}
                    </p>
                  </div>
                  <ul className="divide-y divide-amber-100">
                    {pontosSemDia.map((p) => (
                      <PontoCard key={p.id} ponto={p} />
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>

        {sugeridos.length > 0 && (
          <div className="bg-white rounded-2xl shadow p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-1">
              ✨ Pontos turisticos em {viagem.destino}
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              Toque para adicionar a sua viagem. Depois e so arrastar pro dia certo.
            </p>

            <div className="grid sm:grid-cols-2 gap-3">
              {sugeridos.map((s) => (
                <button
                  key={s.nome}
                  onClick={() => adicionarSugerido(s)}
                  disabled={s.jaAdicionado}
                  className={`text-left p-3 rounded-xl border transition ${
                    s.jaAdicionado
                      ? "bg-green-50 border-green-200 cursor-not-allowed opacity-70"
                      : "border-gray-200 hover:border-indigo-400 hover:bg-indigo-50"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-medium text-gray-800 text-sm">
                      {s.nome}
                    </p>
                    {s.jaAdicionado && (
                      <span className="text-green-700 text-xs">
                        ✓ adicionado
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-1 text-xs">
                    <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full">
                      {s.categoria}
                    </span>
                    <span className="text-gray-500">
                      {s.valor > 0 ? formatarBRL(s.valor) : "Gratuito"}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </main>

      {modalAberto && (
        <PontoTuristicoModal
          onClose={fecharModal}
          onSalvar={salvarPasseio}
          pontoEditando={pontoEditando}
          dias={dias}
          diaInicial={diaInicialModal}
        />
      )}

      {pontoParaExcluir && (
        <ConfirmModal
          titulo="Remover passeio?"
          mensagem={`O passeio "${pontoParaExcluir.nome}" sera removido desta viagem.`}
          textoConfirmar="Remover"
          perigo
          onConfirmar={confirmarExclusaoPonto}
          onCancelar={() => setPontoParaExcluir(null)}
        />
      )}
    </div>
  )
}

export default DetalhesViagem
