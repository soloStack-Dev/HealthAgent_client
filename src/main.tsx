import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ClerkProvider } from '@clerk/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import ErrorBoundary from './app/components/ErrorBoundary'
import App from './App.tsx'
import './index.css'

const CLERK_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!CLERK_KEY) {
  console.error('VITE_CLERK_PUBLISHABLE_KEY is not set. Add it to .env file.')
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000,
    },
  },
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <ClerkProvider
        publishableKey={CLERK_KEY || 'pk_test_cGxlYXNpbmctcGhvZW5peC02NS5jbGVyay5hY2NvdW50cy5kZXYk'}
        afterSignOutUrl="/"
      >
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </QueryClientProvider>
      </ClerkProvider>
    </ErrorBoundary>
  </StrictMode>,
)
