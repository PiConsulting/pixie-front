import {useEffect, useState} from 'react'
import SectionLayout from '../SectionLayout'
import apiClient, {EVENT_ID} from '../../../../lib/api'

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
                        <button
                          onClick={() => setSelectedParticipant(p)}
                          className="px-3 py-1.5 rounded-md text-xs font-medium text-blue-600 border border-blue-200 hover:bg-blue-50 transition-colors whitespace-nowrap"
                        >
                          Enviar mensaje
                        </button>
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
    </SectionLayout>
  )
}

export default AsistentesContent
