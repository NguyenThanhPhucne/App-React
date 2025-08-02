"use client";

import React, { useState } from "react";
import { useSelector } from "react-redux";
import { selectCurrentServer } from "../../../../features/appSlice";
import { X, Hash, Volume2, Lock } from "lucide-react";
import "./CreateChannelModal.css";

const CreateChannelModal = ({
  isOpen,
  onClose,
  onChannelCreated,
  channelType,
}) => {
  const [channelName, setChannelName] = useState("");
  const [description, setDescription] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const server = useSelector(selectCurrentServer);
  const serverId = server?._id;

  const handleClose = () => {
    setChannelName("");
    setDescription("");
    onClose();
  };

  const handleCreateChannel = async () => {
    setIsCreating(true);
    try {
      const newChannel = {
        name: channelName,
        type: channelType,
        description: description,
      };

      if (onChannelCreated) {
        await onChannelCreated(serverId, newChannel);
      }

      handleClose();
    } catch (error) {
      console.error("Error creating channel:", error);
    } finally {
      setIsCreating(false);
    }
  };

  const handleNameChange = (e) => {
    let value = e.target.value;
    setChannelName(value);
  };

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="create-server-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <h2 className="modal-title">
            Create {channelType === "text" ? "Text" : "Voice"} Channel
          </h2>
          <button className="modal-close-btn" onClick={handleClose}>
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="modal-content">
          <p className="modal-description">
            {channelType === "text"
              ? "Text channels are where your members communicate with text. They're best for organized conversations."
              : "Voice channels are where your members communicate with voice. They're great for talking and hanging out."}
          </p>

          {/* Channel Type Display */}
          <div className="channel-type-display">
            <div className="channel-type-icon">
              {channelType === "text" ? (
                <Hash size={20} />
              ) : (
                <Volume2 size={20} />
              )}
            </div>
            <span className="channel-type-text">
              {channelType === "text" ? "Text Channel" : "Voice Channel"}
            </span>
          </div>

          {/* Channel Name Input - REQUIRED */}
          <div className="server-name-input">
            <label htmlFor="channel-name">
              CHANNEL NAME <span className="required-asterisk">*</span>
            </label>
            <div className="channel-name-wrapper">
              <div className="channel-name-prefix">
                {channelType === "text" ? (
                  <Hash size={16} />
                ) : (
                  <Volume2 size={16} />
                )}
              </div>
              <input
                type="text"
                id="channel-name"
                value={channelName}
                onChange={handleNameChange}
                placeholder={channelType === "text" ? "new-channel" : "General"}
                className="server-name-field"
                maxLength={100}
                autoFocus
                required
              />
            </div>
            {!channelName.trim() && channelName.length > 0 && (
              <span className="validation-error">Channel name is required</span>
            )}
            {channelType === "text" && (
              <span className="channel-name-help">
                Channel names must be lowercase, without spaces or special
                characters.
              </span>
            )}
          </div>

          {/* Channel Description Input - OPTIONAL */}
          <div className="server-name-input">
            <label htmlFor="channel-description">
              CHANNEL DESCRIPTION{" "}
              <span className="optional-text">(optional)</span>
            </label>
            <textarea
              id="channel-description"
              value={description}
              onChange={handleDescriptionChange}
              placeholder="What's this channel about?"
              className="channel-description-field"
              maxLength={1024}
              rows={3}
            />
            <div className="character-count">
              <span
                className={
                  description.length > 1000 ? "character-count--warning" : ""
                }
              >
                {description.length}/1024
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="modal-footer">
          <button className="modal-back-btn" onClick={handleClose}>
            Cancel
          </button>

          <button
            className="modal-create-btn"
            onClick={handleCreateChannel}
            disabled={!channelName.trim() || isCreating}
          >
            {isCreating ? "Creating..." : "Create Channel"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateChannelModal;
