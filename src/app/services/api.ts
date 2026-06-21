import { useAuthStore } from '../store/authStore'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5115/api'

interface ApiResponse<T> {
  success: boolean
  message?: string
  data?: T
  error?: string
}

class ApiError extends Error {
  status: number
  details?: string
  constructor(message: string, status: number, details?: string) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.details = details
  }
}

async function request<T>(
  endpoint: string,
  options: RequestInit = {},
  token?: string | null,
): Promise<T> {
  const effectiveToken = token ?? useAuthStore.getState().backendToken

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  }

  if (effectiveToken) {
    headers['Authorization'] = `Bearer ${effectiveToken}`
  }

  let response: Response
  try {
    response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    })
  } catch {
    throw new ApiError(
      'Unable to reach the server. Make sure the backend is running.',
      0,
    )
  }

  let data: ApiResponse<T>
  try {
    data = await response.json()
  } catch {
    const text = await response.text().catch(() => '')
    throw new ApiError(
      response.status === 401
        ? 'Authentication failed. Please sign in again.'
        : `Server error (${response.status})`,
      response.status,
      text.slice(0, 200),
    )
  }

  if (!response.ok || !data.success) {
    const msg =
      data.error ||
      data.message ||
      (response.status === 401
        ? 'Session expired. Please sign in again.'
        : 'Request failed')
    throw new ApiError(msg, response.status)
  }

  return data.data as T
}

export const api = {
  get: <T>(endpoint: string, token?: string | null) =>
    request<T>(endpoint, { method: 'GET' }, token),

  post: <T>(endpoint: string, body: unknown, token?: string | null) =>
    request<T>(endpoint, { method: 'POST', body: JSON.stringify(body) }, token),

  put: <T>(endpoint: string, body: unknown, token?: string | null) =>
    request<T>(endpoint, { method: 'PUT', body: JSON.stringify(body) }, token),

  delete: <T>(endpoint: string, token?: string | null) =>
    request<T>(endpoint, { method: 'DELETE' }, token),
}

export { ApiError }
export type { ApiResponse }
