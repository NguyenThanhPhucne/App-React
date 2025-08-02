"use client";

import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { signOut } from "../features/userSlice";
import {
  clearServers,
  updateServerInList,
  selectCurrentServer,
} from "../features/appSlice";
import apiService from "../app/services/apiServices";

export const useDiscordHandlers = (state, updateState) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const currentServer = useSelector(selectCurrentServer);

  const handlers = {
    toggleTheme: () => updateState({ isDarkTheme: !state.isDarkTheme }),

    toggleMute: () =>
      updateState({
        isMuted: !state.isMuted,
        isDeafened: state.isDeafened ? false : state.isDeafened,
      }),

    toggleDeafen: () => {
      const newDeafenState = !state.isDeafened;
      updateState({
        isDeafened: newDeafenState,
        isMuted: newDeafenState ? true : state.isMuted,
      });
    },

    scrollServers: (direction, servers) => {
      const maxScroll = Math.max(0, servers.length - 3);
      const newIndex =
        direction === "left"
          ? Math.max(0, state.serverScrollIndex - 1)
          : Math.min(maxScroll, state.serverScrollIndex + 1);
      updateState({ serverScrollIndex: newIndex });
    },

    toggleCategory: (categoryId) =>
      updateState({
        collapsedCategories: {
          ...state.collapsedCategories,
          [categoryId]: !state.collapsedCategories[categoryId],
        },
      }),

    toggleServerDropdown: () =>
      updateState({ showServerDropdown: !state.showServerDropdown }),

    toggleNotificationDropdown: () => {
      const isMobile = window.innerWidth <= 767;
      if (isMobile) {
        updateState({
          showMobileNotificationModal: !state.showMobileNotificationModal,
          showMobileMembersPanel: false,
        });
      } else {
        updateState({
          showNotificationDropdown: !state.showNotificationDropdown,
          showMobileMembersPanel: false,
        });
      }
    },

    toggleMemberList: () => {
      const isMobile = window.innerWidth <= 767;
      if (isMobile) {
        updateState({
          showMobileMembersPanel: !state.showMobileMembersPanel,
          showMobileNotificationModal: false,
        });
      } else {
        updateState({
          showMemberList: !state.showMemberList,
          showNotificationDropdown: false,
        });
      }
    },

    toggleMobileSidebar: () =>
      updateState({
        showMobileSidebar: !state.showMobileSidebar,
        showMobileMembersPanel: false,
        showMobileNotificationModal: false,
      }),

    toggleMobileSearch: () =>
      updateState({ showMobileSearch: !state.showMobileSearch }),

    handleServerMenuClick: (itemId) => {
      console.log(`Clicked: ${itemId}`);
      if (itemId === "leave") navigate("/");
      updateState({ showServerDropdown: false });
    },

    handleNotificationSetting: (setting) => {
      const newSettings = {
        useDefault: false,
        allMessages: false,
        onlyMentions: false,
        nothing: false,
        [setting]: true,
      };
      updateState({
        notificationSettings: { ...state.notificationSettings, ...newSettings },
      });
    },

    handleMuteOption: (option) => {
      console.log(`Mute for: ${option}`);
      updateState({
        showNotificationDropdown: false,
        showMobileNotificationModal: false,
        showMobileMuteModal: false,
      });
    },

    showMobileMuteOptions: () => {
      updateState({
        showMobileMuteModal: true,
      });
    },

    setActiveMemberTab: (tab) => {
      updateState({ activeMemberTab: tab });
    },

    closeMobilePanels: () => {
      updateState({
        showMobileSidebar: false,
        showMobileMembersPanel: false,
        showMobileNotificationModal: false,
        showMobileMuteModal: false,
        showMobileNotificationSettings: false,
        showNotificationDropdown: false,
      });
    },

    toggleCreateServerModal: () => {
      updateState({ showCreateServerModal: !state.showCreateServerModal });
    },

    handleServerCreated: async (newServer) => {
      console.log("New server created:", newServer);
      // Here you would typically add the server to your servers list
      // For now, we'll just log it and simulate a delay
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API call
      // You can implement the actual server creation logic here
    },

    toggleCreateChannelModal: () => {
      updateState({ showCreateChannelModal: !state.showCreateChannelModal });
    },

    handleChannelCreated: async (serverId, newChannel) => {
      console.log("New channel created:", newChannel);
      console.log("Server ID:", serverId);

      try {
        // Call the API to create the channel
        const result = await apiService.createChannel(serverId, newChannel);
        if (result) {
          console.log("Channel created successfully:", result.channel);

          // Update the current server's channels array in Redux
          if (currentServer && currentServer._id === serverId) {
            const updatedServer = {
              ...currentServer,
              channels: [...(currentServer.channels || []), result.channel],
            };

            // Update the server in the Redux store
            dispatch(updateServerInList(updatedServer));

            console.log("Server channels updated in Redux");
          }

          // Optionally, you can also fetch the updated server data
          // await refreshServerData(serverId);
        } else {
          console.error("Channel creation failed:", result);
        }
      } catch (error) {
        console.error("Error creating channel:", error);
        // You might want to show an error message to the user here
      }
    },

    refreshServerData: async (serverId) => {
      try {
        const serverData = await apiService.getServerById(serverId);
        if (serverData) {
          dispatch(updateServerInList(serverData));
        }
      } catch (error) {
        console.error("Error refreshing server data:", error);
      }
    },

    handleMemberSearch: (query) => {
      updateState({ memberSearchQuery: query });
    },

    showNotificationSettings: () => {
      updateState({
        showMobileNotificationSettings: true,
        showMobileNotificationModal: false,
      });
    },

    showMuteOptions: () => {
      updateState({
        showMobileMuteModal: true,
        showMobileNotificationSettings: false,
      });
    },

    handleMobileSearch: (query) => {
      updateState({ memberSearchQuery: query });
    },

    toggleMobileSearchInput: () => {
      updateState({
        showMobileSearchInput: !state.showMobileSearchInput,
        memberSearchQuery: state.showMobileSearchInput
          ? ""
          : state.memberSearchQuery,
      });
    },

    handleLogout: async () => {
      try {
        await apiService.logout();
        dispatch(signOut());
        dispatch(clearServers());

        // Clear both token and user data
        localStorage.removeItem("accessToken");
      } catch (error) {
        console.error("Logout error:", error);
        dispatch(signOut());
        dispatch(clearServers());

        // Clear both token and user data in error case too
        localStorage.removeItem("accessToken");
      }
    },
    updateState,
  };

  return handlers;
};
