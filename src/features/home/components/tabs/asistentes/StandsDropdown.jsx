import {createPortal} from 'react-dom'
import {useEffect, useRef, useState} from 'react'

const StandsDropdown = ({onSelect}) => {
  const [open, setOpen] = useState(false)
  const [menuStyle, setMenuStyle] = useState({})
  const btnRef = useRef(null)
  const menuRef = useRef(null)

  useEffect(() => {
    const handleClick = (e) => {
      const insideBtn = btnRef.current?.contains(e.target)
      const insideMenu = menuRef.current?.contains(e.target)
      if (!insideBtn && !insideMenu) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const handleOpen = () => {
    if (!open && btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect()
      setMenuStyle({
        position: 'fixed',
        top: rect.bottom + 4,
        left: rect.left,
        width: 144,
        zIndex: 9999,
      })
    }
    setOpen((v) => !v)
  }

  return (
    <div className="relative">
      <button
        ref={btnRef}
        onClick={handleOpen}
        className="px-3 py-1.5 rounded-md text-xs font-medium text-green-700 border border-green-200 hover:bg-green-50 transition-colors whitespace-nowrap flex items-center gap-1"
      >
        Stands
        <svg className="w-3 h-3" viewBox="0 0 20 20" fill="currentColor">
          <path
            fillRule="evenodd"
            d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
            clipRule="evenodd"
          />
        </svg>
      </button>
      {open &&
        createPortal(
          <div
            ref={menuRef}
            style={menuStyle}
            className="bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden"
          >
            <button
              onClick={() => {
                onSelect('visited')
                setOpen(false)
              }}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Visitados
            </button>
            <button
              onClick={() => {
                onSelect('not-visited')
                setOpen(false)
              }}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              No visitados
            </button>
          </div>,
          document.body,
        )}
    </div>
  )
}

export default StandsDropdown
