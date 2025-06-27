"use client"

import { useState, useRef, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import {
  Home,
  Hash,
  Volume2,
  ChevronDown,
  ChevronRight,
  Plus,
  Settings,
  Bell,
  Users,
  Search,
  Paperclip,
  Smile,
  Mic,
  MicOff,
  Headphones,
  Gamepad2,
  BookOpen,
  Music,
  Palette,
  Monitor,
  ChevronLeft,
  Sun,
  Moon,
  UserPlus,
  LogOut,
  X,
} from "lucide-react"
import "../styles/discord.css"

const DiscordInterface = () => {
  const navigate = useNavigate()
  const dropdownRef = useRef(null)

  const [state, setState] = useState({
    isDarkTheme: true,
    activeChannel: "general",
    currentServer: 0,
    serverScrollIndex: 0,
    collapsedCategories: {},
    showServerDropdown: false,
    isMuted: false,
    isDeafened: false,
  })

  const updateState = (updates) => setState((prev) => ({ ...prev, ...updates }))

  const servers = [
    { id: 1, name: "Gaming Hub", icon: Gamepad2, color: "#5865f2" },
    { id: 2, name: "Study Group", icon: BookOpen, color: "#57f287" },
    { id: 3, name: "Music Lovers", icon: Music, color: "#fee75c" },
    { id: 4, name: "Art Community", icon: Palette, color: "#eb459e" },
    { id: 5, name: "Tech Talk", icon: Monitor, color: "#00d4aa" },
  ]

  const channels = {
    text: [
      { id: "general", name: "general" },
      { id: "memes", name: "memes" },
      { id: "gaming", name: "gaming" },
    ],
    voice: [
      { id: "general-voice", name: "General Voice" },
      { id: "gaming-voice", name: "Gaming Voice" },
    ],
  }

  const serverMenuItems = [
    { id: "invite", label: "Invite People", icon: UserPlus, color: "normal" },
    { id: "settings", label: "Server Settings", icon: Settings, color: "normal" },
    { id: "notifications", label: "Notification Settings", icon: Bell, color: "normal" },
    { id: "leave", label: "Leave Server", icon: LogOut, color: "danger" },
  ]

  const handlers = {
    toggleTheme: () => updateState({ isDarkTheme: !state.isDarkTheme }),
    toggleMute: () =>
      updateState({
        isMuted: !state.isMuted,
        isDeafened: state.isDeafened ? false : state.isDeafened,
      }),
    toggleDeafen: () => {
      const newDeafenState = !state.isDeafened
      updateState({
        isDeafened: newDeafenState,
        isMuted: newDeafenState ? true : state.isMuted,
      })
    },
    scrollServers: (direction) => {
      const maxScroll = Math.max(0, servers.length - 3)
      const newIndex =
        direction === "left"
          ? Math.max(0, state.serverScrollIndex - 1)
          : Math.min(maxScroll, state.serverScrollIndex + 1)
      updateState({ serverScrollIndex: newIndex })
    },
    toggleCategory: (categoryId) =>
      updateState({
        collapsedCategories: {
          ...state.collapsedCategories,
          [categoryId]: !state.collapsedCategories[categoryId],
        },
      }),
    toggleServerDropdown: () => updateState({ showServerDropdown: !state.showServerDropdown }),
    handleServerMenuClick: (itemId) => {
      console.log(`Clicked: ${itemId}`)
      if (itemId === "leave") navigate("/")
      updateState({ showServerDropdown: false })
    },
  }

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        updateState({ showServerDropdown: false })
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const visibleServers = servers.slice(state.serverScrollIndex, state.serverScrollIndex + 3)

  const renderChannelCategory = (type, title) => (
    <div className="category" key={type}>
      <button className="category__header" onClick={() => handlers.toggleCategory(type)}>
        {state.collapsedCategories[type] ? <ChevronRight size={12} /> : <ChevronDown size={12} />}
        <span>{title}</span>
        <Plus size={16} className="category__add" />
      </button>

      <div className={`category__content ${state.collapsedCategories[type] ? "category__content--collapsed" : ""}`}>
        {channels[type].map((channel) => (
          <button
            key={channel.id}
            className={`channel ${state.activeChannel === channel.id ? "channel--active" : ""}`}
            onClick={() => updateState({ activeChannel: channel.id })}
          >
            {type === "text" ? <Hash size={16} /> : <Volume2 size={16} />}
            <span>{channel.name}</span>
          </button>
        ))}
      </div>
    </div>
  )

  return (
    <div className={`app ${state.isDarkTheme ? "theme-dark" : "theme-light"}`}>
      {/* Header */}
      <header className="header">
        <div className="header__home">
          <button className="home-btn">
            <Home size={20} />
          </button>
        </div>

        <div className="header__servers">
          {state.serverScrollIndex > 0 && (
            <button className="scroll-btn" onClick={() => handlers.scrollServers("left")}>
              <ChevronLeft size={16} />
            </button>
          )}

          <div className="server-list">
            {visibleServers.map((server, index) => {
              const actualIndex = state.serverScrollIndex + index
              const ServerIcon = server.icon
              return (
                <button
                  key={server.id}
                  className={`server-btn ${state.currentServer === actualIndex ? "server-btn--active" : ""}`}
                  onClick={() => updateState({ currentServer: actualIndex })}
                  style={{ "--server-color": server.color }}
                  title={server.name}
                >
                  <ServerIcon size={20} />
                </button>
              )
            })}
          </div>

          {state.serverScrollIndex < servers.length - 3 && (
            <button className="scroll-btn" onClick={() => handlers.scrollServers("right")}>
              <ChevronRight size={16} />
            </button>
          )}

          <button className="add-server-btn">
            <Plus size={20} />
          </button>
        </div>

        <div className="header__controls">
          <button className="theme-toggle" onClick={handlers.toggleTheme}>
            {state.isDarkTheme ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          <div className="user-panel">
            <div className="user-info">
              <div className="user-avatar">
                <span>U</span>
                <div className="status-dot" />
              </div>
              <div className="user-details">
                <span className="username">User</span>
                <span className="status">Online</span>
              </div>
            </div>
            <div className="user-actions">
              <button
                className={`action-btn ${state.isMuted ? "action-btn--muted" : ""}`}
                onClick={handlers.toggleMute}
                title={state.isMuted ? "Unmute" : "Mute"}
              >
                {state.isMuted ? <MicOff size={16} /> : <Mic size={16} />}
              </button>
              <button
                className={`action-btn ${state.isDeafened ? "action-btn--deafened" : ""}`}
                onClick={handlers.toggleDeafen}
                title={state.isDeafened ? "Undeafen" : "Deafen"}
              >
                <Headphones size={16} />
                {state.isDeafened && <div className="deafen-indicator" />}
              </button>
              <button className="action-btn" title="Logout" onClick={() => navigate("/")}>
                <LogOut size={16} />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="main">
        {/* Sidebar */}
        <aside className="sidebar">
          <div className="sidebar__header" ref={dropdownRef}>
            <button className="server-dropdown-btn" onClick={handlers.toggleServerDropdown}>
              <h3>{servers[state.currentServer].name}</h3>
              <ChevronDown
                size={16}
                className={`dropdown-arrow ${state.showServerDropdown ? "dropdown-arrow--open" : ""}`}
              />
            </button>

            {state.showServerDropdown && (
              <div className="server-dropdown">
                <div className="server-dropdown__header">
                  <span>{servers[state.currentServer].name}</span>
                  <button className="close-btn" onClick={() => updateState({ showServerDropdown: false })}>
                    <X size={16} />
                  </button>
                </div>

                <div className="server-dropdown__content">
                  {serverMenuItems.map((item) => {
                    const ItemIcon = item.icon
                    return (
                      <button
                        key={item.id}
                        className={`dropdown-item ${item.color === "danger" ? "dropdown-item--danger" : ""}`}
                        onClick={() => handlers.handleServerMenuClick(item.id)}
                      >
                        <ItemIcon size={16} />
                        <span>{item.label}</span>
                      </button>
                    )
                  })}
                </div>
              </div>
            )}
          </div>

          <div className="sidebar__content">
            {renderChannelCategory("text", "TEXT CHANNELS")}
            {renderChannelCategory("voice", "VOICE CHANNELS")}
          </div>
        </aside>

        {/* Content */}
        <main className="content">
          <div className="content__header">
            <div className="channel-info">
              <Hash size={20} />
              <span className="channel-name">{state.activeChannel}</span>
              <span className="channel-desc">Welcome to #{state.activeChannel}!</span>
            </div>

            <div className="header-actions">
              <button className="action-btn">
                <Bell size={20} />
              </button>
              <button className="action-btn">
                <Users size={20} />
              </button>
              <div className="search">
                <Search size={16} />
                <input type="text" placeholder="Search" />
              </div>
            </div>
          </div>

          <div className="content__body">
            <div className="welcome">
              <div className="welcome__icon">
                <Hash size={48} />
              </div>
              <h2>Welcome to #{state.activeChannel}!</h2>
              <p>This is the start of the #{state.activeChannel} channel.</p>
            </div>
          </div>

          <div className="content__footer">
            <div className="message-input">
              <Paperclip size={20} />
              <input type="text" placeholder={`Message #${state.activeChannel}`} />
              <Smile size={20} />
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default DiscordInterface
