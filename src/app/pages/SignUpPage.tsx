import { SignUp } from '@clerk/react'

export default function SignUpPage() {
  return (
    <div className="auth-page">
      <div className="auth-container">
        <SignUp
          appearance={{
            elements: {
              card: 'auth-card',
              headerTitle: 'auth-header-title',
              headerSubtitle: 'auth-header-subtitle',
              formFieldInput: 'auth-input',
              formButtonPrimary: 'auth-submit-btn',
              footerActionLink: 'auth-footer-link',
            },
          }}
          signInUrl="/sign-in"
        />
      </div>
    </div>
  )
}
