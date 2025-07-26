"use client"

import { ArrowLeft, ChevronRight } from "lucide-react"
import "./MobileNotificationModal.css"

const MobileNotificationModal = ({
  show,
  activeChannel,
  muteOptions,
  notificationSettings,
  onClose,
  onMuteOption,
  onNotificationSetting,
  onShowSettings,
}) => {
  if (!show) return null

  return (
    <div
      className={`mobile-notification-modal ${show ? "mobile-notification-modal--open" : ""}`}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="mobile-notification-content">
        <div className="mobile-notification-header">
          <button className="mobile-back-btn" onClick={onClose}>
            <ArrowLeft size={20} />
          </button>
          <div className="mobile-notification-header-content">
            <h2 className="mobile-notification-title">Mute this channel</h2>
            <div className="mobile-notification-subtitle">#{activeChannel}</div>
          </div>
        </div>

        <div className="mobile-notification-body">
          <div className="mobile-mute-options-container">
            {muteOptions.map((option) => (
              <button key={option} className="mobile-mute-option" onClick={() => onMuteOption(option)}>
                {option}
              </button>
            ))}
          </div>

          <div className="mobile-notification-settings-section">
            <button className="mobile-notification-settings-btn" onClick={onShowSettings}>
              <span>Notification Settings</span>
              <ChevronRight size={16} />
            </button>
            <div className="mobile-notification-description">
              You are receiving notifications from all messages in this server, but you can override it here
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MobileNotificationModal
