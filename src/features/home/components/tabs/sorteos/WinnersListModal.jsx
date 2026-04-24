import {useEffect, useState} from 'react'
import apiClient from '../../../../../lib/api'

const DEFAULT_PHOTO_URL =
  'https://upload.wikimedia.org/wikipedia/commons/d/da/Imagen_no_disponible.svg'

const emptyForm = {name: '', photo_url: '', brand: ''}

// ── Shared winner row ─────────────────────────────────────────────────────────
function WinnerRow({w}) {
  const photo = w.photo_url || w.product_photo_url
  return (
    <li className="flex items-center gap-4 bg-gray-50 rounded-xl p-3">
      {photo ? (
        <img
          src={photo}
          alt={w.product_name}
          className="w-14 h-14 rounded-lg object-cover flex-shrink-0"
        />
      ) : (
        <div className="w-14 h-14 rounded-lg bg-gray-200 flex items-center justify-center flex-shrink-0">
          <span className="text-2xl">🎁</span>
        </div>
      )}
      <div className="flex flex-col min-w-0">
        <span className="font-semibold text-gray-900 truncate">
          {w.product_name}
          {w.brand ? (
            <span className="text-xs font-normal text-gray-400 ml-1">— {w.brand}</span>
          ) : null}
        </span>
        <span className="text-sm text-blue-600 font-medium">
          {w.winner_name} {w.winner_last_name}
        </span>
      </div>
    </li>
  )
}

// ── Main modal ────────────────────────────────────────────────────────────────
const WinnersListModal = ({onClose, onProductAdded}) => {
  const [activeTab, setActiveTab] = useState('individual') // 'individual' | 'masivo' | 'forms'

  // Individual winners
  const [winners, setWinners] = useState([])
  const [loadingInd, setLoadingInd] = useState(true)

  // Massive winners
  const [massiveWinners, setMassiveWinners] = useState([])
  const [loadingMas, setLoadingMas] = useState(true)

  // Forms winners
  const [formsWinners, setFormsWinners] = useState([])
  const [loadingForms, setLoadingForms] = useState(true)

  // Add-product form
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState(null)

  useEffect(() => {
    apiClient
      .get('/product/winners')
      .then((res) => setWinners(res.data?.winners ?? []))
      .catch((err) => console.error('[Ganadores individuales]', err))
      .finally(() => setLoadingInd(false))

    apiClient
      .get('/product/multi-winners')
      .then((res) => setMassiveWinners(res.data?.winners ?? []))
      .catch((err) => console.error('[Ganadores masivos]', err))
      .finally(() => setLoadingMas(false))

    apiClient
      .get('/register_connect/excel-winners')
      .then((res) => {
        const raw = res.data?.winners ?? []
        setFormsWinners(
          raw.map((w) => {
            const parts = (w.nombre_completo ?? '').trim().split(' ')
            return {
              ...w,
              winner_name:      parts[0] ?? '',
              winner_last_name: parts.slice(1).join(' ') || '',
            }
          })
        )
      })
      .catch((err) => console.error('[Ganadores forms]', err))
      .finally(() => setLoadingForms(false))
  }, [])

  const handleFormChange = (e) => {
    const {name, value} = e.target
    setForm((prev) => ({...prev, [name]: value}))
  }

  const handleAddProduct = (e) => {
    e.preventDefault()
    setFormError(null)
    setSubmitting(true)

    const payload = {
      name: form.name,
      photo_url: form.photo_url.trim() || DEFAULT_PHOTO_URL,
      brand: form.brand,
    }

    apiClient
      .post('/product', payload)
      .then(() => {
        setForm(emptyForm)
        setShowForm(false)
        onProductAdded?.()
      })
      .catch((err) => {
        console.error('[Agregar Producto]', err)
        setFormError('No se pudo agregar el producto. Intentá de nuevo.')
      })
      .finally(() => setSubmitting(false))
  }

  const title = showForm ? 'Agregar producto' : 'Ganadores de sorteos'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors text-xl leading-none"
          >
            ✕
          </button>
        </div>

        {/* Tab bar (hidden when form is open) */}
        {!showForm && (
          <div className="flex border-b border-gray-100 px-6">
            {[
              {key: 'individual', label: '🎯 Individual'},
              {key: 'masivo', label: '🎰 Masivo'},
              {key: 'forms', label: '📋 Formulario'},
            ].map(({key, label}) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`py-3 px-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === key
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-400 hover:text-gray-600'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        )}

        {/* Body */}
        <div className="overflow-y-auto flex-1 px-6 py-4">
          {showForm ? (
            <form id="add-product-form" onSubmit={handleAddProduct} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700">
                  Nombre <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleFormChange}
                  required
                  placeholder="Ej: Auriculares Bluetooth"
                  className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700">
                  Marca <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="brand"
                  value={form.brand}
                  onChange={handleFormChange}
                  required
                  placeholder="Ej: Sony"
                  className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700">
                  URL de foto{' '}
                  <span className="text-xs font-normal text-gray-400">(opcional)</span>
                </label>
                <input
                  type="url"
                  name="photo_url"
                  value={form.photo_url}
                  onChange={handleFormChange}
                  placeholder="https://..."
                  className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
              {formError && <p className="text-sm text-red-500 text-center">{formError}</p>}
            </form>
          ) : activeTab === 'individual' ? (
            loadingInd ? (
              <p className="text-sm text-gray-400 text-center py-8">Cargando ganadores...</p>
            ) : winners.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-8">
                Todavía no hay ganadores registrados.
              </p>
            ) : (
              <ul className="flex flex-col gap-3">
                {winners.map((w, i) => (
                  <WinnerRow key={w.product_id ?? i} w={w} />
                ))}
              </ul>
            )
          ) : activeTab === 'masivo' ? (
            loadingMas ? (
              <p className="text-sm text-gray-400 text-center py-8">Cargando ganadores...</p>
            ) : massiveWinners.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-8">
                Todavía no hay ganadores de sorteos masivos.
              </p>
            ) : (
              <ul className="flex flex-col gap-3">
                {massiveWinners.map((w, i) => (
                  <WinnerRow key={`${w.product_id}-${w.winner_id ?? i}`} w={w} />
                ))}
              </ul>
            )
          ) : loadingForms ? (
            <p className="text-sm text-gray-400 text-center py-8">Cargando ganadores...</p>
          ) : formsWinners.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-8">
              Todavía no hay ganadores del formulario.
            </p>
          ) : (
            <ul className="flex flex-col gap-3">
              {formsWinners.map((w, i) => (
                <WinnerRow key={`forms-${w.id ?? i}`} w={w} />
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 flex gap-3">
          {showForm ? (
            <>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false)
                  setForm(emptyForm)
                  setFormError(null)
                }}
                className="flex-1 px-6 py-2.5 rounded-xl text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                form="add-product-form"
                disabled={submitting}
                className="flex-1 px-6 py-2.5 rounded-xl text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 transition-colors disabled:opacity-60"
              >
                {submitting ? 'Guardando...' : 'Guardar'}
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setShowForm(true)}
                className="flex-1 px-6 py-2.5 rounded-xl text-sm font-medium text-white bg-green-500 hover:bg-green-600 transition-colors"
              >
                + Agregar producto
              </button>
              <button
                onClick={onClose}
                className="flex-1 px-6 py-2.5 rounded-xl text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 transition-colors"
              >
                Cerrar
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default WinnersListModal
