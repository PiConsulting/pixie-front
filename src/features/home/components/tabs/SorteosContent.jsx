import React, {useState, useRef, useEffect} from 'react'
import WinnerModal from './WinnerModal'
import {useNotifications} from '../../../../notifications/NotificationProvider'
import {notificationMessages} from '../../../../notifications/notifications.messages'

const SorteosContent = () => {
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const inputRef = useRef(null)

  const [productName, setProductName] = useState('')
  const [participants, setParticipants] = useState('Todos los asistentes')
  const [notification, setNotification] = useState(
    '¡Felicitaciones! Ganaste [item] pasa por el stand 2 a retirar tu premio.',
  )
  const [formMode, setFormMode] = useState('create')
  const [showIntro, setShowIntro] = useState(true)
  const [generated, setGenerated] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [sorteado, setSorteado] = useState(false)
  const [products, setProducts] = useState([])
  const [selectedProductIndex, setSelectedProductIndex] = useState(0)
  const [slideDirection, setSlideDirection] = useState('next')
  const {notifySuccess, notifyError, notifyInfo} = useNotifications()
  const generateTimeoutRef = useRef(null)
  const prevProduct = () => {
    if (products.length === 0) return
    setSlideDirection('prev')
    setSelectedProductIndex((i) => (i - 1 + products.length) % products.length)
  }
  const nextProduct = () => {
    if (products.length === 0) return
    setSlideDirection('next')
    setSelectedProductIndex((i) => (i + 1) % products.length)
  }
  const handleDeleteProduct = () => {
    if (products.length === 0) return
    const newArr = products.filter((_, idx) => idx !== selectedProductIndex)
    const newLen = newArr.length
    setProducts(newArr)
    setSelectedProductIndex(newLen === 0 ? 0 : Math.min(selectedProductIndex, newLen - 1))
    if (newLen === 0) setGenerated(false)

    let didError = false
    try {
      localStorage.setItem('sorteos_pending', JSON.stringify(newArr))
    } catch (err) {
      console.error('Error actualizando pendientes al eliminar', err)
      didError = true
      notifyError(notificationMessages.genericError)
    }
    if (!didError) notifyInfo(notificationMessages.productDeleted)
  }

  useEffect(() => {
    if (!file) {
      if (formMode === 'edit') return
      setPreview(null)
      return
    }
    const objectUrl = URL.createObjectURL(file)
    setPreview(objectUrl)
    return () => URL.revokeObjectURL(objectUrl)
  }, [file, formMode])

  useEffect(() => {
    return () => {
      if (generateTimeoutRef.current) {
        clearTimeout(generateTimeoutRef.current)
      }
    }
  }, [])

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
    if (formMode === 'edit') {
      if (!productName.trim()) {
        return alert('Por favor ingresá el nombre del producto.')
      }
      let imageData = null
      try {
        imageData = await fileToDataUrl(file)
      } catch (err) {
        console.error('Error convirtiendo imagen:', err)
        notifyError(notificationMessages.genericError)
      }
      const current = products[selectedProductIndex]
      const updated = {
        ...current,
        productName,
        participants,
        notification,
        image: imageData || current?.image,
        preview: imageData || current?.preview || current?.image,
      }
      const updatedProducts = products.map((item, idx) =>
        idx === selectedProductIndex ? updated : item,
      )
      setProducts(updatedProducts)
      try {
        localStorage.setItem('sorteos_pending', JSON.stringify(updatedProducts))
      } catch (err) {
        console.error('Error guardando edición en localStorage', err)
        notifyError(notificationMessages.genericError)
      }
      setGenerated(true)
      setFormMode('create')
      setFile(null)
      setPreview(null)
      return
    }
    if (!productName.trim() && products.length === 0) {
      alert(
        'Por favor ingresá el nombre del producto o añadí al menos un producto antes de generar.',
      )
      return
    }
    if (isGenerating) return
    if (generateTimeoutRef.current) {
      clearTimeout(generateTimeoutRef.current)
    }
    const startedAt = Date.now()
    setIsGenerating(true)

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
      let didError = false
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
        didError = true
        notifyError(notificationMessages.genericError)
      }
      setProducts((p) => [...p, nuevo])
      if (!didError) notifySuccess(notificationMessages.productAdded)
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
        notifyError(notificationMessages.genericError)
      }
    }

    // resetear inputs del formulario (pero conservar la lista `products` ya guardada)
    setProductName('')
    setParticipants('Todos los asistentes')
    setNotification('¡Felicitaciones! Ganaste [item] pasa por el stand 2 a retirar tu premio.')
    setFile(null)

    // al generar un nuevo sorteo, resetear flag de "sorteado" y marcar generated
    const completeGenerate = () => {
      setSorteado(false)
      setSelectedProductIndex(0)
      setGenerated(true)
      setIsGenerating(false)
      generateTimeoutRef.current = null
    }
    const elapsed = Date.now() - startedAt
    const remaining = Math.max(0, 350 - elapsed)
    generateTimeoutRef.current = setTimeout(completeGenerate, remaining)
  }

  const handleEdit = () => {
    if (!currentProduct) return
    setFormMode('edit')
    setGenerated(false)
    setIsGenerating(false)
    setProductName(currentProduct.productName || '')
    setParticipants(currentProduct.participants || 'Todos los asistentes')
    setNotification(
      currentProduct.notification ||
        '¡Felicitaciones! Ganaste [item] pasa por el stand 2 a retirar tu premio.',
    )
    setFile(null)
    setPreview(currentProduct.image || currentProduct.preview || null)
  }
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
  const displayParticipants =
    products.length > 0 ? products[selectedProductIndex]?.participants : participants
  const currentProduct = products.length > 0 ? products[selectedProductIndex] : null
  const slideClass = slideDirection === 'prev' ? 'product-swap-prev' : 'product-swap-next'

  return (
    <>
      <div className="w-full">
        {/* Responsive: reduce padding and prevent horizontal overflow on small screens. */}
        <div
          className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 min-h-[320px] overflow-hidden lg:overflow-visible"
          aria-busy={isGenerating ? 'true' : 'false'}
        >
          {!generated ? (
            isGenerating ? (
              <div className="px-4 sorteo-panel-enter">
                <div className="relative flex flex-col sm:flex-row items-center gap-6 sm:gap-10 w-full min-h-[260px]">
                  <div className="w-40 h-40 sm:w-56 sm:h-56 rounded-lg bg-gray-100 overflow-hidden relative">
                    <div className="absolute inset-0 sorteo-shimmer" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <span className="h-5 w-5 rounded-full border-2 border-blue-500 border-t-transparent animate-spin motion-reduce:animate-none" />
                      <div>
                        <div className="text-sm font-semibold text-gray-900">
                          Generando sorteo...
                        </div>
                        <div className="text-xs text-gray-500">
                          Preparando la vista del premio
                        </div>
                      </div>
                    </div>
                    <div className="mt-6 space-y-3">
                      <div className="relative h-3 w-32 rounded bg-gray-100 overflow-hidden">
                        <div className="absolute inset-0 sorteo-shimmer" />
                      </div>
                      <div className="relative h-4 w-56 rounded bg-gray-100 overflow-hidden">
                        <div className="absolute inset-0 sorteo-shimmer" />
                      </div>
                      <div className="relative h-3 w-40 rounded bg-gray-100 overflow-hidden">
                        <div className="absolute inset-0 sorteo-shimmer" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <form onSubmit={handleGenerate}>
                {formMode === 'edit' && (
                  <div className="mb-4">
                    <h4 className="text-lg font-semibold text-gray-900">Editar producto</h4>
                  </div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
                  <div
                    className="col-span-1 bg-gray-100 rounded-lg h-48 sm:h-64 flex items-center justify-center border-2 border-dashed border-gray-300 text-gray-500 cursor-pointer overflow-hidden"
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
                          className="mt-1 block w-full sm:w-1/2 border border-gray-300 rounded px-3 py-2"
                          placeholder="Ingresa el nombre del producto a sortear"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Participan
                        </label>
                        <select
                          value={participants}
                          onChange={(e) => setParticipants(e.target.value)}
                          className="mt-1 block w-full sm:w-1/2 border border-gray-300 rounded px-3 py-2"
                        >
                          <option>Todos los asistentes</option>
                          <option>Asistentes acreditados</option>
                        </select>
                      </div>
                      <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
                        {formMode === 'create' && (
                          <button
                            type="button"
                            onClick={async () => {
                              // Añadir producto temporal a la lista (convierte imagen a dataURL si existe)
                              if (!productName.trim())
                                return alert('Por favor ingresá el nombre del producto.')
                              let imageData = null
                              let didError = false
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
                                console.error(
                                  'Error guardando en localStorage al añadir producto',
                                  err,
                                )
                                didError = true
                                notifyError(notificationMessages.genericError)
                              }
                              if (!didError) notifySuccess(notificationMessages.productAdded)
                              // reset inputs for next product
                              setProductName('')
                              setParticipants('Todos los asistentes')
                              setNotification(
                                '¡Felicitaciones! Ganaste [item] pasa por el stand 2 a retirar tu premio.',
                              )
                              setFile(null)
                            }}
                            className="relative z-10 mt-4 inline-flex h-10 w-full sm:w-48 items-center justify-center rounded-lg border-2 border-blue-500 bg-white text-sm font-medium text-blue-500 transition-all duration-150 hover:bg-blue-100 hover:border-blue-00 hover:text-blue-700 hover:shadow-md hover:ring-2 hover:ring-blue-200"
                          >
                            <span className="text-sm ">Añadir producto</span>
                          </button>
                        )}
                        <button
                          type="submit"
                          disabled={isGenerating}
                          className="relative z-10 mt-4 inline-flex h-10 w-full sm:w-48 items-center justify-center rounded-lg border-2 border-blue-500 bg-blue-600 text-sm font-medium text-white transition-all duration-150 hover:bg-blue-800 hover:border-blue-00 0 hover:shadow-md hover:ring-2 hover:ring-blue-200 sm:mr-10"
                        >
                          {formMode === 'edit' ? 'Guardar cambios' : 'Crear sorteo'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            )
          ) : (
            <div className="px-4 sorteo-panel-enter">
              <div className="relative flex flex-col lg:flex-row items-center gap-6 lg:gap-12 overflow-hidden lg:overflow-visible w-full min-h-[260px]">
                {products.length > 1 && (
                  <button
                    type="button"
                    onClick={prevProduct}
                    className="absolute left-2 lg:left-[-60px] top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-blue-500 text-white flex items-center justify-center shadow hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed z-30"
                    aria-label="Anterior producto"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      className="h-5 w-5"
                    >
                      <path
                        d="M15 18l-6-6 6-6"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                )}

                {currentProduct && (
                  <button
                    type="button"
                    onClick={handleDeleteProduct}
                    className="absolute top-3 right-3 z-40 text-red-500 hover:text-red-600 p-2"
                    aria-label="Eliminar producto"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      className="h-6 w-6"
                    >
                      <path
                        d="M5.5 7h13m-9.5-2h6a1 1 0 011 1v1h-8V6a1 1 0 011-1z"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M7 7v11a1 1 0 001 1h8a1 1 0 001-1V7"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M10 10v7m4-7v7"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                      />
                    </svg>
                  </button>
                )}

                <div
                  key={currentProduct?.id ?? selectedProductIndex}
                  className={`flex flex-1 flex-col lg:flex-row items-center gap-6 lg:gap-12 ${slideClass}`}
                >
                  <div className="w-40 h-40 sm:w-56 sm:h-56 bg-white rounded-lg flex items-center justify-center border-gray-200 overflow-hidden mx-0 sm:mx-14">
                    {displayImage ? (
                      <img
                        src={displayImage}
                        alt="Producto"
                        className="max-h-full max-w-full object-contain"
                      />
                    ) : (
                      <div className="text-gray-400 text-sm">No hay imagen</div>
                    )}
                  </div>

                  <div className="flex-1 w-full flex items-start gap-6">
                    <div className="flex flex-col gap-4">
                      <div>
                        <div className="text-sm text-gray-500">Producto</div>
                        <div className="text-base font-semibold text-gray-900">
                          {displayProductName || 'Sin nombre'}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">Participan</div>
                        <div className="text-sm font-semibold text-gray-900">
                          {displayParticipants}
                        </div>
                        <div>
                          {!sorteado ? (
                            <button
                              onClick={handleEdit}
                              className="relative z-10 mt-4 inline-flex h-10 w-full sm:w-48 items-center justify-center rounded-lg border-2 border-blue-500 bg-white text-sm font-medium text-blue-500 transition-all duration-150 hover:bg-blue-100 hover:border-blue-00 hover:text-blue-700 hover:shadow-md hover:ring-2 hover:ring-blue-200"
                            >
                              Editar producto
                            </button>
                          ) : (
                            <button
                              disabled
                              aria-disabled="true"
                              className="mt-4 inline-flex h-10 w-full sm:w-48 items-center justify-center rounded-md bg-gray-200 text-gray-500 font-medium cursor-not-allowed"
                            >
                              Editar producto
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex w-full flex-col items-center gap-3 min-w-[150px] lg:w-auto">
                  {!sorteado ? (
                    <button
                      onClick={startDraw}
                      className="static lg:absolute z-10 mt-4 lg:mt-10 inline-flex h-10 w-full sm:w-48 items-center justify-center rounded-lg border-2 border-blue-500 bg-green-600 text-sm font-medium text-white transition-all duration-150 hover:bg-blue-800 hover:border-blue-00 0 hover:shadow-md hover:ring-2 hover:ring-blue-200 lg:mr-20"
                    >
                      Sortear
                    </button>
                  ) : (
                    <button
                      disabled
                      aria-disabled="true"
                      className="bg-gray-800 text-white w-full sm:w-auto px-14 py-2 rounded-xl font-medium cursor-not-allowed mt-2 sm:mr-6"
                    >
                      Sorteado
                    </button>
                  )}

                  {!sorteado ? (
                    <></>
                  ) : (
                    <button
                      onClick={() => {
                        setShowResortConfirm(true)
                      }}
                      className="text-sm text-red-600 font-medium hover:text-red-700"
                    >
                      Volver a sortear
                    </button>
                  )}
                </div>

                {products.length > 1 && (
                  <button
                    type="button"
                    onClick={nextProduct}
                    className="absolute right-2 lg:right-[-60px] top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-blue-500 text-white flex items-center justify-center shadow hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed z-30"
                    aria-label="Siguiente producto"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      className="h-5 w-5"
                    >
                      <path
                        d="M9 6l6 6-6 6"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {showWinnerModal && (
        <WinnerModal
          open={showWinnerModal}
          onClose={() => setShowWinnerModal(false)}
          onRetry={() => startDraw()}
          winnerName={winnerName}
          productName={displayProductName}
          onNotify={(notificationText) => {
            // marcar como sorteado y notificar
            try {
              setSorteado(true)
              notifySuccess(notificationMessages.winnerNotified)
            } catch (e) {
              console.error('onNotify parent handler error', e)
              notifyError(notificationMessages.genericError)
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
    </>
  )
}

export default SorteosContent
