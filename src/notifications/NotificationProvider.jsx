import React, {createContext, useCallback, useContext, useEffect, useMemo, useRef, useState} from 'react'
import {notificationService} from './notificationService'

const NotificationContext = createContext(null)
// Exit duration matches the CSS fade-out so removal feels smooth.
const TOAST_EXIT_DURATION_MS = 650

const getToastStyles = (type) => {
  if (type === 'success') return 'border-l-4 border-green-500 bg-green-50 text-green-900'
  if (type === 'error') return 'border-l-4 border-red-500 bg-red-50 text-red-900'
  return 'border-l-4 border-blue-500 bg-blue-50 text-blue-900'
}

const getDetailedMessage = (message) => {
  if (!message || typeof message !== 'object') return null
  if (!('title' in message) || !('body' in message)) return null
  return message
}

const getBodyLines = (body) => {
  if (!body) return []
  if (Array.isArray(body)) return body
  if (typeof body === 'string') return body.split('\n')
  return [String(body)]
}

const createToastId = () => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID()
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`
}

export const NotificationProvider = ({children, autoCloseMs = 3500}) => {
  const [toasts, setToasts] = useState([])
  const timeoutsRef = useRef(new Map())
  const toastRefs = useRef(new Map())

  const getToastExitMetrics = useCallback((id) => {
    const node = toastRefs.current.get(id)
    if (!node) return null
    return {
      exitOffsetTop: node.offsetTop,
      exitWidth: node.offsetWidth,
    }
  }, [])

  const clearToastTimeouts = useCallback((id) => {
    const timeouts = timeoutsRef.current.get(id)
    if (!timeouts) return
    if (timeouts.autoCloseId) clearTimeout(timeouts.autoCloseId)
    if (timeouts.removeId) clearTimeout(timeouts.removeId)
    timeoutsRef.current.delete(id)
  }, [])

  const finalizeToastRemoval = useCallback(
    (id) => {
      setToasts((current) => current.filter((toast) => toast.id !== id))
      clearToastTimeouts(id)
    },
    [clearToastTimeouts],
  )

  const beginToastExit = useCallback(
    (id) => {
      const exitMetrics = getToastExitMetrics(id) || {}
      let shouldScheduleRemoval = false
      setToasts((current) => {
        const index = current.findIndex((toast) => toast.id === id)
        if (index === -1 || current[index].isExiting) return current
        const next = [...current]
        // Capture the current position so the toast can fade out without shifting the stack.
        next[index] = {...current[index], isExiting: true, ...exitMetrics}
        shouldScheduleRemoval = true
        return next
      })
      if (!shouldScheduleRemoval) return
      const existing = timeoutsRef.current.get(id)
      if (existing?.autoCloseId) clearTimeout(existing.autoCloseId)
      if (existing?.removeId) {
        timeoutsRef.current.set(id, {autoCloseId: null, removeId: existing.removeId})
        return
      }
      const removeId = setTimeout(() => finalizeToastRemoval(id), TOAST_EXIT_DURATION_MS)
      timeoutsRef.current.set(id, {autoCloseId: null, removeId})
    },
    [finalizeToastRemoval, getToastExitMetrics],
  )

  useEffect(() => {
    // Subscribe to the service so any layer can push notifications without UI coupling.
    const unsubscribe = notificationService.subscribe((payload) => {
      const id = createToastId()
      setToasts((current) => [...current, {...payload, id, isExiting: false}])
      const autoCloseDelayMs = Math.max(0, autoCloseMs - TOAST_EXIT_DURATION_MS)
      // Start the exit a bit earlier so total lifetime matches the existing auto-close.
      const autoCloseId = setTimeout(() => beginToastExit(id), autoCloseDelayMs)
      timeoutsRef.current.set(id, {autoCloseId, removeId: null})
    })

    return () => {
      unsubscribe()
      timeoutsRef.current.forEach((timeouts) => {
        if (timeouts.autoCloseId) clearTimeout(timeouts.autoCloseId)
        if (timeouts.removeId) clearTimeout(timeouts.removeId)
      })
      timeoutsRef.current.clear()
    }
  }, [autoCloseMs, beginToastExit])

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
        {toasts.map((toast) => {
          const detailedMessage = getDetailedMessage(toast.message)
          const bodyLines = detailedMessage ? getBodyLines(detailedMessage.body) : []
          const variant = detailedMessage?.variant
          const isProductAdded = toast.type === 'success' && variant === 'product-added'
          const isWinnerNotified = toast.type === 'success' && variant === 'winner-notified'
          const isProductDeleted = toast.type === 'info' && variant === 'product-deleted'
          const fallbackMessage =
            typeof toast.message === 'string'
              ? toast.message
              : detailedMessage
              ? [detailedMessage.title, ...bodyLines].join(' ')
              : ''
          const exitStyle =
            toast.isExiting && toast.exitOffsetTop != null
              ? {
                  position: 'absolute',
                  top: `${toast.exitOffsetTop}px`,
                  right: 0,
                  width: toast.exitWidth ? `${toast.exitWidth}px` : undefined,
                }
              : undefined

          return (
            <div
              key={toast.id}
              ref={(node) => {
                if (node) toastRefs.current.set(toast.id, node)
                else toastRefs.current.delete(toast.id)
              }}
              style={exitStyle}
              className={
                isProductAdded || isWinnerNotified
                  ? `w-[360px] max-w-[92vw] rounded-[6px] border border-[#6BD97F] bg-[#D7FBE0] px-4 py-3 shadow-[0_4px_10px_rgba(0,0,0,0.15)] ${
                      toast.isExiting ? 'toast-exit' : 'toast-enter'
                    }`
                  : isProductDeleted
                  ? `w-[360px] max-w-[92vw] rounded-[6px] border border-[#E7A0A0] bg-[#F4C6C6] px-4 py-3 shadow-[0_4px_10px_rgba(0,0,0,0.15)] ${
                      toast.isExiting ? 'toast-exit' : 'toast-enter'
                    }`
                  : `min-w-[260px] max-w-sm rounded-lg px-4 py-3 shadow-lg ${getToastStyles(
                      toast.type,
                    )} ${toast.isExiting ? 'toast-exit' : 'toast-enter'}`
              }
            >
              {isProductAdded || isWinnerNotified ? (
                // Custom layout for the updated success notifications (producto cargado / notificación enviada).
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 text-[#2F8E3A]">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      className="h-5 w-5"
                      aria-hidden="true"
                    >
                      <path
                        d="M5 13l4 4L19 7"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                  <div className="flex-1">
                    <div className="text-[14px] font-medium leading-[18px] text-[#2F8E3A]">
                      {detailedMessage.title}
                    </div>
                    <div className="mt-0.5 text-[13px] leading-[18px] text-[#2F8E3A]">
                      {detailedMessage.body}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => beginToastExit(toast.id)}
                    className="mt-0.5 text-[#2F8E3A] transition-colors hover:text-[#23712F]"
                    aria-label="Cerrar notificación"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      className="h-4 w-4"
                      aria-hidden="true"
                    >
                      <path
                        d="M6 6l12 12M18 6l-12 12"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                    </svg>
                  </button>
                </div>
              ) : isProductDeleted ? (
                // Custom layout for the updated "producto eliminado" notification.
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 text-[#D05252]">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      className="h-5 w-5"
                      aria-hidden="true"
                    >
                      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
                      <path
                        d="M9 9l6 6M15 9l-6 6"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                    </svg>
                  </span>
                  <div className="flex-1">
                    <div className="text-[14px] font-medium leading-[18px] text-[#D05252]">
                      {detailedMessage.title}
                    </div>
                    {bodyLines.map((line, index) => (
                      <div
                        key={`${line}-${index}`}
                        className={`text-[13px] leading-[18px] text-[#9B4A4A]${
                          index === 0 ? ' mt-0.5' : ''
                        }`}
                      >
                        {line}
                      </div>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={() => beginToastExit(toast.id)}
                    className="mt-0.5 text-[#D05252] transition-colors hover:text-[#B94646]"
                    aria-label="Cerrar notificación"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      className="h-4 w-4"
                      aria-hidden="true"
                    >
                      <path
                        d="M6 6l12 12M18 6l-12 12"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                    </svg>
                  </button>
                </div>
              ) : (
                <div className="flex items-start justify-between gap-3">
                  <div className="text-sm font-medium">{fallbackMessage}</div>
                  <button
                    type="button"
                    onClick={() => beginToastExit(toast.id)}
                    className="text-gray-400 hover:text-gray-600 text-lg leading-none"
                    aria-label="Cerrar notificación"
                  >
                    ×
                  </button>
                </div>
              )}
            </div>
          )
        })}
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
