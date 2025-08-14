"use client";

import {
  Mic,
  MicOff,
  Headphones,
  Settings,
  LogOut,
  Plus,
  Sun,
  Moon,
  Search,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectUser } from "../../../../features/userSlice";
import { getUserAvatarSrc, handleAvatarError } from "../../../utils/avatarUtils";
import useTheme from "../../../../hooks/useTheme";
import Tooltip from "../../ui/Tooltip";

const UserPanel = ({ state, handlers }) => {
  const user = useSelector(selectUser);
  const { isDarkMode, toggleTheme } = useTheme();
  const [userIcon, setUserIcon] = useState(null);

  // Get the base URL for serving uploaded images
  const API_BASE_URL = import.meta.env.VITE_BACKEND_BASE_URL;

  useEffect(() => {
    if (user) {
      // Set current user avatar
      setUserIcon(`${API_BASE_URL}${user.avatar}`);
    }
  }, [user, API_BASE_URL]);

  return (
    <div className="user-panel">
      {/* Mobile Search Button */}
      <button
        className="mobile-search-btn"
        onClick={handlers.toggleMobileSearch}
      >
        <Search size={20} />
      </button>

      {/* Controls sát bên user */}
      <div className="user-panel__controls">
        {/* Add Server Button */}
        <Tooltip content="Add a Server">
          <button
            className="add-server-btn"
            onClick={handlers.toggleCreateServerModal}
          >
            <Plus size={20} />
          </button>
        </Tooltip>

        {/* Theme Toggle */}
        <Tooltip
          content={
            isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"
          }
        >
          <button className="theme-toggle" onClick={toggleTheme}>
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </Tooltip>
      </div>

      <div className="user-info">
        <div className="user-avatar">
          <img src={userIcon} alt="avatar" />
          <div className="status-dot" />
        </div>
        <div className="user-details">
          <span className="username">{user?.displayName || user?.username}</span>
          <span className="status">Online</span>
        </div>
      </div>

      <div className="user-actions">
        {/* Mic button with tooltip */}
        <Tooltip content={state.isMuted ? "Unmute" : "Mute"}>
          <button
            className={`action-btn ${state.isMuted ? "action-btn--muted" : ""}`}
            onClick={handlers.toggleMute}
          >
            {state.isMuted ? <MicOff size={16} /> : <Mic size={16} />}
          </button>
        </Tooltip>

        {/* Headphone button with tooltip */}
        <Tooltip content={state.isDeafened ? "Undeafen" : "Deafen"}>
          <button
            className={`action-btn ${
              state.isDeafened ? "action-btn--deafened" : ""
            }`}
            onClick={handlers.toggleDeafen}
          >
            <Headphones size={16} />
            {state.isDeafened && <div className="deafen-indicator" />}
          </button>
        </Tooltip>

        {/* Settings button */}
        <Tooltip content="User Settings">
          <button
            className="action-btn"
            onClick={handlers.toggleUserSettingsModal}
          >
            <Settings size={16} />
          </button>
        </Tooltip>

        {/* Logout button */}
        <Tooltip content="Logout">
          <button
            className="action-btn logout-btn"
            onClick={handlers.handleLogout}
          >
            <LogOut size={16} />
          </button>
        </Tooltip>
      </div>
    </div>
  );
};

export default UserPanel;
