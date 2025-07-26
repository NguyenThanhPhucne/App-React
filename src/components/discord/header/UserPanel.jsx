"use client"

import { Mic, MicOff, Headphones, Settings, LogOut } from "lucide-react"
import { useSelector } from "react-redux"
import { selectUser } from "../../../features/userSlice"
import Tooltip from "../../ui/Tooltip"

const UserPanel = ({ state, handlers }) => {
  const user = useSelector(selectUser)

  return (
    <div className="user-panel">
      <div className="user-info">
        <div className="user-avatar">
          <span>U</span>
          <div className="status-dot" />
        </div>
        <div className="user-details">
          <span className="username">{user?.username}</span>
          <span className="status">Online</span>
        </div>
      </div>
      <div className="user-actions">
        {/* Mic button with tooltip */}
        <Tooltip content={state.isMuted ? "Unmute" : "Mute"}>
          <button className={`action-btn ${state.isMuted ? "action-btn--muted" : ""}`} onClick={handlers.toggleMute}>
            {state.isMuted ? <MicOff size={16} /> : <Mic size={16} />}
          </button>
        </Tooltip>

        {/* Headphone button with tooltip */}
        <Tooltip content={state.isDeafened ? "Undeafen" : "Deafen"}>
          <button
            className={`action-btn ${state.isDeafened ? "action-btn--deafened" : ""}`}
            onClick={handlers.toggleDeafen}
          >
            <Headphones size={16} />
            {state.isDeafened && <div className="deafen-indicator" />}
          </button>
        </Tooltip>

        {/* Settings button */}
        <Tooltip content="User Settings">
          <button className="action-btn" onClick={() => console.log("Settings clicked")}>
            <Settings size={16} />
          </button>
        </Tooltip>

        {/* Logout button */}
        <Tooltip content="Logout">
          <button className="action-btn logout-btn" onClick={handlers.handleLogout}>
            <LogOut size={16} />
          </button>
        </Tooltip>
      </div>
    </div>
  )
}

export default UserPanel
