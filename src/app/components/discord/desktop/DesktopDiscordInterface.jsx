import DiscordSidebar from "../../../../app/components/discord/sidebar/DiscordSidebar";
import DiscordContent from "../../../../app/components/discord/content/DiscordContent";
import MemberList from "../../../../app/components/discord/members/MemberList";



const DesktopDiscordInterface = ({
  state,
  handlers,
  dropdownRef,
  notificationRef,
  setCreateChannel,
  setTypeOfChannel,
  members,
}) => {

  return (
    <div className="main">
      {/* Sidebar */}
      <DiscordSidebar
        state={state}
        handlers={handlers}
        dropdownRef={dropdownRef}
        setCreateChannel={setCreateChannel}
        setTypeOfChannel={setTypeOfChannel}
      />

      {/* Content */}
      <DiscordContent
        state={state}
        handlers={handlers}
        notificationRef={notificationRef}
      />

      {/* Member List */}
      <MemberList state={state} handlers={handlers} />
    </div>
  );
};

export default DesktopDiscordInterface;
