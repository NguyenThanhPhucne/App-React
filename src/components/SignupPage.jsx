"use client"
import { useState } from "react"
function SignupPage({ navigateTo, navigateBack, navigateReplace, canGoBack, pageData = {} }) {
  const [currentStep, setCurrentStep] = useState(pageData.step || "social")
  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
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
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!")
      return
    }
    console.log("Signup data:", formData)
  }
  const handleSocialSignup = (provider) => {
    console.log(`Signup with ${provider}`)
  }
  const handleBackClick = () => {
    if (currentStep === "form") {
      setCurrentStep("social")
    } else {
      navigateBack()
    }
  }
  const isFormValid = Object.values(formData).every((value) => value.trim() !== "")

  if (currentStep === "social") {
    return (
      <div className="auth-container">
        {/* Form Section */}
        <div className="form-section">
          <button className="back-button" onClick={handleBackClick} type="button">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </button>

          <div className="form-wrapper">
            <h1 className="form-title">Create Account</h1>

            <div className="social-buttons">
              <button className="social-button google" onClick={() => handleSocialSignup("google")}>
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
                Sign up with Google
              </button>
              <button className="social-button facebook" onClick={() => handleSocialSignup("facebook")}>
                {/* Logo Fb */}
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                Sign up with Facebook
              </button>
            </div>

            <div className="divider">Or</div>

            <div className="social-buttons">
              <button className="social-button email" onClick={() => setCurrentStep("form")}>
                Continue with email, phone number
              </button>
            </div>

            <div className="terms-text">
              By creating an account, you agree to accept our <a href="#">Terms of Service</a> and{" "}
              <a href="#">Privacy Policy</a> at ZIM
            </div>

            <div className="auth-link">
              Already have an account?{" "}
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault()
                  navigateReplace("login")
                }}
              >
                Sign In
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

  return (
    <div className="auth-container">
      {/* Form Section */}
      <div className="form-section">
        <button className="back-button" onClick={handleBackClick} type="button">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
        </button>

        <div className="form-wrapper">
          <h1 className="form-title">Create Account</h1>

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="input-group">
              <label className="input-label">Full Name</label>
              <input
                type="text"
                name="fullName"
                className="input-field"
                placeholder="Enter..."
                value={formData.fullName}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="input-group">
              <label className="input-label">Phone Number</label>
              <input
                type="tel"
                name="phoneNumber"
                className="input-field"
                placeholder="Enter..."
                value={formData.phoneNumber}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="input-group">
              <label className="input-label">Email</label>
              <input
                type="email"
                name="email"
                className="input-field"
                placeholder="Enter..."
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="input-group">
              <label className="input-label">Username</label>
              <input
                type="text"
                name="username"
                className="input-field"
                placeholder="Enter..."
                value={formData.username}
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

            <div className="input-group">
              <label className="input-label">Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                className="input-field"
                placeholder="Enter..."
                value={formData.confirmPassword}
                onChange={handleInputChange}
                required
              />
            </div>

            <button type="submit" className={`submit-button ${isFormValid ? "active" : ""}`} disabled={!isFormValid}>
              Sign Up
            </button>
          </form>

          <div className="terms-text">
            By creating an account, you agree to accept our <a href="#">Terms of Service</a> and{" "}
            <a href="#">Privacy Policy</a> at ZIM
          </div>

          <div className="auth-link">
            Already have an account?{" "}
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault()
                navigateReplace("login")
              }}
            >
              Sign In
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

export default SignupPage
