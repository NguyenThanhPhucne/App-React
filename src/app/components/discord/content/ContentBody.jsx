"use client";

import React, { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import { Hash } from "lucide-react";
import Message from "../message/Message";
import LoadingSpinner from "../../ui/LoadingSpinner";
import { selectCurrentServer } from "../../../../features/appSlice";
import { selectUser } from "../../../../features/userSlice";

const ContentBody = ({ channel, socketService }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [serverLoading, setServerLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const [typingUsers, setTypingUsers] = useState([]);

  const currentServer = useSelector(selectCurrentServer);
  const currentUser = useSelector(selectUser);
  const channelId = channel?._id || channel?.id;

  // Load messages when channel changes
  useEffect(() => {
    if (currentUser) {
      const loadChannelMessages = async () => {
        if (!channelId) {
          setMessages([]); // Clear messages when no channel is selected
          return;
        }

        // Clear messages immediately when channel changes
        setMessages([]);

        // Join new channel
        socketService.joinChannel(channelId);

        // Load previous messages
        setLoading(true);

        try {
          const response = await socketService.fetchChannelMessages(channelId);

          if (response && response.data) {
            setMessages(response.data);
          } else {
            setMessages([]);
          }
        } catch (error) {
          console.error("Error loading messages:", error);
          setMessages([]);
        } finally {
          setLoading(false);
        }
      };

      loadChannelMessages();
    }
  }, [channelId, socketService, currentUser]);

  // Clear messages when server changes (before new channel is selected)
  useEffect(() => {
    setMessages([]);
    setTypingUsers([]);
    setServerLoading(true);

    // Add a small delay to show loading state
    const timer = setTimeout(() => {
      setServerLoading(false);
    }, 150);

    return () => clearTimeout(timer);
  }, [currentServer?._id]);

  // Improved auto-scroll function
  const scrollToBottom = (force = false) => {
    if (messagesContainerRef.current) {
      const container = messagesContainerRef.current;

      // Only auto-scroll if user is near the bottom or force scroll
      const isNearBottom =
        container.scrollTop + container.clientHeight >=
        container.scrollHeight - 100;

      if (force || isNearBottom) {
        container.scrollTop = container.scrollHeight;
      }
    }
  };

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    const timer = setTimeout(() => {
      // Only force scroll for initial load, otherwise respect user scroll position
      const isInitialLoad =
        messages.length > 0 && !messagesContainerRef.current?.scrollTop;
      scrollToBottom(isInitialLoad);
    }, 100);

    return () => clearTimeout(timer);
  }, [messages]);

  // Handle delete message
  const handleDeleteMessage = (messageId, channelId) => {
    socketService.deleteMessage(messageId, channelId);
  };

  const handleUpdateMessage = (messageId, newMessage, channelId) => {
    socketService.updateMessage(messageId, newMessage, channelId);
  };

  // Listen for socket events
  useEffect(() => {
    const handleNewMessage = (messageData) => {
      setMessages((prev) => [...prev, messageData]);
    };

    const handleUserTyping = (data) => {
      setTypingUsers((prev) => {
        if (!prev.find((u) => u.userId === data.userId)) {
          return [...prev, data];
        }
        return prev;
      });
    };

    const handleUserStopTyping = (data) => {
      setTypingUsers((prev) => prev.filter((u) => u.userId !== data.userId));
    };

    const handleMessageSaved = (data) => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === data.tempId
            ? { ...data.savedMessage, id: data.savedMessage._id }
            : msg
        )
      );
    };

    const handleMessageError = (data) => {
      console.error("Message failed to save:", data.error);
    };

    const handleMessageDeleted = (data) => {
      setMessages((prev) =>
        prev.filter((msg) => (msg.id || msg._id) !== data.messageId)
      );
    };

    const handleMessageUpdate = (data) => {
      setMessages((prev) =>
        prev.map((msg) =>
          (msg.id || msg._id) === data.messageId
            ? {
                ...msg,
                message: data.newMessage,
                isEdited: true,
                editedAt: new Date(),
              }
            : msg
        )
      );
    };

    const handleDeleteError = (data) => {
      console.error("Failed to delete message:", data.error);
      alert(data.error);
    };

    const handleUpdateError = (data) => {
      console.error("Failed to edit message:", data.error);
      alert(data.error);
    }

    // Add event listeners
    socketService.onNewMessage(handleNewMessage);
    socketService.onUserTyping(handleUserTyping);
    socketService.onUserStopTyping(handleUserStopTyping);
    socketService.onMessageSaved(handleMessageSaved);
    socketService.onMessageError(handleMessageError);
    socketService.onMessageDeleted(handleMessageDeleted);
    socketService.onDeleteError(handleDeleteError);
    socketService.onMessageUpdate(handleMessageUpdate);
    socketService.onUpdateError(handleUpdateError);

    return () => {
      socketService.offNewMessage();
      socketService.offMessageDeleted();
      socketService.offDeleteError();
      socketService.offMessageUpdate();
      socketService.offUpdateError();
    };
  }, [socketService]);

  // Helper function to determine if message should start a new group
  const shouldStartNewGroup = (currentMessage, previousMessage) => {
    if (!previousMessage) return true;

    // Different user
    if (currentMessage.user?.id !== previousMessage.user?.id) return true;

    // More than 5 minutes apart
    const currentTime = new Date(currentMessage.timestamp);
    const previousTime = new Date(previousMessage.timestamp);
    const timeDiff = currentTime - previousTime;
    if (timeDiff > 5 * 60 * 1000) return true; // 5 minutes in milliseconds

    return false;
  };

  // Helper function to determine if should show date divider
  const shouldShowDateDivider = (currentMessage, previousMessage) => {
    if (!previousMessage) return false;

    const currentDate = new Date(currentMessage.timestamp);
    const previousDate = new Date(previousMessage.timestamp);

    return currentDate.toDateString() !== previousDate.toDateString();
  };

  if (loading || serverLoading) {
    return (
      <div className="content__body">
        {serverLoading ? (
          <div className="server-switching-skeleton">
            <div className="skeleton-header">
              <div className="skeleton-avatar"></div>
              <div className="skeleton-lines">
                <div className="skeleton-line skeleton-line--title"></div>
                <div className="skeleton-line skeleton-line--subtitle"></div>
              </div>
            </div>
            <div className="skeleton-messages">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="skeleton-message"
                  style={{ animationDelay: `${i * 0.1}s` }}
                >
                  <div className="skeleton-message-avatar"></div>
                  <div className="skeleton-message-content">
                    <div className="skeleton-line skeleton-line--name"></div>
                    <div className="skeleton-line skeleton-line--message"></div>
                  </div>
                </div>
              ))}
            </div>
            <div className="switching-text">Switching server...</div>
          </div>
        ) : (
          <div className="content-loading">
            <LoadingSpinner size={32} />
            <div className="loading-text">
              Loading messages
              <span className="loading-dots">
                <span className="loading-dot"></span>
                <span className="loading-dot"></span>
                <span className="loading-dot"></span>
              </span>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="content__body" ref={messagesContainerRef}>
      {!channelId ? (
        <div className="welcome">
          <div className="welcome__icon">
            <Hash size={48} />
          </div>
          <h2>Welcome to {currentServer?.name || "Discord"}!</h2>
          <p>Select a channel to start chatting.</p>
        </div>
      ) : loading ? (
        <div className="loading-container">
          <LoadingSpinner />
        </div>
      ) : messages.length === 0 ? (
        <div className="welcome">
          <div className="welcome__icon">
            <Hash size={48} />
          </div>
          <h2>Welcome to #{channel?.name}!</h2>
          <p>This is the start of the #{channel?.name} channel.</p>
        </div>
      ) : (
        messages.map((message, index) => {
          const previousMessage = index > 0 ? messages[index - 1] : null;
          const isGroupStart = shouldStartNewGroup(message, previousMessage);
          const showDateDivider = shouldShowDateDivider(
            message,
            previousMessage
          );

          return (
            <Message
              key={message.id || message._id}
              messageId={message.id || message._id}
              message={message.message}
              user={message.user}
              timestamp={message.timestamp}
              channelId={channelId}
              onDeleteMessage={handleDeleteMessage}
              onUpdateMessage={handleUpdateMessage}
              isGroupStart={isGroupStart}
              showDateDivider={showDateDivider}
              previousMessage={previousMessage}
            />
          );
        })
      )}

      {/* Typing indicator */}
      {typingUsers.length > 0 && (
        <div className="chat__typing">
          {typingUsers.map((u) => u.username).join(", ")}{" "}
          {typingUsers.length === 1 ? "is" : "are"} typing...
        </div>
      )}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default ContentBody;
