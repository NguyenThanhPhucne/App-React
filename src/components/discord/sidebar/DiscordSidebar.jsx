"use client"

import ServerDropdown from "./ServerDropdown"
import ChannelCategory from "./ChannelCategory"
import MobileBottomNav from "./MobileBottomNav"

const DiscordSidebar = ({ servers, channels, state, updateState, handlers, dropdownRef }) => {
  return (
    <aside className={`sidebar ${state.showMobileSidebar ? "sidebar--open" : ""}`}>
      <ServerDropdown servers={servers} state={state} handlers={handlers} dropdownRef={dropdownRef} />

      <div className="sidebar__content">
        <ChannelCategory
          type="text"
          title="Kênh Chat"
          channels={channels}
          state={state}
          updateState={updateState}
          handlers={handlers}
        />
        <ChannelCategory
          type="voice"
          title="Kênh Thoại"
          channels={channels}
          state={state}
          updateState={updateState}
          handlers={handlers}
        />
      </div>

      <MobileBottomNav />
    </aside>
  )
}

export default DiscordSidebar
