"use client"
import { ChevronDown } from "lucide-react"
import ChannelList from "./ChannelList/ChannelList"
import ServerDropdown from "../../shared/Dropdowns/ServerDropdown"
import "./Sidebar.css"

const Sidebar = ({ state, servers, channels, serverMenuItems, handlers, onServerMenuClick }) => {
  return (
    <aside className={`sidebar ${state.showMobileSidebar ? "sidebar--open" : ""}`}>
      <div className="sidebar__header">
        <button className="server-dropdown-btn" onClick={handlers.toggleServerDropdown}>
          <h3>{servers[state.currentServer].name}</h3>
          <ChevronDown
            size={16}
            className={`dropdown-arrow ${state.showServerDropdown ? "dropdown-arrow--open" : ""}`}
          />
        </button>

        <ServerDropdown
          show={state.showServerDropdown}
          items={serverMenuItems}
          onSelect={onServerMenuClick}
          onClose={() => handlers.updateState({ showServerDropdown: false })}
        />
      </div>

      <div className="sidebar__content">
        <ChannelList
          channels={channels}
          activeChannel={state.activeChannel}
          collapsedCategories={state.collapsedCategories}
          onChannelSelect={handlers.setActiveChannel}
          onToggleCategory={handlers.toggleCategory}
        />
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="mobile-bottom-nav">
        <button className="bottom-nav-item bottom-nav-item--active">
          <span>Home</span>
        </button>
        <button className="bottom-nav-item">
          <span>Notifications</span>
        </button>
        <button className="bottom-nav-item">
          <span>You</span>
        </button>
      </div>
    </aside>
  )
}

export default Sidebar
