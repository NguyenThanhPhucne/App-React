import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../features/userSlice";
import channelReducer from "../features/channelSlice";
import appSlice from "../features/appSlice";
//import loadingReducer from "../features/loadingSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    channel: channelReducer,
    app: appSlice,
    //loading: loadingReducer,
  },
});
