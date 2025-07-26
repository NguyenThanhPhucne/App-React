"use client"

import { muteOptions } from "../../../data/discordData"

const MobileMuteModal = ({ state, handlers }) => {
  return (
    <div
      className={`mobile-mute-modal ${state.showMobileMuteModal ? "mobile-mute-modal--open" : ""}`}
      onClick={(e) => {
        if (e.target === e.currentTarget) handlers.updateState({ showMobileMuteModal: false })
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
  )
}

export default MobileMuteModal
