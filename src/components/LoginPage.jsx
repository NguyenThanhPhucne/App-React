"use client"
import { useState } from "react"
function LoginPage({ navigateTo, navigateBack, canGoBack }) {
  const [formData, setFormData] = useState({
    account: "",
    password: "",
  })
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }
  const handleSubmit = (e) => {
    e.preventDefault()
    console.log("Login data:", formData)
  }
  const handleSocialLogin = (provider) => {
    console.log(`Login with ${provider}`)
  }
  const isFormValid = formData.account && formData.password

  return (
    <div className="auth-container">
      {/* Form Section */}
      <div className="form-section">
        {canGoBack && (
          // Button
          <button className="back-button" onClick={navigateBack} type="button">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </button>
        )}

        <div className="form-wrapper">
          <h1 className="form-title">Sign In</h1>

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="input-group">
              <label className="input-label">Account</label>
              <input
                type="text"
                name="account"
                className="input-field"
                placeholder="Enter..."
                value={formData.account}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="input-group">
              <label className="input-label">Password</label>
              <input
                type="password"
                name="password"
                className="input-field"
                placeholder="Enter..."
                value={formData.password}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="forgot-password">
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault()
                }}
              >
                Forgot password?
              </a>
            </div>

            <button type="submit" className={`submit-button ${isFormValid ? "active" : ""}`} disabled={!isFormValid}>
              Sign In
            </button>
          </form>

          <div className="divider">Or</div>

          <div className="social-buttons">
            <button className="social-button email" onClick={() => navigateTo("signup", { step: "email" })}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
              Sign in with Email & Phone
            </button>
            <div style={{ display: "flex", gap: "0.75rem" }}>
              <button className="social-button google" style={{ flex: 1 }} onClick={() => handleSocialLogin("google")}>
                {/* Logo Google */}
                <svg width="18" height="18" viewBox="0 0 24 24">
                  <path
                    fill="#4285f4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34a853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#fbbc05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#ea4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Google
              </button>
              <button
                className="social-button facebook"
                style={{ flex: 1 }}
                onClick={() => handleSocialLogin("facebook")}
              >
                {/* Logo Fb */}
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                Facebook
              </button>
            </div>
          </div>

          <div className="auth-link">
            Don't have an account?{" "}
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault()
                navigateTo("signup")
              }}
            >
              Sign Up
            </a>
          </div>
        </div>
      </div>

      {/* Background Section */}
      <div className="background-section">
        <div className="background-content">
          <h2 className="background-title">Join Us Today</h2>
          <p className="background-subtitle">Get started for free</p>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
