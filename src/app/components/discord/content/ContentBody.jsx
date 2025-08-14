"use client";

import React, { useEffect, useState, useRef } from "react";
import { Hash } from "lucide-react";
import Message from "../message/Message";

const ContentBody = ({ channel, socketService }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const [typingUsers, setTypingUsers] = useState([]);

  const channelId = channel?._id || channel?.id;

  // Load messages when channel changes
  useEffect(() => {
    const loadChannelMessages = async () => {
      if (!channelId) {
        return;
      }
      if (channelId) {
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
      }
    };

    if (channelId) {
      loadChannelMessages();
    }
  }, [channelId, socketService]);

  // Improved auto-scroll function
  const scrollToBottom = (force = false) => {
    if (messagesContainerRef.current) {
      const container = messagesContainerRef.current;
      
      // Only auto-scroll if user is near the bottom or force scroll
      const isNearBottom = container.scrollTop + container.clientHeight >= container.scrollHeight - 100;
      
      if (force || isNearBottom) {
        container.scrollTop = container.scrollHeight;
      }
    }
  };

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    const timer = setTimeout(() => {
      // Only force scroll for initial load, otherwise respect user scroll position
      const isInitialLoad = messages.length > 0 && !messagesContainerRef.current?.scrollTop;
      scrollToBottom(isInitialLoad);
    }, 100);

    return () => clearTimeout(timer);
  }, [messages]);

  // Handle delete message
  const handleDeleteMessage = (messageId, userId, channelId) => {
    socketService.deleteMessage(messageId, userId, channelId);
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

    const handleDeleteError = (data) => {
      console.error("Failed to delete message:", data.error);
      alert(data.error); // You can replace this with a toast notification
    };

    // Add event listeners
    socketService.onNewMessage(handleNewMessage);
    socketService.onUserTyping(handleUserTyping);
    socketService.onUserStopTyping(handleUserStopTyping);
    socketService.onMessageSaved(handleMessageSaved);
    socketService.onMessageError(handleMessageError);
    socketService.onMessageDeleted(handleMessageDeleted);
    socketService.onDeleteError(handleDeleteError);

    return () => {
      socketService.offNewMessage();
      socketService.offMessageDeleted();
      socketService.offDeleteError();
    };
  }, [socketService]);

  if (loading) {
    return (
      <div className="content__body">
        <div className="loading">Loading messages...</div>
      </div>
    );
  }

  return (
    <div className="content__body" ref={messagesContainerRef}>
      {messages.length === 0 ? (
        <div className="welcome">
          <div className="welcome__icon">
            <Hash size={48} />
          </div>
          <h2>Welcome to #{channel.name}!</h2>
          <p>This is the start of the #{channel.name} channel.</p>
        </div>
      ) : (
        messages.map((message) => (
          <Message
            key={message.id || message._id}
            messageId={message.id || message._id}
            message={message.message}
            user={message.user}
            timestamp={message.timestamp}
            channelId={channelId}
            onDeleteMessage={handleDeleteMessage}
          />
        ))
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
