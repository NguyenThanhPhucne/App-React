// d:\Coming\frontend\src\app\components\discord\voice\VoicePanel.jsx
import React from 'react';
import { Mic, MicOff, PhoneOff, Volume2, Loader } from 'lucide-react';
import './VoicePanel.css';

const VoicePanel = ({
  participants = [],
  connected,
  muted,
  connecting,
  error,
  onToggleMute,
  onLeaveChannel,
  channelName
}) => {
  if (!connected && !connecting) return null;

  return (
    <div className="voice-panel">
      <div className="voice-panel__header">
        <Volume2 size={16} />
        <span>{channelName || 'Voice Channel'}</span>
        {connecting && <Loader size={14} className="spinning" />}
      </div>

      <div className="voice-panel__participants">
        {participants.map(participant => (
          <div 
            key={participant.identity} 
            className={`voice-participant ${participant.isSpeaking ? 'speaking' : ''}`}
          >
            <div className="voice-participant__avatar">
              {participant.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <span className="voice-participant__name">
              {participant.name || participant.identity}
              {participant.isLocal && ' (You)'}
            </span>
            <div className="voice-participant__status">
              {participant.isLocal ? (
                muted ? <MicOff size={14} className="muted" /> : <Mic size={14} />
              ) : (
                participant.audioTracks?.size === 0 ? <MicOff size={14} className="muted" /> : <Mic size={14} />
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="voice-panel__controls">
        <button 
          onClick={onToggleMute}
          className={`voice-control ${muted ? 'muted' : ''}`}
          title={muted ? 'Unmute' : 'Mute'}
          disabled={connecting}
        >
          {muted ? <MicOff size={20} /> : <Mic size={20} />}
        </button>
        <button 
          onClick={onLeaveChannel}
          className="voice-control disconnect"
          title="Leave Channel"
          disabled={connecting}
        >
          <PhoneOff size={20} />
        </button>
      </div>

      {error && (
        <div className="voice-panel__error">
          {error}
        </div>
      )}
    </div>
  );
};

export default VoicePanel;