const AsistentesContent = () => {
  return (
    <div className="w-full">
      <div className="bg-white rounded-2xl shadow-lg p-6 h-[400px] overflow-auto">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Gestiona tus asistentes</h2>
          <p className="text-gray-600 mb-8 max-w-xl mx-auto">
            Administra la lista de participantes de manera eficiente y mantén un control completo de
            tu evento
          </p>
          <button className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-lg font-medium transition-colors duration-200">
            Ver asistentes
          </button>
        </div>
      </div>
    </div>
  )
}

export default AsistentesContent
