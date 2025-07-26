import React from 'react';
import { Hash, Volume2 } from 'lucide-react';
import './ChannelItem.css';

const ChannelItem = ({ channel, isActive, type, onClick }) => {
  const Icon = type === 'text' ? Hash : Volume2;
  
  return (
    <div 
      className={`channel-item ${isActive ? 'active' : ''}`}
      onClick={onClick}
    >
      <Icon className="channel-item__icon" />
      <span className="channel-item__name">{channel.name}</span>
    </div>
  );
};

export default ChannelItem;
