"use client";

import { Crown } from "lucide-react";
import { useEffect, useState } from "react";

const MemberItem = ({ member }) => {
  const [avatar, setAvatar] = useState(null);

  useEffect(() => {
    if (member) {
      setAvatar(`${member.avatar}`);
    }
  }, [member]);

  // Generate initials from name or username
  const getInitials = (name, username) => {
    const displayName = name || username || "U";
    return displayName
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // Generate a color based on member ID or name
  const getAvatarColor = (member) => {
    if (member.color) return member.color;

    const colors = [
      "#7289da",
      "#99aab5",
      "#2c2f33",
      "#23272a",
      "#f04747",
      "#faa61a",
      "#43b581",
      "#593695",
    ];

    const hash = (member.id || member.name || "").split("").reduce((a, b) => {
      a = (a << 5) - a + b.charCodeAt(0);
      return a & a;
    }, 0);

    return colors[Math.abs(hash) % colors.length];
  };

  const initials = member?.initials || getInitials(member.name, member.username);
  const avatarColor = getAvatarColor(member);

  return (
    <div className="member-item">
      <div className="member-avatar">
        {member.avatar ? (
          <img
            src={avatar}
            alt={member.name || member.username}
            className="member-avatar-circle"
            style={{
              width: "32px",
              height: "32px",
              borderRadius: "50%",
              objectFit: "cover",
            }}
          />
        ) : (
          <div
            className="member-avatar-circle"
            style={{ backgroundColor: avatarColor }}
          >
            {initials}
          </div>
        )}
      </div>
      <div className="member-info">
        <div className="member-name">
          {member.displayName || member.name || member.username}
          {member.isOwner && <Crown size={14} className="owner-crown" />}
        </div>
      </div>
    </div>
  );
};

export default MemberItem;
