"use client"

import { useState } from "react"
import { MdArrowBack } from "react-icons/md"
import { SiGoogle, SiFacebook } from "react-icons/si"

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
            {/* Icon Back */}
            <MdArrowBack size={20} />
          </button>

          <div className="form-wrapper">
            <h1 className="form-title">Create Account</h1>

            <div className="social-buttons">
              <button className="social-button google" onClick={() => handleSocialSignup("google")}> 
                {/* Logo Google */}
                <SiGoogle size={18} color="#4285F4" />
                Sign up with Google
              </button>
              <button className="social-button facebook" onClick={() => handleSocialSignup("facebook")}> 
                {/* Logo Fb */}
                <SiFacebook size={18} color="#1877F2" />
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
          {/* Icon Back */}
          <MdArrowBack size={20} />
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
            <a href="#">Privacy Policy</a> at My Application.
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