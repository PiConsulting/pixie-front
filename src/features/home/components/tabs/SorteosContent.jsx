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
  const [generated, setGenerated] = useState(false)
  const [sorteado, setSorteado] = useState(false)
  const [toast, setToast] = useState({show: false, message: ''})

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
    if (!productName.trim()) {
      alert('Por favor ingresá el nombre del producto.')
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

    try {
      const stored = JSON.parse(localStorage.getItem('sorteos') || '[]')
      stored.push(nuevo)
      localStorage.setItem('sorteos', JSON.stringify(stored))
    } catch (err) {
      console.error('Error guardando en localStorage', err)
    }

    // al generar un nuevo sorteo, resetear flag de "sorteado"
    setSorteado(false)
    setGenerated(true)
  }

  const handleEdit = () => setGenerated(false)
  const [showWinnerModal, setShowWinnerModal] = useState(false)
  const [winnerName, setWinnerName] = useState(null)
  const [showResortConfirm, setShowResortConfirm] = useState(false)

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

  return (
    <>
      <div className="w-full">
        <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">Generar sorteo</h2>
        <p className="text-gray-600 mb-6 text-center max-w-2xl mx-auto">
          Cargá la imagen del premio o elemento a sortear arrastrándola al recuadro o haciendo clic
          para seleccionarla.
        </p>

        <div className="bg-white rounded-2xl shadow-lg p-6">
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
                        <option>Developers</option>
                        <option>Administracion</option>
                      </select>
                    </div>
                    <div className="flex justify-end">
                      <button
                        type="submit"
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium"
                      >
                        Generar sorteo
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          ) : (
            <div className="p-4">
              <div className="flex items-start gap-6">
                <div className="w-64 h-64 bg-white rounded-lg flex items-center justify-center border-4 border-blue-300 overflow-hidden">
                  {preview ? (
                    <img
                      src={preview}
                      alt="Producto"
                      className="max-h-full max-w-full object-contain"
                    />
                  ) : (
                    <div className="text-gray-400">No hay imagen</div>
                  )}
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm text-gray-500">Producto</div>
                      <div className="text-base font-semibold text-gray-900">{productName}</div>
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
      </div>

      {showWinnerModal && (
        <WinnerModal
          open={showWinnerModal}
          onClose={() => setShowWinnerModal(false)}
          onRetry={() => startDraw()}
          winnerName={winnerName}
          productName={productName}
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
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-lg">
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
