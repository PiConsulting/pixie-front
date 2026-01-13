// Simple pub/sub so business logic can emit notifications without UI dependencies.
const listeners = new Set()
const config = {
  preventDuplicate: true,
  dedupeWindowMs: 400,
}
let lastNotification = null

const subscribe = (listener) => {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

const shouldSkip = (payload) => {
  if (!config.preventDuplicate) return false
  if (!lastNotification) return false
  const isSame =
    lastNotification.message === payload.message && lastNotification.type === payload.type
  const withinWindow = Date.now() - lastNotification.timestamp < config.dedupeWindowMs
  return isSame && withinWindow
}

const notify = (payload) => {
  if (shouldSkip(payload)) return
  lastNotification = {...payload, timestamp: Date.now()}
  listeners.forEach((listener) => listener(payload))
}

const notifySuccess = (message) => notify({type: 'success', message})
const notifyError = (message) => notify({type: 'error', message})
const notifyInfo = (message) => notify({type: 'info', message})

export const notificationService = {
  subscribe,
  notifySuccess,
  notifyError,
  notifyInfo,
}
