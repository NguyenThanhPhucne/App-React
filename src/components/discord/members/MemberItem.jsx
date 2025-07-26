"use client"

import { Crown } from "lucide-react"

const MemberItem = ({ member }) => {
  return (
    <div className="member-item">
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
  )
}

export default MemberItem
