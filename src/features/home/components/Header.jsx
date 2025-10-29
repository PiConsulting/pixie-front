const Header = () => {
  return (
    <div className="relative bg-gradient-to-r from-primary-300 to-white rounded-2xl px-6 mb-4 overflow-hidden">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-dark text-sm font-medium mb-1">Pi Data Strategy & Consulting</p>
          <h1 className="text-dark text-3xl font-bold">Datazón</h1>
        </div>

        <div className="flex items-center gap-4 relative">
          <div className="relative" style={{width: '420px', height: '240px'}}>
            <img
              src="/public/robot_afirmativo.png"
              alt=""
              className="absolute top-0 -left-10 w-full h-full  z-10"
            />
            <button className="bg-primary-400 hover:bg-primary-500 text-dark px-6 py-2 rounded-md text-sm font-medium transition-colors duration-200 z-20 absolute right-0 bottom-6 shadow-lg">
              Agenda completa
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Header
