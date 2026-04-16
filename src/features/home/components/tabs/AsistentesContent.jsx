import {useEffect, useState} from 'react'
import SectionLayout from '../SectionLayout'
import apiClient, {EVENT_ID} from '../../../../lib/api'
import StandsModal from './StandsModal'
import StandsDropdown from './StandsDropdown'
import MensajeModal from './MensajeModal'
import NotifyPendingModal from './NotifyPendingModal'

// ─── Contenido principal ──────────────────────────────────────────────────────
const AsistentesContent = () => {
  const [participants, setParticipants] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedParticipant, setSelectedParticipant] = useState(null)
  const [standsTarget, setStandsTarget] = useState(null) // { participant, type }
  const [search, setSearch] = useState('')
  const [notifyPendingOpen, setNotifyPendingOpen] = useState(false)
  const [notifyLoading, setNotifyLoading] = useState(false)

  const handleNotifyPending = () => {
    setNotifyLoading(true)
    setTimeout(() => {
      setNotifyLoading(false)
      setNotifyPendingOpen(true)
    }, 1000)
    // apiClient
    //   .post(`URL Mensaje masivo para stands pendientes`)
    //   .then(() => setNotifyPendingOpen(true))
    //   .catch((err) => console.error('[Notificación masiva]', err))
    //   .finally(() => setNotifyLoading(false))
  }

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
          <div className="flex items-center justify-between gap-3">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por nombre, apellido o email..."
              className="w-full max-w-sm border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
            />
            <button
              onClick={handleNotifyPending}
              disabled={notifyLoading}
              className="flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium text-dark bg-primary-400 hover:bg-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 whitespace-nowrap"
            >
              {notifyLoading ? 'Enviando...' : 'Notificar pendientes'}
            </button>
          </div>
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

      {notifyPendingOpen && <NotifyPendingModal onClose={() => setNotifyPendingOpen(false)} />}
    </SectionLayout>
  )
}

export default AsistentesContent
