"use client"

import { ChevronRight } from "lucide-react"
import "./NotificationDropdown.css"

const NotificationDropdown = ({ show, muteOptions, notificationSettings, onMuteOption, onNotificationSetting }) => {
  if (!show) return null

  return (
    <div className="notification-dropdown notification-dropdown--open">
      <div className="notification-mute-container">
        <button className="notification-mute-item">
          <span>Mute Channel</span>
          <ChevronRight size={14} className="submenu-arrow" />

          <div className="mute-submenu">
            {muteOptions.map((option) => (
              <button key={option} className="mute-option" onClick={() => onMuteOption(option)}>
                {option}
              </button>
            ))}
          </div>
        </button>
      </div>

      <div className="notification-settings">
        <div className="notification-option" onClick={() => onNotificationSetting("useDefault")}>
          <div className="notification-label">
            <div className="notification-label-main">Use Category Default</div>
            <div className="notification-label-sub">All Messages</div>
          </div>
          <button
            className={`notification-radio ${notificationSettings.useDefault ? "notification-radio--active" : ""}`}
          />
        </div>

        <div className="notification-option" onClick={() => onNotificationSetting("allMessages")}>
          <div className="notification-label">
            <div className="notification-label-main">All Messages</div>
          </div>
          <button
            className={`notification-radio ${notificationSettings.allMessages ? "notification-radio--active" : ""}`}
          />
        </div>

        <div className="notification-option" onClick={() => onNotificationSetting("onlyMentions")}>
          <div className="notification-label">
            <div className="notification-label-main">Only @mentions</div>
          </div>
          <button
            className={`notification-radio ${notificationSettings.onlyMentions ? "notification-radio--active" : ""}`}
          />
        </div>

        <div className="notification-option" onClick={() => onNotificationSetting("nothing")}>
          <div className="notification-label">
            <div className="notification-label-main">Nothing</div>
          </div>
          <button
            className={`notification-radio ${notificationSettings.nothing ? "notification-radio--active" : ""}`}
          />
        </div>
      </div>
    </div>
  )
}

export default NotificationDropdown
