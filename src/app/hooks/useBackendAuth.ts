import { useEffect, useRef } from 'react'
import { useAuth as useClerkAuth, useUser } from '@clerk/react'
import { api } from '../services/api'
import { useAuthStore } from '../store/authStore'

function generatePassword(userId: string): string {
  const prefix = 'HealthRec_'
  const hash = userId.replace(/-/g, '').slice(0, 16)
  return `${prefix}${hash}_Secure!`
}

export function useBackendAuth() {
  const { isSignedIn: clerkSignedIn, isLoaded: clerkLoaded } = useClerkAuth()
  const { isLoaded: userLoaded, isSignedIn: userSignedIn, user } = useUser()
  const isSignedIn = clerkSignedIn && userSignedIn
  const isLoaded = clerkLoaded && userLoaded
  const backendToken = useAuthStore((s) => s.backendToken)
  const backendAuthStatus = useAuthStore((s) => s.backendAuthStatus)
  const syncing = useRef(false)
  const clerkUserId = user?.id

  useEffect(() => {
    if (!isLoaded || syncing.current) return

    if (!isSignedIn || !clerkUserId) {
      const { clearUser, clearBackendAuth } = useAuthStore.getState()
      clearUser()
      clearBackendAuth()
      return
    }

    const email = user!.primaryEmailAddress?.emailAddress ?? null
    if (!email) return

    const name = user!.fullName ?? email.split('@')[0] ?? 'User'
    const { setUser } = useAuthStore.getState()
    setUser({ id: clerkUserId, email, name })

    if (backendToken) return
    if (backendAuthStatus !== 'idle') return

    syncing.current = true
    const { setBackendAuthStatus, setBackendAuth } = useAuthStore.getState()
    setBackendAuthStatus('syncing')
    const password = generatePassword(clerkUserId)

    const tryLogin = () =>
      api.post<{ token: string; refreshToken: string }>('/auth/login', { email, password })

    const tryRegister = () =>
      api.post<{ token: string; refreshToken: string }>('/auth/register', {
        email,
        password,
        fullName: name,
      })

    tryLogin()
      .catch(() => tryRegister())
      .then((data) => {
        if (data?.token) {
          setBackendAuth(data.token, data.refreshToken)
        } else {
          setBackendAuthStatus('error', 'Backend returned no token')
        }
      })
      .catch((err: Error) => {
        const msg = err.message || 'Unable to connect to backend server'
        setBackendAuthStatus('error', msg)
      })
      .finally(() => {
        syncing.current = false
      })
  }, [isLoaded, isSignedIn, clerkUserId, backendToken, backendAuthStatus])
}
