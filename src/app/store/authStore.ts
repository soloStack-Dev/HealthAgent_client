import { create } from 'zustand'

interface AuthState {
  isSignedIn: boolean
  userId: string | null
  userEmail: string | null
  userName: string | null
  setUser: (user: { id: string; email: string | null; name: string | null }) => void
  clearUser: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  isSignedIn: false,
  userId: null,
  userEmail: null,
  userName: null,
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
}))
