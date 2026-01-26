import SectionLayout from '../SectionLayout'

const AsistentesContent = () => {
  return (
    <SectionLayout className="flex flex-col justify-center items-center overflow-visible md:overflow-auto">
      {/* Responsive: allow the card to grow naturally on small screens. */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Gestiona tus asistentes</h2>
        <p className="text-gray-600 mb-8 max-w-xl mx-auto">
          Administra la lista de participantes de manera eficiente y mantén un control completo de
          tu evento
        </p>
        <button className="m-0 w-full sm:w-auto bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-lg font-medium transition-colors duration-200">
          Ver asistentes
        </button>
      </div>
    </SectionLayout>
  )
}

export default AsistentesContent
