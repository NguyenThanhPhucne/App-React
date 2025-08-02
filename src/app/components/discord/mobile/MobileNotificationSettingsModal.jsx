"use client"

import { ArrowLeft, ChevronRight } from "lucide-react"

const MobileNotificationSettingsModal = ({ state, handlers }) => {
  return (
    <div
      className={`mobile-notification-modal ${
        state.showMobileNotificationSettings ? "mobile-notification-modal--open" : ""
      }`}
      onClick={(e) => {
        if (e.target === e.currentTarget) handlers.closeMobilePanels()
      }}
    >
      <div className="mobile-notification-content">
        <div className="mobile-notification-header">
          <button
            className="mobile-back-btn"
            onClick={() =>
              handlers.updateState({
                showMobileNotificationSettings: false,
                showMobileNotificationModal: true,
              })
            }
          >
            <ArrowLeft size={20} />
          </button>
          <div className="mobile-notification-header-content">
            <h2 className="mobile-notification-title">Notification Settings</h2>
          </div>
        </div>

        <div className="mobile-notification-body">
          <div className="mobile-mute-section">
            <button className="mobile-mute-item" onClick={handlers.showMuteOptions}>
              <span>Mute #{state.activeChannel}</span>
              <ChevronRight size={16} />
            </button>
            <div className="mobile-mute-description">
              You won't receive notifications from muted channels, and they will appear grayed out in your channel list.
              This setting applies across all your devices.
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
  )
}

export default MobileNotificationSettingsModal
