"use client"

import { useEffect, useCallback } from "react"
import { useSelector, useDispatch } from "react-redux"
import { clearTextChannel } from "../../../../features/channelSlice"
import apiService from "../../../services/apiServices"
import { selectServers, selectCurrentServer, selectSelectedServerId, setCurrentServer, setSelectedServer } from "../../../../features/appSlice"

import { Home, Menu } from "lucide-react"
import ServerList from "./ServerList"
import UserPanel from "./UserPanel"

const DiscordHeader = ({ state, handlers }) => {
  const dispatch = useDispatch()
  const servers = useSelector(selectServers)
  const currentServer = useSelector(selectCurrentServer)
  const selectedServerId = useSelector(selectSelectedServerId)

  // Function to fetch a specific server by ID
  const fetchServerById = useCallback(
    async (serverId) => {
      try {
        // Add validation before making API call
        if (!serverId || typeof serverId !== "string") {
          console.error("Invalid server ID:", serverId)
          return
        }

        console.log("Fetching server data for:", serverId)
        const serverData = await apiService.getServerById(serverId)
        console.log("Server data received:", serverData)

        // Clear any existing channel data first
        dispatch(clearTextChannel())
        
        // Set as current server
        dispatch(setCurrentServer(serverData))
        
        console.log("Server data set in Redux store")
      } catch (error) {
        console.error("Error fetching server:", error)
        // Add more detailed error logging
        console.error("Failed server ID:", serverId)
        console.error("Error details:", error.message)
      }
    },
    [dispatch],
  )

  // Handle server selection
  const handleServerSelect = useCallback(
    async (serverId) => {
      // Validate serverId
      if (!serverId) {
        console.error("No server ID provided")
        return
      }

      // Check if server exists in the server list
      const serverExists = servers.some(server => server._id === serverId)
      if (!serverExists) {
        console.error("Server not found in server list:", serverId)
        return
      }

      // Don't refetch if this server is already selected
      if (currentServer?._id === serverId) {
        console.log("Server already selected:", serverId)
        return
      }

      console.log("Switching to server:", serverId)

      // Update both selectedServerId and currentServer
      dispatch(setSelectedServer(serverId))
      
      // Fetch the server data
      await fetchServerById(serverId)
      
      console.log("Server switch completed:", serverId)
    },
    [currentServer?._id, fetchServerById, dispatch, servers],
  )

  // Auto-load selected server when component mounts
  useEffect(() => {
    if (selectedServerId && (!currentServer || currentServer._id !== selectedServerId)) {
      console.log("Auto-loading server:", selectedServerId)
      handleServerSelect(selectedServerId)
    }
  }, [selectedServerId, currentServer, handleServerSelect])

  // Auto-select first server when servers are loaded and no current server is set (fallback)
  useEffect(() => {
    if (servers.length > 0 && !currentServer && !selectedServerId) {
      // Use _id instead of id, and check if servers array has the correct structure
      const firstServer = servers[0]
      const firstServerId = firstServer._id || firstServer.id

      if (firstServerId) {
        console.log("Auto-selecting first server:", firstServerId)
        handleServerSelect(firstServerId)
      } else {
        console.error("No valid server ID found in first server:", firstServer)
      }
    }
  }, [servers, currentServer, selectedServerId, handleServerSelect])

  return (
    <header className="header">
      <div className="header__home">
        {/* Mobile Hamburger Menu */}
        <button
          className="mobile-menu-btn show-mobile"
          onClick={() => handlers.updateState({ showMobileSidebar: true })}
          aria-label="Open navigation menu"
        >
          <Menu size={20} />
        </button>

        {/* Home Button */}
        <button className="home-btn">
          <Home size={20} />
        </button>

        {/* Mobile Server Name Display */}
        <div className="mobile-server-name show-mobile">
          <span>{currentServer?.name || "Select Server"}</span>
        </div>
      </div>

      {/* Desktop Server List */}
      <div className="header__center hide-mobile">
        <ServerList servers={servers} state={state} updateState={handleServerSelect} handlers={handlers} />
      </div>

      <UserPanel state={state} handlers={handlers} />
    </header>
  )
}

export default DiscordHeader
