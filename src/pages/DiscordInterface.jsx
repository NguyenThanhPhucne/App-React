"use client"

import { useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import { selectSelectedServerId, selectServers, setServers } from "../features/appSlice"
import { useDiscordState } from "../hooks/useDiscordState"
import { useDiscordHandlers } from "../hooks/useDiscordHandlers"
import { members } from "../app/data/discordData"
import apiService from "../app/services/apiServices"

import DiscordHeader from "../app/components/discord/header/DiscordHeader";
import ServerSettingsModal from "../app/components/discord/modals/ServerSettingsModal";
import CreateServerModal from "../app/components/discord/modals/CreateServerModal";
import ChannelSettingsModal from "../app/components/discord/modals/ChannelSettingsModal";
import CreateChannelModal from "../app/components/discord/modals/CreateChannelModal";
import MobileDiscordInterface from "../app/components/discord/mobile/MobileDiscordInterface";
import DesktopDiscordInterface from "../app/components/discord/desktop/DesktopDiscordInterface";
import UserSettingsModal from "../app/components/discord/modals/UserSettingsModal";

import "../styles/discord.css";

const DiscordInterface = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const selectedServerId = useSelector(selectSelectedServerId)
  const servers = useSelector(selectServers)
  const { state, updateState, dropdownRef, notificationRef } = useDiscordState()
  const handlers = useDiscordHandlers(state, updateState)

  // Load servers if not already loaded
  useEffect(() => {
    const loadServers = async () => {
      if (servers.length === 0) {
        try {
          console.log("Loading servers in DiscordInterface...")
          const serverList = await apiService.getUserServers()
          dispatch(setServers(serverList))
          console.log("Servers loaded:", serverList)
        } catch (error) {
          console.error("Error loading servers:", error)
        }
      }
    }

    loadServers()
  }, [servers.length, dispatch])

  useEffect(() => {
    // Redirect to server selection if no server is selected
    if (!selectedServerId) {
      navigate("/servers", { replace: true })
      return
    }
  }, [selectedServerId, navigate])

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
      <MobileDiscordInterface
        state={state}
        handlers={handlers}
        members={members}
      />

      {/* User Settings Modal */}
      <UserSettingsModal
        isOpen={state.showUserSettingsModal}
        onClose={() => handlers.toggleUserSettingsModal()}
      />

      {/* Create Server Modal */}
      <CreateServerModal
        isOpen={state.showCreateServerModal}
        onClose={() => handlers.toggleCreateServerModal()}
        onServerCreated={handlers.handleServerCreated}
      />

      {/* Channel Settings Modal */}
      <ServerSettingsModal
        isOpen={state.showServerSettingsModal}
        onClose={() => handlers.toggleServerSettingsModal()}
      />

      {/* Create Channel Modal */}
      <CreateChannelModal
        isOpen={state.showCreateChannelModal}
        onClose={() => {
          handlers.toggleCreateChannelModal();
          handlers.updateState({ channelTypeToCreate: null });
        }}
        onChannelCreated={handlers.handleChannelCreated}
        channelType={state.channelTypeToCreate}
      />

      {/* Channel Settings Modal */}
      <ChannelSettingsModal
        isOpen={state.showChannelSettingsModal}
        onClose={() => handlers.toggleChannelSettingsModal()}
        channel={state.selectedChannelForSettings}
        onChannelUpdated={handlers.handleChannelUpdated}
        onChannelDeleted={handlers.handleChannelDeleted}
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
