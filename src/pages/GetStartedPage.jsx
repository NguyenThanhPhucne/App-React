"use client"

import { useNavigate } from "react-router-dom"
import "../styles/getstarted.css"

const GetStartedPage = () => {
  const navigate = useNavigate()

  const shapes = Array.from({ length: 5 }, (_, i) => <div key={i} className={`shape shape-${i + 1}`} />)

  return (
    <div className="enhanced-fullscreen-container">
      <div className="floating-shapes">{shapes}</div>

      <div className="enhanced-top-nav">
        <div className="nav-left" />
        <div className="nav-right">
          <button className="enhanced-signin-button" onClick={() => navigate("/login")}>
            Sign In
          </button>
        </div>
      </div>

      <div className="enhanced-content">
        <div className="content-wrapper">
          <h1 className="enhanced-title">
            <span className="title-line">Transform Your</span>
            <span className="title-line gradient-text">Digital Experience</span>
          </h1>
          <p className="enhanced-subtitle">Welcome to My Application. Start your journey today.</p>
          <div className="cta-section">
            <button className="enhanced-cta-button" onClick={() => navigate("/signup")}>
              <span className="button-text">Get Started Free</span>
              <div className="button-glow" />
            </button>
          </div>
        </div>
      </div>

      <div className="bottom-decoration">
        <div className="decoration-line" />
      </div>
    </div>
  )
}

export default GetStartedPage
