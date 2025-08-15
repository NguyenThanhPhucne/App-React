"use client";

import React, { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import { Paperclip, Smile } from "lucide-react";
import { selectCurrentServer } from "../../../../features/appSlice";

const MessageInput = ({
  channel,
  user,
  socketService,
}) => {
  const channelId = channel?._id || channel?.id;
  const currentServer = useSelector(selectCurrentServer);

  const [isTyping, setIsTyping] = useState(false);
  const [input, setInput] = useState("");
  const typingTimeout = useRef(null);

  // Clear input when server changes
  useEffect(() => {
    setInput("");
    setIsTyping(false);
    if (typingTimeout.current) {
      clearTimeout(typingTimeout.current);
    }
  }, [currentServer?._id]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim() && channelId && user) {
      socketService.sendMessage(channelId, input.trim(), {
        id: user.id,
        username: user.username,
        avatar: user.avatar,
      });
      setInput("");

      // Stop typing indicator
      if (isTyping) {
        socketService.stopTyping(channelId, user.id);
        setIsTyping(false);
      }
    }
  };

  const handleInputChange = (e) => {
    setInput(e.target.value);

    // Handle typing indicator
    if (!isTyping && e.target.value.trim()) {
      setIsTyping(true);
      socketService.startTyping(channelId, user.id, user.username);
    }

    // Clear existing timeout
    if (typingTimeout.current) {
      clearTimeout(typingTimeout.current);
    }

    // Set new timeout to stop typing
    typingTimeout.current = setTimeout(() => {
      if (isTyping) {
        socketService.stopTyping(channelId, user.id);
        setIsTyping(false);
      }
    }, 2000);
  };

  return (
    <div className="content__footer">
      <div className="message-input">
        <div className="message-input__icon-left">
          <Paperclip size={20} />
        </div>
        <form onSubmit={handleSubmit} className="message-input__form">
          <input
            type="text"
            placeholder={`Message #${channel.name}`}
            value={input}
            onChange={handleInputChange}
          />
          <button type="submit" style={{ display: "none" }}>
            Send
          </button>
        </form>
        <div className="message-input__icon-right">
          <Smile size={20} />
        </div>
      </div>
    </div>
  );
};

export default MessageInput;
