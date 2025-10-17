import AsistentesContent from "./tabs/AsistentesContent"
import SorteosContent from "./tabs/SorteosContent"
import AnunciosContent from "./tabs/AnunciosContent"

const TabContent = ({ activeTab }) => {
  const renderContent = () => {
    switch (activeTab) {
      case "asistentes":
        return <AsistentesContent />
      case "sorteos":
        return <SorteosContent />
      case "anuncios":
        return <AnunciosContent />
      default:
        return <SorteosContent />
    }
  }

  return <div className="content-card">{renderContent()}</div>
}

export default TabContent
