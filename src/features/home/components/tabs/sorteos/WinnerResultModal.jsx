import {useState} from 'react'
import {messagingClient} from '../../../../../lib/api'

const WinnerResultModal = ({winner, product, onClose}) => {
  const [notified, setNotified] = useState(false)
  const [notifying, setNotifying] = useState(false)

  const handleNotify = () => {
    setNotifying(true)
    messagingClient
      .post(
        '/api/send_individual_template?code=BLtfBxcMcffozm5Qf5O9olVOl7KLSyGOxmngGQxTQhhiAzFuO6ojvA==',
        {
          to: winner.winner_phone,
          template_name: 'connect_ganador_sorteo',
          language_code: 'es_AR',
          message: `!Wow! Regalazo para vos 🎁\nTe ganaste ${product?.name ?? ''}, gentileza de ${product?.brand ?? ''}\nℹ️ Retirá tu premio por la mesa de acreditaciones antes de irte 😎`,
          components: [
            {
              type: 'body',
              parameters: [
                {type: 'text', parameter_name: 'regalo', text: product?.name ?? ''},
                {type: 'text', parameter_name: 'marca', text: product?.brand ?? ''},
              ],
            },
          ],
        },
      )
      .then(() => setNotified(true))
      .catch((err) => {
        const data = err.response?.data
        if (data) {
          setNotified(true)
        } else {
          console.error('[Notificar ganador]', err)
        }
      })
      .finally(() => setNotifying(false))
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      style={{animation: 'fadeIn 0.2s ease-out'}}
    >
      <style>{`
        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes popIn { from { opacity: 0; transform: scale(0.65) } to { opacity: 1; transform: scale(1) } }
        @keyframes floatBounce { 0%, 100% { transform: translateY(0px) } 50% { transform: translateY(-14px) } }
      `}</style>
      <div
        className="relative flex flex-col items-center w-full max-w-sm"
        style={{animation: 'popIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)'}}
      >
        {/* imagen flotando por encima del card */}
        <img
          src="/celebracion.png"
          alt="Celebración"
          className="relative z-10 w-56 h-auto pointer-events-none"
          style={{marginBottom: '-4.5rem', animation: 'floatBounce 2.2s ease-in-out infinite'}}
        />
        <div className="bg-white rounded-2xl shadow-2xl w-full pt-20 pb-6 px-6 flex flex-col items-center gap-4 text-center">
          <h3 className="text-xl font-bold text-gray-900">¡Tenemos un ganador!</h3>
          <p className="text-2xl font-semibold text-blue-600">
            {winner.winner_name} {winner.winner_last_name}
          </p>
          <p className="text-sm text-gray-500">
            Premio: <span className="font-medium text-gray-700">{product?.name}</span>
          </p>

          {notified ? (
            <p className="text-sm text-green-600 font-medium">
              El ganador fue notificado sobre su premio.
            </p>
          ) : (
            <button
              onClick={handleNotify}
              disabled={notifying}
              className="w-full flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-sm font-medium text-white bg-green-500 hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {notifying ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Notificando...
                </>
              ) : (
                'Notificar al ganador'
              )}
            </button>
          )}

          <button
            onClick={onClose}
            className="w-full px-6 py-2.5 rounded-xl text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  )
}

export default WinnerResultModal
