"use client"

import { Search, Crown } from "lucide-react"
import "./MemberList.css"

const MemberList = ({ show, members, searchQuery, onSearch }) => {
  const filteredMembers = {
    online: members.online.filter((member) => member.name.toLowerCase().includes((searchQuery || "").toLowerCase())),
    offline: members.offline.filter((member) => member.name.toLowerCase().includes((searchQuery || "").toLowerCase())),
  }

  const renderMemberCategory = (title, memberList) => (
    <div className="member-category" key={title}>
      <div className="member-category__title">
        {title} — {memberList.length}
      </div>
      {memberList.map((member) => (
        <div key={member.id} className="member-item">
          <div className="member-avatar">
            <div className="member-avatar-circle" style={{ backgroundColor: member.color }}>
              {member.initials}
            </div>
            <div className={`member-status member-status--${member.status}`} />
          </div>
          <div className="member-info">
            <div className="member-name">
              {member.name}
              {member.isOwner && <Crown size={14} className="owner-crown" />}
            </div>
          </div>
        </div>
      ))}
    </div>
  )

  return (
    <aside className={`member-list ${show ? "member-list--visible" : "member-list--hidden"}`}>
      <div className="member-list__header">
        <div className="member-list__title">Members — {members.online.length + members.offline.length}</div>
        <div className="member-search">
          <Search size={16} />
          <input
            type="text"
            placeholder="Search"
            value={searchQuery || ""}
            onChange={(e) => onSearch && onSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="member-list__content">
        {searchQuery ? (
          <>
            {filteredMembers.online.length > 0 && renderMemberCategory("ONLINE", filteredMembers.online)}
            {filteredMembers.offline.length > 0 && renderMemberCategory("OFFLINE", filteredMembers.offline)}
          </>
        ) : (
          <>
            {renderMemberCategory("ONLINE", members.online)}
            {members.offline.length > 0 && renderMemberCategory("OFFLINE", members.offline)}
          </>
        )}
      </div>
    </aside>
  )
}

export default MemberList
