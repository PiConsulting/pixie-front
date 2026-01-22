const Header = () => {
  return (
    <div className="relative bg-gradient-to-r from-primary-300 to-white rounded-2xl px-6 mb-4 overflow-hidden">
      {/* Responsive: stack content on small screens while preserving desktop layout. */}
      <div className="flex flex-col lg:flex-row items-stretch justify-between gap-6">
        <div className="flex-1 flex flex-col justify-end pb-6 lg:pb-8">
          <p className="text-dark text-sm font-medium mb-1">Pi Data Strategy & Consulting</p>
          <h1 className="text-dark text-3xl font-bold">Datazón</h1>
        </div>

        <div className="flex items-center gap-4 relative w-full lg:w-auto">
          {/* Fix: lock the robot container width on large screens so it never collapses. */}
          <div className="relative w-full max-w-[480px] h-[200px] sm:h-[250px] lg:w-[480px]">
            <img
              src="/public/robot_afirmativo.png"
              alt=""
              className="absolute top-0 left-0 h-full w-full object-contain z-10"
            />
            <button className="bg-primary-400 hover:bg-primary-500 text-dark px-8 py-2 rounded-md text-sm font-medium transition-colors duration-200 z-20 absolute right-0 bottom-4 sm:bottom-8 shadow-lg">
              Agenda completa
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Header
