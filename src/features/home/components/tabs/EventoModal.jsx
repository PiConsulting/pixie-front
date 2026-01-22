import React from 'react'

const EventoModal = ({isOpen, onClose}) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-gray-400 hover:text-gray-700 text-2xl font-bold"
        >
          ×
        </button>

        {/* Responsive: reduce padding and stack content on small screens. */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 px-5 py-6 sm:px-8 sm:py-10 lg:px-12 lg:py-12">
          <div className="flex flex-col">
            <div className="max-w-md text-center lg:text-left">
              <h2 className="px-4 sm:px-8 pt-6 sm:pt-10 text-2xl font-semibold text-gray-900">
                Te damos la bienvenida a Pixie
              </h2>
              <p className="p-4 sm:p-8 text-l leading-relaxed">
                Empecemos a organizar tu evento, cargá la información básica y Pixie se encarga del
                resto.
              </p>
            </div>

            <div className="flex-1 flex items-center justify-center pt-6 sm:pt-10 lg:pt-0">
              <img
                src="/robot.png"
                alt="Pixie Mascota"
                className="h-56 md:h-80 object-contain m-6 sm:m-10"
              />
            </div>
          </div>

          <div className="flex flex-col justify-center items-center">
            <form className="w-full max-w-md flex flex-col gap-5 mb-10">
              <div className="flex flex-col gap-2">
                <label className="text-gray-800 text-sm font-semibold" htmlFor="nombre-evento">
                  Nombre del evento
                </label>
                <input
                  id="nombre-evento"
                  type="text"
                  placeholder="Ingresa el nombre del evento"
                  className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 bg-white"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-gray-800 text-sm font-semibold">Agenda completa</label>
                <label
                  htmlFor="agenda-completa"
                  className="w-full rounded-md border border-gray-200 bg-gray-200 px-4 py-2 text-sm text-gray-700 text-center cursor-pointer transition-colors hover:bg-gray-100"
                >
                  Subir archivo
                </label>
                <input id="agenda-completa" type="file" className="sr-only" />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-gray-800 text-sm font-semibold">Descripción de agenda</label>
                <textarea
                  rows="4"
                  placeholder="Ingresa el título y la descripción de las presentaciones del evento."
                  className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 bg-white resize-none"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-gray-800 text-sm font-semibold">Lista de invitados</label>
                <label
                  htmlFor="lista-invitados"
                  className="w-full rounded-md border border-gray-200 bg-gray-200 px-4 py-2 text-sm text-gray-700 text-center cursor-pointer transition-colors hover:bg-gray-100"
                >
                  Subir archivo
                </label>
                <input id="lista-invitados" type="file" className="sr-only" />
              </div>

              <button
                type="submit"
                className="bg-[#3386f7] hover:bg-[#1d6ae5] text-white px-6 py-2 rounded-xl transition-colors duration-200 w-full text-xl mt-6"
              >
                Iniciar evento
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EventoModal
