"use client"

import MobileOverlay from "../../ui/MobileOverlay"
import MobileSearchOverlay from "./MobileSearchOverlay"
import MobileNotificationModal from "./MobileNotificationModal"
import MobileMembersPanel from "./MobileMembersPanel"
import MobileMuteModal from "./MobileMuteModal"
import MobileNotificationSettingsModal from "./MobileNotificationSettingsModal"
import MobileSidebar from "./MobileSidebar"
import MobileServerSidebar from "./MobileServerSidebar"

const MobileDiscordInterface = ({ state, handlers, members }) => {
  return (
    <>
      {/* Mobile Overlay */}
      <MobileOverlay
        isVisible={state.showMobileSidebar || state.showMobileMembersPanel || state.showMobileServerSidebar}
        onClick={handlers.closeMobilePanels}
      />

      {/* Mobile Main Sidebar - Hiển thị servers và channels */}
      <MobileSidebar
        isOpen={state.showMobileSidebar}
        onClose={() => handlers.updateState({ showMobileSidebar: false })}
        state={state}
        handlers={handlers}
      />

      {/* Mobile Server Sidebar */}
      <MobileServerSidebar
        isOpen={state.showMobileServerSidebar}
        onClose={() => handlers.updateState({ showMobileServerSidebar: false })}
        state={state}
        handlers={handlers}
      />

      {/* Mobile Search Overlay */}
      <MobileSearchOverlay isVisible={state.showMobileSearch} onClose={handlers.toggleMobileSearch} />

      {/* Mobile Notification Modal */}
      <MobileNotificationModal state={state} handlers={handlers} />

      {/* Mobile Mute Modal */}
      <MobileMuteModal state={state} handlers={handlers} />

      {/* Mobile Notification Settings Modal */}
      <MobileNotificationSettingsModal state={state} handlers={handlers} />

      {/* Mobile Members Panel */}
      <MobileMembersPanel state={state} handlers={handlers} members={members} />
    </>
  )
}

export default MobileDiscordInterface
