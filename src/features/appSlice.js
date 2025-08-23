import { createSlice } from "@reduxjs/toolkit";

export const appSlice = createSlice({
  name: "app",
  initialState: {
    currentServer: null,
    selectedServerId: null,
    servers: [],
  },
  reducers: {
    setServers: (state, action) => {
      state.servers = action.payload;
    },
    setCurrentServer: (state, action) => {
      state.currentServer = action.payload;
    },
    setSelectedServer: (state, action) => {
      state.selectedServerId = action.payload;
    },
    updateServerInList: (state, action) => {
      const index = state.servers.findIndex(
        (server) => server._id === action.payload._id
      );
      if (index !== -1) {
        state.servers[index] = action.payload;
      }

      if (
        state.currentServer &&
        state.currentServer._id === action.payload._id
      ) {
        state.currentServer = action.payload;
      }
    },
    addServer: (state, action) => {
      const { _id, name, serverAvatar } = action.payload;
      state.currentServer = action.payload;
      state.selectedServerId = _id;
      state.servers.push({ _id, name, serverAvatar });
    },
    clearServers: (state) => {
      state.servers = [];
      state.currentServer = null;
    },
    removeServer: (state, action) => {
      const serverId = action.payload;

      // Remove server from servers list
      state.servers = state.servers.filter((server) => server._id !== serverId);

      // If the deleted server was the current server, clear it
      if (state.currentServer && state.currentServer._id === serverId) {
        state.currentServer = null;
        state.selectedServerId = null;
      }
    },

    //Channel
    removeChannelFromCurrentServer: (state, action) => {
      const channelId = action.payload;
      if (state.currentServer) {
        // Remove channel from current server
        state.currentServer.channels = state.currentServer.channels.filter(
          (channel) => channel._id !== channelId
        );

        // Also update the server in the servers list
        const serverIndex = state.servers.findIndex(
          (server) => server._id === state.currentServer._id
        );
        if (serverIndex !== -1) {
          state.servers[serverIndex] = { ...state.currentServer };
        }
      }
    },

    updateChannelInCurrentServer: (state, action) => {
      const updatedChannel = action.payload;
      if (state.currentServer) {
        // Update channel in current server
        const channelIndex = state.currentServer.channels.findIndex(
          (channel) => channel._id === updatedChannel._id
        );
        if (channelIndex !== -1) {
          state.currentServer.channels[channelIndex] = updatedChannel;
        }

        // Also update the server in the servers list
        const serverIndex = state.servers.findIndex(
          (server) => server._id === state.currentServer._id
        );
        if (serverIndex !== -1) {
          state.servers[serverIndex] = { ...state.currentServer };
        }
      }
    },
  },
});

export const {
  setServers,
  setCurrentServer,
  setSelectedServer,
  updateServerInList,
  clearServers,
  addServer,
  removeServer,
  removeChannelFromCurrentServer,
  updateChannelInCurrentServer,
} = appSlice.actions;

export const selectServers = (state) => state.app.servers;
export const selectCurrentServer = (state) => state.app.currentServer;
export const selectSelectedServerId = (state) => state.app.selectedServerId;

export default appSlice.reducer;
