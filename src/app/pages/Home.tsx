import { Link } from 'react-router-dom'
import { useAuth, SignInButton } from '@clerk/react'
import heroImg from '../../assets/hero.png'

export default function Home() {
  const { isSignedIn, isLoaded } = useAuth()

  return (
    <div className="home-page">
      <section className="hero-section">
        <div className="hero-content animate-fade-in">
          <div className="hero-badge">AI-Powered Health Assistant</div>
          <h1 className="hero-title">
            Your Personal <span className="gradient-text">Health Recommendation</span> System
          </h1>
          <p className="hero-description">
            Get intelligent, personalized health recommendations based on your symptoms,
            medical history, and lifestyle. Powered by advanced AI for accurate insights.
          </p>
          <div className="hero-actions">
            {isLoaded && isSignedIn ? (
              <Link to="/chat" className="btn-primary btn-lg">
                Start Consultation
              </Link>
            ) : (
              <SignInButton mode="modal">
                <button className="btn-primary btn-lg">
                  Get Started Free
                </button>
              </SignInButton>
            )}
            <Link to="/about" className="btn-secondary btn-lg">
              Learn More
            </Link>
          </div>
          <div className="hero-stats">
            <div className="stat-item">
              <span className="stat-number">10K+</span>
              <span className="stat-label">Users</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">98%</span>
              <span className="stat-label">Accuracy</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">24/7</span>
              <span className="stat-label">Support</span>
            </div>
          </div>
        </div>
        <div className="hero-visual animate-slide-in">
          <div className="hero-image-wrapper">
            <div className="hero-image-glow" />
            <div className="hero-image-frame">
              <img src={heroImg} alt="Health recommendation illustration" className="hero-image" />
            </div>
            <div className="floating-card card-1">
              <div className="card-dot" />
              <span>Symptom Analysis</span>
            </div>
            <div className="floating-card card-2">
              <div className="card-dot" />
              <span>Health Tips</span>
            </div>
            <div className="floating-card card-3">
              <div className="card-dot" />
              <span>AI Insights</span>
            </div>
          </div>
        </div>
      </section>

      <section className="features-section">
        <h2 className="section-title">Why Choose HealthRec?</h2>
        <p className="section-subtitle">Powered by cutting-edge AI technology</p>
        <div className="features-grid">
          <div className="feature-card animate-on-scroll">
            <div className="feature-icon symptoms" />
            <h3>Symptom Analysis</h3>
            <p>Describe your symptoms and get instant AI-powered analysis and potential condition insights.</p>
          </div>
          <div className="feature-card animate-on-scroll">
            <div className="feature-icon tips" />
            <h3>Health Tips</h3>
            <p>Receive personalized health recommendations and wellness tips based on your profile.</p>
          </div>
          <div className="feature-card animate-on-scroll">
            <div className="feature-icon private" />
            <h3>100% Private</h3>
            <p>Your health data is encrypted and never shared. Complete privacy and security guaranteed.</p>
          </div>
          <div className="feature-card animate-on-scroll">
            <div className="feature-icon resources" />
            <h3>Medical Resources</h3>
            <p>Access curated medical resources and articles relevant to your health concerns.</p>
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="cta-container">
          <h2>Ready to Take Control of Your Health?</h2>
          <p>Join thousands of users who trust HealthRec for their health recommendations.</p>
          {isLoaded && !isSignedIn ? (
            <SignInButton mode="modal">
              <button className="btn-primary btn-lg">Start Your Journey</button>
            </SignInButton>
          ) : (
            <Link to="/chat" className="btn-primary btn-lg">Start Your Journey</Link>
          )}
        </div>
      </section>
    </div>
  )
}
