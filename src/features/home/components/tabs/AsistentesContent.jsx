import {createPortal} from 'react-dom'
import {useEffect, useRef, useState} from 'react'
import SectionLayout from '../SectionLayout'
import apiClient, {EVENT_ID} from '../../../../lib/api'

// ─── Modal de Stands ─────────────────────────────────────────────────────────
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

// ─── Dropdown Stands por fila ─────────────────────────────────────────────────
const StandsDropdown = ({onSelect}) => {
  const [open, setOpen] = useState(false)
  const [menuStyle, setMenuStyle] = useState({})
  const btnRef = useRef(null)
  const menuRef = useRef(null)

  useEffect(() => {
    const handleClick = (e) => {
      const insideBtn = btnRef.current?.contains(e.target)
      const insideMenu = menuRef.current?.contains(e.target)
      if (!insideBtn && !insideMenu) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const handleOpen = () => {
    if (!open && btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect()
      setMenuStyle({
        position: 'fixed',
        top: rect.bottom + 4,
        left: rect.left,
        width: 144,
        zIndex: 9999,
      })
    }
    setOpen((v) => !v)
  }

  return (
    <div className="relative">
      <button
        ref={btnRef}
        onClick={handleOpen}
        className="px-3 py-1.5 rounded-md text-xs font-medium text-green-700 border border-green-200 hover:bg-green-50 transition-colors whitespace-nowrap flex items-center gap-1"
      >
        Stands
        <svg className="w-3 h-3" viewBox="0 0 20 20" fill="currentColor">
          <path
            fillRule="evenodd"
            d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
            clipRule="evenodd"
          />
        </svg>
      </button>
      {open &&
        createPortal(
          <div
            ref={menuRef}
            style={menuStyle}
            className="bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden"
          >
            <button
              onClick={() => {
                onSelect('visited')
                setOpen(false)
              }}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Visitados
            </button>
            <button
              onClick={() => {
                onSelect('not-visited')
                setOpen(false)
              }}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              No visitados
            </button>
          </div>,
          document.body,
        )}
    </div>
  )
}

// ─── Modal de mensaje individual ─────────────────────────────────────────────
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

// ─── Contenido principal ──────────────────────────────────────────────────────
const AsistentesContent = () => {
  const [participants, setParticipants] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedParticipant, setSelectedParticipant] = useState(null)
  const [standsTarget, setStandsTarget] = useState(null) // { participant, type }
  const [search, setSearch] = useState('')

  useEffect(() => {
    setLoading(true)
    setError(null)
    apiClient
      .get(`/participant/${EVENT_ID}`)
      .then((res) => {
        setParticipants(res.data.participants)
      })
      .catch((err) => setError(err.message || 'Error al cargar participantes'))
      .finally(() => setLoading(false))
  }, [])

  return (
    <SectionLayout className="flex flex-col overflow-visible md:overflow-auto">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Participantes — Connect</h2>

      {loading && <p className="text-gray-500 text-sm">Cargando participantes...</p>}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">
          {error}
        </div>
      )}

      {!loading && !error && participants.length === 0 && (
        <p className="text-gray-500 text-sm">No hay participantes registrados.</p>
      )}

      {!loading && !error && participants.length > 0 && (
        <div className="flex flex-col gap-3">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nombre, apellido o email..."
            className="w-full max-w-sm border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
          />
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-left">
              <thead>
                <tr className="border-b border-gray-200 text-gray-600 font-semibold">
                  <th className="py-2 pr-6">Nombre</th>
                  <th className="py-2 pr-6">Apellido</th>
                  <th className="py-2 pr-6">Email</th>
                  <th className="py-2 pr-6">Teléfono</th>
                  <th className="py-2"></th>
                </tr>
              </thead>
              <tbody>
                {participants
                  .filter((p) => {
                    const q = search.toLowerCase()
                    return (
                      !q ||
                      p.name?.toLowerCase().includes(q) ||
                      p.last_name?.toLowerCase().includes(q) ||
                      p.email?.toLowerCase().includes(q)
                    )
                  })
                  .map((p, idx) => (
                    <tr key={p.id ?? idx} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-2 pr-6 text-gray-900">{p.name ?? '—'}</td>
                      <td className="py-2 pr-6 text-gray-900">{p.last_name ?? '—'}</td>
                      <td className="py-2 pr-6 text-gray-600">{p.email ?? '—'}</td>
                      <td className="py-2 pr-6 text-gray-600">{p.phone ?? '—'}</td>
                      <td className="py-2">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setSelectedParticipant(p)}
                            className="px-3 py-1.5 rounded-md text-xs font-medium text-blue-600 border border-blue-200 hover:bg-blue-50 transition-colors whitespace-nowrap"
                          >
                            Enviar mensaje
                          </button>
                          <StandsDropdown
                            onSelect={(type) => setStandsTarget({participant: p, type})}
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {selectedParticipant && (
        <MensajeModal
          participant={selectedParticipant}
          onClose={() => setSelectedParticipant(null)}
        />
      )}

      {standsTarget && (
        <StandsModal
          participant={standsTarget.participant}
          type={standsTarget.type}
          onClose={() => setStandsTarget(null)}
        />
      )}
    </SectionLayout>
  )
}

export default AsistentesContent
