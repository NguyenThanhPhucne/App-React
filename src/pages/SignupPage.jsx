"use client";
import React from "react";
import { useNavigate } from "react-router-dom";
import { MdArrowBack } from "react-icons/md";
import { FcGoogle } from "react-icons/fc";
import { useForm } from "../hooks/useForm";
import apiService from "../app/services/apiServices";

const SignupPage = () => {
  const navigate = useNavigate();

  const { values, handleChange, handleSubmit, isValid } = useForm(
    {
      email: "",
      username: "",
      password: "",
      confirmPassword: "",
    },
    {
      email: { required: true, email: true },
      username: { required: true },
      password: { required: true, minLength: 6 },
      confirmPassword: { required: true, match: "password" },
    }
  );

  const onSubmit = async (data) => {
    try {
      const registerData = {
        email: data.email,
        username: data.username,
        password: data.password,
      };

      const result = await apiService.register(registerData);

      console.log("Signup successful:", result);
      navigate("/login");
    } catch (error) {
      console.error("Signup error:", error.message);
    }
  };

  const handleSocialSignup = (provider) => {
    console.log(`Signup with ${provider}`);
    navigate("/app");
  };

  const formFields = [
    { name: "email", label: "Email", type: "email", autoComplete: "email", placeholder: "Enter your email address" },
    {
      name: "username",
      label: "Username",
      type: "text",
      autoComplete: "username",
      placeholder: "Choose a unique username"
    },
    {
      name: "password",
      label: "Password",
      type: "password",
      autoComplete: "new-password",
      placeholder: "Create a strong password"
    },
    {
      name: "confirmPassword",
      label: "Confirm Password",
      type: "password",
      autoComplete: "new-password",
      placeholder: "Re-enter your password"
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
                <input
                  className="input-field"
                  name={field.name}
                  type={field.type}
                  placeholder={field.placeholder}
                  value={values[field.name]}
                  onChange={handleChange}
                  autoComplete={field.autoComplete}
                  required
                />
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
            <button
              className="social-button google"
              onClick={() => handleSocialSignup("google")}
            >
              <FcGoogle size={18} />
              Sign up with Google
            </button>
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
