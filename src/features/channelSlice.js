import { createSlice } from "@reduxjs/toolkit";

export const channelSlice = createSlice({
  name: "channel",
  initialState: {
    textChannel: {
      id: null,
      name: null,
      description: null,
    },
    voiceChannel: {
      id: null,
      name: null,
      description: null,
    },
  },
  reducers: {
    setTextChannel: (state, action) => {
      state.textChannel.id = action.payload.id;
      state.textChannel.name = action.payload.name;
      state.textChannel.description = action.payload.description;
    },
    setVoiceChannel: (state, action) => {
      state.voiceChannel.id = action.payload.id;
      state.voiceChannel.name = action.payload.name;
      state.voiceChannel.description = action.payload.description;
    },
    clearTextChannel: (state) => {
      state.textChannel = {
        id: null,
        name: null,
        description: null,
      };
    },
    clearVoiceChannel: (state) => {
      state.voiceChannel = {
        id: null,
        name: null,
        description: null,
      };
    },
  },
});

export const {
  setTextChannel,
  setVoiceChannel,
  clearTextChannel,
  clearVoiceChannel,
} = channelSlice.actions;

// Selectors for both channel types
export const selectTextChannel = (state) => state.channel.textChannel;
export const selectVoiceChannel = (state) => state.channel.voiceChannel;

// Individual selectors for text channel
export const selectTextChannelId = (state) => state.channel.textChannel.id;
export const selectTextChannelName = (state) => state.channel.textChannel.name;
export const selectTextChannelDescription = (state) =>
  state.channel.textChannel.description;

// Individual selectors for voice channel
export const selectVoiceChannelId = (state) => state.channel.voiceChannel.id;
export const selectVoiceChannelName = (state) =>
  state.channel.voiceChannel.name;
export const selectVoiceChannelDescription = (state) =>
  state.channel.voiceChannel.description;

export default channelSlice.reducer;
