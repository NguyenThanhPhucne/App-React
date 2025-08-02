"use client"

import { ChevronRight } from "lucide-react"
import { muteOptions } from "../../../data/discordData"

const NotificationDropdown = ({ state, handlers, isOpen }) => {
  if (!isOpen) return null

  return (
    <div className="notification-dropdown notification-dropdown--open">
      <div className="notification-mute-container">
        <button className="notification-mute-item">
          <span>Mute Channel</span>
          <ChevronRight size={14} className="submenu-arrow" />

          <div className="mute-submenu">
            {muteOptions.map((option) => (
              <button key={option} className="mute-option" onClick={() => handlers.handleMuteOption(option)}>
                {option}
              </button>
            ))}
          </div>
        </button>
      </div>

      <div className="notification-settings">
        <div className="notification-option" onClick={() => handlers.handleNotificationSetting("useDefault")}>
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

        <div className="notification-option" onClick={() => handlers.handleNotificationSetting("allMessages")}>
          <div className="notification-label">
            <div className="notification-label-main">All Messages</div>
          </div>
          <button
            className={`notification-radio ${
              state.notificationSettings.allMessages ? "notification-radio--active" : ""
            }`}
          />
        </div>

        <div className="notification-option" onClick={() => handlers.handleNotificationSetting("onlyMentions")}>
          <div className="notification-label">
            <div className="notification-label-main">Only @mentions</div>
          </div>
          <button
            className={`notification-radio ${
              state.notificationSettings.onlyMentions ? "notification-radio--active" : ""
            }`}
          />
        </div>

        <div className="notification-option" onClick={() => handlers.handleNotificationSetting("nothing")}>
          <div className="notification-label">
            <div className="notification-label-main">Nothing</div>
          </div>
          <button
            className={`notification-radio ${state.notificationSettings.nothing ? "notification-radio--active" : ""}`}
          />
        </div>
      </div>
    </div>
  )
}

export default NotificationDropdown
