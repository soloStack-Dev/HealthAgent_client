import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from '@clerk/react'
import Layout from './app/components/layout/Layout'
import Home from './app/pages/Home'
import About from './app/pages/About'
import SignInPage from './app/pages/SignInPage'
import SignUpPage from './app/pages/SignUpPage'
import ChatPage from './app/pages/ChatPage'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isSignedIn, isLoaded } = useAuth()
  if (!isLoaded) return null
  if (!isSignedIn) return <Navigate to="/sign-in" replace />
  return <>{children}</>
}

export default function App() {
  return (
    <>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/sign-in" element={<SignInPage />} />
          <Route path="/sign-up" element={<SignUpPage />} />
          <Route
            path="/chat"
            element={
              <ProtectedRoute>
                <ChatPage />
              </ProtectedRoute>
            }
          />
        </Route>
      </Routes>
    </>
  )
}
