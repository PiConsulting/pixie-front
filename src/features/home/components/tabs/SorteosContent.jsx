import {useEffect, useState} from 'react'
import SectionLayout from '../SectionLayout'
import {EVENT_ID} from '../../../../lib/api'
import apiClient from '../../../../lib/api'

// ─── Modal ganador ─────────────────────────────────────────────────────────────
const WinnerModal = ({winner, productName, onClose}) => {
  const [notified, setNotified] = useState(false)
  const [notifying, setNotifying] = useState(false)

  const handleNotify = () => {
    setNotifying(true)

    // ─── Para activar la notificación real, descomentar el bloque siguiente ───
    // apiClient
    //   .post(`/notify/winner`, {
    //     winner_id: winner.winner_id,
    //     product_id: winner.product_id,
    //   })
    //   .then(() => setNotified(true))
    //   .catch((err) => console.error('[Notificar ganador]', err))
    //   .finally(() => setNotifying(false))
    // return
    // ─────────────────────────────────────────────────────────────────────────

    console.log('[Notificar ganador simulado]', winner)
    setTimeout(() => {
      setNotified(true)
      setNotifying(false)
    }, 800)
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
            Premio: <span className="font-medium text-gray-700">{productName}</span>
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

// ─── Overlay animado mientras se sortea ────────────────────────────────────────
const WHEEL_COLORS = [
  '#ef4444',
  '#f97316',
  '#eab308',
  '#22c55e',
  '#3b82f6',
  '#8b5cf6',
  '#ec4899',
  '#14b8a6',
]
const SEGMENTS = 8

const DrawingOverlay = () => (
  <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/60">
    <style>{`
      @keyframes wheelSpin {
        from { transform: rotate(0deg) }
        to   { transform: rotate(360deg) }
      }
      @keyframes pointerWiggle {
        0%, 100% { transform: translateX(-50%) rotate(-20deg) }
        50%       { transform: translateX(-50%) rotate(20deg) }
      }
      @keyframes dotPulse {
        0%, 80%, 100% { opacity: 0.3; transform: scale(0.75) }
        40%           { opacity: 1;   transform: scale(1.3)  }
      }
    `}</style>

    {/* Ruleta */}
    <div className="relative" style={{width: 220, height: 220}}>
      {/* Puntero arriba */}
      <div
        className="absolute top-0 left-1/2 z-10"
        style={{
          width: 0,
          height: 0,
          borderLeft: '14px solid transparent',
          borderRight: '14px solid transparent',
          borderTop: '28px solid #fbbf24',
          filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))',
          animation: 'pointerWiggle 0.25s ease-in-out infinite',
          transformOrigin: 'top center',
        }}
      />

      {/* Rueda que gira */}
      <div
        className="rounded-full overflow-hidden border-4 border-white shadow-2xl"
        style={{
          width: 220,
          height: 220,
          background: `conic-gradient(${WHEEL_COLORS.map(
            (c, i) => `${c} ${(i / SEGMENTS) * 360}deg ${((i + 1) / SEGMENTS) * 360}deg`,
          ).join(', ')})`,
          animation: 'wheelSpin 0.45s linear infinite',
        }}
      >
        {/* Líneas divisorias */}
        {Array.from({length: SEGMENTS}).map((_, i) => (
          <div
            key={i}
            className="absolute top-1/2 left-1/2 origin-left"
            style={{
              width: '50%',
              height: 2,
              background: 'rgba(255,255,255,0.4)',
              transform: `rotate(${(i / SEGMENTS) * 360}deg)`,
            }}
          />
        ))}
      </div>

      {/* Centro */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white shadow-lg"
        style={{width: 40, height: 40}}
      />
    </div>

    {/* Texto */}
    <p className="mt-7 text-white text-2xl font-bold tracking-wide flex items-center gap-0.5">
      Sorteando
      <span style={{animation: 'dotPulse 1s ease-in-out infinite', animationDelay: '0s'}}>.</span>
      <span style={{animation: 'dotPulse 1s ease-in-out infinite', animationDelay: '0.18s'}}>
        .
      </span>
      <span style={{animation: 'dotPulse 1s ease-in-out infinite', animationDelay: '0.36s'}}>
        .
      </span>
    </p>
  </div>
)

// ─── Pantalla principal de Sorteos ────────────────────────────────────────────
const SorteosContent = () => {
  // ── Productos ──────────────────────────────────────────────────────────────
  const [products, setProducts] = useState([])
  const [productsLoading, setProductsLoading] = useState(true)
  const [selectedProductId, setSelectedProductId] = useState(null)

  useEffect(() => {
    apiClient
      .get(`/product`)
      .then((res) => {
        const list = (res.data?.products ?? []).filter((p) => p.winner_id == null)
        setProducts(list)
        setSelectedProductId(list[0]?.id ?? null)
      })
      .catch((err) => console.error('[Productos]', err))
      .finally(() => setProductsLoading(false))
  }, [])

  // ── Sorteo ─────────────────────────────────────────────────────────────────
  const [drawing, setDrawing] = useState(false)
  const [winner, setWinner] = useState(null)
  const [showWinnerModal, setShowWinnerModal] = useState(false)

  const selectedProduct = products.find((p) => p.id === selectedProductId)

  const handleDraw = () => {
    if (!selectedProductId) return
    setDrawing(true)

    apiClient
      .post(`/lottery/product/${selectedProductId}/draw`)
      .then((res) => {
        setWinner(res.data?.winner)
        setShowWinnerModal(true)
      })
      .catch((err) => console.error('[Sorteo]', err))
      .finally(() => setDrawing(false))
  }

  return (
    <>
      <SectionLayout className="flex flex-col items-center">
        <div className="w-full max-w-md flex flex-col gap-6">
          <h2 className="text-2xl font-bold text-gray-900 text-center">Sorteos — Connect</h2>

          {productsLoading ? (
            <p className="text-sm text-gray-400 text-center">Cargando productos...</p>
          ) : (
            <div className="bg-white rounded-2xl shadow-md overflow-hidden flex flex-col">
              {/* Imagen del producto */}
              {selectedProduct?.photo_url && (
                <div className="w-full h-52 overflow-hidden">
                  <img
                    src={selectedProduct.photo_url}
                    alt={selectedProduct.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <div className="p-6 flex flex-col gap-5">
                {/* Selector */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Producto a sortear
                  </label>
                  <select
                    value={selectedProductId ?? ''}
                    onChange={(e) => setSelectedProductId(e.target.value)}
                    className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 bg-gray-50"
                  >
                    {products.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Botón sortear */}
                <button
                  onClick={handleDraw}
                  disabled={drawing || !selectedProductId}
                  className="w-full flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-colors text-base shadow-sm"
                >
                  {drawing ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Sorteando...
                    </>
                  ) : (
                    'Sortear'
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </SectionLayout>

      {drawing && <DrawingOverlay />}

      {showWinnerModal && winner && (
        <WinnerModal
          winner={winner}
          productName={selectedProduct?.name ?? ''}
          onClose={() => {
            setShowWinnerModal(false)
            setWinner(null)
          }}
        />
      )}
    </>
  )
}

export default SorteosContent
