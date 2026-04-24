const NotifyPendingModal = ({onClose, result}) => {
  const hasResult = result != null
  const allOk = hasResult && result.error_count === 0

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 flex flex-col gap-4">
        <div className="flex flex-col items-center gap-3 py-2">
          <div
            className={`w-12 h-12 rounded-full flex items-center justify-center ${
              allOk ? 'bg-green-100' : 'bg-yellow-100'
            }`}
          >
            {allOk ? (
              <svg
                className="w-6 h-6 text-green-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg
                className="w-6 h-6 text-yellow-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
                />
              </svg>
            )}
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Notificaciones procesadas</h3>
          {hasResult && (
            <div className="flex gap-4 mt-1">
              <span className="flex items-center gap-1.5 text-sm font-medium text-green-700">
                <span className="w-2 h-2 rounded-full bg-green-500 inline-block" />
                {result.success_count} enviados
              </span>
              <span className="flex items-center gap-1.5 text-sm font-medium text-red-600">
                <span className="w-2 h-2 rounded-full bg-red-500 inline-block" />
                {result.error_count} con error
              </span>
            </div>
          )}
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
}

export default NotifyPendingModal
