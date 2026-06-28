const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5115'

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
): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  }

  let response: Response
  try {
    response = await fetch(`${API_BASE_URL}/api${endpoint}`, {
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
  get: <T>(endpoint: string) =>
    request<T>(endpoint, { method: 'GET' }),

  post: <T>(endpoint: string, body: unknown) =>
    request<T>(endpoint, { method: 'POST', body: JSON.stringify(body) }),

  put: <T>(endpoint: string, body: unknown) =>
    request<T>(endpoint, { method: 'PUT', body: JSON.stringify(body) }),

  delete: <T>(endpoint: string) =>
    request<T>(endpoint, { method: 'DELETE' }),
}

export { ApiError }
export type { ApiResponse }
