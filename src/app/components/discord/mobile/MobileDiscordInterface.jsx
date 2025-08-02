import MobileOverlay from "../../ui/MobileOverlay";
import MobileSearchOverlay from "./MobileSearchOverlay";
import MobileNotificationModal from "./MobileNotificationModal";
import MobileMembersPanel from "./MobileMembersPanel";
import MobileMuteModal from "./MobileMuteModal";
import MobileNotificationSettingsModal from "./MobileNotificationSettingsModal";

const MobileDiscordInterface = ({ state, handlers, members }) => {
  return (
    <>
      {/* Mobile Overlay */}
      <MobileOverlay
        isVisible={state.showMobileSidebar || state.showMobileMembersPanel}
        onClick={handlers.closeMobilePanels}
      />

      {/* Mobile Search Overlay */}
      <MobileSearchOverlay
        isVisible={state.showMobileSearch}
        onClose={handlers.toggleMobileSearch}
      />

      {/* Mobile Notification Modal */}
      <MobileNotificationModal state={state} handlers={handlers} />

      {/* Mobile Mute Modal */}
      <MobileMuteModal state={state} handlers={handlers} />

      {/* Mobile Notification Settings Modal */}
      <MobileNotificationSettingsModal state={state} handlers={handlers} />

      {/* Mobile Members Panel */}
      <MobileMembersPanel state={state} handlers={handlers} members={members} />
    </>
  );
};

export default MobileDiscordInterface;
