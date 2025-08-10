"use client";

import React, { useState } from "react";
import { useSelector } from "react-redux";
import { selectServers, selectCurrentServer } from "../../../../features/appSlice";
import { 
  Plus, 
  Hash, 
  Volume2, 
  ChevronDown, 
  ChevronRight,
  Settings,
  X 
} from "lucide-react";

const MobileServerSidebar = ({ 
  isOpen, 
  onClose, 
  state, 
  handlers 
}) => {
  const servers = useSelector(selectServers);
  const currentServer = useSelector(selectCurrentServer);
  const [expandedCategories, setExpandedCategories] = useState({
    text: true,
    voice: true
  });

  const toggleCategory = (type) => {
    setExpandedCategories(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
  };

  const textChannels = currentServer?.channels?.filter(channel => channel.type === "text") || [];
  const voiceChannels = currentServer?.channels?.filter(channel => channel.type === "voice") || [];

  if (!isOpen) return null;

  return (
    <div className="mobile-server-sidebar-overlay">
      <div className="mobile-server-sidebar">
        {/* Header */}
        <div className="mobile-sidebar-header">
          <h3 className="mobile-sidebar-title">
            {currentServer?.name || "Select Server"}
          </h3>
          <button 
            className="mobile-sidebar-close"
            onClick={onClose}
          >
            <X size={20} />
          </button>
        </div>

        {/* Server List */}
        <div className="mobile-server-list">
          <div className="mobile-server-section-title">Your Servers</div>
          {servers.map((server) => (
            <button
              key={server._id}
              className={`mobile-server-item ${
                currentServer?._id === server._id ? "mobile-server-item--active" : ""
              }`}
              onClick={() => {
                handlers.handleServerSelect(server._id);
              }}
            >
              <div className="mobile-server-icon">
                {server.icon ? (
                  <img src={server.icon} alt={server.name} />
                ) : (
                  server.name.charAt(0).toUpperCase()
                )}
              </div>
              <span className="mobile-server-name">{server.name}</span>
            </button>
          ))}
          
          {/* Add Server Button */}
          <button
            className="mobile-server-item mobile-add-server"
            onClick={() => {
              handlers.toggleCreateServerModal();
              onClose();
            }}
          >
            <div className="mobile-server-icon mobile-add-icon">
              <Plus size={20} />
            </div>
            <span className="mobile-server-name">Add a Server</span>
          </button>
        </div>

        {/* Channels Section */}
        {currentServer && (
          <div className="mobile-channels-section">
            <div className="mobile-section-divider" />
            
            {/* Text Channels */}
            <div className="mobile-channel-category">
              <button
                className="mobile-category-header"
                onClick={() => toggleCategory("text")}
              >
                {expandedCategories.text ? (
                  <ChevronDown size={16} />
                ) : (
                  <ChevronRight size={16} />
                )}
                <span>TEXT CHANNELS</span>
                <button
                  className="mobile-add-channel-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    handlers.toggleCreateChannelModal("text");
                    onClose();
                  }}
                >
                  <Plus size={16} />
                </button>
              </button>
              
              {expandedCategories.text && (
                <div className="mobile-channel-list">
                  {textChannels.map((channel) => (
                    <button
                      key={channel._id}
                      className={`mobile-channel-item ${
                        state.activeChannel === channel._id ? "mobile-channel-item--active" : ""
                      }`}
                      onClick={() => {
                        handlers.handleChannelSelect(channel._id);
                        onClose();
                      }}
                    >
                      <Hash size={16} />
                      <span>{channel.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Voice Channels */}
            <div className="mobile-channel-category">
              <button
                className="mobile-category-header"
                onClick={() => toggleCategory("voice")}
              >
                {expandedCategories.voice ? (
                  <ChevronDown size={16} />
                ) : (
                  <ChevronRight size={16} />
                )}
                <span>VOICE CHANNELS</span>
                <button
                  className="mobile-add-channel-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    handlers.toggleCreateChannelModal("voice");
                    onClose();
                  }}
                >
                  <Plus size={16} />
                </button>
              </button>
              
              {expandedCategories.voice && (
                <div className="mobile-channel-list">
                  {voiceChannels.map((channel) => (
                    <button
                      key={channel._id}
                      className={`mobile-channel-item ${
                        state.activeChannel === channel._id ? "mobile-channel-item--active" : ""
                      }`}
                      onClick={() => {
                        handlers.handleChannelSelect(channel._id);
                        onClose();
                      }}
                    >
                      <Volume2 size={16} />
                      <span>{channel.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* User Panel */}
        <div className="mobile-user-panel">
          <div className="mobile-user-info">
            <div className="mobile-user-avatar">
              {state.user?.avatar ? (
                <img src={state.user.avatar} alt={state.user.username} />
              ) : (
                state.user?.username?.charAt(0).toUpperCase() || "U"
              )}
            </div>
            <div className="mobile-user-details">
              <div className="mobile-username">{state.user?.username || "User"}</div>
              <div className="mobile-user-status">Online</div>
            </div>
          </div>
          <button className="mobile-user-settings">
            <Settings size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MobileServerSidebar;
