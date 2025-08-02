"use client";

import React, { useState, useRef } from "react";
import { Paperclip, Smile } from "lucide-react";

const MessageInput = ({
  channel,
  user,
  socketService,
}) => {
  const channelId = channel?._id || channel?.id;

  const [isTyping, setIsTyping] = useState(false);
  const [input, setInput] = useState("");
  const typingTimeout = useRef(null);

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
        <Paperclip size={20} />
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
        <Smile size={20} />
      </div>
    </div>
  );
};

export default MessageInput;
