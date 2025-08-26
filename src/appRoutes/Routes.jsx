// src/appRoutes/Routes.jsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectUser } from "../features/userSlice";
import { selectSelectedServerId } from "../features/appSlice";

// Import pages
import GetStartedPage from "../pages/GetStartedPage";
import LoginPage from "../pages/LoginPage";
import SignupPage from "../pages/SignupPage";
import ForgotPasswordPage from "../pages/ForgotPasswordPage";
import ResetPasswordPage from "../pages/ResetPasswordPage";
import ServerSelectionPage from "../pages/ServerSelectionPage";
import DiscordInterface from "../pages/DiscordInterface";

// Import store components
import StorePage from "../pages/StorePage";
import ProductList from "../app/components/store/ProductList";
import ProductDetail from "../app/components/store/ProductDetail";
import Cart from "../app/components/store/Cart";
import Checkout from "../app/components/store/Checkout";

function AppRoutes() {
  const user = useSelector(selectUser);
  const selectedServerId = useSelector(selectSelectedServerId);

  return (
    <Routes>
      {/* Store Routes - Placed first to take precedence */}
      <Route
        path="/store/*"
        element={
          user ? (
            <StorePage />
          ) : (
            <Navigate to="/login" replace state={{ from: "/store" }} />
          )
        }
      />

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

      <Route path="/" element={<GetStartedPage />} />

      <Route
        path="/servers"
        element={
          user ? <ServerSelectionPage /> : <Navigate to="/login" replace />
        }
      />

      <Route
        path="/login"
        element={
          user ? (
            // If coming from store, redirect back to store
            location.state?.from === "/store" ? (
              <Navigate to="/store" replace />
            ) : (
              <Navigate to="/servers" replace />
            )
          ) : (
            <LoginPage />
          )
        }
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
