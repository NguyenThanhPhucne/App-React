"use client";

import { Search } from "lucide-react";

const MemberSearch = ({ searchQuery, onSearchChange }) => {
  return (
    <div className="member-search">
      <Search size={16} />
      <input
        type="text"
        placeholder="Search members by name"
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
      />
    </div>
  );
};

export default MemberSearch;
