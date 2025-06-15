"use client"
function GetStartedPage({ navigateTo, navigateBack, canGoBack }) {
  const handleGetStarted = (type) => {
    if (type === "signup") {
      navigateTo("signup")
    } else if (type === "login") {
      navigateTo("login")
    }
  }
  return (
    <div className="enhanced-fullscreen-container">
      {/* Animated Background Elements */}
      <div className="floating-shapes">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
        <div className="shape shape-3"></div>
        <div className="shape shape-4"></div>
        <div className="shape shape-5"></div>
      </div>
      {/* Top Navigation */}
      <div className="enhanced-top-nav">
        <div className="nav-left">
          {canGoBack}
        </div>
        <div className="nav-right">
          <button className="enhanced-signin-button" onClick={() => handleGetStarted("login")}>
            <span>Sign In</span>
          </button>
        </div>
      </div>
      {/* Main Content */}
      <div className="enhanced-content">
        <div className="content-wrapper">
          <h1 className="enhanced-title">
            <span className="title-line">Transform Your</span>
            <span className="title-line gradient-text">Digital Experience</span>
          </h1>
          <p className="enhanced-subtitle">
            Welcome to My Application. Start your journey today.
          </p>
          <div className="cta-section">
            <button className="enhanced-cta-button" onClick={() => handleGetStarted("signup")}>
              <span className="button-text">Get Started Free</span>
              <div className="button-glow"></div>
            </button>
          </div>
        </div>
      </div>
      {/* Bottom Decoration */}
      <div className="bottom-decoration">
        <div className="decoration-line"></div>
      </div>
    </div>
  )
}

export default GetStartedPage
