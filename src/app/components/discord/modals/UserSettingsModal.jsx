"use client";

import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { X, Camera, User, AlertTriangle, Lightbulb, Users, Edit3, Trash2 } from "lucide-react";
import { selectUser, signIn } from "../../../../features/userSlice";
import apiService from "../../../services/apiServices";
import "../../../../styles/discord/modals.css"; // Import base modal styles
import "./UserSettingsModal.css";

const UserSettingsModal = ({ isOpen, onClose }) => {
  const user = useSelector(selectUser);
  const dispatch = useDispatch();
  
  const [username, setUsername] = useState(user?.username || "");
  const [displayName, setDisplayName] = useState(user?.displayName || "");
  const [avatar, setAvatar] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [errors, setErrors] = useState({});
  const API_BASE_URL = import.meta.env.VITE_BACKEND_BASE_URL;

  useEffect(() => {
    if(user){
      setAvatar(`${API_BASE_URL}${user.avatar}`)
    }
  }, [user, API_BASE_URL])

  const handleAvatarUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setErrors({ avatar: 'Please select a valid image file' });
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors({ avatar: 'File size must be less than 5MB' });
        return;
      }

      // Clear avatar error
      setErrors(prev => ({ ...prev, avatar: null }));

      // Store the actual file for upload
      setAvatarFile(file);

      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e) => setAvatar(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Username validation
    if (!username.trim()) {
      newErrors.username = "Username is required";
    } else if (username.trim().length < 6) {
      newErrors.username = "Username must be at least 6 characters";
    } else if (username.trim().length > 20) {
      newErrors.username = "Username must be less than 20 characters";
    }

    // Display name validation
    if (displayName.trim() && displayName.trim().length > 32) {
      newErrors.displayName = "Display name must be less than 32 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleUpdateUser = async () => {
    if (!validateForm()) {
      return;
    }

    setIsUpdating(true);

    try {
      let avatarPath = user?.avatar;

      // Upload avatar if a new file was selected
      if (avatarFile) {
        setIsUploading(true);
        try {
          avatarPath = await apiService.uploadUserAvatar(avatarFile);
        } catch (uploadError) {
          console.error("Error uploading avatar:", uploadError);
          setErrors({ avatar: "Failed to upload avatar" });
          setIsUploading(false);
          setIsUpdating(false);
          return;
        } finally {
          setIsUploading(false);
        }
      }

      const userData = {
        username: username.trim(),
        displayName: displayName.trim() || null,
        avatar: avatarPath,
      };

      const updatedUser = await apiService.updateUser(userData);
      
      // Update user in Redux store
      dispatch(signIn(updatedUser));

      handleClose();
    } catch (error) {
      console.error("Error updating user:", error);
      if (error.message.includes("username")) {
        setErrors({ username: error.message });
      } else {
        setErrors({ general: error.message || "Failed to update profile" });
      }
    } finally {
      setIsUpdating(false);
    }
  };

  const handleClose = () => {
    setUsername(user?.username || "");
    setDisplayName(user?.displayName || "");
    setAvatarFile(null);
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="create-server-modal user-settings-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <h2 className="modal-title">
            <User size={20} />
            User Settings
          </h2>
          <button className="modal-close-btn" onClick={handleClose}>
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="modal-content">
          <p className="modal-description">
            Update your profile information. Changes will be reflected across all servers.
          </p>

          {/* General Error */}
          {errors.general && (
            <div className="user-settings-general-error">
              {errors.general}
            </div>
          )}

          {/* Avatar Section */}
          <div className="modal-input-group">
            <label className="modal-label">
              <User size={16} />
              Profile Picture
            </label>
            <div className="user-settings-avatar-section">
              <div className="user-settings-avatar-preview">
                <div
                  className="user-settings-avatar-container"
                  onClick={() =>
                    document.getElementById("user-avatar-input").click()
                  }
                >
                  {avatar ? (
                    <img
                      src={avatar}
                      alt="User avatar"
                      className="user-settings-avatar-image"
                    />
                  ) : (
                    <div className="user-settings-avatar-placeholder">
                      <User size={40} />
                      <span>Upload Image</span>
                    </div>
                  )}
                  <div className="user-settings-avatar-overlay">
                    <Camera size={20} />
                    <span>Change Avatar</span>
                  </div>
                </div>
              </div>
              
              <div className="user-settings-avatar-actions">
                <button
                  type="button"
                  className="user-settings-avatar-btn user-settings-avatar-btn--upload"
                  onClick={() => document.getElementById("user-avatar-input").click()}
                  disabled={isUploading}
                >
                  <Camera size={16} />
                  {isUploading ? "Uploading..." : avatar ? "Change Avatar" : "Upload Avatar"}
                </button>
                {avatar && (
                  <button
                    type="button"
                    className="user-settings-avatar-btn user-settings-avatar-btn--remove"
                    onClick={() => {
                      setAvatar(null);
                      setAvatarFile(null);
                    }}
                    disabled={isUploading}
                  >
                    <Trash2 size={16} />
                    Remove
                  </button>
                )}
              </div>
              
              <input
                type="file"
                id="user-avatar-input"
                accept="image/*"
                onChange={handleAvatarUpload}
                className="user-settings-avatar-input"
              />
              
              {errors.avatar && (
                <div className="user-settings-validation-error">
                  <AlertTriangle size={14} />
                  {errors.avatar}
                </div>
              )}
              
              <div className="user-settings-help-text">
                <Lightbulb size={14} />
                Recommended: Square image, at least 128×128px, max 5MB
              </div>
            </div>
          </div>

          {/* Username Input */}
          <div className="modal-input-group">
            <label htmlFor="username" className="modal-label">
              <Edit3 size={16} />
              Username <span className="required-asterisk">*</span>
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Choose a unique username"
              className="modal-input"
              maxLength={20}
            />
            {errors.username && (
              <div className="user-settings-validation-error">{errors.username}</div>
            )}
            <div className="user-settings-help-text">
              <Edit3 size={14} />
              This is your unique identifier. Must be 6-20 characters, only letters, numbers, and underscores.
            </div>
          </div>

          {/* Display Name Input */}
          <div className="modal-input-group">
            <label htmlFor="displayName" className="modal-label">
              <Users size={16} />
              Display Name <span className="optional-text">— optional</span>
            </label>
            <input
              type="text"
              id="displayName"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Your public display name"
              className="modal-input"
              maxLength={32}
            />
            {errors.displayName && (
              <div className="user-settings-validation-error">
                <AlertTriangle size={14} />
                {errors.displayName}
              </div>
            )}
            <div className="user-settings-help-text">
              <Users size={14} />
              This is how others will see your name in servers and direct messages.
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="modal-footer">
          <button
            className="modal-back-btn"
            onClick={handleClose}
            disabled={isUpdating}
          >
            Cancel
          </button>
          <button
            className="modal-create-btn"
            onClick={handleUpdateUser}
            disabled={!username.trim() || isUpdating}
          >
            {isUpdating ? (
              <>
                {isUploading ? "Uploading..." : "Saving..."}
              </>
            ) : (
              "Save Changes"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserSettingsModal;