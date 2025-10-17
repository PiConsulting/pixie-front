import React, {useState, useRef, useEffect} from 'react'

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

    setGenerated(true)
  }

  const handleEdit = () => setGenerated(false)

  return (
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

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Notificación de premio
                    </label>
                    <textarea
                      value={notification}
                      onChange={(e) => setNotification(e.target.value)}
                      className="mt-1 block w-full border border-gray-300 rounded px-3 py-2 h-24"
                    />
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
                    <div className="text-sm text-gray-500 mt-3">Notificación de premio</div>
                    <div className="mt-2 p-3 bg-gray-100 rounded text-sm text-gray-700">
                      {notification}
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    <button className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-md font-medium">
                      Sortear
                    </button>
                    <button onClick={handleEdit} className="text-sm text-blue-600 underline">
                      Editar sorteo
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default SorteosContent
