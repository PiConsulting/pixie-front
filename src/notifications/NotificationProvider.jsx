import React, {createContext, useCallback, useContext, useEffect, useMemo, useRef, useState} from 'react'
import {notificationService} from './notificationService'

const NotificationContext = createContext(null)

const getToastStyles = (type) => {
  if (type === 'success') return 'border-l-4 border-green-500 bg-green-50 text-green-900'
  if (type === 'error') return 'border-l-4 border-red-500 bg-red-50 text-red-900'
  return 'border-l-4 border-blue-500 bg-blue-50 text-blue-900'
}

const createToastId = () => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID()
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`
}

export const NotificationProvider = ({children, autoCloseMs = 3500}) => {
  const [toasts, setToasts] = useState([])
  const timeoutsRef = useRef(new Map())

  const removeToast = useCallback((id) => {
    setToasts((current) => current.filter((toast) => toast.id !== id))
    const timeoutId = timeoutsRef.current.get(id)
    if (timeoutId) {
      clearTimeout(timeoutId)
      timeoutsRef.current.delete(id)
    }
  }, [])

  useEffect(() => {
    // Subscribe to the service so any layer can push notifications without UI coupling.
    const unsubscribe = notificationService.subscribe((payload) => {
      const id = createToastId()
      setToasts((current) => [...current, {...payload, id}])
      const timeoutId = setTimeout(() => removeToast(id), autoCloseMs)
      timeoutsRef.current.set(id, timeoutId)
    })

    return () => {
      unsubscribe()
      timeoutsRef.current.forEach((timeoutId) => clearTimeout(timeoutId))
      timeoutsRef.current.clear()
    }
  }, [autoCloseMs, removeToast])

  const contextValue = useMemo(
    () => ({
      notifySuccess: notificationService.notifySuccess,
      notifyError: notificationService.notifyError,
      notifyInfo: notificationService.notifyInfo,
    }),
    [],
  )

  return (
    <NotificationContext.Provider value={contextValue}>
      {children}
      <div className="fixed top-6 right-6 z-[60] flex flex-col gap-3" role="status" aria-live="polite">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`min-w-[260px] max-w-sm rounded-lg px-4 py-3 shadow-lg ${getToastStyles(
              toast.type,
            )}`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="text-sm font-medium">{toast.message}</div>
              <button
                type="button"
                onClick={() => removeToast(toast.id)}
                className="text-gray-400 hover:text-gray-600 text-lg leading-none"
                aria-label="Cerrar notificación"
              >
                ×
              </button>
            </div>
          </div>
        ))}
      </div>
    </NotificationContext.Provider>
  )
}

export const useNotifications = () => {
  const context = useContext(NotificationContext)
  if (!context) {
    throw new Error('useNotifications debe usarse dentro de NotificationProvider')
  }
  return context
}
