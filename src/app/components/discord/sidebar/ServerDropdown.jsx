"use client";

import { ChevronDown, X, Settings } from "lucide-react";

const ServerDropdown = ({ server, state, handlers, dropdownRef }) => {
  return (
    <div className="sidebar__header" ref={dropdownRef}>
      <button
        className="server-dropdown-btn"
        onClick={handlers.toggleServerDropdown}
      >
        <h3>{server?.name || "No Server"}</h3>
        <ChevronDown
          size={16}
          className={`dropdown-arrow ${
            state.showServerDropdown ? "dropdown-arrow--open" : ""
          }`}
        />
      </button>

      {state.showServerDropdown && (
        <div className="server-dropdown">
          <div className="server-dropdown__header">
            <span>{server?.name || "No Server"}</span>
            <button
              className="close-btn"
              onClick={() =>
                handlers.updateState({ showServerDropdown: false })
              }
            >
              <X size={16} />
            </button>
          </div>

          <div className="server-dropdown__content">
            <div className="dropdown-description">
              <p>{server?.description || "No description"}</p>
            </div>
            <button
              className="dropdown-item"
              onClick={() => {
                handlers.handleServerSettings();
                handlers.updateState({ showServerDropdown: false });
              }}
            >
              <Settings size={16} />
              <span>Server Settings</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServerDropdown;
