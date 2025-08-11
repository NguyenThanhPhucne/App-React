import React from 'react';
import { useSelector } from 'react-redux';
import { useVoiceRoom } from '../../../../hooks/useVoiceRoom';
import { selectUser } from '../../../../features/userSlice';
import VoicePanel from './VoicePanel';

const VoiceManager = () => {
  const user = useSelector(selectUser);
  const voiceChannel = useSelector(state => state.channel.voiceChannel);
  
  const {
    participants,
    connected,
    muted,
    connecting,
    error,
    joinVoiceChannel,
    leaveVoiceChannel,
    toggleMute
  } = useVoiceRoom({ 
    channelId: voiceChannel?.id, 
    user 
  });

  // Auto-join when voice channel is selected
  React.useEffect(() => {
    if (voiceChannel?.id && user && !connected && !connecting) {
      joinVoiceChannel();
    }
  }, [voiceChannel?.id, user, connected, connecting, joinVoiceChannel]);

  if (!voiceChannel) return null;

  return (
    <VoicePanel
      participants={participants}
      connected={connected}
      muted={muted}
      connecting={connecting}
      error={error}
      onToggleMute={toggleMute}
      onLeaveChannel={leaveVoiceChannel}
      channelName={voiceChannel.name}
    />
  );
};

export default VoiceManager;