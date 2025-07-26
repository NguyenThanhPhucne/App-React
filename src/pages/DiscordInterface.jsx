"use client"

import { useEffect } from "react"
import { useDiscordState } from "../hooks/useDiscordState"
import { useDiscordHandlers } from "../hooks/useDiscordHandlers"
import { servers, channels, members } from "../data/discordData"
import DiscordHeader from "../components/discord/header/DiscordHeader"
import DiscordSidebar from "../components/discord/sidebar/DiscordSidebar"
import DiscordContent from "../components/discord/content/DiscordContent"
import MemberList from "../components/discord/members/MemberList"
import MobileOverlay from "../components/ui/MobileOverlay"
import MobileSearchOverlay from "../components/discord/mobile/MobileSearchOverlay"
import MobileNotificationModal from "../components/discord/mobile/MobileNotificationModal"
import MobileMembersPanel from "../components/discord/mobile/MobileMembersPanel"
import MobileMuteModal from "../components/discord/mobile/MobileMuteModal"
import MobileNotificationSettingsModal from "../components/discord/mobile/MobileNotificationSettingsModal"
import "../styles/discord.css"

const DiscordInterface = () => {
  const { state, updateState, dropdownRef, notificationRef } = useDiscordState()
  const handlers = useDiscordHandlers(state, updateState)

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

  return (
    <div className={`app ${state.isDarkTheme ? "theme-dark" : "theme-light"}`}>
      {/* Mobile Overlay */}
      <MobileOverlay
        isVisible={state.showMobileSidebar || state.showMobileMembersPanel}
        onClick={handlers.closeMobilePanels}
      />

      {/* Mobile Search Overlay */}
      <MobileSearchOverlay isVisible={state.showMobileSearch} onClose={handlers.toggleMobileSearch} />

      {/* Mobile Notification Modal */}
      <MobileNotificationModal state={state} handlers={handlers} />

      {/* Mobile Mute Modal */}
      <MobileMuteModal state={state} handlers={handlers} />

      {/* Mobile Notification Settings Modal */}
      <MobileNotificationSettingsModal state={state} handlers={handlers} />

      {/* Header */}
      <DiscordHeader servers={servers} state={state} updateState={updateState} handlers={handlers} />

      <div className="main">
        {/* Sidebar */}
        <DiscordSidebar
          servers={servers}
          channels={channels}
          state={state}
          updateState={updateState}
          handlers={handlers}
          dropdownRef={dropdownRef}
        />

        {/* Content */}
        <DiscordContent state={state} handlers={handlers} members={members} notificationRef={notificationRef} />

        {/* Desktop Member List */}
        <MemberList state={state} handlers={handlers} members={members} />
      </div>

      {/* Mobile Members Panel */}
      <MobileMembersPanel state={state} handlers={handlers} members={members} />
    </div>
  )
}

export default DiscordInterface
