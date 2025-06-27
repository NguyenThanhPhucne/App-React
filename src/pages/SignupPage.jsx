"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { MdArrowBack } from "react-icons/md"
import { SiGoogle, SiFacebook } from "react-icons/si"
import { MdEmail } from "react-icons/md"
import { useForm } from "../hooks/useForm"

const SignupPage = () => {
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState("social")

  const { values, handleChange, handleSubmit, isValid } = useForm(
    {
      fullName: "",
      phoneNumber: "",
      email: "",
      username: "",
      password: "",
      confirmPassword: "",
    },
    {
      fullName: { required: true },
      phoneNumber: { required: true },
      email: { required: true, email: true },
      username: { required: true },
      password: { required: true, minLength: 6 },
      confirmPassword: { required: true, match: "password" },
    },
  )

  const onSubmit = async (data) => {
    console.log("Signup data:", data)
    navigate("/app")
  }

  const handleSocialSignup = (provider) => {
    console.log(`Signup with ${provider}`)
    navigate("/app")
  }

  const handleBack = () => {
    if (currentStep === "form") {
      setCurrentStep("social")
    } else {
      navigate("/")
    }
  }

  if (currentStep === "social") {
    return (
      <div className="auth-container">
        <div className="form-section">
          <button className="back-button" onClick={handleBack} type="button">
            <MdArrowBack size={20} />
          </button>

          <div className="form-wrapper">
            <h1 className="form-title">Create Account</h1>

            <div className="social-buttons">
              <button className="social-button google" onClick={() => handleSocialSignup("google")}>
                <SiGoogle size={18} />
                Sign up with Google
              </button>

              <button className="social-button facebook" onClick={() => handleSocialSignup("facebook")}>
                <SiFacebook size={18} />
                Sign up with Facebook
              </button>
            </div>

            <div className="divider">Or</div>

            <div className="social-buttons">
              <button className="social-button email" onClick={() => setCurrentStep("form")}>
                <MdEmail size={20} />
                Continue with email, phone number
              </button>
            </div>

            <div className="terms-text">
              By creating an account, you agree to accept our <a href="#">Terms of Service</a> and{" "}
              <a href="#">Privacy Policy</a> at My Application
            </div>

            <div className="auth-link">
              Already have an account?{" "}
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault()
                  navigate("/login")
                }}
              >
                Sign In
              </a>
            </div>
          </div>
        </div>

        <div className="background-section">
          <div className="background-content">
            <h2 className="background-title">Join Us Today</h2>
            <p className="background-subtitle">Get started for free</p>
          </div>
        </div>
      </div>
    )
  }

  const formFields = [
    { name: "fullName", label: "Full Name", type: "text" },
    { name: "phoneNumber", label: "Phone Number", type: "tel" },
    { name: "email", label: "Email", type: "email" },
    { name: "username", label: "Username", type: "text" },
    { name: "password", label: "Password", type: "password" },
    { name: "confirmPassword", label: "Confirm Password", type: "password" },
  ]

  return (
    <div className="auth-container">
      <div className="form-section">
        <button className="back-button" onClick={handleBack} type="button">
          <MdArrowBack size={20} />
        </button>

        <div className="form-wrapper">
          <h1 className="form-title">Create Account</h1>

          <form
            className="auth-form"
            onSubmit={(e) => {
              e.preventDefault()
              handleSubmit(onSubmit)
            }}
          >
            {formFields.map((field) => (
              <div key={field.name} className="input-group">
                <label className="input-label">{field.label}</label>
                <input
                  className="input-field"
                  name={field.name}
                  type={field.type}
                  placeholder="Enter..."
                  value={values[field.name]}
                  onChange={handleChange}
                  required
                />
              </div>
            ))}

            <button type="submit" className={`submit-button ${isValid ? "active" : ""}`} disabled={!isValid}>
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
                navigate("/login")
              }}
            >
              Sign In
            </a>
          </div>
        </div>
      </div>

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
