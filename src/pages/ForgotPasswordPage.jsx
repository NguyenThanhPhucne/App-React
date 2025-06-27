"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { MdArrowBack, MdEmail } from "react-icons/md"
import { useForm } from "../hooks/useForm"

const ForgotPasswordPage = () => {
  const navigate = useNavigate()
  const [isSubmitted, setIsSubmitted] = useState(false)

  const { values, handleChange, handleSubmit, isValid, isSubmitting } = useForm(
    {
      email: "",
    },
    {
      email: { required: true, email: true },
    },
  )

  const onSubmit = async (data) => {
    console.log("Reset password email sent to:", data.email)
    setIsSubmitted(true)

    setTimeout(() => {
      navigate("/reset-password", { state: { email: data.email } })
    }, 2000)
  }

  if (isSubmitted) {
    return (
      <div className="auth-container">
        <div className="form-section">
          <button className="back-button" onClick={() => navigate("/login")} type="button">
            <MdArrowBack size={20} />
          </button>

          <div className="form-wrapper">
            <h1 className="form-title">Check Your Email</h1>

            <div className="centered-container">
              <div className="status-icon status-icon--success">
                <MdEmail size={32} />
              </div>

              <p className="status-message">
                We've sent a password reset link to
                <br />
                <strong>{values.email}</strong>
              </p>

              <div className="info-box">Didn't receive the email? Check your spam folder or try again.</div>

              <button className="submit-button active submit-button--full" onClick={() => navigate("/login")}>
                Back to Sign In
              </button>
            </div>
          </div>
        </div>

        <div className="background-section">
          <div className="background-content">
            <h2 className="background-title">Reset Password</h2>
            <p className="background-subtitle">We'll help you get back in</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="auth-container">
      <div className="form-section">
        <button className="back-button" onClick={() => navigate("/login")} type="button">
          <MdArrowBack size={20} />
        </button>

        <div className="form-wrapper">
          <h1 className="form-title">Forgot Password?</h1>

          <p className="description-text">
            No worries! Enter your email address and we'll send you a link to reset your password.
          </p>

          <form
            className="auth-form"
            onSubmit={(e) => {
              e.preventDefault()
              handleSubmit(onSubmit)
            }}
          >
            <div className="input-group">
              <label className="input-label">Email Address</label>
              <input
                className="input-field"
                name="email"
                type="email"
                placeholder="Enter your email..."
                value={values.email}
                onChange={handleChange}
                disabled={isSubmitting}
                required
              />
            </div>

            <button
              type="submit"
              className={`submit-button ${isValid ? "active" : ""}`}
              disabled={!isValid || isSubmitting}
            >
              {isSubmitting ? "Sending..." : "Send Reset Link"}
            </button>
          </form>

          <div className="auth-link">
            Remember your password?{" "}
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault()
                navigate("/login")
              }}
            >
              Back to Sign In
            </a>
          </div>
        </div>
      </div>

      <div className="background-section">
        <div className="background-content">
          <h2 className="background-title">Reset Password</h2>
          <p className="background-subtitle">We'll help you get back in</p>
        </div>
      </div>
    </div>
  )
}

export default ForgotPasswordPage
