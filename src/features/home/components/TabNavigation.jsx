'use client'

const tabs = [
  {id: 'asistentes', label: 'Asistentes'},
  {id: 'sorteos', label: 'Sorteos'},
  {id: 'anuncios', label: 'Anuncios'},
]

const TabNavigation = ({activeTab, onTabChange}) => {
  return (
    <div className="flex justify-center mb-8">
      <div className="inline-flex items-center rounded-full bg-[#f6ecd9]">
        {tabs.map((tab, idx) => {
          const isFirst = idx === 0
          const isLast = idx === tabs.length - 1
          const active = activeTab === tab.id
          const base = `text-sm font-medium px-6 py-1 transition-colors duration-150`
          const rounded = 'rounded-full'
          const activeClasses = active
            ? 'bg-yellow-400 text-black shadow-sm'
            : 'text-black/70 bg-transparent'

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`${base} ${rounded} ${activeClasses} focus:outline-none`}
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
