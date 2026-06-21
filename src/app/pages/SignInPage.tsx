import { SignIn } from '@clerk/react'

export default function SignInPage() {
  return (
    <div className="auth-page">
      <div className="auth-container">
        <SignIn
          appearance={{
            elements: {
              card: 'auth-card',
              headerTitle: 'auth-header-title',
              headerSubtitle: 'auth-header-subtitle',
              socialButtonsBlockButton: 'auth-social-btn',
              dividerLine: 'auth-divider',
              formFieldInput: 'auth-input',
              formButtonPrimary: 'auth-submit-btn',
              footerActionLink: 'auth-footer-link',
            },
          }}
          signUpUrl="/sign-up"
        />
      </div>
    </div>
  )
}
