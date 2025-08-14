import { useState } from "react";
import { useDispatch } from "react-redux";
import { X, Users } from "lucide-react";
import apiService from "../../../services/apiServices";
import { addServer, setCurrentServer } from "../../../../features/appSlice";
import "./InviteServerPopup.css"

const InviteServerPopup = ({ isOpen, onClose }) => {
  const [inviteCode, setInviteCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inviteCode.trim()) {
      setError("Please enter an invite code");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await apiService.joinServerByInvite(inviteCode.trim());
      
      // Add the server to the store
      dispatch(addServer(response.server));
      
      // Optionally set it as the current server
      dispatch(setCurrentServer(response.server));
      
      // Close the popup and reset form
      onClose();
      setInviteCode("");
      setError("");
    } catch (error) {
      setError(error.message || "Failed to join server");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setInviteCode("");
    setError("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="invite-popup-overlay" onClick={handleClose}>
      <div className="invite-popup" onClick={(e) => e.stopPropagation()}>
        <div className="invite-popup__header">
          <div className="invite-popup__title">
            <Users size={20} />
            <span>Join a Server</span>
          </div>
          <button className="invite-popup__close" onClick={handleClose}>
            <X size={20} />
          </button>
        </div>

        <div className="invite-popup__content">
          <p className="invite-popup__description">
            Enter an invite code to join an existing server
          </p>

          <form onSubmit={handleSubmit} className="invite-popup__form">
            <div className="invite-popup__input-group">
              <label htmlFor="inviteCode" className="invite-popup__label">
                Invite Code
              </label>
              <input
                type="text"
                id="inviteCode"
                value={inviteCode}
                onChange={(e) => setInviteCode(e.target.value)}
                placeholder="Enter invite code"
                className="invite-popup__input"
                disabled={isLoading}
              />
            </div>

            {error && <div className="invite-popup__error">{error}</div>}

            <div className="invite-popup__actions">
              <button
                type="button"
                onClick={handleClose}
                className="invite-popup__button invite-popup__button--cancel"
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="invite-popup__button invite-popup__button--join"
                disabled={isLoading || !inviteCode.trim()}
              >
                {isLoading ? "Joining..." : "Join Server"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default InviteServerPopup;