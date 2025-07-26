"use client"

import { useState, useRef, useEffect } from "react"

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
    memberSearchQuery: "",
    isMuted: false,
    isDeafened: false,
    notificationSettings: {
      muteChannel: false,
      useDefault: true,
      allMessages: false,
      onlyMentions: false,
      nothing: false,
    },
    showMobileSearchInput: false,
  })

  const updateState = (updates) => setState((prev) => ({ ...prev, ...updates }))

  const handlers = {
    updateState,
    toggleTheme: () => updateState({ isDarkTheme: !state.isDarkTheme }),

    toggleMute: () =>
      updateState({
        isMuted: !state.isMuted,
        isDeafened: state.isDeafened ? false : state.isDeafened,
      }),

    toggleDeafen: () => {
      const newDeafenState = !state.isDeafened
      updateState({
        isDeafened: newDeafenState,
        isMuted: newDeafenState ? true : state.isMuted,
      })
    },

    scrollServers: (direction) => {
      const maxScroll = Math.max(0, 5 - 3) // Assuming 5 servers max
      const newIndex =
        direction === "left"
          ? Math.max(0, state.serverScrollIndex - 1)
          : Math.min(maxScroll, state.serverScrollIndex + 1)
      updateState({ serverScrollIndex: newIndex })
    },

    toggleCategory: (categoryId) =>
      updateState({
        collapsedCategories: {
          ...state.collapsedCategories,
          [categoryId]: !state.collapsedCategories[categoryId],
        },
      }),

    toggleServerDropdown: () => updateState({ showServerDropdown: !state.showServerDropdown }),

    toggleNotificationDropdown: () => {
      const isMobile = window.innerWidth <= 767
      if (isMobile) {
        updateState({
          showMobileNotificationModal: !state.showMobileNotificationModal,
          showMobileMembersPanel: false,
        })
      } else {
        updateState({
          showNotificationDropdown: !state.showNotificationDropdown,
          showMobileMembersPanel: false,
        })
      }
    },

    toggleMemberList: () => {
      const isMobile = window.innerWidth <= 767
      if (isMobile) {
        updateState({
          showMobileMembersPanel: !state.showMobileMembersPanel,
          showMobileNotificationModal: false,
        })
      } else {
        updateState({
          showMemberList: !state.showMemberList,
          showNotificationDropdown: false,
        })
      }
    },

    toggleMobileSidebar: () =>
      updateState({
        showMobileSidebar: !state.showMobileSidebar,
        showMobileMembersPanel: false,
        showMobileNotificationModal: false,
      }),

    toggleMobileSearch: () => updateState({ showMobileSearch: !state.showMobileSearch }),

    handleNotificationSetting: (setting) => {
      const newSettings = {
        useDefault: false,
        allMessages: false,
        onlyMentions: false,
        nothing: false,
        [setting]: true,
      }
      updateState({
        notificationSettings: { ...state.notificationSettings, ...newSettings },
      })
    },

    handleMuteOption: (option) => {
      console.log(`Mute for: ${option}`)
      updateState({
        showNotificationDropdown: false,
        showMobileNotificationModal: false,
        showMobileMuteModal: false,
      })
    },

    closeMobilePanels: () => {
      updateState({
        showMobileSidebar: false,
        showMobileMembersPanel: false,
        showMobileNotificationModal: false,
        showMobileMuteModal: false,
        showMobileNotificationSettings: false,
        showNotificationDropdown: false,
      })
    },

    handleMemberSearch: (query) => {
      updateState({ memberSearchQuery: query })
    },

    showNotificationSettings: () => {
      updateState({
        showMobileNotificationSettings: true,
        showMobileNotificationModal: false,
      })
    },

    handleMobileSearch: (query) => {
      updateState({ memberSearchQuery: query })
    },

    setActiveChannel: (channelId) => {
      updateState({ activeChannel: channelId })
    },

    setCurrentServer: (serverId) => {
      updateState({ currentServer: serverId })
    },
  }

  // Effect for handling clicks outside dropdowns
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

  return {
    state,
    handlers,
    dropdownRef,
    notificationRef,
  }
}
