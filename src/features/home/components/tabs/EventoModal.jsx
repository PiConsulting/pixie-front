import React from 'react'

const EventoModal = ({isOpen, onClose}) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
      <div className="bg-white rounded-2xl shadow-2xl px-8 py-10 max-w-4xl w-full flex flex-col relative">
        {/* Botón de cerrar */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-2xl font-bold"
        >
          ×
        </button>

        {/* Título y descripción */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold mb-2">Te damos la bienvenida a Pixie</h2>
          <p className="text-gray-700 text-base leading-snug">
            Empecemos a organizar tu evento, cargá la información básica y Pixie se encarga del
            resto.
          </p>
        </div>

        {/* Contenido principal: Imagen + Formulario */}
        <div className="flex flex-col md:flex-row w-full gap-8 items-center justify-center">
          {/* Imagen a la izquierda */}
          <div className="md:w-1/2 flex justify-center items-center">
            <img src="/robot.png" alt="Pixie Mascota" className="object-contain" />
          </div>

          {/* Formulario a la derecha */}
          <form className="md:w-1/2 w-full flex flex-col gap-4">
            <div>
              <label
                className="block text-gray-700 text-sm mb-1 font-bold text-left"
                htmlFor="nombre-evento"
              >
                Nombre del evento
              </label>
              <input
                id="nombre-evento"
                type="text"
                placeholder="Ingresa el nombre del evento"
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-400 bg-white"
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm mb-1 font-bold text-left">
                Agenda completa
              </label>
              <input
                type="file"
                className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100"
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm mb-1 font-bold text-left">
                Lista de invitados
              </label>
              <input
                type="file"
                className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100"
              />
            </div>
            <button
              type="submit"
              className="bg-[#3386f7] hover:bg-[#1d6ae5] text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200 mt-2 w-full text-base"
            >
              Iniciar evento
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default EventoModal
