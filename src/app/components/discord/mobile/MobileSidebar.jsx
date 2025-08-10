"use client"

import { useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import { selectServers, selectCurrentServer, setCurrentServer } from "../../../../features/appSlice"
import { setTextChannel, setVoiceChannel, selectTextChannelId } from "../../../../features/channelSlice"
import { selectUser } from "../../../../features/userSlice"
import { Plus, Hash, Volume2, ChevronDown, ChevronRight, Search, Users, Calendar, Home } from "lucide-react"
import apiService from "../../../services/apiServices"
import socketService from "../../../services/socketService"

const MobileSidebar = ({ isOpen, onClose, state, handlers }) => {
  const dispatch = useDispatch()
  const servers = useSelector(selectServers)
  const currentServer = useSelector(selectCurrentServer)
  const user = useSelector(selectUser)
  const previousChannel = useSelector(selectTextChannelId)

  const [expandedCategories, setExpandedCategories] = useState({
    text: true,
    voice: true,
  })

  const toggleCategory = (type) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [type]: !prev[type],
    }))
  }

  const handleServerSelect = async (serverId) => {
    if (!serverId || currentServer?._id === serverId) return

    try {
      const serverData = await apiService.getServerById(serverId)
      dispatch(setCurrentServer(serverData))
      onClose()
    } catch (error) {
      console.error("Error selecting server:", error)
    }
  }

  const handleChannelSelect = async (channel) => {
    const channelData = {
      id: channel._id || channel.id,
      name: channel.name,
      description: channel.description,
    }

    if (channel.type === "text") {
      try {
        if (previousChannel && previousChannel !== channelData.id) {
          socketService.leaveChannel(previousChannel)
        }
        dispatch(setTextChannel(channelData))
        onClose()
      } catch (error) {
        console.error("Error joining channel:", error)
      }
    } else {
      dispatch(setVoiceChannel(channelData))
      onClose()
    }
  }

  const handleCreateChannel = (type) => {
    handlers.toggleCreateChannelModal()
    handlers.updateState({ channelTypeToCreate: type })
    onClose()
  }

  const textChannels = currentServer?.channels?.filter((channel) => channel.type === "text") || []
  const voiceChannels = currentServer?.channels?.filter((channel) => channel.type === "voice") || []

  if (!isOpen) return null

  return (
    <div className="mobile-sidebar-overlay">
      <div className="mobile-sidebar">
        {/* Header với server hiện tại */}
        <div className="mobile-sidebar-header">
          <div className="mobile-server-info">
            <div className="mobile-current-server-icon">
              {currentServer?.icon ? (
                <img src={currentServer.icon || "/placeholder.svg"} alt={currentServer.name} />
              ) : (
                currentServer?.name?.charAt(0)?.toUpperCase() || "S"
              )}
            </div>
            <div className="mobile-server-details">
              <h3 className="mobile-server-name">{currentServer?.name || "Select Server"}</h3>
              <div className="mobile-server-chevron">
                <ChevronRight size={16} />
              </div>
            </div>
          </div>
        </div>

        {/* Server List - Sidebar trái */}
        <div className="mobile-server-list">
          {servers.map((server) => (
            <button
              key={server._id}
              className={`mobile-server-item ${currentServer?._id === server._id ? "mobile-server-item--active" : ""}`}
              onClick={() => handleServerSelect(server._id)}
            >
              <div className="mobile-server-icon">
                {server.icon ? (
                  <img src={server.icon || "/placeholder.svg"} alt={server.name} />
                ) : (
                  server.name?.charAt(0)?.toUpperCase() || "S"
                )}
              </div>
            </button>
          ))}

          {/* Add Server Button */}
          <button
            className="mobile-server-item mobile-add-server"
            onClick={() => {
              handlers.toggleCreateServerModal()
              onClose()
            }}
          >
            <div className="mobile-server-icon">
              <Plus size={20} />
            </div>
          </button>
        </div>

        {/* Channels Section */}
        <div className="mobile-channels-section">
          {currentServer && (
            <>
              {/* Text Channels */}
              <div className="mobile-channel-category">
                <button className="mobile-category-header" onClick={() => toggleCategory("text")}>
                  {expandedCategories.text ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                  <span>Text Channels</span>
                </button>

                {expandedCategories.text && (
                  <div className="mobile-channel-list">
                    {textChannels.map((channel) => (
                      <button
                        key={channel._id}
                        className={`mobile-channel-item ${
                          state.activeChannel === channel._id ? "mobile-channel-item--active" : ""
                        }`}
                        onClick={() => handleChannelSelect(channel)}
                      >
                        <Hash size={16} />
                        <span>{channel.name}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Voice Channels */}
              <div className="mobile-channel-category">
                <button className="mobile-category-header" onClick={() => toggleCategory("voice")}>
                  {expandedCategories.voice ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                  <span>Voice Channels</span>
                </button>

                {expandedCategories.voice && (
                  <div className="mobile-channel-list">
                    {voiceChannels.map((channel) => (
                      <button
                        key={channel._id}
                        className={`mobile-channel-item ${
                          state.activeChannel === channel._id ? "mobile-channel-item--active" : ""
                        }`}
                        onClick={() => handleChannelSelect(channel)}
                      >
                        <Volume2 size={16} />
                        <span>{channel.name}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Bottom Navigation */}
        <div className="mobile-bottom-nav">
          <button className="mobile-nav-item mobile-nav-item--active">
            <Home size={20} />
            <span>Home</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default MobileSidebar
