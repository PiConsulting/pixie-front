import {useState} from 'react'
import SectionLayout from '../SectionLayout'

// Megaphone icon for announcements (replaces the previous glyph).
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
  const [audience, setAudience] = useState('all')
  const [history, setHistory] = useState([])

  const sampleHistory = [
    {id: 1, text: 'En 5 min comienza la charla acerca...', time: 'Ahora'},
    {id: 2, text: 'Nos tomamos un descanso de 15...', time: 'Hace 1h'},
    {id: 3, text: 'Bienvenidos a Datazón 2025...', time: 'Ayer'},
  ]

  const handleCreate = () => {
    setIsCreating(true)
    // populate simulated history when entering create mode
    setHistory(sampleHistory)
  }

  const handleSend = () => {
    if (!message.trim()) return
    const newItem = {id: Date.now(), text: message.trim(), time: 'Ahora'}
    setHistory((h) => [newItem, ...h])
    setMessage('')
  }

  return (
    <SectionLayout className="flex flex-col">
      {/* Responsive: let the panel grow on mobile while keeping desktop height. */}
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
          <div className="bg-white rounded-xl shadow-sm p-6 h-full flex flex-col">
            {!isCreating ? (
              <div className="max-w-2xl w-full text-center mx-auto flex flex-col justify-center h-full">
                <h3 className="text-xl font-semibold text-gray-900 pt-6">
                  Conectá con tu audiencia
                </h3>
                <p className="text-gray-600 p-6">
                  Enviar un mensaje general a tu audiencia te ayuda a mantener la conexión,
                  reforzar tu presencia y asegurarte de que todos reciban las novedades importantes
                  al mismo tiempo.
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
              <div className="w-full flex flex-col">
                <div className="">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Para</label>
                  <select
                    value={audience}
                    onChange={(e) => setAudience(e.target.value)}
                    className="block w-full border border-gray-200 rounded-md p-2 text-sm"
                  >
                    <option value="all">Todos los asistentes</option>
                    <option value="speakers">Asistentes acreditados</option>
                  </select>
                </div>

                <div className="flex-1">
                  <label className="block text-sm pt-6 font-medium text-gray-700 mb-2">
                    Mensaje
                  </label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full h-32 border border-gray-200 rounded-md p-3 text-sm resize-none"
                    placeholder="Escribir anuncio..."
                  >
                    {message}
                  </textarea>
                </div>

                <div className="mt-4 flex justify-center sm:justify-end">
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
    </SectionLayout>
  )
}

export default AnunciosContent
