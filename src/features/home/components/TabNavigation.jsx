'use client'

const tabs = [
  {id: 'asistentes', label: 'Asistentes'},
  {id: 'sorteos', label: 'Sorteos'},
  {id: 'anuncios', label: 'Anuncios'},
]

const TabNavigation = ({activeTab, onTabChange}) => {
  const activeIndex = tabs.findIndex((t) => t.id === activeTab)

  return (
    <div className="flex justify-center mb-8">
      <div
        className="relative inline-flex items-center rounded-full bg-[#f6ecd9] overflow-hidden"
        style={{width: '350px', height: '26px'}}
      >
        {/* sliding indicator */}
        <div
          aria-hidden
          className="absolute top-0 bottom-0 left-0 bg-yellow-400 rounded-full transition-transform duration-500 ease-in-out"
          style={{
            width: `${100 / tabs.length}%`,
            transform: `translateX(${(activeIndex >= 0 ? activeIndex : 0) * 100}%)`,
          }}
        />

        {tabs.map((tab, idx) => {
          const active = activeTab === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex-1 text-sm font-medium py-2 transition-colors duration-300 ease-in-out relative z-10 ${
                active ? 'text-black' : 'text-black/70'
              } text-center`}
            >
              {tab.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default TabNavigation
