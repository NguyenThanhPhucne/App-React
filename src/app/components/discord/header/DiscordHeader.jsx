"use client";

import { useEffect, useCallback, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { clearTextChannel } from "../../../../features/channelSlice";
import apiService from "../../../services/apiServices";
import {
  selectServers,
  selectCurrentServer,
  setCurrentServer,
} from "../../../../features/appSlice";

import { Home, Menu, UserPlus } from "lucide-react";
import ServerList from "./ServerList";
import UserPanel from "./UserPanel";
import InviteServerPopup from "./InviteServerPopup";

const DiscordHeader = ({ state, updateState, handlers }) => {
  const dispatch = useDispatch();
  const servers = useSelector(selectServers);
  const currentServer = useSelector(selectCurrentServer);
  const [isInvitePopupOpen, setIsInvitePopupOpen] = useState(false);

  // Function to fetch a specific server by ID
  const fetchServerById = useCallback(
    async (serverId) => {
      try {
        // Add validation before making API call
        if (!serverId || typeof serverId !== "string") {
          console.error("Invalid server ID:", serverId);
          return;
        }

        const serverData = await apiService.getServerById(serverId);

        // Set as current server
        dispatch(setCurrentServer(serverData));
        dispatch(clearTextChannel());
      } catch (error) {
        console.error("Error fetching server:", error);
        // Add more detailed error logging
        console.error("Failed server ID:", serverId);
        console.error("Error details:", error.message);
      }
    },
    [dispatch]
  );

  // Handle server selection
  const handleServerSelect = useCallback(
    async (serverId) => {
      // Validate serverId
      if (!serverId) {
        console.error("No server ID provided");
        return;
      }

      // Don't refetch if this server is already selected
      if (currentServer?._id === serverId) {
        return;
      }

      // Fetch the server data
      await fetchServerById(serverId);
    },
    [currentServer?._id, fetchServerById]
  );

  // Auto-select first server when servers are loaded and no current server is set
  useEffect(() => {
    if (servers.length > 0 && !currentServer) {
      // Use _id instead of id, and check if servers array has the correct structure
      const firstServer = servers[0];
      const firstServerId = firstServer._id || firstServer.id;

      if (firstServerId) {
        handleServerSelect(firstServerId);
      } else {
        console.error("No valid server ID found in first server:", firstServer);
      }
    }
  }, [servers, currentServer, handleServerSelect]);

  return (
    <>
      <header className="header">
        <div className="header__home">
          <button
            className="mobile-menu-btn"
            onClick={handlers.toggleMobileSidebar}
          >
            <Menu size={20} />
          </button>
          <button className="home-btn">
            <Home size={20} />
          </button>
          <button
            className="invite-btn"
            onClick={() => setIsInvitePopupOpen(true)}
            title="Join Server"
          >
            <UserPlus size={20} />
          </button>
        </div>

        <div className="header__center">
          <ServerList
            servers={servers}
            state={state}
            updateState={handleServerSelect}
            handlers={handlers}
          />
        </div>

        <UserPanel state={state} handlers={handlers} />
      </header>

      <InviteServerPopup
        isOpen={isInvitePopupOpen}
        onClose={() => setIsInvitePopupOpen(false)}
      />
    </>
  );
};

export default DiscordHeader;
