import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import channelReducer from "./channelSlice";
import appSlice from "./appSlice";
//import loadingReducer from "../features/loadingSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    channel: channelReducer,
    app: appSlice,
    //loading: loadingReducer,
  },
});
