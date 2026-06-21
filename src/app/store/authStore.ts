import { create } from 'zustand'

export type BackendAuthStatus = 'idle' | 'syncing' | 'synced' | 'error'

interface AuthState {
  isSignedIn: boolean
  userId: string | null
  userEmail: string | null
  userName: string | null
  backendToken: string | null
  backendRefreshToken: string | null
  backendAuthStatus: BackendAuthStatus
  backendAuthError: string | null
  setUser: (user: { id: string; email: string | null; name: string | null }) => void
  clearUser: () => void
  setBackendAuth: (token: string, refreshToken: string) => void
  clearBackendAuth: () => void
  setBackendAuthStatus: (status: BackendAuthStatus, error?: string | null) => void
}

export const useAuthStore = create<AuthState>((set) => ({
  isSignedIn: false,
  userId: null,
  userEmail: null,
  userName: null,
  backendToken: null,
  backendRefreshToken: null,
  backendAuthStatus: 'idle',
  backendAuthError: null,
  setUser: (user) =>
    set({
      isSignedIn: true,
      userId: user.id,
      userEmail: user.email,
      userName: user.name,
    }),
  clearUser: () =>
    set({
      isSignedIn: false,
      userId: null,
      userEmail: null,
      userName: null,
    }),
  setBackendAuth: (token, refreshToken) =>
    set({ backendToken: token, backendRefreshToken: refreshToken, backendAuthStatus: 'synced', backendAuthError: null }),
  clearBackendAuth: () =>
    set({ backendToken: null, backendRefreshToken: null, backendAuthStatus: 'idle', backendAuthError: null }),
  setBackendAuthStatus: (status, error) =>
    set({ backendAuthStatus: status, backendAuthError: error ?? null }),
}))
