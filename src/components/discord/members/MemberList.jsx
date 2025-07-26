"use client"

import MemberCategory from "./MemberCategory"
import MemberSearch from "./MemberSearch"

const MemberList = ({ state, handlers, members }) => {
  // Filter members based on search query
  const filteredMembers = {
    online: members.online.filter((member) =>
      member.name.toLowerCase().includes(state.memberSearchQuery.toLowerCase()),
    ),
    offline: members.offline.filter((member) =>
      member.name.toLowerCase().includes(state.memberSearchQuery.toLowerCase()),
    ),
  }

  return (
    <aside className={`member-list ${state.showMemberList ? "member-list--visible" : "member-list--hidden"}`}>
      <div className="member-list__header">
        <div className="member-list__title">Members — {members.online.length + members.offline.length}</div>
        <MemberSearch searchQuery={state.memberSearchQuery} onSearchChange={handlers.handleMemberSearch} />
      </div>

      <div className="member-list__content">
        <MemberCategory title="ONLINE" memberList={filteredMembers.online} />
        {filteredMembers.offline.length > 0 && <MemberCategory title="OFFLINE" memberList={filteredMembers.offline} />}
      </div>
    </aside>
  )
}

export default MemberList
