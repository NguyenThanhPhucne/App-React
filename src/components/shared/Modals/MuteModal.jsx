import React from 'react';
import './MuteModal.css';

const MuteModal = ({ show, onClose, muteOptions, onSelectOption }) => {
  if (!show) return null;

  return (
    <div className="modal-overlay">
      <div className="mute-modal">
        <div className="modal-header">
          <h3>Mute Channel</h3>
          <button className="close-button" onClick={onClose}>×</button>
        </div>

        <div className="modal-content">
          <div className="mute-options">
            {muteOptions.map((option, index) => (
              <button
                key={index}
                className="mute-option"
                onClick={() => onSelectOption(option)}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MuteModal;
