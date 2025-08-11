import { useEffect, useRef, useState, useCallback } from "react";
import { Room, RoomEvent, createLocalAudioTrack } from "livekit-client";

const API_BASE_URL = import.meta.env.VITE_BACKEND_BASE_URL;

export function useVoiceRoom({ channelId, user }) {
  const roomRef = useRef(null);
  const [participants, setParticipants] = useState([]);
  const [connected, setConnected] = useState(false);
  const [muted, setMuted] = useState(true);
  const [connecting, setConnecting] = useState(false);
  const [error, setError] = useState(null);

  const refreshParticipants = useCallback(() => {
    if (!roomRef.current) return;
    const local = roomRef.current.localParticipant;
    const remote = Array.from(roomRef.current.remoteParticipants.values());
    setParticipants([local, ...remote]);
  }, []);

  const joinVoiceChannel = useCallback(async () => {
    if (!channelId || !user || connecting) return;

    try {
      setConnecting(true);
      setError(null);

      // Get voice token from backend
      const token = localStorage.getItem("accessToken");
      const response = await fetch(
        `${API_BASE_URL}/api/voice/token/${channelId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
          body: JSON.stringify({
            userId: user.id || user._id,
            username: user.username,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to get voice token");
      }

      const { token: voiceToken, url } = await response.json();

      // Create and connect to LiveKit room
      const room = new Room({
        publishDefaults: { video: false, audioBitrate: 32000 },
        adaptiveStream: true,
        dynacast: true,
      });

      await room.connect(url, voiceToken);

      roomRef.current = room;
      setConnected(true);

      // Set up event listeners
      room
        .on(RoomEvent.ParticipantConnected, refreshParticipants)
        .on(RoomEvent.ParticipantDisconnected, refreshParticipants)
        .on(RoomEvent.TrackSubscribed, refreshParticipants)
        .on(RoomEvent.TrackUnsubscribed, refreshParticipants)
        .on(RoomEvent.ActiveSpeakersChanged, refreshParticipants)
        .on(RoomEvent.Disconnected, () => {
          setConnected(false);
          setMuted(true);
          roomRef.current = null;
        });

      refreshParticipants();
    } catch (err) {
      console.error("Error joining voice channel:", err);
      setError(err.message);
    } finally {
      setConnecting(false);
    }
  }, [channelId, user, connecting, refreshParticipants]);

  const leaveVoiceChannel = useCallback(() => {
    if (roomRef.current) {
      roomRef.current.disconnect();
      roomRef.current = null;
      setConnected(false);
      setMuted(true);
      setParticipants([]);
    }
  }, []);

  const toggleMute = useCallback(async () => {
    if (!roomRef.current) return;

    try {
      if (muted) {
        // Unmute: create and publish audio track
        const track = await createLocalAudioTrack({
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        });
        await roomRef.current.localParticipant.publishTrack(track);
        setMuted(false);
      } else {
        // Mute: unpublish all audio tracks
        roomRef.current.localParticipant.audioTracks.forEach((pub) => {
          pub.track?.stop();
          roomRef.current.localParticipant.unpublishTrack(pub.track);
        });
        setMuted(true);
      }
    } catch (err) {
      console.error("Error toggling mute:", err);
      setError(err.message);
    }
  }, [muted]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (roomRef.current) {
        roomRef.current.disconnect();
      }
    };
  }, []);

  return {
    participants,
    connected,
    muted,
    connecting,
    error,
    joinVoiceChannel,
    leaveVoiceChannel,
    toggleMute,
  };
}
