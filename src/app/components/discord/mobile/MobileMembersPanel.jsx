"use client"

import { ArrowLeft, Hash, Search, Bell, UserPlus, ChevronRight, X } from "lucide-react"
import MemberCategory from "../members/MemberCategory"

const MobileMembersPanel = ({ state, handlers, members }) => {
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
    <div className={`mobile-members-panel ${state.showMobileMembersPanel ? "mobile-members-panel--open" : ""}`}>
      <div className="mobile-members-panel__header">
        <button className="mobile-back-btn" onClick={() => handlers.updateState({ showMobileMembersPanel: false })}>
          <ArrowLeft size={20} />
        </button>
        <div className="mobile-channel-info">
          <Hash size={20} />
          <div className="mobile-channel-details">
            <div className="mobile-channel-name">{state.activeChannel}</div>
            <div className="mobile-channel-type">Text Channel</div>
          </div>
        </div>
        <div className="mobile-header-actions">
          <button
            className="mobile-action-btn"
            onClick={() => handlers.updateState({ showMobileSearch: !state.showMobileSearch })}
          >
            <Search size={20} />
          </button>
          <button 
            className="mobile-action-btn" 
            data-bell="true"
            data-has-notification={state.hasNotifications ? "true" : "false"}
            onClick={handlers.toggleNotificationDropdown}
            aria-label="Notification Settings"
          >
            <Bell size={20} />
          </button>
        </div>
      </div>

      <div className="mobile-members-panel__content">
        {/* Search Input */}
        {state.showMobileSearchInput && (
          <div className="mobile-search-container">
            <div className="mobile-search-input-wrapper">
              <Search size={16} />
              <input
                type="text"
                placeholder="Search members by name"
                value={state.memberSearchQuery}
                onChange={(e) => handlers.handleMemberSearch(e.target.value)}
                className="mobile-search-input-field"
                autoFocus
              />
              {state.memberSearchQuery && (
                <button className="mobile-search-clear" onClick={() => handlers.handleMemberSearch("")}>
                  <X size={16} />
                </button>
              )}
            </div>
          </div>
        )}

        <div className="mobile-invite-section">
          <button className="mobile-invite-btn">
            <div className="mobile-invite-icon">
              <UserPlus size={20} />
            </div>
            <span>Invite Members</span>
            <ChevronRight size={16} />
          </button>
        </div>

        {/* Show search results or all members */}
        {state.memberSearchQuery ? (
          <>
            {filteredMembers.online.length > 0 && <MemberCategory title="Online" memberList={filteredMembers.online} />}
            {filteredMembers.offline.length > 0 && (
              <MemberCategory title="Offline" memberList={filteredMembers.offline} />
            )}
            {filteredMembers.online.length === 0 && filteredMembers.offline.length === 0 && (
              <div className="no-search-results">
                <div className="no-results-icon">
                  <Search size={48} />
                </div>
                <div className="no-results-text">No members found</div>
                <div className="no-results-subtext">Try searching for something else</div>
              </div>
            )}
          </>
        ) : (
          <>
            <MemberCategory title="Online" memberList={members.online} />
            {members.offline.length > 0 && <MemberCategory title="Offline" memberList={members.offline} />}
          </>
        )}
      </div>
    </div>
  )
}

export default MobileMembersPanel
