// src/appRoutes/Routes.jsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectUser } from "../features/userSlice";
import { selectSelectedServerId } from "../features/appSlice";
//import { selectGlobalLoading, selectLoadingMessage, } from "../features/loadingSlice";

// Import pages
import GetStartedPage from "../pages/GetStartedPage";
import LoginPage from "../pages/LoginPage";
import SignupPage from "../pages/SignupPage";
import ForgotPasswordPage from "../pages/ForgotPasswordPage";
import ResetPasswordPage from "../pages/ResetPasswordPage";
import ServerSelectionPage from "../pages/ServerSelectionPage";
import DiscordInterface from "../pages/DiscordInterface";
//import LoadingPage from "../pages/LoadingPage";

function AppRoutes() {
  const user = useSelector(selectUser);
  const selectedServerId = useSelector(selectSelectedServerId);
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
        element={
          user ? (
            selectedServerId ? (
              <DiscordInterface />
            ) : (
              <Navigate to="/servers" replace />
            )
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
      <Route
        path="/servers"
        element={
          user ? <ServerSelectionPage /> : <Navigate to="/login" replace />
        }
      />
      <Route path="/" element={<GetStartedPage />} />
      <Route
        path="/login"
        element={user ? <Navigate to="/servers" replace /> : <LoginPage />}
      />
      <Route
        path="/signup"
        element={user ? <Navigate to="/servers" replace /> : <SignupPage />}
      />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default AppRoutes;
