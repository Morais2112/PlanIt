import { useState } from "react"

// Input de senha com botão "olho" pra mostrar/esconder
function CampoSenha({ value, onChange, label, placeholder, required, minLength, autoFocus }) {
  const [mostrar, setMostrar] = useState(false)
  return (
    <div>
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          value={value}
          onChange={onChange}
          type={mostrar ? "text" : "password"}
          required={required}
          minLength={minLength}
          autoFocus={autoFocus}
          placeholder={placeholder}
          className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-lg pl-4 pr-11 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 placeholder:text-gray-400 dark:placeholder:text-gray-500"
        />
        <button
          type="button"
          onClick={() => setMostrar((v) => !v)}
          tabIndex={-1}
          aria-label={mostrar ? "Esconder senha" : "Mostrar senha"}
          className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 text-lg"
          title={mostrar ? "Esconder senha" : "Mostrar senha"}
        >
          {mostrar ? "🙈" : "👁️"}
        </button>
      </div>
    </div>
  )
}

export default CampoSenha
