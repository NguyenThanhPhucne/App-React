// src/App.jsx
import React, { useEffect } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { Provider, useSelector, useDispatch } from "react-redux";
import { store } from "./app/store";
import { selectUser, signIn, signOut } from "./features/userSlice";
import { selectServers, setServers, clearServers } from "./features/appSlice";
import apiService from "./app/services/apiServices";
import socketService from "./app/services/socketService";
import AppRoutes from "./appRoutes/Routes";

function AppContent() {
  const user = useSelector(selectUser);
  const servers = useSelector(selectServers);
  const dispatch = useDispatch();

  useEffect(() => {
    //dispatch(setGlobalLoading({ isLoading: true, message: "Validating session..." }));
    const token = localStorage.getItem("accessToken");
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
  }, [dispatch]);

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
    if (user) {
      socketService.connect();
    }

    return () => {
      socketService.disconnect();
    };
  }, [user]);

  return (
    <Router>
      <div className="App">
        <AppRoutes />
      </div>
    </Router>
  );
}

function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}

export default App;
