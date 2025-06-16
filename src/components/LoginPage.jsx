"use client"

import { useState } from "react"
import { MdArrowBack, MdEmail } from "react-icons/md"
import { SiGoogle, SiFacebook } from "react-icons/si"

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
            {/* Icon Back */}
            <MdArrowBack size={20} />
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
              <a href="#" onClick={(e) => e.preventDefault()}>
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
              {/* Logo Email */}
              <MdEmail size={20} />
              Sign in with Email & Phone
            </button>

            <div style={{ display: "flex", gap: "0.75rem" }}>
              <button className="social-button google" style={{ flex: 1 }} onClick={() => handleSocialLogin("google")}> 
                {/* Logo Google */}
                <SiGoogle size={18} color="#4285F4" />
                Google
              </button>
              <button className="social-button facebook" style={{ flex: 1 }} onClick={() => handleSocialLogin("facebook")}> 
                {/* Logo Fb */}
                <SiFacebook size={18} color="#1877F2" />
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