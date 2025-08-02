"use client";

import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { MdArrowBack } from "react-icons/md";
import { SiGoogle } from "react-icons/si";
import { MdEmail } from "react-icons/md";
import { useForm } from "../hooks/useForm";
import apiService from "../app/services/apiServices";
import { signIn } from "../features/userSlice";

const LoginPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { values, handleChange, handleSubmit, isValid } = useForm({
    account: "",
    password: "",
  }, {
    account: { required: true },
    password: { required: true, minLength: 6 },
  });

  const onSubmit = async (data) => {
    try {
      const userData = await apiService.login(data.account, data.password);
      dispatch(signIn(userData));
    } catch (error) {
      console.error("Login failed:", error);
      // You might want to show an error message to the user here
    }
  };

  const handleSocialLogin = (provider) => {
    console.log(`Login with ${provider}`);
    navigate("/app");
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

          <form
            className="auth-form"
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit(onSubmit);
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
                autoComplete="username"
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
                autoComplete="current-password"
              />
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
            <button
              className="social-button email"
              onClick={() => navigate("/signup")}
            >
              <MdEmail size={20} />
              Sign in with Email & Phone
            </button>

            <button
              className="social-button google"
              onClick={() => handleSocialLogin("google")}
            >
              <SiGoogle size={18} />
              Google
            </button>
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
