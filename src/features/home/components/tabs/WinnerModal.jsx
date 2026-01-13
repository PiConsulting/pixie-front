import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react'

const WinnerModal = ({open, onClose, winnerName, onRetry, productName, onNotify}) => {
  const [phase, setPhase] = useState('idle')
  const [progress, setProgress] = useState(0)
  const [showNotificationEditor, setShowNotificationEditor] = useState(false)
  const timersRef = useRef([])
  const defaultTemplate = useMemo(
    () =>
      `¡Felicitaciones! Ganaste ${
        productName || '[item]'
      } pasa por el stand 2 a retirar tu premio. Te esperamos 🎉`,
    [productName],
  )
  const [notificationText, setNotificationText] = useState(defaultTemplate)

  const statusSteps = [
    {key: 'starting', label: 'Buscando ganador...'},
    {key: 'processing', label: 'Procesando participantes...'},
    {key: 'revealing', label: 'Seleccionando resultado...'},
  ]
  const phaseIndex =
    phase === 'starting' ? 0 : phase === 'processing' ? 1 : phase === 'revealing' ? 2 : 2
  const isFinished = phase === 'finished'

  const clearTimers = useCallback(() => {
    timersRef.current.forEach((timer) => clearTimeout(timer))
    timersRef.current = []
  }, [])

  const startFlow = useCallback(() => {
    clearTimers()
    setPhase('starting')
    setProgress(12)
    // Timings tuned for perceived quality: quick feedback + staged progress.
    const timers = [
      setTimeout(() => {
        setPhase('processing')
        setProgress(80)
      }, 360),
      setTimeout(() => {
        setPhase('revealing')
        setProgress(95)
      }, 820),
      setTimeout(() => {
        setPhase('finished')
        setProgress(100)
      }, 960),
    ]
    timersRef.current = timers
  }, [clearTimers])

  useEffect(() => {
    if (!open) return
    // reset editor state when modal opens
    setShowNotificationEditor(false)
    setNotificationText(defaultTemplate)
    startFlow()
    return () => clearTimers()
  }, [clearTimers, defaultTemplate, open, startFlow])

  if (!open) return null

  const handleRetry = () => {
    if (!isFinished) return
    if (onRetry) onRetry()
    setShowNotificationEditor(false)
    startFlow()
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
      <div
        className="bg-white rounded-2xl w-full max-w-3xl p-10 shadow-xl sorteo-modal-enter"
        role="dialog"
        aria-modal="true"
      >
        <div className="flex flex-col items-center text-center gap-8">
          <div className="flex flex-col items-center gap-2">
            {statusSteps.map((step, index) => {
              const isActive = !isFinished && index === phaseIndex
              return (
                <div
                  key={`${step.key}-${isActive ? phase : 'idle'}`}
                  className={`text-2xl md:text-3xl transition-all duration-300 ease-in-out ${
                    isActive
                      ? 'text-gray-900 font-semibold sorteo-text-fade'
                      : 'text-gray-400'
                  }`}
                >
                  {step.label}
                </div>
              )
            })}
          </div>

          <div className="w-full max-w-2xl">
            <div
              className="h-3 rounded-full bg-blue-100 overflow-hidden"
              role="progressbar"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={progress}
            >
              <div
                className="h-full bg-blue-500 transition-all duration-500 ease-in-out"
                style={{width: `${progress}%`}}
              />
            </div>
          </div>

          {isFinished && (
            <div className="flex flex-col items-center gap-2 sorteo-winner-reveal">
              <div className="text-lg text-gray-600">Ganador:</div>
              <div className="text-3xl md:text-4xl font-semibold text-gray-900">
                {winnerName || '[nombre de asistente]'} 🎉
              </div>
            </div>
          )}

          {isFinished && (
            <div className="w-full flex flex-col items-center gap-4">
              {showNotificationEditor ? (
                <div className="w-full max-w-xl rounded-lg bg-gray-50 p-4 text-left">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-600 font-medium">
                      Notificación de premio
                    </div>
                    <button
                      onClick={() => setShowNotificationEditor(false)}
                      className="text-sm text-blue-600 underline"
                    >
                      Ocultar
                    </button>
                  </div>
                  <textarea
                    value={notificationText}
                    onChange={(e) => setNotificationText(e.target.value)}
                    className="mt-3 w-full h-24 p-2 border border-gray-200 rounded bg-white text-sm"
                  />
                  <div className="mt-4 flex flex-col items-center gap-3">
                    <button
                      onClick={handleNotify}
                      className="bg-blue-600 text-white px-6 py-2 rounded"
                    >
                      Enviar notificación
                    </button>
                    <button onClick={handleRetry} className="text-sm text-blue-600 underline">
                      Volver a sortear
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-3">
                  <button
                    onClick={() => setShowNotificationEditor(true)}
                    className="bg-blue-600 text-white px-5 py-2 rounded"
                  >
                    Notificar resultado
                  </button>
                  <button onClick={handleRetry} className="text-sm text-blue-600 underline">
                    Volver a sortear
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default WinnerModal
