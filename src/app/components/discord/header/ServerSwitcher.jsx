// Alternative Server Switcher Component với style đơn giản hơn
"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, Check, Loader2, Settings } from "lucide-react";
import { useSelector } from "react-redux";
import { selectServers, selectCurrentServer } from "../../../../features/appSlice";
import Tooltip from "../../ui/Tooltip";

const ServerSwitcher = ({ handlers }) => {
  const servers = useSelector(selectServers);
  const currentServer = useSelector(selectCurrentServer);
  
  const [showDropdown, setShowDropdown] = useState(false);
  const [switchingServerId, setSwitchingServerId] = useState(null);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setShowDropdown(false);
      }
    };

    if (showDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [showDropdown]);

  const handleServerSelect = async (serverId) => {
    if (currentServer?._id === serverId) {
      setShowDropdown(false);
      return;
    }

    try {
      setSwitchingServerId(serverId);
      if (handlers.handleServerSwitch) {
        await handlers.handleServerSwitch(serverId);
      }
      setShowDropdown(false);
    } catch (error) {
      console.error("Error switching server:", error);
    } finally {
      setSwitchingServerId(null);
    }
  };

  return (
    <div className="simple-server-switcher" ref={dropdownRef}>
      <Tooltip content={currentServer?.name || "Select Server"}>
        <button
          className={`simple-server-btn ${showDropdown ? 'simple-server-btn--active' : ''}`}
          onClick={() => setShowDropdown(!showDropdown)}
        >
          <div className="simple-server-btn__avatar">
            {currentServer?.name?.charAt(0)?.toUpperCase() || '?'}
          </div>
          <ChevronDown size={10} className={`simple-chevron ${showDropdown ? 'simple-chevron--rotated' : ''}`} />
        </button>
      </Tooltip>

      {showDropdown && (
        <div className="simple-server-dropdown">
          <div className="simple-server-dropdown__header">
            <span>{currentServer?.name || 'Select Server'}</span>
          </div>
          
          <div className="simple-server-dropdown__list">
            {servers.map((server) => (
              <button
                key={server._id}
                className={`simple-server-item ${
                  currentServer?._id === server._id ? 'simple-server-item--active' : ''
                } ${switchingServerId === server._id ? 'simple-server-item--loading' : ''}`}
                onClick={() => handleServerSelect(server._id)}
                disabled={switchingServerId === server._id}
              >
                <div className="simple-server-item__avatar">
                  {switchingServerId === server._id ? (
                    <Loader2 size={12} className="animate-spin" />
                  ) : (
                    <span>{server.name?.charAt(0)?.toUpperCase()}</span>
                  )}
                </div>
                <span className="simple-server-item__name">{server.name}</span>
                {currentServer?._id === server._id && switchingServerId !== server._id && (
                  <Check size={14} className="simple-server-item__check" />
                )}
              </button>
            ))}
          </div>

          <div className="simple-server-dropdown__footer">
            <button
              className="simple-server-manage-btn"
              onClick={() => {
                setShowDropdown(false);
                handlers.handleBackToServerSelection();
              }}
            >
              <Settings size={12} />
              Manage Servers
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServerSwitcher;
