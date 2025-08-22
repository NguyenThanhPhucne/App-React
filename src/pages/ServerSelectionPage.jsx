import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { selectUser, signOut } from "../features/userSlice";
import { setSelectedServer } from "../features/appSlice";
import { Sun, Moon, Hash, Volume2, Users, Plus, UserPlus } from "lucide-react";
import apiService from "../app/services/apiServices";
import { getUserAvatarSrc, handleAvatarError } from "../app/utils/avatarUtils";
import useTheme from "../hooks/useTheme";
import CreateServerModal from "../app/components/discord/modals/CreateServerModal";
import JoinServerModal from "../app/components/discord/modals/JoinServerModal";
import {useDiscordHandlers} from "../hooks/useDiscordHandlers"
import "../styles/server-selection.css";

const ServerSelectionPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const user = useSelector(selectUser);
  const { isDarkMode, toggleTheme } = useTheme();
  const [servers, setServers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const handlers = useDiscordHandlers()

  // Apply theme class to body
  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    fetchUserServers();

    // Check if coming from creating a server
    const createServer = searchParams.get("createServer");
    if (createServer === "true") {
      // Show create server modal or redirect to create server flow
      // For now, we'll just fetch servers as the modal will be handled in DiscordInterface
    }
  }, [user, navigate, searchParams]);

  const fetchUserServers = async () => {
    try {
      setLoading(true);
      const serverList = await apiService.getUserServers();
      setServers(serverList);
    } catch (error) {
      console.error("Error fetching servers:", error);
      setError("Unable to load server list. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleServerSelect = async (serverId) => {
    try {
      // Lưu server đã chọn vào Redux store
      dispatch(setSelectedServer(serverId));
      // Điều hướng đến Discord interface
      navigate("/app");
    } catch (error) {
      console.error("Error selecting server:", error);
      setError("Unable to access server. Please try again.");
    }
  };

  const handleCreateServer = () => {
    setIsCreateModalOpen(true);
  };

  const handleJoinServer = () => {
    setIsJoinModalOpen(true);
  };

  const handleServerCreated = async (newServerData) => {
    try {
      // Refresh server list to include the new server
      await fetchUserServers();
      
      // Select the new server and navigate to app
      dispatch(setSelectedServer(newServerData._id));
      navigate("/app");
    } catch (error) {
      console.error("Error after server creation:", error);
      // Even if refresh fails, still navigate to the new server
      dispatch(setSelectedServer(newServerData._id));
      navigate("/app");
    }
  };

  const handleServerJoined = async (joinedServerData) => {
    try {
      // Refresh server list to include the joined server
      await fetchUserServers();
      
      // Select the joined server and navigate to app
      dispatch(setSelectedServer(joinedServerData._id));
      navigate("/app");
    } catch (error) {
      console.error("Error after joining server:", error);
      // Even if refresh fails, still navigate to the joined server
      dispatch(setSelectedServer(joinedServerData._id));
      navigate("/app");
    }
  };

  const handleCloseCreateModal = () => {
    setIsCreateModalOpen(false);
  };

  const handleCloseJoinModal = () => {
    setIsJoinModalOpen(false);
  };

  if (loading) {
    return (
      <div className="server-selection-container">
        <div className="loading-wrapper">
          <div className="loading-spinner"></div>
          <p>Loading server list...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="server-selection-container">
      <div className="server-selection-header">
        <div className="user-info">
          <img
            src={getUserAvatarSrc(user)}
            alt="User Avatar"
            className="user-avatar"
            onError={handleAvatarError}
          />
          <div className="user-details">
            <h3>{user?.username || "User"}</h3>
            <p>{user?.email}</p>
          </div>
        </div>
        <div className="header-controls">
          <button 
            className="theme-toggle"
            onClick={toggleTheme}
            title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <button onClick={handlers.handleLogout} className="logout-btn">
            Logout
          </button>
        </div>
      </div>

      <div className="server-selection-content">
        <h1 className="page-title">Select Server</h1>
        <p className="page-subtitle">
          Choose a server to start chatting or create a new server
        </p>

        {error && <div className="error-message">{error}</div>}

        <div className="servers-grid">
          {servers.length > 0 ? (
            servers.map((server) => (
              <div
                key={server._id}
                className="server-card"
                onClick={() => handleServerSelect(server._id)}
              >
                <div className="server-content">
                  <div className="server-icon">
                    {server.icon ? (
                      <img src={server.icon} alt={server.name} />
                    ) : (
                      <div className="server-initial">
                        {server.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div className="server-info">
                    <h3 className="server-name">{server.name}</h3>
                    {server.description && (
                      <p className="server-description">{server.description}</p>
                    )}
                  </div>
                </div>
                <div className="server-stats">
                  <div className="stat-item">
                    <Hash className="stat-icon" size={16} />
                    <span className="stat-label">{server.textChannels || 0} Text</span>
                  </div>
                  <div className="stat-item">
                    <Volume2 className="stat-icon" size={16} />
                    <span className="stat-label">{server.voiceChannels || 0} Voice</span>
                  </div>
                  <div className="stat-item">
                    <Users className="stat-icon" size={16} />
                    <span className="stat-label">{server.memberCount || 0} Members</span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="no-servers">
              <div className="no-servers-icon">📱</div>
              <h3>No servers yet</h3>
              <p>You haven't joined any servers. Create your first server!</p>
            </div>
          )}

          <div 
            className="server-card create-server-card" 
            onClick={handleCreateServer}
          >
            <div className="server-content">
              <div className="server-icon create-icon">
                <span>+</span>
              </div>
              <div className="server-info">
                <h3 className="server-name">Create New Server</h3>
                <p className="server-description">
                  Create a new server to chat with friends
                </p>
              </div>
            </div>
            <div className="server-stats">
              <div className="stat-item">
                <Plus className="stat-icon" size={16} />
                <span className="stat-label">New</span>
              </div>
            </div>
          </div>

          <div 
            className="server-card join-server-card" 
            onClick={handleJoinServer}
          >
            <div className="server-content">
              <div className="server-icon join-icon">
                <UserPlus size={24} />
              </div>
              <div className="server-info">
                <h3 className="server-name">Join a Server</h3>
                <p className="server-description">
                  Join an existing server with an invite code
                </p>
              </div>
            </div>
            <div className="server-stats">
              <div className="stat-item">
                <UserPlus className="stat-icon" size={16} />
                <span className="stat-label">Join</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Create Server Modal */}
      <CreateServerModal
        isOpen={isCreateModalOpen}
        onClose={handleCloseCreateModal}
        onServerCreated={handleServerCreated}
      />

      {/* Join Server Modal */}
      <JoinServerModal
        isOpen={isJoinModalOpen}
        onClose={handleCloseJoinModal}
        onServerJoined={handleServerJoined}
      />
    </div>
  );
};

export default ServerSelectionPage;
