"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  Copy,
  Check,
  Crown,
  Settings,
  Trash2,
  AlertTriangle,
  Camera,
  Upload,
} from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import {
  selectCurrentServer,
  updateServerInList,
  removeServer,
} from "../../../../features/appSlice";
import apiService from "../../../services/apiServices";
import "./ServerSettingsModal.css";

const ServerSettingsModal = ({ isOpen, onClose }) => {
  const [serverName, setServerName] = useState("");
  const [serverDescription, setServerDescription] = useState("");
  const [selectedOwnerId, setSelectedOwnerId] = useState("");
  const [serverIcon, setServerIcon] = useState(null);
  const [serverIconFile, setServerIconFile] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isUploadingIcon, setIsUploadingIcon] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [copied, setCopied] = useState(false);

  const currentServer = useSelector(selectCurrentServer);
  const dispatch = useDispatch();

  // Get the base URL for serving uploaded images
  const API_BASE_URL = import.meta.env.VITE_BACKEND_BASE_URL;

  useEffect(() => {
    if (currentServer) {
      setServerName(currentServer.name || "");
      setServerDescription(currentServer.description || "");
      setSelectedOwnerId(
        currentServer.ownerId?._id || currentServer.ownerId || ""
      );
      // Set current server avatar
      setServerIcon(`${API_BASE_URL}${currentServer.serverAvatar}`
      );
      setServerIconFile(null);
    }
  }, [currentServer, API_BASE_URL]);

  const handleClose = () => {
    setServerName("");
    setServerDescription("");
    setSelectedOwnerId("");
    setServerIconFile(null);
    setCopied(false);
    setShowDeleteConfirm(false);
    onClose();
  };

  const handleIconUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        alert("Please select a valid image file");
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert("File size must be less than 5MB");
        return;
      }

      // Store the actual file for upload
      setServerIconFile(file);

      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e) => setServerIcon(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleUpdateServer = async () => {
    if (!serverName.trim() || serverName.trim().length < 3 || !currentServer)
      return;

    setIsUpdating(true);
    try {
      let serverAvatarPath = currentServer.serverAvatar;

      // Upload new avatar if one was selected
      if (serverIconFile) {
        setIsUploadingIcon(true);
        try {
          serverAvatarPath = await apiService.uploadServerAvatar(
            serverIconFile
          );
        } catch (uploadError) {
          console.error("Error uploading server avatar:", uploadError);
          alert(
            "Failed to upload server icon, but other changes will be saved"
          );
        } finally {
          setIsUploadingIcon(false);
        }
      }

      const serverData = {
        name: serverName.trim(),
        description: serverDescription.trim(),
        serverAvatar: serverAvatarPath,
        ownerId:
          selectedOwnerId !== currentServer.ownerId?._id
            ? selectedOwnerId
            : undefined,
      };

      // Remove undefined values
      Object.keys(serverData).forEach(
        (key) => serverData[key] === undefined && delete serverData[key]
      );

      const response = await apiService.updateServer(
        currentServer._id,
        serverData
      );
      console.log(response);

      if (response && response.server) {
        // Update the server in Redux store
        dispatch(updateServerInList(response.server));
        handleClose();
        alert("Server updated successfully!");
      }
    } catch (error) {
      console.error("Error updating server:", error);
      alert(error.message || "Failed to update server");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteServer = async () => {
    if (!currentServer) return;

    setIsDeleting(true);
    try {
      await apiService.deleteServer(currentServer._id);

      // Remove server from Redux store
      dispatch(removeServer(currentServer._id));

      // Close modal
      handleClose();

      // Show success message
      alert("Server deleted successfully");
    } catch (error) {
      console.error("Error deleting server:", error);
      alert(error.message || "Failed to delete server");
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  const handleCopyInviteCode = async () => {
    if (currentServer?.inviteCode) {
      await navigator.clipboard.writeText(currentServer.inviteCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const isCurrentUserOwner = () => {
    // You might need to get current user ID from another selector
    return true; // For now, assume user can edit
  };

  if (!isOpen || !currentServer) return null;

  return (
    <div className="server-settings-modal-overlay" onClick={handleClose}>
      <div
        className="server-settings-modal"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="server-settings-modal__header">
          <h2 className="server-settings-modal__title">
            <Settings size={20} />
            Server Settings
          </h2>
          <button
            className="server-settings-modal__close"
            onClick={handleClose}
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="server-settings-modal__content">
          <p className="server-settings-modal__description">
            Manage your server settings below.
          </p>

          {/* Server Avatar Section */}
          <div className="server-settings-input-group">
            <label className="server-settings-label">
              SERVER AVATAR <span className="required-asterisk">*</span>
            </label>
            <div className="server-settings-avatar-section">
              <div className="server-settings-avatar-preview">
                <div
                  className="server-settings-avatar-container"
                  onClick={() =>
                    document.getElementById("server-icon-input").click()
                  }
                >
                  {serverIcon ? (
                    <img
                      src={serverIcon}
                      alt="Server avatar"
                      className="server-settings-avatar-image"
                    />
                  ) : (
                    <div className="server-settings-avatar-placeholder">
                      <Camera size={32} />
                      <span>Upload Avatar</span>
                    </div>
                  )}
                  <div className="server-settings-avatar-overlay">
                    <Upload size={20} />
                  </div>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleIconUpload}
                  style={{ display: "none" }}
                  id="server-icon-input"
                />
              </div>
              <div className="server-settings-avatar-actions">
                <button
                  type="button"
                  onClick={() =>
                    document.getElementById("server-icon-input").click()
                  }
                  className="server-settings-avatar-btn server-settings-avatar-btn--upload"
                >
                  <Upload size={16} />
                  {serverIcon ? "Change Avatar" : "Upload Avatar"}
                </button>
              </div>
              {serverIconFile && (
                <p className="server-settings-file-info">
                  Selected: {serverIconFile.name} (
                  {(serverIconFile.size / 1024 / 1024).toFixed(2)} MB)
                </p>
              )}
              <span className="server-settings-help-text">
                Recommended size: 512x512px. Max file size: 5MB. Supports JPG,
                PNG, GIF.
              </span>
            </div>
          </div>

          {/* Server Name Input */}
          <div className="server-settings-input-group">
            <label htmlFor="server-name" className="server-settings-label">
              SERVER NAME <span className="required-asterisk">*</span>
            </label>
            <input
              type="text"
              id="server-name"
              value={serverName}
              onChange={(e) => setServerName(e.target.value)}
              className="server-settings-input"
              maxLength={100}
              required
            />
            {serverName.trim().length > 0 && serverName.trim().length < 3 && (
              <span className="server-settings-validation-error">
                Server name must be at least 3 characters long
              </span>
            )}
          </div>

          {/* Server Description Input */}
          <div className="server-settings-input-group">
            <label
              htmlFor="server-description"
              className="server-settings-label"
            >
              SERVER DESCRIPTION{" "}
              <span className="optional-text">(optional)</span>
            </label>
            <textarea
              id="server-description"
              value={serverDescription}
              onChange={(e) => setServerDescription(e.target.value)}
              placeholder="What's this server about?"
              className="server-settings-textarea"
              maxLength={1024}
              rows={3}
            />
            <div className="server-settings-character-count">
              <span
                className={
                  serverDescription.length > 1000
                    ? "server-settings-character-count--warning"
                    : ""
                }
              >
                {serverDescription.length}/1024
              </span>
            </div>
          </div>

          {/* Owner Selection */}
          <div className="server-settings-input-group">
            <label htmlFor="server-owner" className="server-settings-label">
              SERVER OWNER
            </label>
            <select
              id="server-owner"
              value={selectedOwnerId}
              onChange={(e) => setSelectedOwnerId(e.target.value)}
              className="server-settings-select"
            >
              {currentServer.members?.map((member) => (
                <option
                  key={member.userId._id || member.userId}
                  value={member.userId._id || member.userId}
                >
                  {member.userId.username ||
                    member.userId.displayName ||
                    `User ${member.userId._id || member.userId}`}
                  {(member.userId._id || member.userId) ===
                    (currentServer.ownerId?._id || currentServer.ownerId) &&
                    " (Current Owner)"}
                </option>
              ))}
            </select>
            <span className="server-settings-help-text">
              <Crown size={14} />
              Only the current owner can transfer ownership
            </span>
          </div>

          {/* Invite Code Section */}
          <div className="server-settings-input-group">
            <label htmlFor="invite-code" className="server-settings-label">
              INVITE CODE
            </label>
            <div className="server-settings-invite-container">
              <input
                type="text"
                id="invite-code"
                value={currentServer.inviteCode || "No invite code"}
                className="server-settings-input server-settings-invite-input"
                readOnly
              />
              <button
                type="button"
                onClick={handleCopyInviteCode}
                className="server-settings-copy-btn"
              >
                {copied ? <Check size={16} /> : <Copy size={16} />}
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
            <span className="server-settings-help-text">
              Share this code with others to invite them to your server
            </span>
          </div>

          {/* Danger Zone */}
          <div className="server-settings-danger-zone">
            <label className="server-settings-label server-settings-danger-label">
              DANGER ZONE
            </label>
            <div className="server-settings-danger-container">
              <div className="server-settings-danger-header">
                <h4 className="server-settings-danger-title">
                  <AlertTriangle size={18} />
                  Delete Server
                </h4>
                <p className="server-settings-danger-description">
                  This action cannot be undone. This will permanently delete the
                  server and all of its channels.
                </p>
              </div>

              {!showDeleteConfirm ? (
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(true)}
                  className="server-settings-delete-btn"
                >
                  <Trash2 size={16} />
                  Delete Server
                </button>
              ) : (
                <div className="server-settings-danger-actions">
                  <span className="server-settings-confirm-text">
                    Are you sure?
                  </span>
                  <button
                    type="button"
                    onClick={handleDeleteServer}
                    disabled={isDeleting}
                    className="server-settings-confirm-btn"
                  >
                    {isDeleting ? "Deleting..." : "Yes, Delete"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowDeleteConfirm(false)}
                    disabled={isDeleting}
                    className="server-settings-cancel-btn"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="server-settings-modal__footer">
          <button
            className="server-settings-footer-btn server-settings-footer-btn--cancel"
            onClick={handleClose}
          >
            Cancel
          </button>
          <button
            className="server-settings-footer-btn server-settings-footer-btn--save"
            onClick={handleUpdateServer}
            disabled={
              !serverName.trim() ||
              serverName.trim().length < 3 ||
              isUpdating ||
              isDeleting ||
              isUploadingIcon
            }
          >
            {isUploadingIcon
              ? "Uploading Avatar..."
              : isUpdating
              ? "Updating..."
              : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ServerSettingsModal;
