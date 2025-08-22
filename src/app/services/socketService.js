import { io } from "socket.io-client";
const API_BASE_URL = import.meta.env.VITE_BACKEND_BASE_URL;

class SocketService {
  constructor() {
    this.socket = null;
    this.isConnected = false;
  }

  connect(token) {
    if (!this.socket) {
      this.socket = io(API_BASE_URL, {
        withCredentials: true,
        transports: ["websocket", "polling"],
        extraHeaders: {
        Authorization: `Bearer ${token}`,
      },
      });

      this.socket.on("connect", () => {
        console.log("Connected to server:", this.socket.id);
        this.isConnected = true;
      });

      this.socket.on("disconnect", () => {
        console.log("Disconnected from server");
        this.isConnected = false;
      });
    }
    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
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

  sendMessage(channelId, message, user) {
    if (this.socket) {
      this.socket.emit("send-message", {
        channelId,
        message,
        user,
      });
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
  deleteMessage(messageId, userId, channelId) {
    if (this.socket) {
      this.socket.emit("delete-message", {
        messageId,
        userId,
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
}

const socketService = new SocketService();
export default socketService;
