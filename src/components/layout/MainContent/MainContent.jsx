"use client"

import { Hash, Bell, Users, Search, Paperclip, Smile, Mic } from "lucide-react"
import NotificationDropdown from "../../shared/Dropdowns/NotificationDropdown"
import "./MainContent.css"

const MainContent = ({ state, members, muteOptions, handlers }) => {
  return (
    <main className={`content ${state.showMemberList ? "content--with-members" : "content--without-members"}`}>
      <div className="content__header">
        <div className="channel-info">
          <Hash size={20} />
          <span className="channel-name">{state.activeChannel}</span>
          <span className="channel-desc">{members.online.length} Online</span>
        </div>

        <div className="header-actions">
          {/* Notification Button */}
          <div className="notification-container">
            <button className="notification-btn" onClick={handlers.toggleNotificationDropdown}>
              <Bell size={20} />
            </button>
            <div className="notification-tooltip">Notification Settings</div>

            <NotificationDropdown
              show={state.showNotificationDropdown}
              muteOptions={muteOptions}
              notificationSettings={state.notificationSettings}
              onMuteOption={handlers.handleMuteOption}
              onNotificationSetting={handlers.handleNotificationSetting}
            />
          </div>

          {/* Member List Button */}
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
  )
}

export default MainContent
