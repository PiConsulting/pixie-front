import React from 'react'
import HistoryList from './HistoryList'

const HistorySection = ({history, showAllHistory, setShowAllHistory, historyLoading}) => (
  <div className="h-full flex flex-col">
    <h4 className="text-sm font-semibold text-gray-700 mb-2">Historial</h4>

    <div className="flex-1">
      {historyLoading ? (
        <p className="text-sm text-gray-400 pt-4">Cargando historial...</p>
      ) : history.length === 0 ? (
        <div className="flex items-center justify-center h-full">
          <div className="text-s pt-20 p-8 text-gray-500 text-center">
            Acá se mostrarán los anuncios enviados durante el evento.
          </div>
        </div>
      ) : (
        <>
          <div
            style={
              showAllHistory
                ? {
                    maxHeight: '100%',
                    overflowY: 'auto',
                  }
                : {}
            }
          >
            <HistoryList history={history} showAllHistory={showAllHistory} />
          </div>

          {history.length > 3 && (
            <div className="flex justify-center mt-2">
              {!showAllHistory ? (
                <button
                  className="flex items-center gap-1 text-yellow-500 hover:text-yellow-600 font-semibold text-sm"
                  onClick={() => setShowAllHistory(true)}
                >
                  Ver más
                  <svg
                    className="w-4 h-4 ml-1"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              ) : (
                <button
                  className="flex items-center gap-1 text-yellow-500 hover:text-yellow-600 font-semibold text-sm"
                  onClick={() => setShowAllHistory(false)}
                >
                  Ver menos
                  <svg
                    className="w-4 h-4 ml-1 transform rotate-180"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              )}
            </div>
          )}
        </>
      )}
    </div>
  </div>
)

export default HistorySection
