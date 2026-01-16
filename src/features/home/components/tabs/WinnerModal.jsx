import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react'

const WinnerModal = ({open, onClose, winnerName, onRetry, productName, onNotify}) => {
  const [phase, setPhase] = useState('idle')
  const [progress, setProgress] = useState(0)
  const timersRef = useRef([])
  const notificationInputRef = useRef(null)
  const defaultTemplate = useMemo(
    () =>
      `¡Felicitaciones! Ganaste ${
        productName || '[item]'
      } pasa por el stand 2 a retirar tu premio. Te esperamos 🎉`,
    [productName],
  )
  const [notificationText, setNotificationText] = useState(defaultTemplate)
  const [postNotify, setPostNotify] = useState(false)

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
    setPostNotify(false)
    setNotificationText(defaultTemplate)
    startFlow()
    return () => clearTimers()
  }, [clearTimers, defaultTemplate, open, startFlow])

  if (!open) return null

  const handleRetry = () => {
    if (!isFinished) return
    if (onRetry) onRetry()
    setPostNotify(false)
    setNotificationText(defaultTemplate)
    startFlow()
  }

  const handleNotify = () => {
    if (!postNotify) {
      setPostNotify(true)
      return
    }
    // enviar notificación (delegate to parent if provided)
    if (onNotify) {
      try {
        onNotify(notificationText)
      } catch (e) {
        console.error('onNotify failed', e)
        return
      }
    }
    if (onClose) onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div
        className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl sorteo-modal-enter"
        role="dialog"
        aria-modal="true"
      >
        <div className="flex flex-col items-center text-center gap-5">
          {!isFinished && (
            <div className="flex flex-col items-center gap-2">
              {statusSteps.map((step, index) => {
                const isActive = !isFinished && index === phaseIndex
                return (
                  <div
                    key={`${step.key}-${isActive ? phase : 'idle'}`}
                    className={`text-2xl md:text-3xl transition-all duration-300 ease-in-out ${
                      isActive ? 'text-gray-900 font-semibold sorteo-text-fade' : 'text-gray-400'
                    }`}
                  >
                    {step.label}
                  </div>
                )
              })}
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
            </div>
          )}

          {isFinished && (
            <>
              <div className="w-full h-36 rounded-lg overflow-hidden bg-gradient-to-r from-yellow-200 to-white flex items-center justify-center">
                <img
                  src="/public/celebracion.png"
                  alt="celebracion"
                  className="object-contain w-full h-full p-4"
                />
              </div>

              <div className="flex flex-col items-center gap-2 sorteo-winner-reveal">
                <h3 className="text-lg font-semibold text-gray-900">
                  ¡El premio va para {winnerName || '[nombre de asistente]'}!
                </h3>
                <p className="text-sm text-gray-600 max-w-sm">
                  Mostrá el resultado del sorteo y celebrá a la persona que obtuvo el premio.
                </p>
              </div>

              {/* Estado post-notificacion: mantiene el layout y cambia el CTA principal. */}
              {postNotify ? (
                <div className="w-full flex flex-col items-center gap-4">
                  <div className="w-full max-w-sm rounded-lg bg-gray-100 px-4 py-3 text-left">
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <span className="font-medium">Notificación de premio</span>
                      <button
                        type="button"
                        onClick={() =>
                          notificationInputRef.current && notificationInputRef.current.focus()
                        }
                        className="text-blue-600"
                      >
                        Editar
                      </button>
                    </div>
                    <textarea
                      ref={notificationInputRef}
                      value={notificationText}
                      onChange={(event) => setNotificationText(event.target.value)}
                      className="mt-3 w-full h-20 rounded-md bg-gray-200 px-3 py-2 text-sm text-gray-700"
                    />
                  </div>

                  <div className="w-full flex flex-col items-center gap-3">
                    <button
                      onClick={handleNotify}
                      className="bg-blue-600 text-white px-8 py-2.5 rounded-full font-medium"
                    >
                      Enviar notificación
                    </button>
                    <button onClick={handleRetry} className="text-sm text-blue-600">
                      Volver a sortear
                    </button>
                  </div>
                </div>
              ) : (
                <div className="w-full flex flex-col items-center gap-3">
                  <button
                    onClick={handleNotify}
                    className="bg-blue-600 text-white px-8 py-2.5 rounded-full font-medium"
                  >
                    Notificar resultado
                  </button>
                  <button onClick={handleRetry} className="text-sm text-blue-600">
                    Volver a sortear
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default WinnerModal
