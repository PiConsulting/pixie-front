import {useEffect, useState} from 'react'
import SectionLayout from '../SectionLayout'
import apiClient from '../../../../lib/api'
import WinnerResultModal from './sorteos/WinnerResultModal'
import WinnersListModal from './sorteos/WinnersListModal'
import DrawingOverlay from './sorteos/DrawingOverlay'
import SorteosTabNavigation from './sorteos/SorteosTabNavigation'
import MassiveDrawMock from './sorteos/MassiveDrawMock'

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
        const list = res.data?.products ?? []
        setProducts(list)
        setSelectedProductId(list[0]?.id ?? null)
      })
      .catch((err) => console.error('[Productos]', err))
      .finally(() => setProductsLoading(false))
  }, [])

  // ── Participantes (para la ruleta) ────────────────────────────────────────
  const MOCK_PARTICIPANTS = [
    {id:'m1',name:'Lucía',last_name:'González'},{id:'m2',name:'Mateo',last_name:'Rodríguez'},
    {id:'m3',name:'Valentina',last_name:'López'},{id:'m4',name:'Sebastián',last_name:'Martínez'},
    {id:'m5',name:'Camila',last_name:'García'},{id:'m6',name:'Tomás',last_name:'Pérez'},
    {id:'m7',name:'Martina',last_name:'Sánchez'},{id:'m8',name:'Nicolás',last_name:'Romero'},
    {id:'m9',name:'Sofía',last_name:'Torres'},{id:'m10',name:'Agustín',last_name:'Flores'},
    {id:'m11',name:'Isabella',last_name:'Díaz'},{id:'m12',name:'Joaquín',last_name:'Reyes'},
    {id:'m13',name:'Emma',last_name:'Morales'},{id:'m14',name:'Lucas',last_name:'Jiménez'},
    {id:'m15',name:'Florencia',last_name:'Álvarez'},{id:'m16',name:'Diego',last_name:'Ruiz'},
    {id:'m17',name:'Renata',last_name:'Herrera'},{id:'m18',name:'Facundo',last_name:'Medina'},
    {id:'m19',name:'Milagros',last_name:'Castro'},{id:'m20',name:'Ignacio',last_name:'Vega'},
  ]
  const [participants, setParticipants] = useState(MOCK_PARTICIPANTS)

  // Participantes filtro: 'todos' | 'stands' | 'forms'
  const [participantFilter, setParticipantFilter] = useState('todos')
  const [drawCount, setDrawCount] = useState(0)

  const normalizeExcelParticipant = (p) => {
    const parts = (p.nombre_completo ?? '').trim().split(' ')
    return {
      ...p,
      name:      parts[0] ?? '',
      last_name: parts.slice(1).join(' ') || '',
      phone:     p.whatsapp ?? '',
      email:     p.correo ?? '',
    }
  }

  useEffect(() => {
    const url =
      participantFilter === 'stands'
        ? `/participant/stands/visited-all`
        : participantFilter === 'forms'
        ? `/register_connect/excel-participants`
        : `/participant/no-winners`
    apiClient
      .get(url)
      .then((res) => {
        const raw = res.data?.participants ?? []
        const normalized = participantFilter === 'forms' ? raw.map(normalizeExcelParticipant) : raw
        setParticipants([...MOCK_PARTICIPANTS, ...normalized])
      })
      .catch((err) => console.error('[Participantes]', err))
  }, [participantFilter, drawCount])

  // ── Sorteo ─────────────────────────────────────────────────────────────────
  const [drawing, setDrawing] = useState(false)
  const [pendingWinner, setPendingWinner] = useState(null)
  const [winner, setWinner] = useState(null)
  const [winnerProduct, setWinnerProduct] = useState(null)
  const [showWinnerModal, setShowWinnerModal] = useState(false)

  const selectedProduct = products.find((p) => p.id === selectedProductId)

  const handleDraw = () => {
    if (!selectedProductId) return
    setDrawing(true)
    setPendingWinner(null)

    const drawUrl =
      participantFilter === 'stands'
        ? `/lottery/draw/visited-all-stands/${selectedProductId}`
        : participantFilter === 'forms'
        ? `/lottery/draw/excel/${selectedProductId}`
        : `/lottery/draw/no-winners/${selectedProductId}`

    apiClient
      .post(drawUrl)
      .then((res) => {
        const w = res.data?.winner
        if (w && w.nombre_completo) {
          const parts = w.nombre_completo.trim().split(' ')
          w.winner_name      = parts[0] ?? ''
          w.winner_last_name = parts.slice(1).join(' ') || ''
          w.winner_phone     = w.whatsapp ?? ''
          w.winner_email     = w.correo ?? ''
        }
        setPendingWinner(w)
      })
      .catch((err) => {
        console.error('[Sorteo]', err)
        setDrawing(false)
      })
  }

  const handleDrawingComplete = (w) => {
    setDrawing(false)
    setWinner(w)
    setWinnerProduct(selectedProduct)
    setShowWinnerModal(true)
    setDrawCount((c) => c + 1)
  }

  // Estado de tab: 'individual' o 'massive'
  const [activeTab, setActiveTab] = useState('individual')

  // ── Modal ganadores ────────────────────────────────────────────────────────
  const [showWinnersModal, setShowWinnersModal] = useState(false)

  const refreshProducts = () => {
    setProductsLoading(true)
    apiClient
      .get(`/product`)
      .then((res) => {
        const list = res.data?.products ?? []
        setProducts(list)
        setSelectedProductId((prev) => prev ?? list[0]?.id ?? null)
      })
      .catch((err) => console.error('[Productos]', err))
      .finally(() => setProductsLoading(false))
  }

  return (
    <>
      <SectionLayout className="flex flex-col items-center">
        <div className="w-full max-w-md flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">Sorteos — Connect</h2>
            <button
              onClick={() => setShowWinnersModal(true)}
              className="flex items-center gap-1.5 text-sm font-medium text-blue-500 hover:text-blue-600 transition-colors"
            >
              🏆 Ver ganadores
            </button>
          </div>
          <SorteosTabNavigation activeTab={activeTab} onTabChange={setActiveTab} />
          {activeTab === 'individual' && (
            <>
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
                    {/* Participantes filtro */}
                    <div className="flex flex-col gap-1.5 mb-2">
                      <label className="text-sm font-medium text-gray-700 mb-1">
                        ¿Quiénes pueden participar?
                      </label>
                      <select
                        value={participantFilter}
                        onChange={(e) => setParticipantFilter(e.target.value)}
                        className="border border-gray-200 rounded-lg px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-yellow-200 focus:border-yellow-400 bg-gray-50 shadow-sm"
                      >
                        <option value="todos">Todos los participantes del evento</option>
                        <option value="stands">Solo quienes visitaron todos los stands</option>
                        <option value="forms">Solo quienes completaron el formulario</option>
                      </select>
                    </div>
                    {/* Selector */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                        Producto a sortear
                      </label>
                      <select
                        value={selectedProductId ?? ''}
                        onChange={(e) => setSelectedProductId(e.target.value)}
                        className="border border-gray-200 rounded-lg px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-yellow-200 focus:border-yellow-400 bg-gray-50 shadow-sm"
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
            </>
          )}
          {activeTab === 'massive' && <MassiveDrawMock products={products} />}
        </div>
      </SectionLayout>
      {activeTab === 'individual' && drawing && (
        <DrawingOverlay
          participants={participants}
          pendingWinner={pendingWinner}
          onComplete={handleDrawingComplete}
        />
      )}
      {showWinnersModal && (
        <WinnersListModal
          onClose={() => setShowWinnersModal(false)}
          onProductAdded={refreshProducts}
        />
      )}
      {activeTab === 'individual' && showWinnerModal && winner && (
        <WinnerResultModal
          winner={winner}
          product={winnerProduct}
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
