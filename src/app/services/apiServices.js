const API_BASE_URL = import.meta.env.VITE_BACKEND_BASE_URL || 'http://localhost:3000';
class ApiService {
  constructor() {
    this.refreshPromise = null;
  }
  async login(username, password) {
    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      // Store token
      if (data.accessToken) {
        localStorage.setItem("accessToken", data.accessToken);
      }

      const userData = data.user;

      return userData;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  }

  async googleLogin(googleToken){
    try {
      const response = await fetch(`${API_BASE_URL}/google-login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ googleToken }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      // Store token
      if (data.accessToken) {
        localStorage.setItem("accessToken", data.accessToken);
      }

      const userData = data.user;

      return userData;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  }

  async logout() {
    try {
      const token = localStorage.getItem("accessToken");

      if (token) {
        const response = await fetch(`${API_BASE_URL}/user/logout`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Logout failed");
        }
      }

      // Clear token regardless of API call success
      localStorage.removeItem("accessToken");

      return { success: true };
    } catch (error) {
      // Even if API call fails, clear local state
      localStorage.removeItem("accessToken");
      throw error;
    }
  }

  async register(userData) {
    try {
      const response = await fetch(`${API_BASE_URL}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: userData.username,
          email: userData.email,
          password: userData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }

      return data.message || "Registration successful";
    } catch (error) {
      console.error("Registration error:", error);
      throw error;
    }
  }

  async refreshAccessToken() {
    // Return existing promise if refresh is already in progress
    if (this.refreshPromise) {
      return this.refreshPromise;
    }

    this.refreshPromise = this._performTokenRefresh();
    return this.refreshPromise;
  }

  async _performTokenRefresh() {
    try {
      const response = await fetch(`${API_BASE_URL}/user/requestRefreshToken`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Token refresh failed");
      }

      const { accessToken } = await response.json();

      if (!accessToken) {
        throw new Error("No access token received");
      }

      localStorage.setItem("accessToken", accessToken);
    } catch (error) {
      localStorage.removeItem("accessToken");
      throw error;
    } finally {
      this.refreshPromise = null;
    }
  }

  async validateTokenLocally() {
    const accessToken = localStorage.getItem("accessToken");

    if (!accessToken) {
      console.error("No access token found in localStorage");
      return { isValid: false, shouldSignOut: true };
    }
    
    try {
      const tokenData = JSON.parse(atob(accessToken.split(".")[1]));
      if (tokenData.exp * 1000 > Date.now()) {
        return {
          isValid: true,
          userData: {
            id: tokenData.id,
            email: tokenData.email,
            username: tokenData.username,
            avatar: tokenData.avatar,
            role: tokenData.role,
            displayName: tokenData.displayName,
          },
        };
      } else {
        // Use the existing refresh mechanism which already handles duplicates
        await this.refreshAccessToken();

        // Get the refreshed token
        const newToken = localStorage.getItem("accessToken");

        if (!newToken) {
          return { isValid: false, shouldSignOut: true };
        }

        const newTokenData = JSON.parse(atob(newToken.split(".")[1]));

        return {
          isValid: true,
          userData: {
            id: newTokenData.id,
            email: newTokenData.email,
            username: newTokenData.username,
            avatar: newTokenData.avatar,
            role: newTokenData.role,
            displayName: newTokenData.displayName,
          },
        };
      }
    } catch (error) {
      console.error("Token validation/refresh failed:", error);
      localStorage.removeItem("accessToken");
      return { isValid: false, shouldSignOut: true };
    }
  }

  async createServer(severData) {
    const accessToken = localStorage.getItem("accessToken");

    if (!accessToken) {
      throw new Error("No access token found");
    }

    try {
      const response = await fetch(`${API_BASE_URL}/server`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        credentials: "include",
        body: JSON.stringify(severData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch channels");
      }

      return response.json();
    } catch (error) {
      console.log("Error fetching channels:", error);
      throw error;
    }
  }

  async getUserServers() {
    const accessToken = localStorage.getItem("accessToken");

    if (!accessToken) {
      throw new Error("No access token found");
    }
    try {
      const response = await fetch(`${API_BASE_URL}/server`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        credentials: "include",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch channels");
      }

      return response.json();
    } catch (error) {
      console.error("Error fetching channels:", error);
      throw error;
    }
  }

  async getServerById(serverId) {
    const accessToken = localStorage.getItem("accessToken");

    if (!accessToken) {
      throw new Error("No access token found");
    }

    try {
      const response = await fetch(`${API_BASE_URL}/server/${serverId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        credentials: "include",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch server");
      }

      return response.json();
    } catch (error) {
      console.error("Error fetching server by ID:", error);
      throw error;
    }
  }

  async updateServer(serverId, serverData) {
    const accessToken = localStorage.getItem("accessToken");

    if (!accessToken) {
      throw new Error("No access token found");
    }

    try {
      const response = await fetch(`${API_BASE_URL}/server/${serverId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        credentials: "include",
        body: JSON.stringify(serverData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update server");
      }

      return response.json();
    } catch (error) {
      console.error("Error updating server:", error);
      throw error;
    }
  }

  async deleteServer(serverId) {
    const accessToken = localStorage.getItem("accessToken");

    if (!accessToken) {
      throw new Error("No access token found");
    }

    try {
      const response = await fetch(`${API_BASE_URL}/server/${serverId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        credentials: "include",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete server");
      }

      return response.json();
    } catch (error) {
      console.error("Error deleting server:", error);
      throw error;
    }
  }

  // CHANNEL
  async createChannel(serverId, newChannel) {
    const accessToken = localStorage.getItem("accessToken");

    if (!accessToken) {
      throw new Error("No access token found");
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}/server/${serverId}/channels`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          credentials: "include",
          body: JSON.stringify(newChannel),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create channel");
      }

      return response.json();
    } catch (error) {
      console.error("Error creating channel:", error);
      throw error;
    }
  }

  async updateChannel(serverId, channelId, channelData) {
    const accessToken = localStorage.getItem("accessToken");

    if (!accessToken) {
      throw new Error("No access token found");
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}/server/${serverId}/channels/${channelId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          credentials: "include",
          body: JSON.stringify(channelData),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update channel");
      }

      return response.json();
    } catch (error) {
      console.error("Error updating channel:", error);
      throw error;
    }
  }

  async deleteChannel(serverId, channelId) {
    const accessToken = localStorage.getItem("accessToken");

    if (!accessToken) {
      throw new Error("No access token found");
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}/server/${serverId}/channels/${channelId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          credentials: "include",
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete channel");
      }

      return response.json();
    } catch (error) {
      console.error("Error deleting channel:", error);
      throw error;
    }
  }

  // Join Server
  async joinServerByInvite(inviteCode) {
    const accessToken = localStorage.getItem("accessToken");

    if (!accessToken) {
      throw new Error("No access token found");
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}/server/join/${inviteCode}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          credentials: "include",
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to join server");
      }

      return response.json();
    } catch (error) {
      console.error("Error joining server:", error);
      throw error;
    }
  }

  // Avatar
  async uploadServerAvatar(imageFile) {
    const accessToken = localStorage.getItem("accessToken");

    if (!accessToken) {
      throw new Error("No access token found");
    }

    try {
      const formData = new FormData();
      formData.append("serverAvatar", imageFile);

      const response = await fetch(`${API_BASE_URL}/upload/server-avatar`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        credentials: "include",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to upload server avatar");
      }

      const result = await response.json();
      return result.avatarPath;
    } catch (error) {
      console.error("Upload server avatar error:", error);
      throw error;
    }
  }

  // User
  async uploadUserAvatar(imageFile) {
    const accessToken = localStorage.getItem("accessToken");

    if (!accessToken) {
      throw new Error("No access token found");
    }

    try {
      const formData = new FormData();
      formData.append("userAvatar", imageFile);

      const response = await fetch(`${API_BASE_URL}/upload/user-avatar`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        credentials: "include",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to upload user avatar");
      }

      const result = await response.json();
      return result.avatarPath;
    } catch (error) {
      console.error("Upload user avatar error:", error);
      throw error;
    }
  }

  async updateUser(userData) {
    const accessToken = localStorage.getItem("accessToken");

    if (!accessToken) {
      throw new Error("No access token found");
    }

    try {
      const response = await fetch(`${API_BASE_URL}/user/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        credentials: "include",
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update user");
      }

      const result = await response.json();

      if (result.accessToken) {
        localStorage.setItem("accessToken", result.accessToken);
      }

      const { accessToken: newToken, ...updatedUserData } = result;

      return updatedUserData;
    } catch (error) {
      console.error("Error updating user:", error);
      throw error;
    }
  }
}

const apiService = new ApiService();
export default apiService;
