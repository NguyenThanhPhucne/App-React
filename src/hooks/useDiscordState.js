"use client";

import { useState, useRef, useCallback } from "react";

export const useDiscordState = () => {
  const dropdownRef = useRef(null);
  const notificationRef = useRef(null);

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
    showServerSettingsModal: false,
    showCreateChannelModal: false,
    showChannelSettingsModal: false,
    channelTypeToCreate: null,
    selectedChannelForSettings: null,
    memberSearchQuery: "",
    isMuted: false,
    isDeafened: false,
    hasNotifications: true,
    notificationCount: 3,
    notificationSettings: {
      muteChannel: false,
      useDefault: true,
      allMessages: false,
      onlyMentions: false,
      nothing: false,
    },
    showMobileSearchInput: false,
    activeMemberTab: "Members",
    showUserSettingsModal: false,
  });

  // Wrap updateState in useCallback to prevent recreation on every render
  const updateState = useCallback((updates) => {
    setState((prev) => ({ ...prev, ...updates }));
  }, []);

  return {
    state,
    updateState,
    dropdownRef,
    notificationRef,
  };
};
