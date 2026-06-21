export default function About() {
  return (
    <div className="about-page">
      <section className="about-hero">
        <h1 className="animate-fade-in">About HealthRec</h1>
        <p className="animate-fade-in">
          Empowering individuals with AI-driven health insights and recommendations.
        </p>
      </section>

      <section className="about-content">
        <div className="about-grid">
          <div className="about-card animate-on-scroll">
            <h2>Our Mission</h2>
            <p>
              We aim to make health information accessible, understandable, and actionable
              for everyone. Using advanced AI, we provide personalized health recommendations
              based on your symptoms and medical history.
            </p>
          </div>
          <div className="about-card animate-on-scroll">
            <h2>How It Works</h2>
            <p>
              Simply describe your symptoms, and our AI analyzes them against a vast medical
              knowledge base. You receive potential condition insights, health tips, and
              recommendations — all in seconds.
            </p>
          </div>
          <div className="about-card animate-on-scroll">
            <h2>Privacy First</h2>
            <p>
              Your health data is encrypted end-to-end. We never share your personal
              information with third parties. Complete confidentiality is our promise.
            </p>
          </div>
          <div className="about-card animate-on-scroll">
            <h2>Disclaimer</h2>
            <p>
              HealthRec is for informational purposes only and does not constitute medical
              advice. Always consult a qualified healthcare professional for medical decisions.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
