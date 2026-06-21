import { Link, useLocation } from 'react-router-dom'
import { useAuth, UserButton, SignInButton } from '@clerk/react'

export default function Navbar() {
  const { isSignedIn, isLoaded } = useAuth()
  const location = useLocation()

  const linkClass = (path: string) =>
    `nav-link${location.pathname === path ? ' active' : ''}`

  return (
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
              <button className="btn-primary">Get Started</button>
            </SignInButton>
          ) : null}
        </div>
      </div>
    </nav>
  )
}
