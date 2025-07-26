"use client"

import { Home, Menu } from "lucide-react"
import ServerList from "./ServerList"
import HeaderControls from "./HeaderControls"
import UserPanel from "./UserPanel"

const DiscordHeader = ({ servers, state, updateState, handlers }) => {
  return (
    <header className="header">
      <div className="header__home">
        <button className="mobile-menu-btn" onClick={handlers.toggleMobileSidebar}>
          <Menu size={20} />
        </button>
        <button className="home-btn">
          <Home size={20} />
        </button>
      </div>

      <ServerList servers={servers} state={state} updateState={updateState} handlers={handlers} />

      <HeaderControls state={state} handlers={handlers} />

      <UserPanel state={state} handlers={handlers} />
    </header>
  )
}

export default DiscordHeader
