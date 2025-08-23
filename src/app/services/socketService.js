import { io } from "socket.io-client";
const API_BASE_URL = import.meta.env.VITE_BACKEND_BASE_URL;

class SocketService {
  constructor() {
    this.socket = null;
  }

  connect(token) {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
    this.socket = io(API_BASE_URL, {
      withCredentials: true,
      transports: ["websocket", "polling"],
      auth: {
        Authorization: `Bearer ${token}`,
      },
    });
    
    this.socket.on("connect", () => {
      console.log("Connected to server:", this.socket.id);
    });
    
    this.socket.on("disconnect", () => {
      console.log("Disconnected from server");
    });
    console.log(this.socket);
    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      console.log("disconnect.....");
      this.socket.disconnect();
      this.socket = null;
    }
  }

  joinChannel(channelId) {
    if (this.socket && channelId) {
      this.socket.emit("join-channel", channelId);
    }
  }

  leaveChannel(channelId) {
    if (this.socket && channelId) {
      this.socket.emit("leave-channel", channelId);
    }
  }

  sendMessage(channelId, message) {
    if (this.socket && this.socket.connected) {
      this.socket.emit("send-message", {
        channelId,
        message,
      });
    } else {
      console.warn("Socket not connected, cannot send message");
    }
  }

  onNewMessage(callback) {
    if (this.socket) {
      this.socket.on("new-message", callback);
    }
  }

  offNewMessage() {
    if (this.socket) {
      this.socket.off("new-message");
    }
  }

  startTyping(channelId, userId, username) {
    if (this.socket) {
      this.socket.emit("typing", { channelId, userId, username });
    }
  }

  stopTyping(channelId, userId) {
    if (this.socket) {
      this.socket.emit("stop-typing", { channelId, userId });
    }
  }

  onUserTyping(callback) {
    if (this.socket) {
      this.socket.on("user-typing", callback);
    }
  }

  onUserStopTyping(callback) {
    if (this.socket) {
      this.socket.on("user-stop-typing", callback);
    }
  }

  // Add method to fetch previous messages
  async fetchChannelMessages(channelId, page = 1) {
    try {
      const response = await fetch(
        `${
          API_BASE_URL || "http://localhost:3000"
        }/api/messages/channel/${channelId}?page=${page}`,
        {
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch messages");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching messages:", error);
      throw error;
    }
  }

  // Listen for message save confirmation
  onMessageSaved(callback) {
    if (this.socket) {
      this.socket.on("message-saved", callback);
    }
  }

  // Listen for message errors
  onMessageError(callback) {
    if (this.socket) {
      this.socket.on("message-error", callback);
    }
  }

  // Delete a message
  deleteMessage(messageId, channelId) {
    if (this.socket) {
      this.socket.emit("delete-message", {
        messageId,
        channelId,
      });
    }
  }

  // Listen for message deletion
  onMessageDeleted(callback) {
    if (this.socket) {
      this.socket.on("message-deleted", callback);
    }
  }

  // Listen for delete errors
  onDeleteError(callback) {
    if (this.socket) {
      this.socket.on("delete-error", callback);
    }
  }

  // Remove delete listeners
  offMessageDeleted() {
    if (this.socket) {
      this.socket.off("message-deleted");
    }
  }

  offDeleteError() {
    if (this.socket) {
      this.socket.off("delete-error");
    }
  }

  // Update a message
  updateMessage(messageId, newMessage, channelId) {
    if (this.socket) {
      this.socket.emit("edit-message", {
        messageId,
        newMessage,
        channelId,
      });
    }
  }

  // Listen for message updates
  onMessageUpdate(callback) {
    if (this.socket) {
      this.socket.on("message-edited", callback);
    }
  }

  // Listen for delete errors
  onUpdateError(callback) {
    if (this.socket) {
      this.socket.on("edit-error", callback);
    }
  }

  // Remove delete listeners
  offMessageUpdate() {
    if (this.socket) {
      this.socket.off("message-edited");
    }
  }

  offUpdateError() {
    if (this.socket) {
      this.socket.off("edit-error");
    }
  }
}

const socketService = new SocketService();
export default socketService;
