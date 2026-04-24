import React from 'react'
import HistoryItem from './HistoryItem'

const HistoryList = ({history, showAllHistory}) => (
  <ul className="space-y-2 p-1">
    {(showAllHistory && history.length > 3 ? history : history.slice(0, 3)).map((item) => (
      <HistoryItem key={item.id} item={item} />
    ))}
  </ul>
)

export default HistoryList
