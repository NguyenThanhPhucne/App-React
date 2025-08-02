// src/appRoutes/Routes.jsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectUser } from "../features/userSlice";
//import { selectGlobalLoading, selectLoadingMessage, } from "../features/loadingSlice";

// Import pages
import GetStartedPage from "../pages/GetStartedPage";
import LoginPage from "../pages/LoginPage";
import SignupPage from "../pages/SignupPage";
import ForgotPasswordPage from "../pages/ForgotPasswordPage";
import ResetPasswordPage from "../pages/ResetPasswordPage";
import DiscordInterface from "../pages/DiscordInterface";
//import LoadingPage from "../pages/LoadingPage";

function AppRoutes() {
  const user = useSelector(selectUser);
  //const isGlobalLoading = useSelector(selectGlobalLoading);
  //const loadingMessage = useSelector(selectLoadingMessage);

  /* Show loading page for global loading
  if (isGlobalLoading) {
    return <LoadingPage message={loadingMessage} />;
  }*/

  return (
    <Routes>
      <Route
        path="/app"
        element={user ? <DiscordInterface /> : <Navigate to="/login" replace />}
      />
      <Route path="/" element={<GetStartedPage />} />
      <Route
        path="/login"
        element={user ? <Navigate to="/app" replace /> : <LoginPage />}
      />
      <Route
        path="/signup"
        element={user ? <Navigate to="/app" replace /> : <SignupPage />}
      />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default AppRoutes;
