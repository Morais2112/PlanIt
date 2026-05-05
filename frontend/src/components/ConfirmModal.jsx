// Modal generico de confirmacao (usado para deletes)
function ConfirmModal({
  titulo = "Tem certeza?",
  mensagem,
  textoConfirmar = "Confirmar",
  textoCancelar = "Cancelar",
  perigo = false,
  onConfirmar,
  onCancelar,
}) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm">
        <h3 className="text-lg font-bold text-gray-800 mb-2">{titulo}</h3>
        {mensagem && (
          <p className="text-sm text-gray-600 mb-5">{mensagem}</p>
        )}

        <div className="flex gap-3">
          <button
            onClick={onCancelar}
            className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg font-semibold hover:bg-gray-50 transition"
          >
            {textoCancelar}
          </button>
          <button
            onClick={onConfirmar}
            className={`flex-1 text-white py-2 rounded-lg font-semibold transition ${
              perigo
                ? "bg-red-600 hover:bg-red-700"
                : "bg-indigo-600 hover:bg-indigo-700"
            }`}
          >
            {textoConfirmar}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmModal
