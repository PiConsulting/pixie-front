const NotifyPendingModal = ({onClose}) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 flex flex-col gap-4">
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
        <h3 className="text-lg font-semibold text-gray-900">Notificaciones enviadas</h3>
        <p className="text-sm text-gray-500 text-center">
          Se notificó a todos los participantes con stands pendientes por visitar.
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
    </div>
  </div>
)

export default NotifyPendingModal
