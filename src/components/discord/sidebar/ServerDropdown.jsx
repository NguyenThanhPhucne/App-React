"use client"

import { ChevronDown, X } from "lucide-react"
import { serverMenuItems } from "../../../data/discordData"

const ServerDropdown = ({ servers, state, handlers, dropdownRef }) => {
  return (
    <div className="sidebar__header" ref={dropdownRef}>
      <button className="server-dropdown-btn" onClick={handlers.toggleServerDropdown}>
        <h3>{servers[state.currentServer].name}</h3>
        <ChevronDown size={16} className={`dropdown-arrow ${state.showServerDropdown ? "dropdown-arrow--open" : ""}`} />
      </button>

      {state.showServerDropdown && (
        <div className="server-dropdown">
          <div className="server-dropdown__header">
            <span>{servers[state.currentServer].name}</span>
            <button className="close-btn" onClick={() => handlers.updateState({ showServerDropdown: false })}>
              <X size={16} />
            </button>
          </div>

          <div className="server-dropdown__content">
            {serverMenuItems.map((item) => {
              const ItemIcon = item.icon
              return (
                <button
                  key={item.id}
                  className={`dropdown-item ${item.color === "danger" ? "dropdown-item--danger" : ""} ${item.id === "leave" ? "dropdown-item--leave" : ""}`}
                  onClick={() => handlers.handleServerMenuClick(item.id)}
                >
                  <ItemIcon size={16} />
                  <span>{item.label}</span>
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

export default ServerDropdown
