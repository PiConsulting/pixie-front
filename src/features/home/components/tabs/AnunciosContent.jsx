import {useState} from 'react'
import SectionLayout from '../SectionLayout'
import {useLocalStorage} from '../../../../core/hooks/useLocalStorage'
import {EVENT_ID} from '../../../../lib/api'
// import apiClient from '../../../../lib/api'  // descomentar al activar envío real

const MegaphoneIcon = ({className}) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M11 6a13 13 0 0 0 8.4-2.8A1 1 0 0 1 21 4v12a1 1 0 0 1-1.6.8A13 13 0 0 0 11 14H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2z" />
    <path d="M6 14a12 12 0 0 0 2.4 7.2 2 2 0 0 0 3.2-2.4A8 8 0 0 1 10 14" />
    <path d="M8 6v8" />
    <line x1="18.7" y1="5.2" x2="21.4" y2="4" />
    <line x1="19.4" y1="7.8" x2="22.2" y2="7.8" />
  </svg>
)

const AnunciosContent = () => {
  const [isCreating, setIsCreating] = useState(false)
  const [message, setMessage] = useState('')
  const [history, setHistory] = useLocalStorage('anuncios-historial', [])
  const [sent, setSent] = useState(false)

  const handleCreate = () => {
    setIsCreating(true)
  }

  const handleSend = () => {
    if (!message.trim()) return

    // ─── Para activar el envío real, descomentar el bloque siguiente ──────────
    // Envía el mensaje a todos los participantes del evento "Connect".
    //
    // apiClient
    //   .post(`/message/${EVENT_ID}`, {
    //     message: message.trim(),
    //   })
    //   .then(() => {
    //     const newItem = {id: Date.now(), text: message.trim(), time: 'Ahora'}
    //     setHistory((h) => [newItem, ...h])
    //     setMessage('')
    //   })
    //   .catch((err) => console.error('[Mensaje masivo]', err))
    // return
    // ─────────────────────────────────────────────────────────────────────────
    const newItem = {id: Date.now(), text: message.trim(), time: 'Ahora'}
    setHistory((h) => [newItem, ...h])
    setMessage('')
    setSent(true)
  }

  return (
    <SectionLayout className="flex flex-col">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch flex-1 min-h-0">
        {/* Left column - historial */}
        <div className="md:col-span-1 h-full min-h-0">
          <div className="bg-white rounded-xl shadow-sm p-4 text-left flex flex-col h-full">
            <h4 className="text-sm font-semibold text-gray-700 mb-2">Historial</h4>
            <div className="flex-1 overflow-visible md:overflow-y-auto pr-2 min-h-0">
              {history.length === 0 ? (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-s pt-20 p-8 text-gray-500 text-center">
                    Acá se mostrarán los anuncios enviados durante el evento.
                  </div>
                </div>
              ) : (
                <ul className="space-y-3 p-1">
                  {history.map((item) => (
                    <li key={item.id} className="flex items-start gap-3">
                      <div className="mt-1">
                        <MegaphoneIcon className="w-5 h-5 text-blue-500" />
                      </div>
                      <div className="flex-1">
                        <div className="text-gray-800 truncate" style={{fontSize: '14px'}}>
                          {item.text}
                        </div>
                        <div className="text-[11px] text-gray-400 mt-1">{item.time}</div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>

        {/* Right column - main panel */}
        <div className="md:col-span-2 h-full min-h-0">
          <div className="bg-white rounded-xl shadow-sm h-full flex flex-col">
            {!isCreating ? (
              <div className="max-w-2xl w-full text-center mx-auto flex flex-col justify-center h-full">
                <h3 className="text-xl font-semibold text-gray-900 pt-6">
                  Conectá con tu audiencia
                </h3>
                <p className="text-gray-600 p-6">
                  Enviar un mensaje general a tu audiencia te ayuda a mantener la conexión, reforzar
                  tu presencia y asegurarte de que todos reciban las novedades importantes al mismo
                  tiempo.
                </p>

                <div className="flex justify-center pb-4">
                  <button
                    onClick={handleCreate}
                    className="m-0 w-full sm:w-auto bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-lg font-medium transition-colors duration-200"
                  >
                    Crear anuncio
                  </button>
                </div>
              </div>
            ) : (
              <div className="w-full p-4 flex flex-col gap-3">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Mensaje</label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full h-32 border border-gray-200 rounded-md p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
                    placeholder="Escribir anuncio..."
                  />
                </div>

                <div className="flex justify-center sm:justify-end">
                  <button
                    onClick={handleSend}
                    className="w-full sm:w-auto bg-blue-500 hover:bg-blue-600 text-white px-4 py-2.5 rounded-md font-medium transition-colors duration-200"
                  >
                    Enviar anuncio
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {sent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 flex flex-col items-center gap-4">
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
            <h3 className="text-lg font-semibold text-gray-900">Anuncio enviado</h3>
            <p className="text-sm text-gray-500 text-center">
              El mensaje fue enviado a todos los participantes del evento Connect.
            </p>
            <button
              onClick={() => setSent(false)}
              className="px-6 py-2 rounded-lg text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 transition-colors"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </SectionLayout>
  )
}

export default AnunciosContent
