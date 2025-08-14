import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import channelReducer from "./channelSlice";
import appSlice from "./appSlice";
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
