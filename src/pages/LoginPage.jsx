"use client"

import { useNavigate } from "react-router-dom"
import { MdArrowBack } from "react-icons/md"
import { SiGoogle, SiFacebook } from "react-icons/si"
import { MdEmail } from "react-icons/md"
import { useForm } from "../hooks/useForm"

const LoginPage = () => {
  const navigate = useNavigate()

  const { values, handleChange, handleSubmit, isValid } = useForm({
    account: "",
    password: "",
  })

  const onSubmit = async (data) => {
    console.log("Login data:", data)
    navigate("/app")
  }

  const handleSocialLogin = (provider) => {
    console.log(`Login with ${provider}`)
    navigate("/app")
  }

  return (
    <div className="auth-container">
      <div className="form-section">
        <button className="back-button" onClick={() => navigate("/")} type="button">
          <MdArrowBack size={20} />
        </button>

        <div className="form-wrapper">
          <h1 className="form-title">Sign In</h1>

          <form
            className="auth-form"
            onSubmit={(e) => {
              e.preventDefault()
              handleSubmit(onSubmit)
            }}
          >
            <div className="input-group">
              <label className="input-label">Account</label>
              <input
                className="input-field"
                name="account"
                placeholder="Enter..."
                value={values.account}
                onChange={handleChange}
                required
              />
            </div>

            <div className="input-group">
              <label className="input-label">Password</label>
              <input
                className="input-field"
                name="password"
                type="password"
                placeholder="Enter..."
                value={values.password}
                onChange={handleChange}
                required
              />
            </div>

            <div className="forgot-password">
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault()
                  navigate("/forgot-password")
                }}
              >
                Forgot password?
              </a>
            </div>

            <button type="submit" className={`submit-button ${isValid ? "active" : ""}`} disabled={!isValid}>
              Sign In
            </button>
          </form>

          <div className="divider">Or</div>

          <div className="social-buttons">
            <button className="social-button email" onClick={() => navigate("/signup")}>
              <MdEmail size={20} />
              Sign in with Email & Phone
            </button>

            <div className="login-social-bottom">
              <button className="social-button google" onClick={() => handleSocialLogin("google")}>
                <SiGoogle size={18} />
                Google
              </button>
              <button className="social-button facebook" onClick={() => handleSocialLogin("facebook")}>
                <SiFacebook size={18} />
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
                navigate("/signup")
              }}
            >
              Sign Up
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

export default LoginPage
