import React, { useState } from "react";
import { useSelector } from "react-redux";
import { selectUser } from "../../../../features/userSlice";
import { Trash2 } from "lucide-react";
import "./Message.css";

function Message({
  message,
  user,
  timestamp,
  messageId,
  channelId,
  onDeleteMessage,
}) {
  const [isHovered, setIsHovered] = useState(false);
  const currentUser = useSelector(selectUser);

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return "";

    const date = new Date(timestamp);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();

    if (isToday) {
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else {
      return date.toLocaleDateString([], {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    }
  };

  const handleDeleteMessage = () => {
    if (window.confirm("Are you sure you want to delete this message?")) {
      onDeleteMessage(messageId, currentUser?.id, channelId);
    }
  };

  // Check if current user can delete this message
  const canDelete = currentUser && user && currentUser.id === user.id;

  return (
    <div
      className="message"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Use user avatar if available, otherwise default Avatar */}

      <div className="message__info">
        <p className="timestamp">
          {user?.username || "Unknown User"}
          <span className="message__info-timestamp">
            {formatTimestamp(timestamp)}
          </span>
        </p>
        <p>{message}</p>
      </div>

      {/* Delete button - only show on hover and if user owns the message */}
      {isHovered && canDelete && (
        <div className="message__actions">
          <button
            className="message__delete-btn"
            onClick={handleDeleteMessage}
            title="Delete message"
          >
            <Trash2 size={16} />
          </button>
        </div>
      )}
    </div>
  );
}

export default Message;
