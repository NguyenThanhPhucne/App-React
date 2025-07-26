import React from 'react';
import { Mic, MicOff, Headphones, Settings } from 'lucide-react';
import './UserControls.css';

const UserControls = ({
  user,
  isMuted,
  isDeafened,
  onToggleMute,
  onToggleDeafen,
  onOpenSettings
}) => {
  return (
    <div className="user-controls">
      <div className="user-controls__profile">
        <div className="user-avatar">
          {user.photoURL ? (
            <img src={user.photoURL} alt={user.displayName} />
          ) : (
            <div className="user-avatar__initials">
              {user.displayName?.charAt(0)}
            </div>
          )}
        </div>
        <div className="user-info">
          <span className="user-info__name">{user.displayName}</span>
          <span className="user-info__id">#{user.uid?.slice(-4)}</span>
        </div>
      </div>
      
      <div className="user-controls__actions">
        <button
          className={`control-button ${isMuted ? 'active' : ''}`}
          onClick={onToggleMute}
          title={isMuted ? 'Unmute' : 'Mute'}
        >
          {isMuted ? <MicOff /> : <Mic />}
        </button>
        
        <button
          className={`control-button ${isDeafened ? 'active' : ''}`}
          onClick={onToggleDeafen}
          title={isDeafened ? 'Undeafen' : 'Deafen'}
        >
          <Headphones />
        </button>
        
        <button
          className="control-button"
          onClick={onOpenSettings}
          title="User Settings"
        >
          <Settings />
        </button>
      </div>
    </div>
  );
};

export default UserControls;
