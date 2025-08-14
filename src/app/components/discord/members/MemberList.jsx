"use client";

import { useMemo } from "react";
import MemberItem from "./MemberItem";
import MemberSearch from "./MemberSearch";
import { useSelector } from "react-redux";
import { selectCurrentServer } from "../../../../features/appSlice";

const MemberList = ({ state, handlers }) => {
  const server = useSelector(selectCurrentServer);
  const members = server?.members || [];

  // Filter members based on search query
  const filteredMembers = useMemo(() => {
    const query = state.memberSearchQuery?.toLowerCase().trim() || "";

    if (!query) {
      return members;
    }

    return members.filter((member) => {
      const user = member.userId;
      const visibleName = user.displayName || user.name || user.username;
      return visibleName && visibleName.toLowerCase().includes(query);
    });
  }, [members, state.memberSearchQuery]);

  return (
    <aside
      className={`member-list ${
        state.showMemberList ? "member-list--visible" : "member-list--hidden"
      }`}
    >
      <div className="member-list__header">
        <div className="member-list__title">
          Members — {filteredMembers.length}
          {state.memberSearchQuery && ` of ${members.length}`}
        </div>
        <MemberSearch
          searchQuery={state.memberSearchQuery || ""}
          onSearchChange={handlers.handleMemberSearch}
        />
      </div>

      <div className="member-list__content">
        {filteredMembers.length > 0 ? (
          filteredMembers.map((member) => (
            <MemberItem
              key={member.id || member._id}
              member={member.userId}
            />
          ))
        ) : state.memberSearchQuery ? (
          <div className="member-list__no-results">
            <p>No members found matching "{state.memberSearchQuery}"</p>
            <small>Try searching by name, username, or display name</small>
          </div>
        ) : (
          <div className="member-list__no-results">
            <p>No members in this server</p>
          </div>
        )}
      </div>
    </aside>
  );
};

export default MemberList;
