import React, {useState} from 'react'
import MegaphoneIcon from './MegaphoneIcon'

const HistoryItem = ({item}) => {
  const [expanded, setExpanded] = useState(false)
  return (
    <li className="border border-gray-100 rounded-lg overflow-hidden">
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="w-full flex items-center gap-3 px-3 py-2.5 text-left hover:bg-gray-50 transition-colors"
      >
        <MegaphoneIcon className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5 self-start" />
        <div className="flex-1 min-w-0">
          <p className={`text-sm text-gray-800 break-words ${expanded ? '' : 'truncate'}`}>
            {item.message ?? item.text}
          </p>
          <p className="text-[11px] text-gray-400 mt-0.5">
            {item.created_at
              ? new Date(item.created_at).toLocaleTimeString('es-AR', {
                  hour: '2-digit',
                  minute: '2-digit',
                })
              : item.time}
          </p>
        </div>
        <svg
          className={`w-4 h-4 text-gray-400 flex-shrink-0 self-start mt-1 transition-transform ${expanded ? 'rotate-180' : ''}`}
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
            clipRule="evenodd"
          />
        </svg>
      </button>
    </li>
  )
}

export default HistoryItem
