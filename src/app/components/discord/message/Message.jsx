import React, { useState } from "react";
import { useSelector } from "react-redux";
import { selectUser } from "../../../../features/userSlice";
import { Trash2 } from "lucide-react";
import "./Message.css";
import { getUserAvatarSrc, handleAvatarError } from "../../../utils/avatarUtils";

function Message({ 
  message, 
  user, 
  timestamp, 
  isGroupStart = true, 
  showDateDivider = false,
  previousMessage = null 
}) {
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
      return "Yesterday at " + date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else {
      return date.toLocaleDateString([], {
        month: "2-digit",
        day: "2-digit",
        year: "numeric",
      }) + " " + date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
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
      "#7289da", "#747f8d", "#43b581", "#f04747", 
      "#faa61a", "#9266cc", "#e91e63", "#00bcd4",
      "#4caf50", "#ff9800", "#795548", "#607d8b"
    ];
    if (user?.color) return user.color;
    if (user?.id) {
      return colors[user.id.charCodeAt(0) % colors.length];
    }
    return colors[Math.floor(Math.random() * colors.length)];
  };

  return (
    <>
      {showDateDivider && (
        <div className="message__date-divider">
          <span className="message__date-text">
            {formatDateDivider(timestamp)}
          </span>
        </div>
      )}
      
      <div className={getMessageClasses()}>
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
          
          <div className="message__text">
            {message}
          </div>
        </div>

        {/* Message actions (reactions, reply, etc.) */}
        <div className="message__actions">
          <button className="message__action" title="Add Reaction" aria-label="Add Reaction">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12,17.5C14.33,17.5 16.3,16.04 17.11,14H6.89C7.69,16.04 9.67,17.5 12,17.5M8.5,11A1.5,1.5 0 0,0 10,9.5A1.5,1.5 0 0,0 8.5,8A1.5,1.5 0 0,0 7,9.5A1.5,1.5 0 0,0 8.5,11M15.5,11A1.5,1.5 0 0,0 17,9.5A1.5,1.5 0 0,0 15.5,8A1.5,1.5 0 0,0 14,9.5A1.5,1.5 0 0,0 15.5,11M12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20M12,2C6.47,2 2,6.5 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12C22,6.5 17.5,2 12,2Z"/>
            </svg>
          </button>
          
          <button className="message__action" title="Reply" aria-label="Reply to message">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M10,9V5L3,12L10,19V14.9C15,14.9 18.5,16.5 21,20C20,15 17,10 10,9Z"/>
            </svg>
          </button>
          
          <button className="message__action" title="More" aria-label="More options">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12,16A2,2 0 0,1 14,18A2,2 0 0,1 12,20A2,2 0 0,1 10,18A2,2 0 0,1 12,16M12,10A2,2 0 0,1 14,12A2,2 0 0,1 12,14A2,2 0 0,1 10,12A2,2 0 0,1 12,10M12,4A2,2 0 0,1 14,6A2,2 0 0,1 12,8A2,2 0 0,1 10,6A2,2 0 0,1 12,4Z"/>
            </svg>
          </button>
        </div>
      </div>
    </>
  );
}

export default Message;
