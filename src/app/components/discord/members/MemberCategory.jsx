"use client"

import MemberItem from "./MemberItem"

const MemberCategory = ({ title, memberList }) => {
  return (
    <div className="member-category">
      <div className="member-category__title">
        {title} — {memberList.length}
      </div>
      {memberList.map((member) => (
        <MemberItem key={member.id} member={member} />
      ))}
    </div>
  )
}

export default MemberCategory
