"use client";

import { useState } from "react";
import { X, ArrowLeft } from "lucide-react";
import apiService from "../../../services/apiServices.js";

const JoinServerModal = ({ isOpen, onClose, onServerJoined }) => {
  const [inviteLink, setInviteLink] = useState("");
  const [isJoining, setIsJoining] = useState(false);

  const handleClose = () => {
    setInviteLink("");
    onClose();
  };

  const handleJoinServerSubmit = async () => {
    if (!inviteLink.trim()) {
      alert("Please enter an invite link");
      return;
    }

    setIsJoining(true);

    try {
      // Extract invite code from different formats
      let inviteCode = inviteLink.trim();
      if (inviteCode.includes('discord.gg/')) {
        inviteCode = inviteCode.split('discord.gg/')[1];
      } else if (inviteCode.includes('discord.com/invite/')) {
        inviteCode = inviteCode.split('discord.com/invite/')[1];
      } else if (inviteCode.includes('/invite/')) {
        inviteCode = inviteCode.split('/invite/')[1];
      }

      // Basic validation for invite code format
      if (inviteCode.length < 3) {
        alert("Please enter a valid invite link");
        return;
      }

      console.log("Joining server with invite code:", inviteCode);
      
      // Use the existing API service if available
      if (apiService.joinServerByInvite) {
        const result = await apiService.joinServerByInvite(inviteCode);
        if (result && onServerJoined) {
          await onServerJoined(result);
        }
        handleClose();
      } else {
        // Fallback implementation - you can implement this based on your API
        alert("Join server functionality will be implemented soon!");
        handleClose();
      }
    } catch (error) {
      console.error("Error joining server:", error);
      alert(error.message || "Failed to join server. Please check the invite link.");
    } finally {
      setIsJoining(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="create-server-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <h2 className="modal-title">Join a Server</h2>
          <button className="modal-close-btn" onClick={handleClose}>
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="modal-content">
          <p className="modal-description">
            Enter an invite below to join an existing server
          </p>

          <div className="join-form">
            <label htmlFor="invite-link">Invite Code or Link *</label>
            <input
              type="text"
              id="invite-link"
              value={inviteLink}
              onChange={(e) => setInviteLink(e.target.value)}
              placeholder="Enter invite code (e.g., abcd123 or discord.gg/abcd123)"
              className="invite-link-field"
              disabled={isJoining}
            />
            <p className="input-help">
              Paste the full invite link or just the invite code
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="modal-footer">
          <button className="modal-back-btn" onClick={handleClose}>
            <ArrowLeft size={16} />
            Cancel
          </button>
          
          <button 
            className="modal-join-btn"
            onClick={handleJoinServerSubmit}
            disabled={!inviteLink.trim() || isJoining}
          >
            {isJoining ? "Joining..." : "Join Server"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default JoinServerModal;
