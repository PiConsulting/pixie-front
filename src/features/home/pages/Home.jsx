'use client'

import {useState} from 'react'
import Header from '../components/Header'
import TabNavigation from '../components/TabNavigation'
import TabContent from '../components/TabContent'
import EventoModal from '../components/tabs/EventoModal'

const Home = () => {
  const [activeTab, setActiveTab] = useState('sorteos')
  const [showEventoModal, setShowEventoModal] = useState(true)

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8 px-10">
        <Header />
        <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />
        <TabContent activeTab={activeTab} />
        <EventoModal isOpen={showEventoModal} onClose={() => setShowEventoModal(false)} />
      </div>
    </div>
  )
}

export default Home
