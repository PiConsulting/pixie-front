import {useEffect, useState} from 'react'
import apiClient from '../../../../../lib/api'

const StandsModal = ({participant, type, onClose}) => {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const isVisited = type === 'visited'
  const endpoint = isVisited
    ? `/stand/participant/${participant.id_connect}/stands-visited`
    : `/stand/participant/${participant.id_connect}/stands-not-visited`

  useEffect(() => {
    setLoading(true)
    setError(null)
    apiClient
      .get(endpoint)
      .then((res) => {
        const list = isVisited
          ? (res.data?.registrations ?? [])
          : (res.data?.stands_not_visited ?? [])
        setItems(list)
      })
      .catch((err) => setError(err.message || 'Error al cargar stands'))
      .finally(() => setLoading(false))
    console.log('[Stands]', {endpoint, isVisited, items})
  }, [endpoint, isVisited])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">
            Stands {isVisited ? 'visitados' : 'no visitados'}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700 text-xl font-bold leading-none"
          >
            x
          </button>
        </div>
        <p className="text-sm text-gray-500 -mt-2">
          {participant.name} {participant.last_name}
        </p>

        {loading && <p className="text-sm text-gray-500">Cargando...</p>}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">
            {error}
          </div>
        )}
        {!loading && !error && items.length === 0 && (
          <p className="text-sm text-gray-500">
            {isVisited ? 'No visitó ningún stand.' : 'Visitó todos los stands.'}
          </p>
        )}
        {!loading && !error && items.length > 0 && (
          <ul className="divide-y divide-gray-100 max-h-72 overflow-y-auto">
            {items.map((item, idx) => (
              <li
                key={item.id ?? idx}
                className="py-2 flex items-center gap-2 text-sm text-gray-800"
              >
                <span
                  className={`w-2 h-2 rounded-full flex-shrink-0 ${isVisited ? 'bg-green-400' : 'bg-gray-300'}`}
                />
                {item.name}
                {isVisited && item.visited_at && (
                  <span className="ml-auto text-xs text-gray-400">
                    {new Date(item.visited_at).toLocaleTimeString('es-AR', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                )}
              </li>
            ))}
          </ul>
        )}

        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-lg text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  )
}

export default StandsModal
