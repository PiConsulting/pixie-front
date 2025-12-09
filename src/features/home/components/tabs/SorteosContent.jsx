import React, {useState, useRef, useEffect} from 'react'
import WinnerModal from './WinnerModal'

const SorteosContent = () => {
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const inputRef = useRef(null)

  const [productName, setProductName] = useState('')
  const [participants, setParticipants] = useState('Todos los asistentes')
  const [notification, setNotification] = useState(
    '¡Felicitaciones! Ganaste [item] pasa por el stand 2 a retirar tu premio.',
  )
  const [showIntro, setShowIntro] = useState(true)
  const [generated, setGenerated] = useState(false)
  const [sorteado, setSorteado] = useState(false)
  const [toast, setToast] = useState({show: false, message: ''})
  const [products, setProducts] = useState([])
  const [selectedProductIndex, setSelectedProductIndex] = useState(0)
  const prevProduct = () => {
    if (products.length === 0) return
    setSelectedProductIndex((i) => (i - 1 + products.length) % products.length)
  }
  const nextProduct = () => {
    if (products.length === 0) return
    setSelectedProductIndex((i) => (i + 1) % products.length)
  }

  useEffect(() => {
    if (!file) {
      setPreview(null)
      return
    }
    const objectUrl = URL.createObjectURL(file)
    setPreview(objectUrl)
    return () => URL.revokeObjectURL(objectUrl)
  }, [file])

  const onDrop = (e) => {
    e.preventDefault()
    const dropped = e.dataTransfer.files && e.dataTransfer.files[0]
    if (dropped) setFile(dropped)
  }

  const onSelect = (e) => {
    const f = e.target.files && e.target.files[0]
    if (f) setFile(f)
  }

  const openFilePicker = () => inputRef.current && inputRef.current.click()

  const fileToDataUrl = (file) => {
    return new Promise((resolve, reject) => {
      if (!file) return resolve(null)
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result)
      reader.onerror = (err) => reject(err)
      reader.readAsDataURL(file)
    })
  }

  const handleGenerate = async (e) => {
    e.preventDefault()
    if (!productName.trim() && products.length === 0) {
      alert(
        'Por favor ingresá el nombre del producto o añadí al menos un producto antes de generar.',
      )
      return
    }

    let imageData = null
    try {
      imageData = await fileToDataUrl(file)
    } catch (err) {
      console.error('Error convirtiendo imagen:', err)
    }

    const nuevo = {
      id: Date.now(),
      productName,
      participants,
      notification,
      image: imageData,
    }

    // Si el formulario actual contiene un producto (no fue añadido previamente), lo añadimos y guardamos
    if (productName.trim()) {
      // si el producto actual no fue añadido previamente, lo guardamos en pendientes y en final
      try {
        // mover pendings a final + nuevo
        const pending = JSON.parse(localStorage.getItem('sorteos_pending') || '[]')
        const stored = JSON.parse(localStorage.getItem('sorteos') || '[]')
        // push pending items to final
        if (Array.isArray(pending) && pending.length > 0) {
          stored.push(...pending)
        }
        // push the current nuevo
        stored.push(nuevo)
        localStorage.setItem('sorteos', JSON.stringify(stored))
        // clear pending
        localStorage.setItem('sorteos_pending', JSON.stringify([]))
      } catch (err) {
        console.error('Error guardando en localStorage', err)
      }
      setProducts((p) => [...p, nuevo])
    } else {
      // si no hay producto en el formulario, intentamos mover solo los pendientes a final
      try {
        const pending = JSON.parse(localStorage.getItem('sorteos_pending') || '[]')
        if (Array.isArray(pending) && pending.length > 0) {
          const stored = JSON.parse(localStorage.getItem('sorteos') || '[]')
          stored.push(...pending)
          localStorage.setItem('sorteos', JSON.stringify(stored))
          localStorage.setItem('sorteos_pending', JSON.stringify([]))
        }
      } catch (err) {
        console.error('Error moviendo pendientes a final', err)
      }
    }

    // resetear inputs del formulario (pero conservar la lista `products` ya guardada)
    setProductName('')
    setParticipants('Todos los asistentes')
    setNotification('¡Felicitaciones! Ganaste [item] pasa por el stand 2 a retirar tu premio.')
    setFile(null)

    // al generar un nuevo sorteo, resetear flag de "sorteado" y marcar generated
    setSorteado(false)
    setSelectedProductIndex(0)
    setGenerated(true)
  }

  const handleEdit = () => setGenerated(false)
  const [showWinnerModal, setShowWinnerModal] = useState(false)
  const [winnerName, setWinnerName] = useState(null)
  const [showResortConfirm, setShowResortConfirm] = useState(false)

  // cargar pendientes guardados al montar
  useEffect(() => {
    try {
      const pending = JSON.parse(localStorage.getItem('sorteos_pending') || '[]')
      if (Array.isArray(pending) && pending.length > 0) {
        setProducts(pending)
      }
    } catch (e) {
      // ignore
    }
  }, [])

  const sampleAttendees = [
    'Ana López',
    'Carlos Pérez',
    'María Gómez',
    'Juan Martínez',
    'Lucía Fernández',
  ]

  const startDraw = () => {
    // elegir un ganador aleatorio de la lista simulada
    const idx = Math.floor(Math.random() * sampleAttendees.length)
    setWinnerName(sampleAttendees[idx])
    setShowWinnerModal(true)
  }

  // imagen y nombre que se muestran en la vista generada (seleccionable)
  const displayImage =
    products.length > 0
      ? products[selectedProductIndex]?.image || products[selectedProductIndex]?.preview
      : preview
  const displayProductName =
    products.length > 0 ? products[selectedProductIndex]?.productName : productName

  return (
    <>
      <div className="w-full">
        {showIntro ? (
          <div className="bg-white rounded-2xl shadow-lg p-8 h-[400px] flex flex-col items-center justify-center text-center gap-4">
            <div className="max-w-xl">
              <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                Armá un sorteo en segundos
              </h3>
              <p className="text-gray-600">
                Elegí a los participantes y dejá que la plataforma elija al ganador en un instante.
              </p>
            </div>
            <button
              onClick={() => setShowIntro(false)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full font-medium shadow transition-colors duration-200"
            >
              Crear sorteo
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-lg p-6 h-[400px] overflow-auto">
            {!generated ? (
              <form onSubmit={handleGenerate}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
                  <div
                    className="col-span-1 bg-gray-100 rounded-lg h-64 flex items-center justify-center border-2 border-dashed border-gray-300 text-gray-500 cursor-pointer overflow-hidden"
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={onDrop}
                    onClick={openFilePicker}
                    role="button"
                    aria-label="Subir imagen premio"
                  >
                    {preview ? (
                      <img
                        src={preview}
                        alt="Preview"
                        className="max-h-full max-w-full object-contain"
                      />
                    ) : (
                      <div className="text-center px-4">
                        <p className="font-medium">Subí o arrastra tu archivo acá</p>
                        <p className="text-sm text-gray-500 mt-2">PNG, JPG, GIF — hasta 5MB</p>
                      </div>
                    )}
                    <input
                      ref={inputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={onSelect}
                    />
                  </div>

                  <div className="col-span-2">
                    <div className="flex flex-col gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Nombre del producto
                        </label>
                        <input
                          value={productName}
                          onChange={(e) => setProductName(e.target.value)}
                          className="mt-1 block w-full border border-gray-300 rounded px-3 py-2"
                          placeholder="Ingresa el nombre del producto a sortear"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">Participan</label>
                        <select
                          value={participants}
                          onChange={(e) => setParticipants(e.target.value)}
                          className="mt-1 block w-1/2 border border-gray-300 rounded px-3 py-2"
                        >
                          <option>Todos los asistentes</option>
                          <option>Asistentes acreditados</option>
                        </select>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <button
                          type="submit"
                          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium"
                        >
                          Generar sorteo
                        </button>

                        <button
                          type="button"
                          onClick={async () => {
                            // Añadir producto temporal a la lista (convierte imagen a dataURL si existe)
                            if (!productName.trim())
                              return alert('Por favor ingresá el nombre del producto.')
                            let imageData = null
                            try {
                              imageData = await fileToDataUrl(file)
                            } catch (err) {
                              console.error('Error convirtiendo imagen al añadir producto:', err)
                            }
                            const id = Date.now()
                            const item = {
                              id,
                              productName,
                              participants,
                              notification,
                              // prefer data URL preview (stable) if available
                              preview: imageData || preview,
                              image: imageData,
                            }
                            setProducts((p) => [...p, item])
                            // guardar inmediatamente en localStorage (pendientes)
                            try {
                              const stored = JSON.parse(
                                localStorage.getItem('sorteos_pending') || '[]',
                              )
                              stored.push(item)
                              localStorage.setItem('sorteos_pending', JSON.stringify(stored))
                            } catch (err) {
                              console.error('Error guardando en localStorage al añadir producto', err)
                            }
                            // reset inputs for next product
                            setProductName('')
                            setParticipants('Todos los asistentes')
                            setNotification(
                              '¡Felicitaciones! Ganaste [item] pasa por el stand 2 a retirar tu premio.',
                            )
                            setFile(null)
                          }}
                          className="mt-2 inline-flex items-center gap-2 text-blue-600 hover:text-blue-700"
                        >
                          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-600">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </span>
                          <span className="text-sm">Añadir otro producto</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            ) : (
              <div className="p-4">
                {/* lista de productos agregados (si hay) */}
                {products.length > 0 && (
                  <div className="mb-4 flex gap-3 items-center overflow-x-auto">
                    {products.map((p, i) => (
                      <div
                        key={p.id}
                        onClick={() => setSelectedProductIndex(i)}
                        className={`flex items-center gap-2 bg-gray-50 border ${
                          i === selectedProductIndex ? 'border-blue-400' : 'border-gray-200'
                        } rounded px-3 py-2 cursor-pointer`}
                      >
                        <div className="w-12 h-12 bg-white rounded overflow-hidden flex items-center justify-center">
                          {p.image || p.preview ? (
                            // prefer stored data URL (image) else object URL (preview)
                            <img
                              src={p.image || p.preview}
                              alt={p.productName}
                              className="object-contain w-full h-full"
                            />
                          ) : (
                            <div className="text-xs text-gray-400">No img</div>
                          )}
                        </div>
                        <div className="text-sm font-medium">{p.productName}</div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            setProducts((arr) => {
                              const newArr = arr.filter((x) => x.id !== p.id)
                              try {
                                localStorage.setItem('sorteos_pending', JSON.stringify(newArr))
                              } catch (err) {
                                console.error('Error actualizando pendientes al eliminar', err)
                              }
                              return newArr
                            })
                            // if we removed the selected, adjust selected index
                            setSelectedProductIndex((old) => {
                              const newLen = Math.max(0, products.length - 1)
                              if (newLen === 0) return 0
                              return Math.min(old, newLen - 1)
                            })
                          }}
                          className="text-xs text-red-500 ml-2"
                        >
                          Eliminar
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                <div className="flex items-start gap-6">
                  <div className="w-64 h-64 bg-white rounded-lg flex items-center justify-center border-4 border-blue-300 overflow-hidden">
                    {displayImage ? (
                      <img
                        src={displayImage}
                        alt="Producto"
                        className="max-h-full max-w-full object-contain"
                      />
                    ) : (
                      <div className="text-gray-400">No hay imagen</div>
                    )}
                  </div>

                  {/* Carousel controls for selected product */}
                  {products.length > 1 && (
                    <div className="flex flex-col items-center mt-2">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={prevProduct}
                          className="px-3 py-1 bg-white border rounded hover:bg-gray-50"
                        >
                          Anterior
                        </button>
                        <div className="text-sm text-gray-600">
                          {selectedProductIndex + 1} / {products.length}
                        </div>
                        <button
                          onClick={nextProduct}
                          className="px-3 py-1 bg-white border rounded hover:bg-gray-50"
                        >
                          Siguiente
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm text-gray-500">Producto</div>
                        <div className="text-base font-semibold text-gray-900">
                          {displayProductName}
                        </div>
                        <div className="text-sm text-gray-500 mt-3">Participan</div>
                        <div className="text-sm text-gray-700">{participants}</div>
                      </div>

                      <div className="flex flex-col items-end gap-2">
                        {/* Botón Sortear / Sorteado */}
                        {!sorteado ? (
                          <button
                            onClick={startDraw}
                            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-md font-medium transition-colors duration-150"
                          >
                            Sortear
                          </button>
                        ) : (
                          <button
                            disabled
                            aria-disabled="true"
                            className="bg-gray-200 text-gray-500 px-6 py-3 rounded-md font-medium cursor-not-allowed"
                          >
                            Sorteado
                          </button>
                        )}

                        {/* Botón Editar / Volver a sortear */}
                        {!sorteado ? (
                          <button onClick={handleEdit} className="text-sm text-blue-600 underline">
                            Editar sorteo
                          </button>
                        ) : (
                          <button
                            onClick={() => {
                              // abrir modal de confirmación; el sorteo real se hace solo si confirma
                              setShowResortConfirm(true)
                            }}
                            className="text-sm text-red-600 font-medium hover:text-red-700"
                          >
                            Volver a sortear
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {showWinnerModal && (
        <WinnerModal
          open={showWinnerModal}
          onClose={() => setShowWinnerModal(false)}
          onRetry={() => startDraw()}
          winnerName={winnerName}
          productName={displayProductName}
          onNotify={(notificationText) => {
            // marcar como sorteado y mostrar toast
            try {
              setSorteado(true)
              setToast({show: true, message: 'Notificación enviada!'})
              // ocultar toast después de 3s
              setTimeout(() => setToast({show: false, message: ''}), 3000)
            } catch (e) {
              console.error('onNotify parent handler error', e)
            }
          }}
        />
      )}

      {/* Confirmación: Estás por sortear un producto nuevamente */}
      {showResortConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-2xl w-full max-w-xl p-6 shadow-lg">
            <div className="overflow-hidden rounded-t-xl">
              {/* Imagen decorativa: usar el mismo robot o placeholder */}
              <div className="h-32 bg-gradient-to-r from-yellow-200 to-white flex items-center justify-center">
                <img src="/public/sorpresa.png" alt="alerta" className="h-36 object-contain" />
              </div>
            </div>

            <div className="p-4 text-center">
              <h3 className="text-lg font-semibold">Estás por sortear un producto nuevamente</h3>
              <p className="text-sm text-gray-600 mt-2">
                El ganador anterior perderá su premio,{' '}
                <strong>esta acción no se puede deshacer</strong>.
              </p>

              <div className="mt-6">
                <button
                  onClick={() => {
                    // confirmar: cerrar modal, reactivar flag y ejecutar sorteo
                    setShowResortConfirm(false)
                    setSorteado(false)
                    startDraw()
                  }}
                  className="w-full bg-red-500 hover:bg-red-600 text-white px-4 py-3 rounded-md font-medium shadow"
                >
                  Volver a sortear
                </button>
              </div>

              <div className="mt-4">
                <button
                  onClick={() => setShowResortConfirm(false)}
                  className="text-sm text-gray-700"
                >
                  Volver
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toast simple bottom-right */}
      {toast.show && (
        <div className="fixed top-6 right-6 z-50">
          <div className="bg-green-600 text-white px-4 py-2 rounded-md shadow-lg border border-green-700">
            {toast.message}
          </div>
        </div>
      )}
    </>
  )
}

export default SorteosContent
