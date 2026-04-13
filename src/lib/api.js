import axios from 'axios'

// ─── Fixed event configuration ────────────────────────────────────────────────
export const EVENT_ID = '4abbcfc1-bba1-4d7b-aae8-17a8fe417fb5'

// En desarrollo el proxy de Vite reenvía /api/* → baseURL real (evita CORS).
// En producción apuntar directamente al servidor.
const BASE_URL = import.meta.env.PROD
  ? 'https://pixie-app-test-bgc7bkgngxfpfpd4.eastus2-01.azurewebsites.net'
  : '/api'
const TOKEN =
  'df54345bf8d4fae4c48e10cb2636bba6c55fca2760f9e11cb64166a7e715f53c9fdde02c22da39d1698ee21885e3cd1e0c4c15887e6d6f65357299327bbfafcf'

// ─── Axios instance ────────────────────────────────────────────────────────────
const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${TOKEN}`,
  },
})

export default apiClient

// ─── Legacy fetch-based helper (kept for backwards compatibility) ──────────────
// const API_BASE = import.meta.env.VITE_API_BASE_URL || ''
// const API_KEY = import.meta.env.VITE_API_KEY || ''
// const TIMEOUT = Number(import.meta.env.VITE_API_TIMEOUT || 10000)
//
// function timeoutFetch(resource, options = {}) {
//   const controller = new AbortController()
//   const id = setTimeout(() => controller.abort(), TIMEOUT)
//   return fetch(resource, {...options, signal: controller.signal}).finally(() => clearTimeout(id))
// }
//
// export async function api(path, {method = 'GET', body = null, headers = {}, ...rest} = {}) {
//   const url = path.startsWith('http') ? path : `${API_BASE}${path}`
//   const baseHeaders = {'Content-Type': 'application/json'}
//   if (API_KEY) baseHeaders['Authorization'] = API_KEY
//   const res = await timeoutFetch(url, {
//     method,
//     headers: {...baseHeaders, ...headers},
//     body: body ? JSON.stringify(body) : null,
//     ...rest,
//   })
//   if (!res.ok) {
//     const text = await res.text().catch(() => null)
//     const err = new Error(`API error ${res.status}: ${res.statusText}`)
//     err.status = res.status
//     err.body = text
//     throw err
//   }
//   const ct = res.headers.get('content-type') || ''
//   if (ct.includes('application/json')) return res.json()
//   return res.text()
// }
