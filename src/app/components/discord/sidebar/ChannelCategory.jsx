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

  const handleCreateChannel = (e) => {
    e.stopPropagation(); // Prevent event bubbling to category header
    e.preventDefault(); // Prevent any default behavior
    handlers.toggleCreateChannelModal();
    handlers.updateState({ channelTypeToCreate: type });
  };

  const handleKeyDown = (e) => {
    // Handle keyboard navigation
    if (e.key === 'Enter' || e.key === ' ') {
      e.stopPropagation();
      e.preventDefault();
      handleCreateChannel(e);
    }
  };

  return (
    <div className="category">
      <div className="category__header-wrapper">
        <button
          className="category__header ripple-effect"
          onClick={() => handlers.toggleCategory(type)}
          aria-expanded={!isCollapsed}
          aria-controls={`category-${type}-content`}
        >
          <span className={`category__arrow ${!isCollapsed ? 'category__arrow--expanded' : ''}`}>
            {isCollapsed ? <ChevronRight size={12} /> : <ChevronDown size={12} />}
          </span>
          <span>{title}</span>
        </button>
        <button
          className="category__add-btn ripple-effect"
          onClick={handleCreateChannel}
          onKeyDown={handleKeyDown}
          title={`Add ${type} channel`}
          aria-label={`Add new ${type} channel`}
        >
          <Plus size={16} className="category__add" />
        </button>
      </div>

      <div
        id={`category-${type}-content`}
        className={`category__content ${
          isCollapsed ? "category__content--collapsed" : ""
        }`}
        role="group"
        aria-labelledby={`category-${type}-header`}
      >
        {channels.map((channel) => (
          <button
            key={channel._id || channel.id}
            className={`channel ripple-effect ${
              state.activeChannel === channel._id ? "channel--active" : ""
            }`}
            onClick={() => handleChannelSelect(channel)}
            aria-pressed={state.activeChannel === channel._id}
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
