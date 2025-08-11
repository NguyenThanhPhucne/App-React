"use client";

import { useSelector } from "react-redux";
import { selectCurrentServer } from "../../../../features/appSlice";

// Components
import ServerDropdown from "./ServerDropdown";
import ChannelCategory from "./ChannelCategory";
import MobileBottomNav from "./MobileBottomNav";

const DiscordSidebar = ({ state, handlers, dropdownRef }) => {
  const server = useSelector(selectCurrentServer);
  const channels = server?.channels || [];

  const textChannels =
    channels?.filter((channel) => channel.type === "text") || [];
  const voiceChannels =
    channels?.filter((channel) => channel.type === "voice") || [];

  return (
    <aside
      className={`sidebar ${state.showMobileSidebar ? "sidebar--open" : ""}`}
    >
      <ServerDropdown
        server={server}
        state={state}
        handlers={handlers}
        dropdownRef={dropdownRef}
      />

      <div className="sidebar__content">
        <ChannelCategory
          type="text"
          title="Text Channels"
          channels={textChannels}
          state={state}
          handlers={handlers}
        />
        {/*<ChannelCategory
          type="voice"
          title="Kênh Thoại"
          channels={voiceChannels}
          state={state}
          handlers={handlers}
        />*/}
      </div>

      <MobileBottomNav />
    </aside>
  );
};

export default DiscordSidebar;
