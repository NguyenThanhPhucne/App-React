import React from 'react';
import { X } from 'lucide-react';
import './NotificationModal.css';

const NotificationModal = ({ 
  show, 
  onClose,
  notificationSettings,
  onUpdateSettings 
}) => {
  if (!show) return null;

  return (
    <div className="modal-overlay">
      <div className="notification-modal">
        <div className="modal-header">
          <h3>Notification Settings</h3>
          <button className="close-button" onClick={onClose}>
            <X />
          </button>
        </div>

        <div className="modal-content">
          <div className="notification-options">
            <label className="notification-option">
              <input
                type="radio"
                checked={notificationSettings.useDefault}
                onChange={() => onUpdateSettings({ useDefault: true })}
              />
              Use Default
            </label>

            <label className="notification-option">
              <input
                type="radio"
                checked={notificationSettings.allMessages}
                onChange={() => onUpdateSettings({ allMessages: true })}
              />
              All Messages
            </label>

            <label className="notification-option">
              <input
                type="radio"
                checked={notificationSettings.onlyMentions}
                onChange={() => onUpdateSettings({ onlyMentions: true })}
              />
              Only @mentions
            </label>

            <label className="notification-option">
              <input
                type="radio"
                checked={notificationSettings.nothing}
                onChange={() => onUpdateSettings({ nothing: true })}
              />
              Nothing
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationModal;
