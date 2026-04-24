import {useEffect, useState} from 'react'
import SectionLayout from '../SectionLayout'
import HistorySection from './anuncios/HistorySection'
import AnunciosContentMainPanel from './anuncios/AnunciosContentMainPanel'
import apiClient, {EVENT_ID, messagingClient} from '../../../../lib/api'

// ─── Plantillas (hardcodeadas) ───────────────────────────────────────────────
const TEMPLATES = [
  {
    id: 1,
    name: 'Sala Principal',
    template_name: 'connect_sala_principal',
    language_code: 'en',
    body: '🕓 {{horario}} - Sala Principal\n📢 Asegurate tu lugar que se viene una charla de Alto Impacto 🎯',
  },
  {
    id: 2,
    name: 'Formulario + Sorteos',
    template_name: 'connect_formulario_sorteos',
    language_code: 'es_AR',
    body: '🕓 {{horario}} - Mensaje final: formulario + sorteos\n¡Gracias por ser parte de Connect Legendary Edition!\nAntes de irte, respondé este formulario para contarnos cómo viviste la experiencia y participar de los sorteos 🎁\n📝 {{link}}\nTu feedback es oro para nosotros',
  },
  {
    id: 3,
    name: 'Aviso Salas Paralelas',
    template_name: 'connect_aviso_salas_paralelas',
    language_code: 'es_AR',
    body: '📣 {{horario}} - Inicia el siguiente bloque en salas paralelas.\n¡Momento de elegir tu camino! 🔀 Elegí tu favorita y seguimos aprendiendo😎',
  },
  {
    id: 4,
    name: 'Escenario Principal',
    template_name: 'connect_escenario_principal',
    language_code: 'es_AR',
    body: 'Tomá tu lugar… se viene una jornada histórica ✨\n\nAndá acercándote al Escenario Principal porque en breve comenzamos con la apertura y las primeras charlas 🚀',
  },
  {
    id: 5,
    name: 'Break + Networking',
    template_name: 'connect_break_networking',
    language_code: 'es_AR',
    body: '☕ Tiempo de break + networking\n\nAprovechá este momento para tomar un cafecito y recorrer la sala de atracciones. No olvides pasar por todos los stands para completar tu colección de camisetas. ¡Una vez completa participas por grandes premios!! 👕⚽',
  },
  {
    id: 6,
    name: 'Breakout Sessions',
    template_name: 'connect_breakout_session',
    language_code: 'es_AR',
    body: '⚽ ¡Momento de elegir tu próxima jugada!\n\nArrancan las Breakout Sessions en el primer piso.\n\n¿Te ayudo a elegir a qué sala ir?',
  },
  {
    id: 7,
    name: 'Almuerzo + Networking',
    template_name: 'connect_almuerzo_networking',
    language_code: 'en',
    body: '🍽️ ¡Hora de almorzar!\n\nRecargá energías, conectá con otras personas y preparate para el bloque de la tarde. Hay estaciones de comida con gran variedad de opciones. Pedí lo que mas te guste.',
  },
  {
    id: 8,
    name: 'Recordatorio Circuito Sponsors',
    template_name: 'connect_recordatorio_circuito_sponsors',
    language_code: 'es_AR',
    body: '¿Ya completaste tu colección de 21 camisetas de argentina? 🇦🇷\n\nRecorre cada stand pidiendo que scaneen tu gafete y participa de sorteos y premios.\n\n¿Quieres que te cuente que otras atracciones y juegos tenemos en el evento?\n\n¿Te interesa saber sobre algún stand de Grupo CEDI?',
  },
  {
    id: 9,
    name: 'Breakout Sessions Tarde',
    template_name: 'connect_breakout_sessions',
    language_code: 'es_AR',
    body: '🔁 ¡Volvemos al juego!\n\nEn minutos arranca el bloque de la tarde de las Breakout Sessions con nuevas charlas y experiencias.\n\nBuscá tu sala y seguí sumando ideas 💡',
  },
  {
    id: 10,
    name: 'Regreso Escenario Principal',
    template_name: 'connect_regreso_escenario_principal',
    language_code: 'es_AR',
    body: '🎤 ¡Todos a la Sala Legendaria!\n\nSe viene el tramo final de Connect con grandes momentos:\n\n⚡ Dell + AMD\n🏛️ Suprema Corte\n🏆 Campeonato\n⭐⭐⭐ Entrevista a Pablo Aimar 😱\n\nSe viene un gran cierre ✨',
  },
  {
    id: 11,
    name: 'Sorteo Final',
    template_name: 'connect_sorteo_final',
    language_code: 'es_AR',
    body: '🎁 Llegó el momento de los sorteos finales.\n\nAntes de cerrar, completá este formulario y participá\n👉 SORTEO | CONNECT Legendary Edition\n\n{{link}}\n\nTu feedback nos ayuda a seguir creciendo ✨',
  },
  {
    id: 12,
    name: 'After',
    template_name: 'connect_after',
    language_code: 'es_AR',
    body: '🥂 ¡La jornada de charlas termina, pero la experiencia legendaria continua!\n\nQueremos invitarte a celebrar con nosotros los 35 años de innovación de Grupo CEDI en un After con 🍸 Tragos, 🍽️ comida y 🥂 un gran brindis\n\n¡Gracias por acompañarnos una vez más!',
  },
]

// ─── Mocks ─────────────────────────────────────────────────────────────────────

// Reemplazar con GET /message-recipients/{event_id} → { recipients: [{ id, label }] }
const MOCK_RECIPIENTS = [
  {id: 'Participant', label: 'Participantes'},
  {id: 'Staff', label: 'Staff'},
  {id: 'Vendor', label: 'Vendors'},
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
  {
    id: 3,
    text: 'Recuerda pasar por el stand de innovación para conocer las últimas novedades.',
    time: 'Hace 50 minutos',
  },
  {
    id: 4,
    text: '¡Ya comenzó la charla principal en el auditorio! No te la pierdas.',
    time: 'Hace 30 minutos',
  },
  {
    id: 5,
    text: 'Participa en la encuesta de satisfacción y gana premios.',
    time: 'Hace 10 minutos',
  },
  {
    id: 6,
    text: '¡Gracias por ser parte de este evento! Esperamos verte el próximo año.',
    time: 'Hace 2 minutos',
  },
  {
    id: 7,
    text: 'Recuerda que el evento cierra a las 10 PM. ¡Aprovecha hasta el final!',
    time: 'Hace 1 minuto',
  },
  {
    id: 8,
    text: '¡Última llamada para visitar el stand de networking! Conectá con otros asistentes.',
    time: 'Hace 30 segundos',
  },
  {
    id: 9,
    text: '¡Sorteo sorpresa en 5 minutos! Estén atentos a sus mensajes para participar.',
    time: 'Hace 10 segundos',
  },
  {
    id: 10,
    text: '¡Gracias por ser parte de este evento! Esperamos verte el próximo año.',
    time: 'Hace 5 segundos',
  },
  {id: 11, text: '¡Evento cerrado! Nos vemos en la próxima edición. 🎉', time: 'Ahora'},
]

const AnunciosContent = () => {
  const [isCreating, setIsCreating] = useState(false)
  const [message, setMessage] = useState('')
  const [history, setHistory] = useState([])
  const [historyLoading, setHistoryLoading] = useState(true)
  const [sent, setSent] = useState(false)
  const [sending, setSending] = useState(false)
  const [showAllHistory, setShowAllHistory] = useState(false)

  // ── Historial ───────────────────────────────────────────────────────────────
  useEffect(() => {
    setHistoryLoading(true)
    apiClient
      .get('/bulk_message_history')
      .then((res) => {
        setHistory(res.data.data ?? [])
      })
      .catch((err) => console.error('[Historial]', err))
      .finally(() => setHistoryLoading(false))
  }, [])

  // ── Plantillas (hardcodeadas) ─────────────────────────────────────────────
  const [selectedTemplateId, setSelectedTemplateId] = useState(null)
  const [templateVars, setTemplateVars] = useState({}) // { varName: value }

  // ── Destinatarios ───────────────────────────────────────────────────────────
  const [recipients, setRecipients] = useState([])
  const [recipientsLoading, setRecipientsLoading] = useState(false)
  const [selectedRecipientId, setSelectedRecipientId] = useState(null)

  useEffect(() => {
    setRecipients(MOCK_RECIPIENTS)
    setSelectedRecipientId(MOCK_RECIPIENTS[0].id)
    setRecipientsLoading(false)
  }, [])

  const handleSelectTemplate = (tpl) => {
    setSelectedTemplateId(tpl.id)
    setMessage(tpl.body)
    const matches = [...tpl.body.matchAll(/\{\{(\w+)\}\}/g)]
    const vars = {}
    matches.forEach(([, name]) => {
      vars[name] = ''
    })
    setTemplateVars(vars)
  }

  // Mensaje con variables sustituidas para el preview
  const resolvedMessage = Object.entries(templateVars).reduce(
    (msg, [name, val]) => msg.replaceAll(`{{${name}}}`, val || `{{${name}}}`),
    message,
  )

  const allVarsFilled = Object.values(templateVars).every((v) => v.trim() !== '')
  const canSend = !!message.trim() && !!selectedTemplateId && !!selectedRecipientId && allVarsFilled

  const handleSend = () => {
    if (!canSend) return

    const selectedTemplate = TEMPLATES.find((t) => t.id === selectedTemplateId)
    setSending(true)
    messagingClient
      .post(
        '/api/send_bulk_template?code=BLtfBxcMcffozm5Qf5O9olVOl7KLSyGOxmngGQxTQhhiAzFuO6ojvA==',
        {
          template_name: selectedTemplate?.template_name,
          language_code: selectedTemplate?.language_code,
          participant_type: selectedRecipientId,
          message: resolvedMessage,
          components: Object.entries(templateVars).map(([name, text]) => ({name, text})),
        },
      )
      .then(() => {
        const newItem = {id: Date.now(), text: resolvedMessage, time: 'Ahora'}
        setHistory((h) => [newItem, ...h])
        setMessage('')
        setSelectedTemplateId(null)
        setTemplateVars({})
        setSent(true)
      })
      .catch((err) => console.error('[Mensaje masivo]', err))
      .finally(() => setSending(false))
  }

  const handleCancel = () => {
    setIsCreating(false)
    setMessage('')
    setSelectedTemplateId(null)
    setTemplateVars({})
  }

  return (
    <SectionLayout className="flex flex-col">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch flex-1 min-h-0">
        {/* Left column - historial */}
        <div className="md:col-span-1 h-full min-h-0">
          <div className="bg-white rounded-xl shadow-sm p-4 text-left flex flex-col h-full">
            <HistorySection
              history={history}
              showAllHistory={showAllHistory}
              setShowAllHistory={setShowAllHistory}
              historyLoading={historyLoading}
            />
          </div>
        </div>

        {/* Right column - main panel */}
        <div className="md:col-span-2 h-full min-h-0">
          <AnunciosContentMainPanel
            isCreating={isCreating}
            TEMPLATES={TEMPLATES}
            selectedTemplateId={selectedTemplateId}
            handleSelectTemplate={handleSelectTemplate}
            templateVars={templateVars}
            setTemplateVars={setTemplateVars}
            message={message}
            resolvedMessage={resolvedMessage}
            recipients={recipients}
            recipientsLoading={recipientsLoading}
            selectedRecipientId={selectedRecipientId}
            setSelectedRecipientId={setSelectedRecipientId}
            handleCancel={handleCancel}
            handleSend={handleSend}
            canSend={canSend}
            sending={sending}
          />
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
