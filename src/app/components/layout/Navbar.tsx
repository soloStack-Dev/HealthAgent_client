import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth, UserButton, SignInButton } from '@clerk/react'

export default function Navbar() {
  const { isSignedIn, isLoaded } = useAuth()
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    setMenuOpen(false)
  }, [location.pathname])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  const linkClass = (path: string) =>
    `nav-link${location.pathname === path ? ' active' : ''}`

  return (
    <>
      <nav className="navbar">
        <div className="navbar-container">
          <Link to="/" className="navbar-brand">
            <span className="brand-icon">+</span>
            <span className="brand-text">HealthRec</span>
          </Link>

          <div className="navbar-links">
            <Link to="/" className={linkClass('/')}>Home</Link>
            <Link to="/about" className={linkClass('/about')}>About</Link>
            {isLoaded && !isSignedIn && (
              <Link to="/sign-in" className={linkClass('/sign-in')}>Sign In</Link>
            )}
          </div>

          <div className="navbar-actions">
            {isLoaded && isSignedIn ? (
              <UserButton />
            ) : isLoaded ? (
              <SignInButton mode="modal">
                <button className="btn-primary nav-cta">Get Started</button>
              </SignInButton>
            ) : null}
            <button
              className={`mobile-menu-btn ${menuOpen ? 'open' : ''}`}
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            >
              <span /><span /><span />
            </button>
          </div>
        </div>
      </nav>

      <div className={`mobile-overlay ${menuOpen ? 'visible' : ''}`} onClick={() => setMenuOpen(false)} />
      <div className={`mobile-menu ${menuOpen ? 'open' : ''}`}>
        <div className="mobile-menu-header">
          <span className="brand-text">HealthRec</span>
        </div>
        <div className="mobile-menu-links">
          <Link to="/" className={`mobile-nav-link${location.pathname === '/' ? ' active' : ''}`}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
            Home
          </Link>
          <Link to="/about" className={`mobile-nav-link${location.pathname === '/about' ? ' active' : ''}`}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
            About
          </Link>
          {isLoaded && !isSignedIn ? (
            <Link to="/sign-in" className={`mobile-nav-link${location.pathname === '/sign-in' ? ' active' : ''}`}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>
              Sign In
            </Link>
          ) : null}
          {isLoaded && isSignedIn && (
            <Link to="/chat" className={`mobile-nav-link${location.pathname === '/chat' ? ' active' : ''}`}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
              Chat
            </Link>
          )}
        </div>
        <div className="mobile-menu-footer">
          {isLoaded && !isSignedIn && (
            <SignInButton mode="modal">
              <button className="btn-primary btn-lg mobile-signin-btn">Get Started</button>
            </SignInButton>
          )}
        </div>
      </div>
    </>
  )
}
