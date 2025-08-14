"use client";

import { useState } from "react";
import { X, Camera } from "lucide-react";
import apiService from "../../../services/apiServices.js";

const CreateServerModal = ({ isOpen, onClose, onServerCreated }) => {
  const [serverName, setServerName] = useState("");
  const [serverDescription, setServerDescription] = useState("");
  const [serverIcon, setServerIcon] = useState(null);
  const [serverIconFile, setServerIconFile] = useState(null);
  const [isUploadingIcon, setIsUploadingIcon] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const handleClose = () => {
    setServerName("");
    setServerDescription("");
    setServerIcon(null);
    onClose();
  };

  const handleCreateServer = async () => {
    if (!serverName.trim() || serverName.trim().length < 3) {
      return;
    }

    if (!serverIconFile && !serverIcon) {
    alert("Please select a server avatar");
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
          // Continue with server creation even if upload fails
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
      }
      console.log(newServerData);
      
      if (onServerCreated) {
        await onServerCreated(newServerData);
      }

      handleClose();
    } catch (error) {
      console.error("Error creating server:", error);
      alert(error.message || "Failed to create server");
    } finally {
      setIsCreating(false);
    }
  };

  const handleIconUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select a valid image file');
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB');
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

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="create-server-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <h2 className="modal-title">Create Your Server</h2>
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

              {/* <div className="template-section">
                <h3 className="template-title">START FROM A TEMPLATE</h3>
                <div className="template-options">
                  <button className="template-option" onClick={() => handleTemplateClick("Gaming")}>
                    <div className="template-icon gaming">
                      <Gamepad2 size={24} />
                    </div>
                    <span>Gaming</span>
                    <ChevronRight size={16} />
                  </button>

                  <button className="template-option" onClick={() => handleTemplateClick("Friends")}>
                    <div className="template-icon friends">
                      <Heart size={24} />
                    </div>
                    <span>Friends</span>
                    <ChevronRight size={16} />
                  </button>

                  <button className="template-option" onClick={() => handleTemplateClick("Study Group")}>
                    <div className="template-icon study">
                      <GraduationCap size={24} />
                    </div>
                    <span>Study Group</span>
                    <ChevronRight size={16} />
                  </button>

                  <button className="template-option" onClick={() => handleTemplateClick("School Club")}>
                    <div className="template-icon school">
                      <Building size={24} />
                    </div>
                    <span>School Club</span>
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div> */}

              <div className="join-section">
                <p className="join-question">Have an invite already?</p>
                <button className="join-server-btn" onClick={handleJoinServer}>
                  Join a Server
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Purpose Step */}
        {currentStep === "purpose" && (
          <div className="modal-content">
            <p className="modal-description">
              In order to help you with your setup, is your new server for just a few friends or a larger community?
            </p>

            <div className="purpose-options">
              <button className="purpose-option" onClick={() => setCurrentStep("customize")}>
                <div className="purpose-icon">
                  <Globe size={24} />
                </div>
                <span>For a club or community</span>
                <ChevronRight size={16} />
              </button>

              <button className="purpose-option" onClick={() => setCurrentStep("customize")}>
                <div className="purpose-icon">
                  <Users size={24} />
                </div>
                <span>For me and my friends</span>
                <ChevronRight size={16} />
              </button>
            </div>

            <p className="skip-text">
              Not sure? You can <button className="skip-link" onClick={handleSkipQuestion}>skip this question</button> for now.
            </p>
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
              <div
                className="icon-upload-area"
                onClick={() =>
                  document.getElementById("server-icon-input").click()
                }
              >
                {serverIcon ? (
                  <img
                    src={serverIcon}
                    alt="Server icon"
                    className="server-icon-preview"
                  />
                ) : (
                  <>
                    <Camera size={24} />
                    <span>UPLOAD</span>
                  </>
                )}
                <button
                  className="icon-upload-btn"
                  onClick={(e) => e.stopPropagation()}
                >
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
              <label htmlFor="server-name">SERVER NAME *</label>
              <input
                type="text"
                id="server-name"
                value={serverName}
                onChange={(e) => setServerName(e.target.value)}
                placeholder="Enter server name"
                className="server-name-field"
                maxLength={100}
              />
              {serverName.trim().length > 0 && serverName.trim().length < 3 && (
                <span className="validation-error">
                  Server name must be at least 3 characters long
                </span>
              )}
            </div>

              <p className="agreement-text">
                By creating a server, you agree to Discord's{" "}
                <button className="agreement-link">Community Guidelines</button>.
              </p>
            </div>
          </div>
        )}

        {/* Join Step */}
        {currentStep === "join" && (
          <div className="modal-content">
            <p className="modal-description">Enter an invite below to join an existing server</p>

            <div className="join-form">
              <label htmlFor="invite-link">Invite Link *</label>
              <input
                type="text"
                id="invite-link"
                placeholder="Please put your link here"
                className="invite-link-field"
              />

              {/* <div className="invite-examples">
                <h4>Invites Should Look Like</h4>
                <div className="example-links">
                  <span>hTKzmak</span>
                  <span>https://discord.gg/hTKzmak</span>
                  <span>https://discord.gg/wumpus-friends</span>
                </div>
              </div> */}

              <div className="discovery-section">
                <div className="discovery-icon">
                  <Globe size={20} />
                </div>
                <div className="discovery-content">
                  <span className="discovery-title">Don't have an invite?</span>
                  <span className="discovery-desc">Check out Discoverable communities in Server Discovery.</span>
                </div>
                <ChevronRight size={16} />
              </div>
            </div>

            <p className="agreement-text">
              By creating a server, you agree to the Community Guidelines.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="modal-footer">
          <button
            className="modal-create-btn"
            onClick={handleCreateServer}
            disabled={
              !serverName.trim() || serverName.trim().length < 3 || !serverIconFile || isCreating
            }
          >
            {isCreating ? "Creating..." : "Create"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateServerModal;
