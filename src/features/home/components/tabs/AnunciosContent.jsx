import {useState} from 'react'

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
    <div className="w-full">
      <div className="bg-white rounded-2xl shadow-lg p-6 h-[400px] flex flex-col">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch flex-1 min-h-0">
          {/* Left column - historial */}
          <div className="md:col-span-1 h-full min-h-0">
            <div className="bg-white rounded-xl shadow-sm p-4 text-left flex flex-col h-full">
              <h4 className="text-sm font-semibold text-gray-700 mb-2">Historial</h4>
              <div className="flex-1 overflow-y-auto pr-2 min-h-0">
                {history.length === 0 ? (
                  <div className="flex-1 flex items-center justify-center">
                    <div className="text-xs pt-20 p-10 text-gray-500 text-center">
                      Acá se mostrarán los anuncios enviados durante el evento.
                    </div>
                  </div>
                ) : (
                  <ul className="space-y-3 p-1">
                    {history.map((item) => (
                      <li key={item.id} className="flex items-start gap-3">
                        <div className="mt-1">
                          <svg
                            className="w-5 h-5 text-blue-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M8 10h.01M12 10h.01M16 10h.01M9 16h6"
                            ></path>
                          </svg>
                        </div>
                        <div className="flex-1">
                          <div className="text-xs text-gray-800 truncate">{item.text}</div>
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
                    reforzar tu presencia y asegurarte de que todos reciban las novedades
                    importantes al mismo tiempo.
                  </p>

                  <div className="flex justify-center pb-4">
                    <button
                      onClick={handleCreate}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2.5 rounded-md font-medium transition-colors duration-200"
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
                    <label className="block text-sm font-medium text-gray-700 mb-2">Mensaje</label>
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="w-full h-40 border border-gray-200 rounded-md p-3 text-sm resize-none"
                      placeholder="Escribir anuncio..."
                    >
                      {message}
                    </textarea>
                  </div>

                  <div className="mt-4 flex justify-end">
                    <button
                      onClick={handleSend}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2.5 rounded-md font-medium transition-colors duration-200"
                    >
                      Enviar anuncio
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AnunciosContent
