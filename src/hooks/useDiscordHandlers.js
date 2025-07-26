"use client"

import { useNavigate } from "react-router-dom"
import { useDispatch } from "react-redux"
import { signOut } from "../features/userSlice"
import { apiService } from "../services/apiServices"

export const useDiscordHandlers = (state, updateState) => {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const handlers = {
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

    scrollServers: (direction, servers) => {
      const maxScroll = Math.max(0, servers.length - 3)
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

    handleServerMenuClick: (itemId) => {
      console.log(`Clicked: ${itemId}`)
      if (itemId === "leave") navigate("/")
      updateState({ showServerDropdown: false })
    },

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

    showMobileMuteOptions: () => {
      updateState({
        showMobileMuteModal: true,
      })
    },

    setActiveMemberTab: (tab) => {
      updateState({ activeMemberTab: tab })
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

    showMuteOptions: () => {
      updateState({
        showMobileMuteModal: true,
        showMobileNotificationSettings: false,
      })
    },

    handleMobileSearch: (query) => {
      updateState({ memberSearchQuery: query })
    },

    toggleMobileSearchInput: () => {
      updateState({
        showMobileSearchInput: !state.showMobileSearchInput,
        memberSearchQuery: state.showMobileSearchInput ? "" : state.memberSearchQuery,
      })
    },

    handleLogout: async () => {
      try {
        await apiService.logout()
        dispatch(signOut())
        localStorage.removeItem("accessToken")
        navigate("/login")
      } catch (error) {
        console.error("Logout error:", error)
        dispatch(signOut())
        localStorage.removeItem("accessToken")
        navigate("/login")
      }
    },

    // Thêm updateState để các component con có thể sử dụng
    updateState,
  }

  return handlers
}
