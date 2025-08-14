"use client"

import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { signOut } from "../features/userSlice";
import {
  clearServers,
  updateServerInList,
  selectCurrentServer,
  addServer,
  updateChannelInCurrentServer,
  removeChannelFromCurrentServer,
} from "../features/appSlice";
import { clearTextChannel, clearVoiceChannel } from "../features/channelSlice";
import apiService from "../app/services/apiServices";

export const useDiscordHandlers = (state, updateState) => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const currentServer = useSelector(selectCurrentServer)

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
        showMobileServerSidebar: false,
      })
    },

    toggleCreateServerModal: () => {
      updateState({ showCreateServerModal: !state.showCreateServerModal })
    },

    handleServerCreated: async (newServer) => {
      dispatch(addServer(newServer));
      console.log("New server created:");
    },

    toggleCreateChannelModal: () => {
      updateState({ showCreateChannelModal: !state.showCreateChannelModal })
    },

    handleChannelCreated: async (serverId, createdChannel) => {
      console.log("New channel created:", createdChannel);
      console.log("Server ID:", serverId);

      try {
        // Update the current server's channels array in Redux
        if (currentServer && currentServer._id === serverId) {
          const updatedServer = {
            ...currentServer,
            channels: [...(currentServer.channels || []), createdChannel],
          };

          // Update the server in the Redux store
          dispatch(updateServerInList(updatedServer));

          console.log("Server channels updated in Redux");
        }
      } catch (error) {
        console.error("Error updating channel in Redux:", error);
      }
    },

    toggleChannelSettingsModal: (channel = null) => {
      updateState({
        showChannelSettingsModal: !state.showChannelSettingsModal,
        selectedChannelForSettings: channel,
      });
    },

    handleChannelSettings: (channel) => {
      updateState({
        showChannelSettingsModal: true,
        selectedChannelForSettings: channel,
      });
    },

    handleChannelUpdated: async (updatedChannel) => {
      console.log("Channel updated:", updatedChannel);
      try {
        dispatch(updateChannelInCurrentServer(updatedChannel));
        console.log("Channel updated in Redux store");
      } catch (error) {
        console.error("Error updating channel in Redux:", error);
      }
    },

    handleChannelDeleted: async (channelId) => {
      console.log("Channel deleted:", channelId);
      try {
        dispatch(removeChannelFromCurrentServer(channelId));
        dispatch(clearTextChannel());
        console.log("Channel removed from Redux store");
      } catch (error) {
        console.error("Error removing channel from Redux:", error);
      }
    },

    refreshServerData: async (serverId) => {
      try {
        const serverData = await apiService.getServerById(serverId)
        if (serverData) {
          dispatch(updateServerInList(serverData))
        }
      } catch (error) {
        console.error("Error refreshing server data:", error)
      }
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
        await apiService.logout();
        dispatch(signOut());
        dispatch(clearServers());
        dispatch(clearTextChannel());
        dispatch(clearVoiceChannel);

        // Clear both token and user data
        localStorage.removeItem("accessToken")
      } catch (error) {
        console.error("Logout error:", error)
        dispatch(signOut())
        dispatch(clearServers())

        // Clear both token and user data in error case too
        localStorage.removeItem("accessToken")
      }
    },
    toggleServerSettingsModal: () => {
      updateState({ showServerSettingsModal: !state.showServerSettingsModal });
    },

    handleServerSettings: () => {
      updateState({ showServerSettingsModal: true });
    },
    updateState,

    toggleUserSettingsModal: () => {
      updateState({ showUserSettingsModal: !state.showUserSettingsModal });
    },
  };

  return handlers
}
