"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { useSelector, useDispatch } from "react-redux"
import { selectServers, selectCurrentServer, setCurrentServer } from "../../../../features/appSlice"
import { setTextChannel, setVoiceChannel, selectTextChannelId } from "../../../../features/channelSlice"
import { selectUser } from "../../../../features/userSlice"
import { Plus, Hash, Volume2, ChevronDown, ChevronRight, Search, Users, Calendar, Home, X } from "lucide-react"
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
  const [isClosing, setIsClosing] = useState(false)
  const [touchStart, setTouchStart] = useState(null)
  const [touchEnd, setTouchEnd] = useState(null)
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  
  const sidebarRef = useRef(null)
  const overlayRef = useRef(null)
  const startTimeRef = useRef(null)

  // Minimum swipe distance (in px) and velocity for gesture recognition
  const minSwipeDistance = 50
  const minSwipeVelocity = 0.3

  // Haptic feedback function (only works on supported devices)
  const triggerHaptic = useCallback((type = 'light') => {
    if (typeof window !== 'undefined' && window.navigator?.vibrate) {
      const patterns = {
        light: [10],
        medium: [20],
        heavy: [30],
        success: [10, 50, 10],
        error: [100, 50, 100]
      }
      window.navigator.vibrate(patterns[type] || patterns.light)
    }
  }, [])

  // Enhanced animation state management
  useEffect(() => {
    if (isOpen && !isAnimating) {
      setIsAnimating(true)
      // Reset any previous states
      setDragOffset(0)
      setIsDragging(false)
      setIsClosing(false)
      
      // Trigger entrance haptic
      setTimeout(() => triggerHaptic('light'), 100)
      
      // Animation complete
      setTimeout(() => setIsAnimating(false), 350)
    }
  }, [isOpen, triggerHaptic])

  // Touch event handlers for swipe gestures
  const handleTouchStart = useCallback((e) => {
    if (!isOpen || isAnimating) return
    
    const touch = e.touches[0]
    setTouchStart({
      x: touch.clientX,
      y: touch.clientY,
      time: Date.now()
    })
    setTouchEnd(null)
    startTimeRef.current = Date.now()
    
    // Add slight haptic feedback on touch start
    triggerHaptic('light')
  }, [isOpen, isAnimating, triggerHaptic])

  const handleTouchMove = useCallback((e) => {
    if (!touchStart || isAnimating) return
    
    const touch = e.touches[0]
    const deltaX = touch.clientX - touchStart.x
    const deltaY = touch.clientY - touchStart.y
    
    // Only handle horizontal swipes (left swipe to close)
    if (Math.abs(deltaX) > Math.abs(deltaY) && deltaX < 0) {
      setIsDragging(true)
      
      // Calculate drag offset (only allow negative values for closing)
      const offset = Math.max(deltaX, -300) // Limit maximum drag distance
      setDragOffset(offset)
      
      // Prevent default scrolling
      e.preventDefault()
    }
    
    setTouchEnd({
      x: touch.clientX,
      y: touch.clientY,
      time: Date.now()
    })
  }, [touchStart, isAnimating])

  const handleTouchEnd = useCallback(() => {
    if (!touchStart || !touchEnd || isAnimating) {
      setIsDragging(false)
      setDragOffset(0)
      return
    }
    
    const deltaX = touchEnd.x - touchStart.x
    const deltaY = touchEnd.y - touchStart.y
    const deltaTime = touchEnd.time - touchStart.time
    const velocity = Math.abs(deltaX) / deltaTime
    
    // Reset drag state
    setIsDragging(false)
    setDragOffset(0)
    
    // Check if it's a valid swipe gesture
    const isLeftSwipe = deltaX < -minSwipeDistance
    const isHorizontalSwipe = Math.abs(deltaX) > Math.abs(deltaY)
    const isFastSwipe = velocity > minSwipeVelocity
    
    if (isHorizontalSwipe && (isLeftSwipe || isFastSwipe) && deltaX < 0) {
      // Trigger close with haptic feedback
      triggerHaptic('medium')
      handleClose()
    }
    
    // Reset touch states
    setTouchStart(null)
    setTouchEnd(null)
  }, [touchStart, touchEnd, isAnimating, triggerHaptic])

  // Add global touch event listeners
  useEffect(() => {
    if (!isOpen) return

    document.addEventListener('touchmove', handleTouchMove, { passive: false })
    document.addEventListener('touchend', handleTouchEnd)
    
    return () => {
      document.removeEventListener('touchmove', handleTouchMove)
      document.removeEventListener('touchend', handleTouchEnd)
    }
  }, [isOpen, handleTouchMove, handleTouchEnd])

  const toggleCategory = (type) => {
    // Add haptic feedback for category toggle
    triggerHaptic('light')
    setExpandedCategories((prev) => ({
      ...prev,
      [type]: !prev[type],
    }))
  }

  const handleOverlayClick = (e) => {
    // Only close if clicking directly on the overlay, not on the sidebar content
    if (e.target === e.currentTarget && !isDragging) {
      triggerHaptic('medium')
      handleClose()
    }
  }

  const handleClose = useCallback(() => {
    if (isClosing || isAnimating) return
    
    setIsClosing(true)
    setIsAnimating(true)
    
    // Reset any drag states
    setDragOffset(0)
    setIsDragging(false)
    
    // Wait for animation to complete before actually closing
    setTimeout(() => {
      setIsClosing(false)
      setIsAnimating(false)
      onClose()
    }, 300) // Match the animation duration
  }, [isClosing, isAnimating, onClose])

  const handleServerSelect = async (serverId) => {
    if (!serverId || currentServer?._id === serverId) return

    // Add haptic feedback for server selection
    triggerHaptic('medium')

    try {
      const serverData = await apiService.getServerById(serverId)
      dispatch(setCurrentServer(serverData))
      
      // Add success haptic and smooth close
      setTimeout(() => {
        triggerHaptic('success')
        handleClose()
      }, 150)
    } catch (error) {
      console.error("Error selecting server:", error)
      triggerHaptic('error')
    }
  }

  const handleChannelSelect = async (channel) => {
    // Add haptic feedback for channel selection
    triggerHaptic('light')
    
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
        
        // Add success haptic and smooth close
        setTimeout(() => {
          triggerHaptic('success')
          handleClose()
        }, 100)
      } catch (error) {
        console.error("Error joining channel:", error)
        triggerHaptic('error')
      }
    } else {
      dispatch(setVoiceChannel(channelData))
      setTimeout(() => {
        triggerHaptic('success')
        handleClose()
      }, 100)
    }
  }

  const handleCreateChannel = (type) => {
    triggerHaptic('medium')
    handlers.toggleCreateChannelModal()
    handlers.updateState({ channelTypeToCreate: type })
    handleClose()
  }

  const textChannels = currentServer?.channels?.filter((channel) => channel.type === "text") || []
  const voiceChannels = currentServer?.channels?.filter((channel) => channel.type === "voice") || []

  // Calculate dynamic styles for smooth animations
  const sidebarStyle = {
    transform: isDragging 
      ? `translateX(${dragOffset}px)` 
      : isClosing 
        ? 'translateX(-100%)' 
        : 'translateX(0)',
    transition: isDragging ? 'none' : 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  }

  const overlayOpacity = isDragging 
    ? Math.max(0.3, 1 + (dragOffset / 300)) // Fade overlay as user drags
    : isClosing 
      ? 0 
      : 1

  if (!isOpen) return null

  return (
    <div 
      ref={overlayRef}
      className={`mobile-sidebar-overlay ${isClosing ? 'closing' : ''} ${isDragging ? 'dragging' : ''}`} 
      onClick={handleOverlayClick}
      style={{ 
        backgroundColor: `rgba(0, 0, 0, ${0.6 * overlayOpacity})`,
        transition: isDragging ? 'none' : 'background-color 0.3s ease'
      }}
    >
      <div 
        ref={sidebarRef}
        className={`mobile-sidebar ${isDragging ? 'mobile-sidebar--dragging' : ''}`}
        style={sidebarStyle}
        onTouchStart={handleTouchStart}
      >
        {/* Enhanced Header với close button */}
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
          
          {/* Close Button */}
          <button 
            className="mobile-sidebar-close-btn"
            onClick={handleClose}
            aria-label="Close sidebar"
          >
            <X size={20} />
          </button>
        </div>

        {/* Server List - Enhanced với loading states */}
        <div className="mobile-server-list">
          {servers.map((server, index) => (
            <button
              key={server._id}
              className={`mobile-server-item ${currentServer?._id === server._id ? "mobile-server-item--active" : ""}`}
              onClick={() => handleServerSelect(server._id)}
              style={{
                animationDelay: `${index * 50}ms` // Staggered animation
              }}
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

          {/* Add Server Button - Enhanced */}
          <button
            className="mobile-server-item mobile-add-server"
            onClick={() => {
              triggerHaptic('medium')
              handlers.toggleCreateServerModal()
              handleClose()
            }}
            style={{
              animationDelay: `${servers.length * 50}ms`
            }}
          >
            <div className="mobile-server-icon">
              <Plus size={20} />
            </div>
          </button>
        </div>

        {/* Channels Section - Enhanced with better UX */}
        <div className="mobile-channels-section">
          {currentServer ? (
            <>
              {/* Text Channels */}
              <div className="mobile-channel-category">
                <button 
                  className="mobile-category-header" 
                  onClick={() => toggleCategory("text")}
                >
                  <span className={`mobile-category-arrow ${expandedCategories.text ? 'mobile-category-arrow--expanded' : ''}`}>
                    {expandedCategories.text ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                  </span>
                  <span>Text Channels</span>
                  <button
                    className="mobile-add-channel-btn"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleCreateChannel("text")
                    }}
                  >
                    <Plus size={16} />
                  </button>
                </button>

                <div className={`mobile-channel-list ${expandedCategories.text ? 'mobile-channel-list--expanded' : 'mobile-channel-list--collapsed'}`}>
                  {textChannels.map((channel, index) => (
                    <button
                      key={channel._id}
                      className={`mobile-channel-item ${
                        state.activeChannel === channel._id ? "mobile-channel-item--active" : ""
                      }`}
                      onClick={() => handleChannelSelect(channel)}
                      style={{
                        animationDelay: expandedCategories.text ? `${index * 30}ms` : '0ms'
                      }}
                    >
                      <Hash size={16} />
                      <span>{channel.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Voice Channels */}
              <div className="mobile-channel-category">
                <button 
                  className="mobile-category-header" 
                  onClick={() => toggleCategory("voice")}
                >
                  <span className={`mobile-category-arrow ${expandedCategories.voice ? 'mobile-category-arrow--expanded' : ''}`}>
                    {expandedCategories.voice ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                  </span>
                  <span>Voice Channels</span>
                  <button
                    className="mobile-add-channel-btn"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleCreateChannel("voice")
                    }}
                  >
                    <Plus size={16} />
                  </button>
                </button>

                <div className={`mobile-channel-list ${expandedCategories.voice ? 'mobile-channel-list--expanded' : 'mobile-channel-list--collapsed'}`}>
                  {voiceChannels.map((channel, index) => (
                    <button
                      key={channel._id}
                      className={`mobile-channel-item ${
                        state.activeChannel === channel._id ? "mobile-channel-item--active" : ""
                      }`}
                      onClick={() => handleChannelSelect(channel)}
                      style={{
                        animationDelay: expandedCategories.voice ? `${index * 30}ms` : '0ms'
                      }}
                    >
                      <Volume2 size={16} />
                      <span>{channel.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </>
          ) : (
            // Empty state when no server selected
            <div className="mobile-no-server-state">
              <div className="mobile-no-server-icon">
                <Search size={48} />
              </div>
              <h3>No Server Selected</h3>
              <p>Select a server to view channels</p>
            </div>
          )}
        </div>

        {/* Swipe indicator */}
        <div className="mobile-swipe-indicator">
          <div className="mobile-swipe-line"></div>
          <span className="mobile-swipe-text">Swipe left to close</span>
        </div>
      </div>
    </div>
  )
}

export default MobileSidebar
