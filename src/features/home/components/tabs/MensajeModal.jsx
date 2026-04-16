import {useState} from 'react'
import apiClient, {EVENT_ID} from '../../../../lib/api'

const MensajeModal = ({participant, onClose}) => {
  const [message, setMessage] = useState('')
  const [sent, setSent] = useState(false)

  const handleConfirm = () => {
    if (!message.trim()) return

    // ─── Para activar el envío real, descomentar el bloque siguiente ──────────
    // Usa el mismo endpoint que mensajes masivos pero con un único destinatario:
    // el teléfono de la persona seleccionada.
    //
    // apiClient
    //   .post(`/message/${EVENT_ID}`, {
    //     message: message.trim(),
    //     phone: participant.phone,   // destinatario individual
    //   })
    //   .then(() => setSent(true))
    //   .catch((err) => console.error('[Mensaje individual]', err))
    // return
    // ─────────────────────────────────────────────────────────────────────────

    console.log('[Mensaje individual simulado]', {
      event_id: EVENT_ID,
      to: participant.phone,
      message: message.trim(),
    })
    setSent(true)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 flex flex-col gap-4">
        {!sent ? (
          <>
            <h3 className="text-lg font-semibold text-gray-900">
              Enviar mensaje a {participant.name} {participant.last_name}
            </h3>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              placeholder="Escribí tu mensaje..."
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
            />
            <div className="flex gap-3 justify-end">
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirm}
                disabled={!message.trim()}
                className="px-4 py-2 rounded-lg text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Confirmar envío
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="flex flex-col items-center gap-3 py-4">
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-green-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Mensaje enviado</h3>
              <p className="text-sm text-gray-500 text-center">
                El mensaje fue enviado a {participant.name} {participant.last_name}.
              </p>
            </div>
            <div className="flex justify-center">
              <button
                onClick={onClose}
                className="px-6 py-2 rounded-lg text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 transition-colors"
              >
                Cerrar
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default MensajeModal
