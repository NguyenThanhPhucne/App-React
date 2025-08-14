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
      state.servers.push(action.payload);
    },
    clearServers: (state) => {
      state.servers = [];
      state.currentServer = null;
      state.selectedServerId = null;
    }
  },
});

export const { setServers, setCurrentServer, setSelectedServer, updateServerInList, clearServers } =
  appSlice.actions;

export const selectServers = (state) => state.app.servers;
export const selectCurrentServer = (state) => state.app.currentServer;
export const selectSelectedServerId = (state) => state.app.selectedServerId;

export default appSlice.reducer;
