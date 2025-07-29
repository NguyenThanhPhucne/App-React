"use client"

import { Search, Plus, Sun, Moon } from "lucide-react"
import Tooltip from "../../ui/Tooltip"

const HeaderControls = ({ state, handlers }) => {
  return (
    <div className="header__controls">
      <button className="mobile-search-btn" onClick={handlers.toggleMobileSearch}>
        <Search size={20} />
      </button>

      {/* Add Server Button */}
      <Tooltip content="Add a Server">
        <button className="add-server-btn" onClick={handlers.toggleCreateServerModal}>
          <Plus size={20} />
        </button>
      </Tooltip>

      {/* Theme Toggle */}
      <Tooltip content={state.isDarkTheme ? "Switch to Light Mode" : "Switch to Dark Mode"}>
        <button className="theme-toggle" onClick={handlers.toggleTheme}>
          {state.isDarkTheme ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </Tooltip>
    </div>
  )
}

export default HeaderControls
