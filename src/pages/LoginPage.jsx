"use client";

import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { MdArrowBack } from "react-icons/md";
import { FcGoogle } from "react-icons/fc";
import { SiGmail } from "react-icons/si";
import { useState } from "react";
import { useForm } from "../hooks/useForm";
import apiService from "../app/services/apiServices";
import { signIn } from "../features/userSlice";
import { GoogleLogin } from "@react-oauth/google";

const LoginPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [apiError, setApiError] = useState("");

  const {
    values,
    handleChange,
    handleSubmit,
    isValid,
    errors,
    handleBlur,
    emailSuggestions,
    showSuggestions,
    handleSuggestionClick,
    handleSuggestionsMouseEnter,
    handleSuggestionsMouseLeave,
  } = useForm(
    {
      account: "",
      password: "",
    },
    {
      account: { required: true, minLength: 3, email: true },
      password: { required: true, minLength: 6 },
    }
  );

  const onSubmit = async (data) => {
    try {
      setApiError("");
      const userData = await apiService.login(data.account, data.password);
      dispatch(signIn(userData));
      navigate("/app");
    } catch (error) {
      console.error("Login failed:", error);
      if (error.message === "User not found") {
        setApiError(
          "Account not found. Please check your username/email or sign up."
        );
      } else if (error.message === "Invalid password") {
        setApiError("Incorrect password. Please try again.");
      } else if (error.message?.includes("Failed to fetch")) {
        setApiError(
          "Cannot connect to server. Please check your internet connection."
        );
      } else {
        setApiError(error.message || "Login failed. Please try again.");
      }
    }
  };

  const handleSocialLogin = async (provider) => {
    try {
      const { credential } = provider;
      const userData = await apiService.googleLogin(credential);
      dispatch(signIn(userData));
    } catch (error) {
      console.error("Login failed:", error);
      if (error.message === "No Google token provided") {
        setApiError(
          "Google login error. Please use website account or refresh page."
        );
      } else if (error.message === "No email provided") {
        setApiError(error.message);
      } else {
        setApiError(error.message || "Login failed. Please try again.");
      }
    }
  };

  return (
    <div className="auth-container">
      <div className="form-section">
        <button className="back-button" type="button">
          {" "}
          {/* This button should navigate back to the previous page */}
          <MdArrowBack size={20} />
        </button>

        <div className="form-wrapper">
          <h1 className="form-title">Sign In</h1>

          {/* API Error Display */}
          {apiError && <div className="api-error-message">{apiError}</div>}

          <form
            className="auth-form"
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit(onSubmit);
            }}
          >
            <div className="input-group">
              <label className="input-label">Account (Username or Email)</label>
              <div className="input-with-suggestions">
                <input
                  className={`input-field ${errors.account ? "error" : ""}`}
                  name="account"
                  placeholder="Username or Email address"
                  value={values.account}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  autoComplete="username"
                />
                {showSuggestions.account && emailSuggestions.length > 0 && (
                  <div
                    className="email-suggestions"
                    onMouseEnter={() => handleSuggestionsMouseEnter("account")}
                    onMouseLeave={() => handleSuggestionsMouseLeave("account")}
                  >
                    {emailSuggestions.map((suggestion, index) => (
                      <div
                        key={index}
                        className="suggestion-item"
                        onClick={() =>
                          handleSuggestionClick("account", suggestion)
                        }
                      >
                        {suggestion}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {errors.account && (
                <span className="error-message">{errors.account}</span>
              )}
            </div>

            <div className="input-group">
              <label className="input-label">
                Password (min. 6 characters)
              </label>
              <input
                className={`input-field ${errors.password ? "error" : ""}`}
                name="password"
                type="password"
                placeholder="Enter your password"
                value={values.password}
                onChange={handleChange}
                onBlur={handleBlur}
                autoComplete="current-password"
              />
              {errors.password && (
                <span className="error-message">{errors.password}</span>
              )}
            </div>

            <div className="forgot-password">
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  navigate("/forgot-password");
                }}
              >
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              className={`submit-button ${isValid ? "active" : ""}`}
              disabled={!isValid}
            >
              Sign In
            </button>
          </form>

          <div className="divider">Or</div>

          <div className="social-buttons">
            <GoogleLogin
            className="social-button google"
              onSuccess={(credentialResponse) => {
                handleSocialLogin(credentialResponse);
              }}
              onError={() => {
                console.log("Login Failed");
              }}
            />
          </div>

          <div className="auth-link">
            Don't have an account?{" "}
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                navigate("/signup");
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
  );
};

export default LoginPage;
