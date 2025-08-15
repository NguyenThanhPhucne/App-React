"use client"

import { Hash, Bell, Users, Search } from "lucide-react"
import NotificationDropdown from "../notifications/NotificationDropdown"
import Tooltip from "../../ui/Tooltip"

const ContentHeader = ({ state, handlers, channel, notificationRef }) => {
  return (
    <div className="content__header">
      <div className="channel-info">
        {channel && <Hash size={20} className="channel-icon" />}
        <span className="channel-name">{channel?.name}</span>
        {/*<span className="channel-desc">{members.online.length} Online</span>*/}
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

          <NotificationDropdown state={state} handlers={handlers} isOpen={state.showNotificationDropdown} />
        </div>

        {/* Enhanced Member List Button */}
        <Tooltip
          content={state.showMemberList || state.showMobileMembersPanel ? "Hide Member List" : "Show Member List"}
        >
          <button className="action-btn" onClick={handlers.toggleMemberList}>
            <Users size={20} />
          </button>
        </Tooltip>

        <div className="search">
          <Search size={16} />
          <input type="text" placeholder="Search messages in this channel" />
        </div>
      </div>
    </div>
  )
}

export default ContentHeader
