"use client";

import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { X, Camera, User } from "lucide-react";
import { selectUser, signIn } from "../../../../features/userSlice";
import apiService from "../../../services/apiServices";
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
      <div className="user-settings-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <h2 className="modal-title">User Settings</h2>
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
            <div className="error-message general-error">
              {errors.general}
            </div>
          )}

          {/* Avatar Section */}
          <div className="avatar-section">
            <label className="section-label">Avatar</label>
            <div className="avatar-upload">
              <div
                className="avatar-upload-area"
                onClick={() =>
                  document.getElementById("user-avatar-input").click()
                }
              >
                {avatar ? (
                  <img
                    src={avatar}
                    alt="User avatar"
                    className="user-avatar-preview"
                  />
                ) : (
                  <div className="default-avatar">
                    <User size={40} />
                  </div>
                )}
                <div className="avatar-upload-overlay">
                  <Camera size={20} />
                  <span>Change Avatar</span>
                </div>
              </div>
              
              <input
                type="file"
                id="user-avatar-input"
                accept="image/*"
                onChange={handleAvatarUpload}
                style={{ display: "none" }}
              />
              
              {errors.avatar && (
                <span className="error-message">{errors.avatar}</span>
              )}
            </div>
          </div>

          {/* Username Input */}
          <div className="input-section">
            <label htmlFor="username" className="input-label">
              Username <span className="required-asterisk">*</span>
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
              className={`input-field ${errors.username ? "input-field--error" : ""}`}
              maxLength={20}
            />
            {errors.username && (
              <span className="error-message">{errors.username}</span>
            )}
          </div>

          {/* Display Name Input */}
          <div className="input-section">
            <label htmlFor="displayName" className="input-label">
              Display Name
            </label>
            <input
              type="text"
              id="displayName"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Enter display name (optional)"
              className={`input-field ${errors.displayName ? "input-field--error" : ""}`}
              maxLength={32}
            />
            {errors.displayName && (
              <span className="error-message">{errors.displayName}</span>
            )}
            <span className="input-help">
              This is how others will see your name in servers and direct messages.
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="modal-footer">
          <button
            className="cancel-btn"
            onClick={handleClose}
            disabled={isUpdating}
          >
            Cancel
          </button>
          <button
            className={`save-btn ${
              (!username.trim() || isUpdating) ? "save-btn--disabled" : ""
            }`}
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