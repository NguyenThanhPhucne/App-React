"use client";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MdArrowBack } from "react-icons/md";
import { FcGoogle } from "react-icons/fc";
import { useForm } from "../hooks/useForm";
import { GoogleLogin } from "@react-oauth/google";
import apiService from "../app/services/apiServices";
import { signIn } from "../features/userSlice";
import { useDispatch } from "react-redux";

const SignupPage = () => {
  const navigate = useNavigate();
  const [apiError, setApiError] = useState("");
  const [apiSuccess, setApiSuccess] = useState("");
  const dispatch = useDispatch();

  const { 
    values, 
    handleChange, 
    handleSubmit, 
    isValid, 
    getFieldError, 
    handleBlur,
    emailSuggestions,
    showSuggestions,
    handleSuggestionClick,
    handleSuggestionsMouseEnter,
    handleSuggestionsMouseLeave
  } = useForm(
    {
      email: "",
      username: "",
      password: "",
      confirmPassword: "",
    },
    {
      email: { required: true, email: true },
      username: { required: true, username: true },
      password: { required: true, password: true },
      confirmPassword: { required: true, match: "password" },
    }
  );

  const onSubmit = async (data) => {
    try {
      setApiError("");
      setApiSuccess("");
      
      const registerData = {
        email: data.email,
        username: data.username,
        password: data.password,
      };

      const result = await apiService.register(registerData);

      console.log("Signup successful:", result);
      setApiSuccess("Account created successfully! Redirecting to login...");
      
      // Redirect to login after 2 seconds
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      console.error("Signup error:", error.message);
      // Display API error to user
      if (error.message === "Username or email already exists") {
        setApiError("Username or email already exists. Please choose different credentials.");
      } else if (error.message?.includes("Failed to fetch")) {
        setApiError("Cannot connect to server. Please check your internet connection.");
      } else {
        setApiError(error.message || "Registration failed. Please try again.");
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

  const renderInputField = (field) => {
    if (field.name === 'email') {
      return (
        <div className="input-with-suggestions">
          <input
            className={`input-field ${getFieldError(field.name) ? 'error' : ''}`}
            name={field.name}
            type={field.type}
            placeholder={field.placeholder}
            value={values[field.name]}
            onChange={handleChange}
            onBlur={handleBlur}
            autoComplete={field.autoComplete}
            required
          />
          {showSuggestions.email && emailSuggestions.length > 0 && (
            <div 
              className="email-suggestions"
              onMouseEnter={() => handleSuggestionsMouseEnter('email')}
              onMouseLeave={() => handleSuggestionsMouseLeave('email')}
            >
              {emailSuggestions.map((suggestion, index) => (
                <div
                  key={index}
                  className="suggestion-item"
                  onClick={() => handleSuggestionClick('email', suggestion)}
                >
                  {suggestion}
                </div>
              ))}
            </div>
          )}
        </div>
      );
    }

    return (
      <input
        className={`input-field ${getFieldError(field.name) ? 'error' : ''}`}
        name={field.name}
        type={field.type}
        placeholder={field.placeholder}
        value={values[field.name]}
        onChange={handleChange}
        onBlur={handleBlur}
        autoComplete={field.autoComplete}
        required
      />
    );
  };

  const formFields = [
    { 
      name: "email", 
      label: "Email",
      type: "email", 
      autoComplete: "email", 
      placeholder: "Enter your email address"
    },
    {
      name: "username",
      label: "Username",
      type: "text",
      autoComplete: "username",
      placeholder: "Choose a username (letters, numbers, underscores)"
    },
    {
      name: "password",
      label: "Password",
      type: "password",
      autoComplete: "new-password",
      placeholder: "Create a strong password (min. 6 chars)"
    },
    {
      name: "confirmPassword",
      label: "Confirm Password",
      type: "password",
      autoComplete: "new-password",
      placeholder: "Re-enter your password to confirm (must match)"
    },
  ];

  return (
    <div className="auth-container">
      <div className="form-section">
        <button className="back-button" type="button">
          {" "}
          {/* Back function needed */}
          <MdArrowBack size={20} />
        </button>

        <div className="form-wrapper">
          {" "}
          {/* The form is too high */}
          <h1 className="form-title">Create Account</h1>
          
          {/* API Error Display */}
          {apiError && (
            <div className="api-error-message">
              {apiError}
            </div>
          )}

          {/* API Success Display */}
          {apiSuccess && (
            <div className="api-success-message">
              {apiSuccess}
            </div>
          )}

          <form
            className="auth-form"
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit(onSubmit);
            }}
          >
            {formFields.map((field) => (
              <div key={field.name} className="input-group">
                <label className="input-label">{field.label}</label>
                {renderInputField(field)}
                {getFieldError(field.name) && (
                  <span className="error-message">{getFieldError(field.name)}</span>
                )}
              </div>
            ))}

            <button
              type="submit"
              className={`submit-button ${isValid ? "active" : ""}`}
              disabled={!isValid}
            >
              Sign Up
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
          <div className="terms-text">
            By creating an account, you agree to accept our{" "}
            <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>{" "}
            at My Application.
          </div>
          <div className="auth-link">
            Already have an account?{" "}
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                navigate("/login");
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
  );
};

export default SignupPage;