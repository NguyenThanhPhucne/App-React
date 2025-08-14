"use client";

import { useState } from "react";
import { X, ChevronRight, Globe, Camera, ArrowLeft } from "lucide-react";
import apiService from "../../../services/apiServices.js";

const CreateServerModal = ({ isOpen, onClose, onServerCreated }) => {
  const [currentStep, setCurrentStep] = useState("main"); // main, customize, join
  const [serverName, setServerName] = useState("");
  const [serverDescription, setServerDescription] = useState("");
  const [serverIcon, setServerIcon] = useState(null);
  const [serverIconFile, setServerIconFile] = useState(null);
  const [isUploadingIcon, setIsUploadingIcon] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [inviteLink, setInviteLink] = useState("");

  const handleClose = () => {
    setCurrentStep("main");
    setServerName("");
    setServerDescription("");
    setServerIcon(null);
    setServerIconFile(null);
    setInviteLink("");
    onClose();
  };

  const handleBack = () => {
    if (currentStep === "customize") setCurrentStep("main");
    else if (currentStep === "join") setCurrentStep("main");
  };

  const handleCreateMyOwn = () => {
    setCurrentStep("customize");
  };

  const handleJoinServer = () => {
    setCurrentStep("join");
  };

  const handleCreateServer = async () => {
    if (!serverName.trim() || serverName.trim().length < 2) {
      alert("Server name must be at least 2 characters long");
      return;
    }

    setIsCreating(true);

    try {
      let serverAvatarPath = null;

      if (serverIconFile) {
        setIsUploadingIcon(true);
        try {
          serverAvatarPath = await apiService.uploadServerAvatar(serverIconFile);
        } catch (uploadError) {
          console.error("Error uploading server avatar:", uploadError);
          alert("Failed to upload server icon, but server will be created without it");
        } finally {
          setIsUploadingIcon(false);
        }
      }

      const serverData = {
        name: serverName.trim(),
        description: serverDescription.trim(),
        serverAvatar: serverAvatarPath,
      };

      const newServer = await apiService.createServer(serverData);
      const newServerData = {
        _id: newServer._id,
        name: newServer.name,
        serverAvatar: newServer.serverAvatar,
      };
      
      if (onServerCreated) {
        await onServerCreated(newServerData);
      }

      handleClose();
    } catch (error) {
      console.error("Error creating server:", error);
      alert(error.message || "Failed to create server. Please try again.");
    } finally {
      setIsCreating(false);
    }
  };

  const handleJoinServerSubmit = async () => {
    if (!inviteLink.trim()) {
      alert("Please enter an invite link");
      return;
    }

    try {
      // Extract invite code from different formats
      let inviteCode = inviteLink.trim();
      if (inviteCode.includes('discord.gg/')) {
        inviteCode = inviteCode.split('discord.gg/')[1];
      } else if (inviteCode.includes('discord.com/invite/')) {
        inviteCode = inviteCode.split('discord.com/invite/')[1];
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
        if (result && onServerCreated) {
          await onServerCreated(result);
        }
        handleClose();
      } else {
        alert("Join server functionality will be implemented soon!");
        handleClose();
      }
    } catch (error) {
      console.error("Error joining server:", error);
      alert(error.message || "Failed to join server. Please check the invite link.");
    }
  };

  const handleIconUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Please select a valid image file');
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB');
        return;
      }

      setServerIconFile(file);
      const reader = new FileReader();
      reader.onload = (e) => setServerIcon(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="create-server-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <h2 className="modal-title">
            {currentStep === "main" && "Create Your Server"}
            {currentStep === "customize" && "Customize Your Server"}
            {currentStep === "join" && "Join a Server"}
          </h2>
          <button className="modal-close-btn" onClick={handleClose}>
            <X size={20} />
          </button>
        </div>

        {/* Main Step */}
        {currentStep === "main" && (
          <div className="modal-content">
            <p className="modal-description">
              Your server is where you and your friends hang out. Make yours and start talking.
            </p>

            <div className="server-options">
              <button className="server-option" onClick={handleCreateMyOwn}>
                <div className="server-option-icon">
                  <Globe size={24} />
                </div>
                <span>Create My Own</span>
                <ChevronRight size={16} />
              </button>

              <div className="join-section">
                <p className="join-question">Have an invite already?</p>
                <button className="join-server-btn" onClick={handleJoinServer}>
                  Join a Server
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Customize Step */}
        {currentStep === "customize" && (
          <div className="modal-content">
            <p className="modal-description">
              Give your new server a personality with a name and an icon. You can always change it later.
            </p>

            <div className="customize-section">
              <div className="icon-upload">
                <div className="icon-upload-area" onClick={() => document.getElementById("server-icon-input").click()}>
                  {serverIcon ? (
                    <img src={serverIcon} alt="Server icon" className="server-icon-preview" />
                  ) : (
                    <>
                      <Camera size={24} />
                      <span>UPLOAD</span>
                    </>
                  )}
                  <button className="icon-upload-btn" onClick={(e) => e.stopPropagation()}>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleIconUpload}
                      style={{ display: "none" }}
                      id="server-icon-input"
                    />
                    <label htmlFor="server-icon-input">
                      <div className="upload-plus">+</div>
                    </label>
                  </button>
                </div>
                {serverIconFile && (
                  <p className="file-info">
                    Selected: {serverIconFile.name} ({(serverIconFile.size / 1024 / 1024).toFixed(2)} MB)
                  </p>
                )}
              </div>

              <div className="server-name-input">
                <label htmlFor="server-name">SERVER NAME</label>
                <input
                  type="text"
                  id="server-name"
                  value={serverName}
                  onChange={(e) => setServerName(e.target.value)}
                  placeholder="Enter server name"
                  className="server-name-field"
                  maxLength={100}
                />
                {serverName.trim().length > 0 && serverName.trim().length < 2 && (
                  <span className="validation-error">Server name must be at least 2 characters long</span>
                )}
              </div>

              <div className="server-description-input">
                <label htmlFor="server-description">
                  SERVER DESCRIPTION (Optional)
                </label>
                <textarea
                  id="server-description"
                  value={serverDescription}
                  onChange={(e) => setServerDescription(e.target.value)}
                  placeholder="Tell people what your server is about"
                  className="server-description-field"
                  maxLength={500}
                  rows={3}
                />
              </div>

              <p className="agreement-text">
                By creating a server, you agree to the Community Guidelines.
              </p>
            </div>
          </div>
        )}

        {/* Join Step */}
        {currentStep === "join" && (
          <div className="modal-content">
            <p className="modal-description">Enter an invite below to join an existing server</p>

            <div className="join-form">
              <label htmlFor="invite-link">Invite Your Code Here *</label>
              <input
                type="text"
                id="invite-link"
                value={inviteLink}
                onChange={(e) => setInviteLink(e.target.value)}
                placeholder="Your Code"
                className="invite-link-field"
              />

              {/* <div className="discovery-section">
                <div className="discovery-icon">
                  <Globe size={20} />
                </div>
                <div className="discovery-content">
                  <span className="discovery-title">Don't have an invite?</span>
                  <span className="discovery-desc">Check out Discoverable communities in Server Discovery.</span>
                </div>
                <ChevronRight size={16} />
              </div> */}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="modal-footer">
          {currentStep !== "main" && (
            <button className="modal-back-btn" onClick={handleBack}>
              <ArrowLeft size={16} />
              Back
            </button>
          )}
          
          {currentStep === "customize" && (
            <button 
              className="modal-create-btn" 
              onClick={handleCreateServer} 
              disabled={!serverName.trim() || serverName.trim().length < 2 || isCreating}
            >
              {isCreating ? (isUploadingIcon ? "Uploading..." : "Creating...") : "Create"}
            </button>
          )}
          
          {currentStep === "join" && (
            <button 
              className="modal-join-btn"
              onClick={handleJoinServerSubmit}
              disabled={!inviteLink.trim()}
            >
              Join Server
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateServerModal;
