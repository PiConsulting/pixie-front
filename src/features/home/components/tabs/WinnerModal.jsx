import React, {useEffect, useState} from 'react'

const WinnerModal = ({open, onClose, winnerName, onRetry, productName, onNotify}) => {
  const [loading, setLoading] = useState(true)
  const [showNotificationEditor, setShowNotificationEditor] = useState(false)
  const defaultTemplate = `¡Felicitaciones! Ganaste ${
    productName || '[item]'
  } pasa por el stand 2 a retirar tu premio. Te esperamos 🎉`
  const [notificationText, setNotificationText] = useState(defaultTemplate)

  useEffect(() => {
    if (!open) return
    setLoading(true)
    // reset editor state when modal opens
    setShowNotificationEditor(false)
    setNotificationText(
      `¡Felicitaciones! Ganaste ${
        productName || '[item]'
      } pasa por el stand 2 a retirar tu premio. Te esperamos 🎉`,
    )
    const t = setTimeout(() => setLoading(false), 2500)
    return () => clearTimeout(t)
  }, [open, productName])

  if (!open) return null

  const handleRetry = () => {
    setLoading(true)
    // mostrar spinner breve, luego pedir nuevo ganador al padre
    setTimeout(() => {
      if (onRetry) onRetry()
      // una vez que onRetry actualice el winner en el padre, el modal volverá
      // a entrar en efecto 'open' si se mantiene visible; aquí ponemos loading=false
      // para permitir que el parent vuelva a mostrar el resultado cuando lo cargue.
      setLoading(false)
    }, 1500)
  }

  const handleNotify = () => {
    // enviar notificación (delegate to parent if provided)
    if (onNotify) {
      try {
        onNotify(notificationText)
      } catch (e) {
        console.error('onNotify failed', e)
      }
    }
    // por ahora simplemente cerramos el modal
    if (onClose) onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-2xl w-full max-w-2xl p-6 shadow-lg">
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
        ) : showNotificationEditor ? (
          <div className="flex flex-col gap-4">
            <div className="w-full h-36 rounded-md overflow-hidden bg-gradient-to-r from-yellow-200 to-white flex items-center justify-center">
              <img
                src="/public/celebracion.png"
                alt="robot"
                className="object-contain w-full h-full p-4"
              />
            </div>
            <h3 className="text-xl font-semibold">
              ¡El premio va para {winnerName || '[nombre de asistente]'}!
            </h3>

            <div className="mt-2 rounded bg-gray-50 p-3">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600 font-medium">Notificación de premio</div>
                <button
                  onClick={() => setShowNotificationEditor(true)}
                  className="text-sm text-blue-600 underline"
                >
                  Editar
                </button>
              </div>
              <textarea
                value={notificationText}
                onChange={(e) => setNotificationText(e.target.value)}
                className="mt-3 w-full h-24 p-2 border border-gray-200 rounded bg-white text-sm"
              />
            </div>

            <div className="flex flex-col items-center gap-3 mt-4">
              <button onClick={handleNotify} className="bg-blue-600 text-white px-6 py-2 rounded">
                Enviar notificación
              </button>
              <button onClick={handleRetry} className="text-sm text-blue-600 underline">
                Volver a sortear
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center text-center gap-4">
            <div className="w-full h-36 rounded-md overflow-hidden bg-gradient-to-r from-yellow-200 to-white flex items-center justify-center">
              <img
                src="/public/celebracion.png"
                alt="robot"
                className="object-contain w-full h-full p-4"
              />
            </div>
            <h3 className="text-xl font-semibold">
              ¡El premio va para {winnerName || '[nombre de asistente]'}!
            </h3>
            <p className="text-gray-600">
              Mostrá el resultado del sorteo y celebrá a la persona que obtuvo el premio.
            </p>
            <div className="flex flex-col gap-4 mt-4">
              <button
                onClick={() => setShowNotificationEditor(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded"
              >
                Notificar resultado
              </button>
              <button onClick={handleRetry} className="text-sm text-blue-600 underline">
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
