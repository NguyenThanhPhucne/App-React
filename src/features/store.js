import { configureStore } from "@reduxjs/toolkit";
import userReducer, { signOut } from "../features/userSlice";
import channelReducer from "../features/channelSlice";
import appSlice, { clearServers } from "../features/appSlice";
//import loadingReducer from "../features/loadingSlice";

// Middleware to clear app data when user signs out
const clearAppDataOnSignOut = (store) => (next) => (action) => {
  if (signOut.match(action)) {
    store.dispatch(clearServers());
  }
  return next(action);
};

export const store = configureStore({
  reducer: {
    user: userReducer,
    channel: channelReducer,
    app: appSlice,
    //loading: loadingReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(clearAppDataOnSignOut),
});
