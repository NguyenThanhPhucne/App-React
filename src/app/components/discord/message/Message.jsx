import { useState } from "react";
import { useSelector } from "react-redux";
import { selectUser } from "../../../../features/userSlice";
import { Trash2, MoreHorizontal } from "lucide-react";
import "./Message.css";
import {
  getUserAvatarSrc,
  handleAvatarError,
} from "../../../utils/avatarUtils";
import React from "react";

function Message({
  message,
  user,
  timestamp,
  messageId,
  channelId,
  onDeleteMessage,
  onUpdateMessage,
  isGroupStart = true,
  showDateDivider = false,
  previousMessage = null,
}) {
  const [isHovered, setIsHovered] = useState(false);
  const currentUser = useSelector(selectUser);

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return "";

    const date = new Date(timestamp);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    const isYesterday = date.toDateString() === yesterday.toDateString();

    if (isToday) {
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else if (isYesterday) {
      return (
        "Yesterday at " +
        date.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })
      );
    } else {
      return (
        date.toLocaleDateString([], {
          month: "2-digit",
          day: "2-digit",
          year: "numeric",
        }) +
        " " +
        date.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })
      );
    }
  };

  const formatCompactTimestamp = (timestamp) => {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDateDivider = (timestamp) => {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    const isYesterday = date.toDateString() === yesterday.toDateString();

    if (isToday) {
      return "Today";
    } else if (isYesterday) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString([], {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    }
  };

  const getMessageClasses = () => {
    let classes = "message";
    if (isGroupStart) {
      classes += " message--group-start";
    } else {
      classes += " message--subsequent";
    }
    return classes;
  };

  const getUsernameColor = () => {
    // Color based on user role or random color
    const colors = [
      "#7289da",
      "#747f8d",
      "#43b581",
      "#f04747",
      "#faa61a",
      "#9266cc",
      "#e91e63",
      "#00bcd4",
      "#4caf50",
      "#ff9800",
      "#795548",
      "#607d8b",
    ];
    if (user?.color) return user.color;
    if (user?.id) {
      return colors[user.id.charCodeAt(0) % colors.length];
    }
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const handleDeleteMessage = () => {
    if (window.confirm("Are you sure you want to delete this message?")) {
      onDeleteMessage(messageId, channelId);
    }
  };

  const handleUpdateMessage = () => {
    const newMessage = window.prompt("Edit your message:", message);
    if (newMessage && newMessage.trim() !== "" && newMessage !== message) {
      onUpdateMessage(messageId, newMessage.trim(), channelId);
    }
  };

  // Check if current user can delete this message
  const auth = currentUser && user && currentUser.id === user.id;

  return (
    <>
      {showDateDivider && (
        <div className="message__date-divider">
          <span className="message__date-text">
            {formatDateDivider(timestamp)}
          </span>
        </div>
      )}

      <div
        className={getMessageClasses()}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {isGroupStart && (
          <img
            src={getUserAvatarSrc(user)}
            alt={user?.username || "User"}
            className="message__avatar"
            onError={handleAvatarError}
          />
        )}

        <div className="message__content">
          {isGroupStart && (
            <div className="message__header">
              <span
                className="message__username"
                style={{ color: getUsernameColor() }}
              >
                {user?.username || "Unknown User"}
              </span>
              <span className="message__timestamp">
                {formatTimestamp(timestamp)}
              </span>
            </div>
          )}

          {!isGroupStart && (
            <span className="message__timestamp message__timestamp--compact">
              {formatCompactTimestamp(timestamp)}
            </span>
          )}

          <div className="message__text">{message}</div>
        </div>

        {/* Message actions (reactions, reply, delete) */}
        <div className="message__actions">
          {/* <button className="message__action" title="Add Reaction" aria-label="Add Reaction">
            <Smile size={16} />
          </button>

          <button className="message__action" title="Reply" aria-label="Reply to message">
            <Reply size={16} />
          </button> */}

          {auth && (
            <>
              <button
                className="message__action message__delete-btn"
                title="Delete message"
                onClick={handleDeleteMessage}
              >
                <Trash2 size={16} />
              </button>
              <button
                className="message__action message__delete-btn"
                title="Edit message"
                onClick={handleUpdateMessage}
              >
                <MoreHorizontal size={16} />
              </button>
            </>
          )}

          {/* <button className="message__action" title="More" aria-label="More options">
            <MoreHorizontal size={16} />
          </button> */}
        </div>
      </div>
    </>
  );
}

export default Message;
