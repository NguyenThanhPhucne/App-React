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
  Menu,
  ArrowLeft,
  User,
  MessageSquare,
  Pin,
  Link,
  FileText,
  Crown,
} from "lucide-react"
import "../styles/discord.css"

const DiscordInterface = () => {
  const navigate = useNavigate()
  const dropdownRef = useRef(null)
  const notificationRef = useRef(null)

  const [state, setState] = useState({
    isDarkTheme: true,
    activeChannel: "chung",
    currentServer: 0,
    serverScrollIndex: 0,
    collapsedCategories: {},
    showServerDropdown: false,
    showNotificationDropdown: false,
    showMemberList: false,
    showMobileSidebar: false,
    showMobileSearch: false,
    showMobileMembersPanel: false,
    showMobileNotificationModal: false,
    showMobileMuteModal: false,
    activeMemberTab: "Members",
    isMuted: false,
    isDeafened: false,
    notificationSettings: {
      muteChannel: false,
      useDefault: true,
      allMessages: false,
      onlyMentions: false,
      nothing: false,
    },
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
      { id: "chung", name: "chung" },
      { id: "rule-of-code", name: "rule-of-code" },
      { id: "theory-and-lecture", name: "theory-and-lecture" },
      { id: "objective", name: "objective" },
    ],
    voice: [{ id: "phong-hoc-1", name: "Phòng Học 1" }],
  }

  const members = {
    online: [
      { id: 1, name: "nokm", initials: "NK", status: "online", color: "#99aab5", isOwner: true },
      { id: 2, name: "Thành Phúc", initials: "TP", status: "online", color: "#5865f2" },
    ],
    offline: [],
  }

  const memberTabs = [
    { id: "Members", label: "Members", icon: Users },
    { id: "Media", label: "Media", icon: FileText },
    { id: "Pins", label: "Pins", icon: Pin },
    { id: "Threads", label: "Threads", icon: MessageSquare },
    { id: "Links", label: "Links", icon: Link },
    { id: "Files", label: "Files", icon: FileText },
  ]

  const serverMenuItems = [
    { id: "invite", label: "Invite People", icon: UserPlus, color: "normal" },
    { id: "settings", label: "Server Settings", icon: Settings, color: "normal" },
    { id: "notifications", label: "Notification Settings", icon: Bell, color: "normal" },
    { id: "leave", label: "Leave Server", icon: LogOut, color: "danger" },
  ]

  const muteOptions = [
    "For 15 Minutes",
    "For 1 Hour",
    "For 3 Hours",
    "For 8 Hours",
    "For 24 Hours",
    "Until I turn it back on",
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
    toggleNotificationDropdown: () => {
      const isMobile = window.innerWidth <= 767
      if (isMobile) {
        updateState({
          showMobileNotificationModal: !state.showMobileNotificationModal,
          showMobileMembersPanel: false,
        })
      } else {
        updateState({
          showNotificationDropdown: !state.showNotificationDropdown,
          showMobileMembersPanel: false,
        })
      }
    },
    toggleMemberList: () => {
      const isMobile = window.innerWidth <= 767
      if (isMobile) {
        updateState({
          showMobileMembersPanel: !state.showMobileMembersPanel,
          showMobileNotificationModal: false,
        })
      } else {
        updateState({
          showMemberList: !state.showMemberList,
          showNotificationDropdown: false,
        })
      }
    },
    toggleMobileSidebar: () =>
      updateState({
        showMobileSidebar: !state.showMobileSidebar,
        showMobileMembersPanel: false,
        showMobileNotificationModal: false,
      }),
    toggleMobileSearch: () => updateState({ showMobileSearch: !state.showMobileSearch }),
    handleServerMenuClick: (itemId) => {
      console.log(`Clicked: ${itemId}`)
      if (itemId === "leave") navigate("/")
      updateState({ showServerDropdown: false })
    },
    handleNotificationSetting: (setting) => {
      const newSettings = {
        useDefault: false,
        allMessages: false,
        onlyMentions: false,
        nothing: false,
        [setting]: true,
      }
      updateState({
        notificationSettings: { ...state.notificationSettings, ...newSettings },
      })
    },
    handleMuteOption: (option) => {
      console.log(`Mute for: ${option}`)
      updateState({
        showNotificationDropdown: false,
        showMobileNotificationModal: false,
        showMobileMuteModal: false,
      })
    },
    showMobileMuteOptions: () => {
      updateState({
        showMobileMuteModal: true,
      })
    },
    setActiveMemberTab: (tab) => {
      updateState({ activeMemberTab: tab })
    },
    closeMobilePanels: () => {
      updateState({
        showMobileSidebar: false,
        showMobileMembersPanel: false,
        showMobileNotificationModal: false,
        showMobileMuteModal: false,
        showNotificationDropdown: false,
      })
    },
  }

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        updateState({ showServerDropdown: false })
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        updateState({ showNotificationDropdown: false })
      }
    }

    const handleResize = () => {
      const isMobile = window.innerWidth <= 767
      if (!isMobile && (state.showMobileMembersPanel || state.showMobileNotificationModal)) {
        updateState({
          showMobileMembersPanel: false,
          showMobileNotificationModal: false,
          showMemberList: true,
        })
      } else if (isMobile && state.showMemberList) {
        updateState({ showMemberList: false })
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    window.addEventListener("resize", handleResize)

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      window.removeEventListener("resize", handleResize)
    }
  }, [state.showMobileMembersPanel, state.showMobileNotificationModal, state.showMemberList])

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

  const renderMemberCategory = (title, memberList) => (
    <div className="member-category" key={title}>
      <div className="member-category__title">
        {title} — {memberList.length}
      </div>
      {memberList.map((member) => (
        <div key={member.id} className="member-item">
          <div className="member-avatar">
            <div className="member-avatar-circle" style={{ backgroundColor: member.color }}>
              {member.initials}
            </div>
            <div className={`member-status member-status--${member.status}`} />
          </div>
          <div className="member-info">
            <div className="member-name">
              {member.name}
              {member.isOwner && <Crown size={14} className="owner-crown" />}
            </div>
          </div>
        </div>
      ))}
    </div>
  )

  return (
    <div className={`app ${state.isDarkTheme ? "theme-dark" : "theme-light"}`}>
      {/* Mobile Overlay */}
      {(state.showMobileSidebar || state.showMobileMembersPanel) && (
        <div
          className={`mobile-overlay ${
            state.showMobileSidebar || state.showMobileMembersPanel ? "mobile-overlay--visible" : ""
          }`}
          onClick={handlers.closeMobilePanels}
        />
      )}

      {/* Mobile Search Overlay */}
      {state.showMobileSearch && (
        <div className="mobile-search-overlay">
          <div className="mobile-search-header">
            <button className="action-btn" onClick={() => handlers.toggleMobileSearch()}>
              <ArrowLeft size={20} />
            </button>
            <input className="mobile-search-input" type="text" placeholder="Search" autoFocus />
          </div>
        </div>
      )}

      {/* Mobile Notification Modal */}
      <div
        className={`mobile-notification-modal ${
          state.showMobileNotificationModal ? "mobile-notification-modal--open" : ""
        }`}
        onClick={(e) => {
          if (e.target === e.currentTarget) handlers.closeMobilePanels()
        }}
      >
        <div className="mobile-notification-content">
          <div className="mobile-notification-header">
            <h2 className="mobile-notification-title">Notification Settings</h2>
            <button className="mobile-notification-close" onClick={handlers.closeMobilePanels}>
              <X size={20} />
            </button>
          </div>

          <div className="mobile-notification-body">
            <div className="mobile-mute-section">
              <button className="mobile-mute-item" onClick={handlers.showMobileMuteOptions}>
                <span>Mute #{state.activeChannel}</span>
                <ChevronRight size={16} />
              </button>
              <div className="mobile-mute-description">
                You won't receive notifications from muted channels, and they will appear grayed out in your channel
                list. This setting applies across all your devices.
              </div>
            </div>

            <div className="mobile-settings-section">
              <div className="mobile-settings-title">Notification Settings</div>

              <div
                className="mobile-notification-option"
                onClick={() => handlers.handleNotificationSetting("allMessages")}
              >
                <div className="mobile-notification-label">
                  <div className="mobile-notification-label-main">All Messages</div>
                </div>
                <button
                  className={`mobile-notification-radio ${
                    state.notificationSettings.allMessages ? "mobile-notification-radio--active" : ""
                  }`}
                />
              </div>

              <div
                className="mobile-notification-option"
                onClick={() => handlers.handleNotificationSetting("onlyMentions")}
              >
                <div className="mobile-notification-label">
                  <div className="mobile-notification-label-main">Only @mentions</div>
                </div>
                <button
                  className={`mobile-notification-radio ${
                    state.notificationSettings.onlyMentions ? "mobile-notification-radio--active" : ""
                  }`}
                />
              </div>

              <div className="mobile-notification-option" onClick={() => handlers.handleNotificationSetting("nothing")}>
                <div className="mobile-notification-label">
                  <div className="mobile-notification-label-main">Nothing</div>
                </div>
                <button
                  className={`mobile-notification-radio ${
                    state.notificationSettings.nothing ? "mobile-notification-radio--active" : ""
                  }`}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Mute Options Modal */}
      <div
        className={`mobile-mute-modal ${state.showMobileMuteModal ? "mobile-mute-modal--open" : ""}`}
        onClick={(e) => {
          if (e.target === e.currentTarget) updateState({ showMobileMuteModal: false })
        }}
      >
        <div className="mobile-mute-content">
          <div className="mobile-mute-header">
            <h2 className="mobile-mute-title">Mute this channel</h2>
            <div className="mobile-mute-subtitle">#{state.activeChannel}</div>
          </div>

          <div className="mobile-mute-options">
            {muteOptions.map((option) => (
              <button key={option} className="mobile-mute-option" onClick={() => handlers.handleMuteOption(option)}>
                {option}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Header */}
      <header className="header">
        <div className="header__home">
          <button className="mobile-menu-btn" onClick={handlers.toggleMobileSidebar}>
            <Menu size={20} />
          </button>
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
              return (
                <button
                  key={server.id}
                  className={`server-btn ${state.currentServer === actualIndex ? "server-btn--active" : ""}`}
                  onClick={() => updateState({ currentServer: actualIndex })}
                  style={{ "--server-color": server.color }}
                  title={server.name}
                >
                  <server.icon size={20} />
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
          <button className="mobile-search-btn" onClick={handlers.toggleMobileSearch}>
            <Search size={20} />
          </button>

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
        <aside className={`sidebar ${state.showMobileSidebar ? "sidebar--open" : ""}`}>
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
            {renderChannelCategory("text", "Kênh Chat")}
            {renderChannelCategory("voice", "Kênh Thoại")}
          </div>

          {/* Mobile Bottom Navigation */}
          <div className="mobile-bottom-nav">
            <button className="bottom-nav-item bottom-nav-item--active">
              <Home size={20} />
              <span>Home</span>
            </button>
            <button className="bottom-nav-item">
              <Bell size={20} />
              <span>Notifications</span>
            </button>
            <button className="bottom-nav-item">
              <User size={20} />
              <span>You</span>
            </button>
          </div>
        </aside>

        {/* Content */}
        <main className={`content ${state.showMemberList ? "content--with-members" : "content--without-members"}`}>
          <div className="content__header">
            <div className="channel-info">
              <Hash size={20} />
              <span className="channel-name">{state.activeChannel}</span>
              <span className="channel-desc">{members.online.length} Online</span>
            </div>

            <div className="header-actions">
              {/* Enhanced Notification Button */}
              <div
                className={`notification-container ${
                  state.showNotificationDropdown ? "notification-container--dropdown-open" : ""
                }`}
                ref={notificationRef}
              >
                <button className="notification-btn" onClick={handlers.toggleNotificationDropdown}>
                  <Bell size={20} />
                </button>

                <div className="notification-tooltip">Notification Settings</div>

                {state.showNotificationDropdown && (
                  <div className="notification-dropdown notification-dropdown--open">
                    <div className="notification-mute-container">
                      <button className="notification-mute-item">
                        <span>Mute Channel</span>
                        <ChevronRight size={14} className="submenu-arrow" />

                        <div className="mute-submenu">
                          {muteOptions.map((option) => (
                            <button
                              key={option}
                              className="mute-option"
                              onClick={() => handlers.handleMuteOption(option)}
                            >
                              {option}
                            </button>
                          ))}
                        </div>
                      </button>
                    </div>

                    <div className="notification-settings">
                      <div
                        className="notification-option"
                        onClick={() => handlers.handleNotificationSetting("useDefault")}
                      >
                        <div className="notification-label">
                          <div className="notification-label-main">Use Category Default</div>
                          <div className="notification-label-sub">All Messages</div>
                        </div>
                        <button
                          className={`notification-radio ${
                            state.notificationSettings.useDefault ? "notification-radio--active" : ""
                          }`}
                        />
                      </div>

                      <div
                        className="notification-option"
                        onClick={() => handlers.handleNotificationSetting("allMessages")}
                      >
                        <div className="notification-label">
                          <div className="notification-label-main">All Messages</div>
                        </div>
                        <button
                          className={`notification-radio ${
                            state.notificationSettings.allMessages ? "notification-radio--active" : ""
                          }`}
                        />
                      </div>

                      <div
                        className="notification-option"
                        onClick={() => handlers.handleNotificationSetting("onlyMentions")}
                      >
                        <div className="notification-label">
                          <div className="notification-label-main">Only @mentions</div>
                        </div>
                        <button
                          className={`notification-radio ${
                            state.notificationSettings.onlyMentions ? "notification-radio--active" : ""
                          }`}
                        />
                      </div>

                      <div
                        className="notification-option"
                        onClick={() => handlers.handleNotificationSetting("nothing")}
                      >
                        <div className="notification-label">
                          <div className="notification-label-main">Nothing</div>
                        </div>
                        <button
                          className={`notification-radio ${
                            state.notificationSettings.nothing ? "notification-radio--active" : ""
                          }`}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Enhanced Member List Button */}
              <div className="member-list-container">
                <button className="action-btn" onClick={handlers.toggleMemberList}>
                  <Users size={20} />
                </button>

                <div className="member-list-tooltip">
                  {state.showMemberList || state.showMobileMembersPanel ? "Hide Member List" : "Show Member List"}
                </div>
              </div>

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
              <Mic size={20} />
            </div>
          </div>
        </main>

        {/* Desktop Member List */}
        <aside className={`member-list ${state.showMemberList ? "member-list--visible" : "member-list--hidden"}`}>
          <div className="member-list__header">
            <div className="member-list__title">Members — {members.online.length + members.offline.length}</div>
            <div className="member-search">
              <Search size={16} />
              <input type="text" placeholder="Search" />
            </div>
          </div>

          <div className="member-list__content">
            {renderMemberCategory("ONLINE", members.online)}
            {renderMemberCategory("OFFLINE", members.offline)}
          </div>
        </aside>
      </div>

      {/* Mobile Members Panel */}
      <div className={`mobile-members-panel ${state.showMobileMembersPanel ? "mobile-members-panel--open" : ""}`}>
        <div className="mobile-members-panel__header">
          <button className="mobile-back-btn" onClick={() => updateState({ showMobileMembersPanel: false })}>
            <ArrowLeft size={20} />
          </button>
          <div className="mobile-channel-info">
            <Hash size={20} />
            <div className="mobile-channel-details">
              <div className="mobile-channel-name">{state.activeChannel}</div>
              <div className="mobile-channel-type">Text Channel</div>
            </div>
          </div>
          <div className="mobile-header-actions">
            <button className="mobile-action-btn">
              <Search size={20} />
            </button>
            <button className="mobile-action-btn">
              <Bell size={20} />
            </button>
            <button className="mobile-action-btn">
              <Settings size={20} />
            </button>
          </div>
        </div>

        <div className="mobile-member-tabs">
          {memberTabs.map((tab) => {
            const TabIcon = tab.icon
            return (
              <button
                key={tab.id}
                className={`mobile-member-tab ${state.activeMemberTab === tab.id ? "mobile-member-tab--active" : ""}`}
                onClick={() => handlers.setActiveMemberTab(tab.id)}
              >
                {tab.label}
              </button>
            )
          })}
        </div>

        <div className="mobile-members-panel__content">
          {state.activeMemberTab === "Members" && (
            <>
              <div className="mobile-invite-section">
                <button className="mobile-invite-btn">
                  <div className="mobile-invite-icon">
                    <UserPlus size={20} />
                  </div>
                  <span>Invite Members</span>
                  <ChevronRight size={16} />
                </button>
              </div>
              {renderMemberCategory("Online", members.online)}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default DiscordInterface
