"use client";

import React from "react";
import ContentHeader from "./ContentHeader";
import ContentBody from "./ContentBody";
import MessageInput from "./MessageInput";

import { useSelector } from "react-redux";
import { selectTextChannel } from "../../../../features/channelSlice";
import { selectUser } from "../../../../features/userSlice";
import socketService from "../../../services/socketService";

const DiscordContent = ({ state, handlers, notificationRef }) => {
  const user = useSelector(selectUser);
  const channel = useSelector(selectTextChannel);

  return (
    <main
      className={`content ${
        state.showMemberList
          ? "content--with-members"
          : "content--without-members"
      }`}
    >
      {channel && (
        <ContentHeader
          state={state}
          handlers={handlers}
          channel={channel}
          notificationRef={notificationRef}
        />
      )}

      <ContentBody channel={channel} socketService={socketService}/>

      {channel && (
        <MessageInput
          socketService={socketService}
          channel={channel}
          user={user}
        />
      )}
    </main>
  );
};

export default DiscordContent;
