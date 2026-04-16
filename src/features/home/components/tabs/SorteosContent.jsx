import {useEffect, useState} from 'react'
import SectionLayout from '../SectionLayout'
import {EVENT_ID} from '../../../../lib/api'
import apiClient from '../../../../lib/api'
import WinnerResultModal from './WinnerResultModal'
import DrawingOverlay from './DrawingOverlay'

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
        <WinnerResultModal
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
