import React from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectUser } from "../../../features/userSlice";
import { Home, Sun, Moon } from "lucide-react";
import useTheme from "../../../hooks/useTheme";
import Tooltip from "../ui/Tooltip";

const StoreUserPanel = () => {
  const user = useSelector(selectUser);
  const { isDarkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();

  return (
    <div className="store-user-panel">
      <div className="store-controls">
        {/* Home Button */}
        <Tooltip content="Return to Servers">
          <button className="action-btn" onClick={() => navigate("/servers")}>
            <Home size={20} />
          </button>
        </Tooltip>

        {/* Theme Toggle */}
        <Tooltip
          content={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          <button className="theme-toggle" onClick={toggleTheme}>
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </Tooltip>
      </div>

      {/* User Info */}
      <div className="user-info">
        <div className="user-avatar">
          <img src={user?.avatar || "/defaultAvatar.jpg"} alt="avatar" />
          <div className="status-dot" />
        </div>
      </div>
    </div>
  );
};

export default StoreUserPanel;
