// src/App.jsx
import React, { useEffect, useState } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { Provider, useSelector, useDispatch } from "react-redux";
import { store } from "./features/store";
import { selectUser, signIn, signOut } from "./features/userSlice";
import { selectServers, setServers, clearServers } from "./features/appSlice";
import apiService from "./app/services/apiServices";
import socketService from "./app/services/socketService";
import ThemeProvider from "./app/components/ui/ThemeProvider";
import AppRoutes from "./appRoutes/Routes";
import { GoogleOAuthProvider } from "@react-oauth/google";

// Cấu hình cho Google OAuth
const googleConfig = {
  client_id: "your-client-id", // Giữ nguyên client ID của bạn
  ux_mode: 'popup',
  locale: 'en' // Đặt locale thành tiếng Anh
};

function AppContent() {
  const user = useSelector(selectUser);
  const servers = useSelector(selectServers);
  const dispatch = useDispatch();
  const token = localStorage.getItem("accessToken");

  useEffect(() => {
    //dispatch(setGlobalLoading({ isLoading: true, message: "Validating session..." }));
    if (!token) return;
    const validateUser = async () => {
      try {
        const result = await apiService.validateTokenLocally();

        if (result.isValid && result.userData) {
          dispatch(signIn(result.userData));
        } else if (result.shouldSignOut) {
          dispatch(signOut());
          dispatch(clearServers());
        }
      } catch (error) {
        console.error("Token validation error:", error);
        dispatch(signOut());
        dispatch(clearServers());
      }
      //finally dispatch(setGlobalLoading({ isLoading: false, message: "" }));
    };

    validateUser();
  }, [dispatch, token]);

  // Fetch servers when user is authenticated
  useEffect(() => {
    const fetchServers = async () => {
      try {
        const response = await apiService.getUserServers();

        if (response && Array.isArray(response)) {
          dispatch(setServers(response));
        }
      } catch (error) {
        console.error("Error fetching servers in App:", error);
      }
    };

    // Fetch servers if user exists and servers haven't been loaded yet
    if (user && servers.length === 0) {
      fetchServers();
    }
  }, [user, dispatch, servers.length]);

  // Connect to socket when user mounts
  useEffect(() => {
    if (token && (!socketService.socket || !socketService.socket.connected)) {
      console.log("Connecting....");
      socketService.connect(token);
    }

    return () => {
      console.log("disconnect?");
      socketService.disconnect();
    };
  }, [token]);

  return (
    <Router>
      <ThemeProvider>
        <div className="App">
          <AppRoutes />
        </div>
      </ThemeProvider>
    </Router>
  );
}

function App() {
  return (
    <GoogleOAuthProvider 
      clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}
      locale="en" // Đặt ngôn ngữ mặc định là tiếng Anh
      ux_mode="popup"
    >
      <Provider store={store}>
        <AppContent />
      </Provider>
    </GoogleOAuthProvider>
  );
}

export default App;
