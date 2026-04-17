import {useEffect, useState} from 'react'
import SectionLayout from '../SectionLayout'
import MegaphoneIcon from './MegaphoneIcon'
import apiClient, {EVENT_ID} from '../../../../lib/api' // descomentar al activar envío real

// ─── Mocks ─────────────────────────────────────────────────────────────────────
// Reemplazar con GET /templates → { templates: [{ id, name, body }] }
const MOCK_TEMPLATES = [
  {
    id: 1,
    name: 'Bienvenida',
    body: '¡Te damos la bienvenida al evento! Esperamos que disfrutes cada momento.',
  },
  {
    id: 2,
    name: 'Recordatorio de stands',
    body: 'Hay stands que todavía no visitaste. ¡Te esperamos para que no te pierdas nada!',
  },
  {
    id: 3,
    name: 'Cierre del evento',
    body: 'El evento está llegando a su fin. ¡Gracias por tu presencia y participación!',
  },
]

// Reemplazar con GET /message-recipients/{event_id} → { recipients: [{ id, label }] }
const MOCK_RECIPIENTS = [
  {id: 'all', label: 'Todos los participantes'},
  {id: 'pending-stands', label: 'Participantes con stands pendientes'},
  {id: 'visited-all', label: 'Participantes que visitaron todos los stands'},
]

// Reemplazar con GET /announcements/{event_id} → { announcements: [{ id, text, time }] }
const MOCK_HISTORY = [
  {
    id: 1,
    text: '¡Te damos la bienvenida al evento! Esperamos que disfrutes cada momento.',
    time: 'Hace 2 horas',
  },
  {
    id: 2,
    text: 'Hay stands que todavía no visitaste. ¡Te esperamos para que no te pierdas nada!',
    time: 'Hace 1 hora',
  },
]

const HistoryItem = ({item}) => {
  const [expanded, setExpanded] = useState(false)
  return (
    <li className="border border-gray-100 rounded-lg overflow-hidden">
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="w-full flex items-center gap-3 px-3 py-2.5 text-left hover:bg-gray-50 transition-colors"
      >
        <MegaphoneIcon className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5 self-start" />
        <div className="flex-1 min-w-0">
          <p className={`text-sm text-gray-800 break-words ${expanded ? '' : 'truncate'}`}>
            {item.text}
          </p>
          <p className="text-[11px] text-gray-400 mt-0.5">{item.time}</p>
        </div>
        <svg
          className={`w-4 h-4 text-gray-400 flex-shrink-0 self-start mt-1 transition-transform ${expanded ? 'rotate-180' : ''}`}
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
            clipRule="evenodd"
          />
        </svg>
      </button>
    </li>
  )
}

const AnunciosContent = () => {
  const [isCreating, setIsCreating] = useState(false)
  const [message, setMessage] = useState('')
  const [history, setHistory] = useState([])
  const [historyLoading, setHistoryLoading] = useState(true)
  const [sent, setSent] = useState(false)

  // ── Historial ───────────────────────────────────────────────────────────────
  useEffect(() => {
    setHistoryLoading(true)
    // ─── Reemplazar con llamada real ──────────────────────────────────────────
    // apiClient.get(`/announcements/${EVENT_ID}`).then((res) => {
    //   setHistory(res.data.announcements)
    // }).catch((err) => console.error('[Historial]', err))
    //   .finally(() => setHistoryLoading(false))
    setTimeout(() => {
      setHistory(MOCK_HISTORY)
      setHistoryLoading(false)
    }, 400)
    // ─────────────────────────────────────────────────────────────────────────
  }, [])

  // ── Plantillas ──────────────────────────────────────────────────────────────
  const [templates, setTemplates] = useState([])
  const [templatesLoading, setTemplatesLoading] = useState(false)
  const [selectedTemplateId, setSelectedTemplateId] = useState(null)

  // ── Destinatarios ───────────────────────────────────────────────────────────
  const [recipients, setRecipients] = useState([])
  const [recipientsLoading, setRecipientsLoading] = useState(false)
  const [selectedRecipientId, setSelectedRecipientId] = useState(null)

  useEffect(() => {
    if (!isCreating) return

    setTemplatesLoading(true)
    setRecipientsLoading(true)

    // ─── Reemplazar con llamada real ──────────────────────────────────────────
    // apiClient.get('/templates').then((res) => {
    //   setTemplates(res.data.templates)
    // }).catch((err) => console.error('[Templates]', err))
    //   .finally(() => setTemplatesLoading(false))
    setTimeout(() => {
      setTemplates(MOCK_TEMPLATES)
      setTemplatesLoading(false)
    }, 400)
    // ─────────────────────────────────────────────────────────────────────────

    // ─── Reemplazar con llamada real ──────────────────────────────────────────
    // apiClient.get(`/message-recipients/${EVENT_ID}`).then((res) => {
    //   const list = res.data.recipients
    //   setRecipients(list)
    //   setSelectedRecipientId(list[0]?.id ?? null)
    // }).catch((err) => console.error('[Recipients]', err))
    //   .finally(() => setRecipientsLoading(false))
    setTimeout(() => {
      setRecipients(MOCK_RECIPIENTS)
      setSelectedRecipientId(MOCK_RECIPIENTS[0].id)
      setRecipientsLoading(false)
    }, 400)
    // ─────────────────────────────────────────────────────────────────────────
  }, [isCreating])

  const handleSelectTemplate = (tpl) => {
    setSelectedTemplateId(tpl.id)
    setMessage(tpl.body)
  }

  const canSend = !!message.trim() && !!selectedTemplateId && !!selectedRecipientId

  const handleSend = () => {
    if (!canSend) return

    // ─── Reemplazar con llamada real para enviar anuncio masivo ──────────────────────────────────────────
    // apiClient.post(`/message/${EVENT_ID}`, {
    //   message: message.trim(),
    //   template_id: selectedTemplateId,
    //   recipient_group: selectedRecipientId,
    // }).then(() => {
    //   const newItem = {id: Date.now(), text: message.trim(), time: 'Ahora'}
    //   setHistory((h) => [newItem, ...h])
    //   setMessage('')
    //   setSelectedTemplateId(null)
    //   setSent(true)
    // }).catch((err) => console.error('[Mensaje masivo]', err))
    // return
    // ─────────────────────────────────────────────────────────────────────────
    const newItem = {id: Date.now(), text: message.trim(), time: 'Ahora'}
    setHistory((h) => [newItem, ...h])
    setMessage('')
    setSelectedTemplateId(null)
    setSent(true)
  }

  const handleCancel = () => {
    setIsCreating(false)
    setMessage('')
    setSelectedTemplateId(null)
  }

  return (
    <SectionLayout className="flex flex-col">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch flex-1 min-h-0">
        {/* Left column - historial */}
        <div className="md:col-span-1 h-full min-h-0">
          <div className="bg-white rounded-xl shadow-sm p-4 text-left flex flex-col h-full">
            <h4 className="text-sm font-semibold text-gray-700 mb-2">Historial</h4>
            <div className="flex-1 overflow-visible md:overflow-y-auto pr-2 min-h-0">
              {historyLoading ? (
                <p className="text-sm text-gray-400 pt-4">Cargando historial...</p>
              ) : history.length === 0 ? (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-s pt-20 p-8 text-gray-500 text-center">
                    Acá se mostrarán los anuncios enviados durante el evento.
                  </div>
                </div>
              ) : (
                <ul className="space-y-2 p-1">
                  {history.map((item) => (
                    <HistoryItem key={item.id} item={item} />
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
                    onClick={() => setIsCreating(true)}
                    className="m-0 w-full sm:w-auto bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-lg font-medium transition-colors duration-200"
                  >
                    Crear anuncio
                  </button>
                </div>
              </div>
            ) : (
              <div className="w-full p-5 flex flex-col gap-6 overflow-y-auto">
                {/* Elegir plantilla */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Plantilla <span className="text-red-500">*</span>
                  </label>
                  {templatesLoading ? (
                    <p className="text-sm text-gray-400">Cargando plantillas...</p>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {templates.map((tpl) => (
                        <button
                          key={tpl.id}
                          type="button"
                          onClick={() => handleSelectTemplate(tpl)}
                          className={`text-left px-4 py-3 rounded-lg border text-sm transition-colors ${
                            selectedTemplateId === tpl.id
                              ? 'border-blue-500 bg-blue-50 text-blue-800'
                              : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-700'
                          }`}
                        >
                          <p className="font-medium">{tpl.name}</p>
                          <p className="text-xs text-gray-400 mt-0.5 line-clamp-2">{tpl.body}</p>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Mensaje personalizado */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mensaje personalizado
                  </label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={4}
                    placeholder="Seleccioná una plantilla o escribí tu mensaje..."
                    className="w-full border border-gray-200 rounded-md p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
                  />
                </div>

                {/* Destinatarios */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Enviar a</label>
                  {recipientsLoading ? (
                    <p className="text-sm text-gray-400">Cargando destinatarios...</p>
                  ) : (
                    <div className="flex flex-col gap-2">
                      {recipients.map((r) => (
                        <label key={r.id} className="flex items-center gap-3 cursor-pointer group">
                          <input
                            type="radio"
                            name="recipient"
                            value={r.id}
                            checked={selectedRecipientId === r.id}
                            onChange={() => setSelectedRecipientId(r.id)}
                            className="accent-blue-500 w-4 h-4"
                          />
                          <span className="text-sm text-gray-700 group-hover:text-gray-900 transition-colors">
                            {r.label}
                          </span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>

                {/* Acciones */}
                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="px-4 py-2 rounded-md text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    onClick={handleSend}
                    disabled={!canSend}
                    className="px-6 py-2 rounded-md text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
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
              El mensaje fue enviado exitosamente.
            </p>
            <button
              onClick={() => {
                setSent(false)
                setIsCreating(false)
              }}
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
