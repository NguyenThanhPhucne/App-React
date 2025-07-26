"use client"
import { useNavigate } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import { selectUser, signOut } from "../features/userSlice"
import { apiService } from "../services/apiServices"
import { useEffect } from "react"
import { Hash, Users, Menu, LogOut } from "lucide-react"

// Import data and hooks
import { servers, channels, members } from "../data/discordData"
import { useDiscordState } from "../hooks/useDiscordState"

// Styles
import "../styles/discord.css"

const DiscordInterface = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const user = useSelector(selectUser)

  const { state, handlers } = useDiscordState()

  const handleLogout = async () => {
    try {
      await apiService.logout()
      dispatch(signOut())
      localStorage.removeItem("accessToken")
      navigate("/login")
    } catch (error) {
      console.error("Logout error:", error)
      dispatch(signOut())
      localStorage.removeItem("accessToken")
      navigate("/login")
    }
  }

  // Add auth check
  useEffect(() => {
    if (!user) {
      navigate("/login")
    }
  }, [user, navigate])

  if (!user) {
    return null
  }

  return (
    <div className={`discord-container ${state.isDarkTheme ? "theme-dark" : "theme-light"}`}>
      {/* Overlay for mobile */}
      {state.showMobileSidebar && (
        <div className="mobile-overlay mobile-overlay--visible" onClick={handlers.closeMobilePanels} />
      )}

      {/* Header */}
      <header className="header">
        <div className="header-left">
          <button className="mobile-menu-btn" onClick={handlers.toggleMobileSidebar}>
            <Menu size={20} />
          </button>
          <Hash size={24} />
          <span>{state.activeChannel}</span>
        </div>

        <div className="header-right">
          <button
            className="header-btn"
            onClick={() => handlers.updateState({ showMemberList: !state.showMemberList })}
          >
            <Users size={20} />
          </button>
          <button className="header-btn" onClick={handleLogout}>
            <LogOut size={20} />
          </button>
        </div>
      </header>

      {/* Main content */}
      <div className="main-container">
        {/* Sidebar */}
        <nav className={`sidebar ${state.showMobileSidebar ? "sidebar-mobile-open" : ""}`}>
          <div className="servers-list">
            {servers.map((server) => (
              <button
                key={server.id}
                className={`server-btn ${state.currentServer === server.id ? "active" : ""}`}
                onClick={() => handlers.updateState({ currentServer: server.id })}
                style={{ backgroundColor: server.color }}
              >
                <server.icon size={24} />
              </button>
            ))}
          </div>

          <div className="channels-list">
            {channels.text.map((channel) => (
              <button
                key={channel.id}
                className={`channel-btn ${state.activeChannel === channel.id ? "active" : ""}`}
                onClick={() => handlers.updateState({ activeChannel: channel.id })}
              >
                <Hash size={20} />
                <span>{channel.name}</span>
              </button>
            ))}
          </div>

          <div className="user-controls">
            <div className="user-info">
              <div className="avatar">{user?.username?.charAt(0)}</div>
              <span className="username">{user?.username}</span>
            </div>
          </div>
        </nav>

        {/* Main chat area */}
        <main className="chat-area">
          <div className="messages">
            <div className="welcome-message">
              <Hash size={48} />
              <h2>Welcome to #{state.activeChannel}!</h2>
              <p>This is the start of the #{state.activeChannel} channel.</p>
            </div>
          </div>
        </main>

        {/* Member list */}
        {state.showMemberList && (
          <aside className="member-list">
            <div className="member-list-header">
              <h3>Members - {members.online.length}</h3>
            </div>
            <div className="members">
              {members.online.map((member) => (
                <div key={member.id} className="member-item">
                  <div className="member-avatar" style={{ backgroundColor: member.color }}>
                    {member.initials}
                  </div>
                  <span className="member-name">{member.name}</span>
                </div>
              ))}
            </div>
          </aside>
        )}
      </div>
    </div>
  )
}

export default DiscordInterface
