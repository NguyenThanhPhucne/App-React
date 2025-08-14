import { createSlice } from "@reduxjs/toolkit";

export const themeSlice = createSlice({
  name: "theme",
  initialState: {
    isDarkMode: JSON.parse(localStorage.getItem('theme')) ?? true,
    isTransitioning: false,
  },
  reducers: {
    toggleTheme: (state) => {
      state.isTransitioning = true;
      state.isDarkMode = !state.isDarkMode;
      localStorage.setItem('theme', JSON.stringify(state.isDarkMode));
    },
    setTheme: (state, action) => {
      state.isTransitioning = true;
      state.isDarkMode = action.payload;
      localStorage.setItem('theme', JSON.stringify(state.isDarkMode));
    },
    setTransitionComplete: (state) => {
      state.isTransitioning = false;
    },
  },
});

export const { toggleTheme, setTheme, setTransitionComplete } = themeSlice.actions;

export const selectIsDarkMode = (state) => state.theme.isDarkMode;
export const selectIsTransitioning = (state) => state.theme.isTransitioning;

export default themeSlice.reducer;
