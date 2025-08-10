"use client"

import { useState, useRef } from "react"

export const useDiscordState = () => {
  const dropdownRef = useRef(null)
  const notificationRef = useRef(null)

  const [state, setState] = useState({
    isDarkTheme: true,
    activeChannel: "chung",
    currentServer: 0,
    serverScrollIndex: 0,
    collapsedCategories: {},
    showServerDropdown: false,
    showNotificationDropdown: false,
    showMemberList: false,
    showMobileSidebar: false,
    showMobileSearch: false,
    showMobileMembersPanel: false,
    showMobileNotificationModal: false,
    showMobileMuteModal: false,
    showMobileNotificationSettings: false,
    showMobileServerSidebar: false,
    showCreateServerModal: false,
    showCreateChannelModal: false,
    channelTypeToCreate: null,
    memberSearchQuery: "",
    isMuted: false,
    isDeafened: false,
    hasNotifications: true, // Demo state for notification badge
    notificationCount: 3, // Demo notification count
    notificationSettings: {
      muteChannel: false,
      useDefault: true,
      allMessages: false,
      onlyMentions: false,
      nothing: false,
    },
    showMobileSearchInput: false,
    activeMemberTab: "Members",
  })

  const updateState = (updates) => setState((prev) => ({ ...prev, ...updates }))

  return {
    state,
    updateState,
    dropdownRef,
    notificationRef,
  }
}
