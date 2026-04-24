import AsistentesContent from './tabs/AsistentesContent'
import SorteosContent from './tabs/SorteosContent'
import AnunciosContent from './tabs/AnunciosContent'
import StandsMasVisitadosContent from './tabs/StandsMasVisitadosContent'

const TabContent = ({activeTab}) => {
  const renderContent = () => {
    switch (activeTab) {
      case 'asistentes':
        return <AsistentesContent />
      case 'sorteos':
        return <SorteosContent />
      case 'anuncios':
        return <AnunciosContent />
      case 'visitas-stands':
        return <StandsMasVisitadosContent />
      default:
        return <AsistentesContent />
    }
  }

  return <div className="">{renderContent()}</div>
}

export default TabContent
