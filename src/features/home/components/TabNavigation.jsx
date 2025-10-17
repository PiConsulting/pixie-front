"use client"

const tabs = [
  { id: "asistentes", label: "Asistentes" },
  { id: "sorteos", label: "Sorteos" },
  { id: "anuncios", label: "Anuncios" },
]

const TabNavigation = ({ activeTab, onTabChange }) => {
  return (
    <div className="flex justify-center gap-2 mb-8">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`tab-button ${activeTab === tab.id ? "tab-button-active" : "tab-button-inactive"}`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}

export default TabNavigation
