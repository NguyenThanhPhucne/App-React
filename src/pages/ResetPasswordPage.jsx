"use client"

import { useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { MdArrowBack, MdCheckCircle } from "react-icons/md"
import { useForm } from "../hooks/useForm"

const ResetPasswordPage = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const email = location.state?.email || ""
  const [isSuccess, setIsSuccess] = useState(false)

  const { values, handleChange, handleSubmit, isValid, isSubmitting } = useForm(
    {
      resetCode: "",
      newPassword: "",
      confirmPassword: "",
    },
    {
      resetCode: { required: true },
      newPassword: { required: true, minLength: 6 },
      confirmPassword: { required: true, match: "newPassword" },
    },
  )

  const onSubmit = async (data) => {
    console.log("Password reset successful:", data)
    setIsSuccess(true)

    setTimeout(() => {
      navigate("/login")
    }, 3000)
  }

  if (isSuccess) {
    return (
      <div className="auth-container">
        <div className="form-section">
          <div className="form-wrapper">
            <h1 className="form-title">Password Reset Successful!</h1>

            <div className="centered-container">
              <div className="status-icon status-icon--success">
                <MdCheckCircle size={32} />
              </div>

              <p className="status-message">
                Your password has been successfully reset.
                <br />
                You can now sign in with your new password.
              </p>

              <div className="success-box">Redirecting to sign in page in 3 seconds...</div>

              <button className="submit-button active submit-button--full" onClick={() => navigate("/login")}>
                Continue to Sign In
              </button>
            </div>
          </div>
        </div>

        <div className="background-section">
          <div className="background-content">
            <h2 className="background-title">All Set!</h2>
            <p className="background-subtitle">Welcome back to your account</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="auth-container">
      <div className="form-section">
        <button className="back-button" onClick={() => navigate("/forgot-password")} type="button">
          <MdArrowBack size={20} />
        </button>

        <div className="form-wrapper">
          <h1 className="form-title">Reset Password</h1>

          <p className="description-text">
            {email ? (
              <>
                Enter the verification code sent to <strong>{email}</strong> and create a new password.
              </>
            ) : (
              "Enter the verification code from your email and create a new password."
            )}
          </p>

          <form
            className="auth-form"
            onSubmit={(e) => {
              e.preventDefault()
              handleSubmit(onSubmit)
            }}
          >
            <div className="input-group">
              <label className="input-label">Verification Code</label>
              <input
                className="input-field verification-input"
                name="resetCode"
                type="text"
                placeholder="Enter 6-digit code..."
                value={values.resetCode}
                onChange={handleChange}
                maxLength={6}
                disabled={isSubmitting}
                required
              />
            </div>

            <div className="input-group">
              <label className="input-label">New Password</label>
              <input
                className="input-field"
                name="newPassword"
                type="password"
                placeholder="Enter new password..."
                value={values.newPassword}
                onChange={handleChange}
                disabled={isSubmitting}
                required
              />
            </div>

            <div className="input-group">
              <label className="input-label">Confirm New Password</label>
              <input
                className="input-field"
                name="confirmPassword"
                type="password"
                placeholder="Confirm new password..."
                value={values.confirmPassword}
                onChange={handleChange}
                disabled={isSubmitting}
                required
              />
            </div>

            <div className="password-requirements">
              <strong>Password requirements:</strong>
              <ul>
                <li>At least 6 characters long</li>
                <li>Include both letters and numbers</li>
                <li>Use a mix of uppercase and lowercase</li>
              </ul>
            </div>

            <button
              type="submit"
              className={`submit-button ${isValid ? "active" : ""}`}
              disabled={!isValid || isSubmitting}
            >
              {isSubmitting ? "Resetting Password..." : "Reset Password"}
            </button>
          </form>

          <div className="auth-link">
            Didn't receive the code?{" "}
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault()
                navigate("/forgot-password")
              }}
            >
              Send Again
            </a>
          </div>
        </div>
      </div>

      <div className="background-section">
        <div className="background-content">
          <h2 className="background-title">Almost There</h2>
          <p className="background-subtitle">Create your new secure password</p>
        </div>
      </div>
    </div>
  )
}

export default ResetPasswordPage
