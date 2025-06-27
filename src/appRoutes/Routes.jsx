// src/appRoutes/Routes.jsx
import { Routes, Route } from "react-router-dom"
import GetStartedPage from "../pages/GetStartedPage"
import LoginPage from "../pages/LoginPage"
import SignupPage from "../pages/SignupPage"
import ForgotPasswordPage from "../pages/ForgotPasswordPage"
import ResetPasswordPage from "../pages/ResetPasswordPage"
import DiscordInterface from "../pages/DiscordInterface"

function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<GetStartedPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />

      {/* Discord Interface */}
      <Route path="/app" element={<DiscordInterface />} />

      {/* Redirect any unknown routes to home */}
      <Route path="*" element={<GetStartedPage />} />
    </Routes>
  )
}

export default AppRoutes
