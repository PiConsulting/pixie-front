const API_BASE = import.meta.env.VITE_API_BASE_URL || ''
const API_KEY = import.meta.env.VITE_API_KEY || ''
const TIMEOUT = Number(import.meta.env.VITE_API_TIMEOUT || 10000)

function timeoutFetch(resource, options = {}) {
  const controller = new AbortController()
  const id = setTimeout(() => controller.abort(), TIMEOUT)
  return fetch(resource, {...options, signal: controller.signal}).finally(() => clearTimeout(id))
}

export async function api(path, {method = 'GET', body = null, headers = {}, ...rest} = {}) {
  const url = path.startsWith('http') ? path : `${API_BASE}${path}`

  const baseHeaders = {
    'Content-Type': 'application/json',
  }

  // Attach Authorization header when API_KEY is available
  if (API_KEY) {
    baseHeaders['Authorization'] = API_KEY
  }

  const res = await timeoutFetch(url, {
    method,
    headers: {...baseHeaders, ...headers},
    body: body ? JSON.stringify(body) : null,
    ...rest,
  })

  if (!res.ok) {
    const text = await res.text().catch(() => null)
    const err = new Error(`API error ${res.status}: ${res.statusText}`)
    err.status = res.status
    err.body = text
    throw err
  }

  // try parse json, otherwise return text
  const ct = res.headers.get('content-type') || ''
  if (ct.includes('application/json')) return res.json()
  return res.text()
}

export default api
