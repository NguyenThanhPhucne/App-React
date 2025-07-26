import React from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import ChannelItem from './ChannelItem';
import './ChannelList.css';

const ChannelList = ({
  channels,
  activeChannel,
  collapsedCategories,
  onChannelSelect,
  onToggleCategory
}) => {
  return (
    <div className="channel-list">
      <div className="channel-category">
        <div 
          className="channel-category__header"
          onClick={() => onToggleCategory('text')}
        >
          {collapsedCategories['text'] ? <ChevronRight /> : <ChevronDown />}
          <span>TEXT CHANNELS</span>
        </div>
        
        {!collapsedCategories['text'] && (
          <div className="channel-category__items">
            {channels.text.map((channel) => (
              <ChannelItem
                key={channel.id}
                channel={channel}
                isActive={activeChannel === channel.id}
                onClick={() => onChannelSelect(channel.id)}
                type="text"
              />
            ))}
          </div>
        )}
      </div>

      <div className="channel-category">
        <div 
          className="channel-category__header"
          onClick={() => onToggleCategory('voice')}
        >
          {collapsedCategories['voice'] ? <ChevronRight /> : <ChevronDown />}
          <span>VOICE CHANNELS</span>
        </div>
        
        {!collapsedCategories['voice'] && (
          <div className="channel-category__items">
            {channels.voice.map((channel) => (
              <ChannelItem
                key={channel.id}
                channel={channel}
                isActive={activeChannel === channel.id}
                onClick={() => onChannelSelect(channel.id)}
                type="voice"
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChannelList;
