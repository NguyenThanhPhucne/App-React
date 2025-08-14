"use client";

import React, { useState, useEffect } from "react";
import { X, Hash, Volume2, Trash2, Edit } from "lucide-react";
import { useSelector } from "react-redux";
import { selectCurrentServer } from "../../../../features/appSlice";
import apiService from "../../../services/apiServices";
import "./ChannelSettingsModal.css"; // Reuse the same CSS

// Update the modal to use the passed handlers instead of internal logic
const ChannelSettingsModal = ({
  isOpen,
  onClose,
  channel,
  onChannelUpdated,
  onChannelDeleted,
}) => {
  const [channelName, setChannelName] = useState("");
  const [description, setDescription] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

  const currentServer = useSelector(selectCurrentServer);

  useEffect(() => {
    if (channel) {
      setChannelName(channel.name || "");
      setDescription(channel.description || "");
    }
  }, [channel]);

  const handleClose = () => {
    setChannelName("");
    setDescription("");
    setShowDeleteConfirmation(false);
    onClose();
  };

  const handleUpdateChannel = async () => {
    if (!channelName.trim() || !currentServer || !channel) return;

    setIsUpdating(true);
    try {
      const channelData = {
        name: channelName.trim(),
        description: description.trim(),
      };

      const updatedChannel = await apiService.updateChannel(
        currentServer._id,
        channel._id,
        channelData
      );

      if (updatedChannel && onChannelUpdated) {
        await onChannelUpdated(updatedChannel);
        handleClose();
      }
    } catch (error) {
      console.error("Error updating channel:", error);
      alert(error.message || "Failed to update channel");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteChannel = async () => {
    if (!currentServer || !channel) return;

    setIsDeleting(true);
    try {
      await apiService.deleteChannel(currentServer._id, channel._id);

      if (onChannelDeleted) {
        await onChannelDeleted(channel._id);
        handleClose();
      }
    } catch (error) {
      console.error("Error deleting channel:", error);
      alert(error.message || "Failed to delete channel");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleNameChange = (e) => {
    setChannelName(e.target.value);
  };

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  if (!isOpen || !channel) return null;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="create-server-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <h2 className="modal-title">
            {showDeleteConfirmation ? "Delete Channel" : "Channel Settings"}
          </h2>
          <button className="modal-close-btn" onClick={handleClose}>
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="modal-content">
          {showDeleteConfirmation ? (
            <>
              <p className="modal-description">
                Are you sure you want to delete <strong>#{channel.name}</strong>
                ? This action cannot be undone.
              </p>
              <div className="delete-warning">
                <div className="channel-type-display">
                  <div className="channel-type-icon">
                    {channel.type === "text" ? (
                      <Hash size={20} />
                    ) : (
                      <Volume2 size={20} />
                    )}
                  </div>
                  <span className="channel-type-text">#{channel.name}</span>
                </div>
              </div>
            </>
          ) : (
            <>
              <p className="modal-description">
                Modify your channel settings below.
              </p>

              {/* Channel Type Display */}
              <div className="channel-type-display">
                <div className="channel-type-icon">
                  {channel.type === "text" ? (
                    <Hash size={20} />
                  ) : (
                    <Volume2 size={20} />
                  )}
                </div>
                <span className="channel-type-text">
                  {channel.type === "text" ? "Text Channel" : "Voice Channel"}
                </span>
              </div>

              {/* Channel Name Input */}
              <div className="server-name-input">
                <label htmlFor="channel-name">
                  CHANNEL NAME <span className="required-asterisk">*</span>
                </label>
                <div className="channel-name-wrapper">
                  <div className="channel-name-prefix">
                    {channel.type === "text" ? (
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
                    className="server-name-field"
                    maxLength={100}
                    required
                  />
                </div>
                {!channelName.trim() && channelName.length >= 0 && (
                  <span className="validation-error">
                    Channel name is required
                  </span>
                )}
              </div>

              {/* Channel Description Input */}
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
                      description.length > 1000
                        ? "character-count--warning"
                        : ""
                    }
                  >
                    {description.length}/1024
                  </span>
                </div>
              </div>

              {/* Delete Section */}
              <div className="delete-section">
                <h3>Danger Zone</h3>
                <button
                  className="delete-channel-btn"
                  onClick={() => setShowDeleteConfirmation(true)}
                >
                  <Trash2 size={16} />
                  Delete Channel
                </button>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="modal-footer">
          {showDeleteConfirmation ? (
            <>
              <button
                className="modal-back-btn"
                onClick={() => setShowDeleteConfirmation(false)}
              >
                Cancel
              </button>
              <button
                className="modal-delete-btn"
                onClick={handleDeleteChannel}
                disabled={isDeleting}
              >
                {isDeleting ? "Deleting..." : "Delete Channel"}
              </button>
            </>
          ) : (
            <>
              <button className="modal-back-btn" onClick={handleClose}>
                Cancel
              </button>
              <button
                className="modal-create-btn"
                onClick={handleUpdateChannel}
                disabled={!channelName.trim() || isUpdating}
              >
                {isUpdating ? "Updating..." : "Save Changes"}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChannelSettingsModal;
