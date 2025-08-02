"use client";

import React from "react";
import { ChevronDown, ChevronRight, Plus, Hash, Volume2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  setTextChannel,
  setVoiceChannel,
  selectTextChannelId,
} from "../../../../features/channelSlice";
import socketService from "../../../services/socketService";

const ChannelCategory = ({
  type,
  title,
  channels,
  state,
  handlers,
}) => {
  const previousChannel = useSelector(selectTextChannelId);
  const dispatch = useDispatch();
  const isCollapsed = state.collapsedCategories?.[type];
  const ChannelIcon = type === "text" ? Hash : Volume2;

  const handleChannelSelect = async (channel) => {
    const channelData = {
      id: channel._id || channel.id,
      name: channel.name,
      description: channel.description,
    };

    if (type === "text") {
      try {
        if (previousChannel && previousChannel !== channelData.id) {
          socketService.leaveChannel(previousChannel);
        }
        dispatch(setTextChannel(channelData));
      } catch (error) {
        console.error("Error joining channel:", error);
      }
    } else {
      dispatch(setVoiceChannel(channelData));
    }
  };

  const handleCreateChannel = () => {
    handlers.toggleCreateChannelModal();
    handlers.updateState({ channelTypeToCreate: type });
  };

  return (
    <div className="category">
      <button
        className="category__header"
        onClick={() => handlers.toggleCategory(type)}
      >
        {isCollapsed ? <ChevronRight size={12} /> : <ChevronDown size={12} />}
        <span>{title}</span>
        <Plus
          size={16}
          className="category__add"
          onClick={handleCreateChannel}
        />
      </button>

      <div
        className={`category__content ${
          isCollapsed ? "category__content--collapsed" : ""
        }`}
      >
        {channels.map((channel) => (
          <button
            key={channel._id || channel.id}
            className={`channel ${
              state.activeChannel === channel._id ? "channel--active" : ""
            }`}
            onClick={() => handleChannelSelect(channel)}
          >
            <ChannelIcon size={16} />
            <span>{channel.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ChannelCategory;
