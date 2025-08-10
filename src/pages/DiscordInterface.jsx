"use client"

import { useEffect } from "react"
import { useDiscordState } from "../hooks/useDiscordState"
import { useDiscordHandlers } from "../hooks/useDiscordHandlers"
import { members } from "../app/data/discordData"

import DiscordHeader from "../app/components/discord/header/DiscordHeader"
import CreateServerModal from "../app/components/discord/modals/CreateServerModal"
import CreateChannelModal from "../app/components/discord/modals/CreateChannelModal"
import MobileDiscordInterface from "../app/components/discord/mobile/MobileDiscordInterface"
import DesktopDiscordInterface from "../app/components/discord/desktop/DesktopDiscordInterface"
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
      if (isMobile) {
        // Close desktop-specific panels on mobile
        updateState({
          showMemberList: false,
          showNotificationDropdown: false,
        })
      } else {
        // Close mobile-specific panels on desktop
        updateState({
          showMobileSidebar: false,
          showMobileMembersPanel: false,
          showMobileNotificationModal: false,
        })
      }
    }

    // Close mobile sidebar when clicking outside
    const handleMobileOverlayClick = (event) => {
      if (event.target.classList.contains("mobile-overlay--visible")) {
        updateState({ showMobileSidebar: false })
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    document.addEventListener("click", handleMobileOverlayClick)
    window.addEventListener("resize", handleResize)

    // Initial resize check
    handleResize()

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      document.removeEventListener("click", handleMobileOverlayClick)
      window.removeEventListener("resize", handleResize)
    }
  }, [updateState, dropdownRef, notificationRef])

  return (
    <div className={`app ${state.isDarkTheme ? "theme-dark" : "theme-light"}`}>
      {/* Mobile Components */}
      <MobileDiscordInterface state={state} handlers={handlers} members={members} />

      {/* Create Server Modal */}
      <CreateServerModal
        isOpen={state.showCreateServerModal}
        onClose={() => handlers.toggleCreateServerModal()}
        onServerCreated={handlers.handleServerCreated}
      />

      {/* Create Channel Modal */}
      <CreateChannelModal
        isOpen={state.showCreateChannelModal}
        onClose={() => {
          handlers.toggleCreateChannelModal()
          handlers.updateState({ channelTypeToCreate: null })
        }}
        onChannelCreated={handlers.handleChannelCreated}
        channelType={state.channelTypeToCreate}
      />

      {/* Header */}
      <DiscordHeader state={state} handlers={handlers} />

      {/* Main Interface */}
      <DesktopDiscordInterface
        state={state}
        handlers={handlers}
        dropdownRef={dropdownRef}
        notificationRef={notificationRef}
        members={members}
      />
    </div>
  )
}

export default DiscordInterface
