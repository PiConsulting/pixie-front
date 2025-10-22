import React, {useEffect, useState} from 'react'

const WinnerModal = ({open, onClose, winnerName, onRetry}) => {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!open) return
    setLoading(true)
    const t = setTimeout(() => setLoading(false), 2500)
    return () => clearTimeout(t)
  }, [open])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-2xl w-full max-w-lg p-6 shadow-lg">
        {loading ? (
          <div className="flex flex-col items-center gap-4">
            <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center">
              <svg
                className="animate-spin h-12 w-12 text-blue-600"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                ></path>
              </svg>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold">Buscando ganador...</div>
              <div className="text-sm text-gray-500 mt-2">
                Estamos eligiendo a la persona ganadora, por favor esperá
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center text-center gap-4">
            <img
              src="/public/robot_afirmativo.png"
              alt="robot"
              className="w-48 h-32 object-contain"
            />
            <h3 className="text-xl font-semibold">
              ¡El premio va para {winnerName || '[nombre de asistente]'}!
            </h3>
            <p className="text-gray-600">
              Mostrá el resultado del sorteo y celebrá a la persona que obtuvo el premio.
            </p>
            <div className="flex gap-4 mt-4">
              <button onClick={onClose} className="bg-blue-600 text-white px-4 py-2 rounded">
                Notificar resultado
              </button>
              <button
                onClick={() => {
                  if (onRetry) onRetry()
                }}
                className="text-sm text-blue-600 underline"
              >
                Volver a sortear
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default WinnerModal
