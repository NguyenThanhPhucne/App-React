"use client"

import { ChevronLeft, ChevronRight } from "lucide-react"

const ServerList = ({ servers, state, updateState, handlers }) => {
  const visibleServers = servers.slice(state.serverScrollIndex, state.serverScrollIndex + 3)

  return (
    <div className="header__servers">
      {state.serverScrollIndex > 0 && (
        <button className="scroll-btn" onClick={() => handlers.scrollServers("left", servers)}>
          <ChevronLeft size={16} />
        </button>
      )}

      <div className="server-list">
        {visibleServers.map((server, index) => {
          const actualIndex = state.serverScrollIndex + index
          return (
            <button
              key={server.id}
              className={`server-btn ${state.currentServer === actualIndex ? "server-btn--active" : ""}`}
              onClick={() => updateState({ currentServer: actualIndex })}
              style={{ "--server-color": server.color }}
              title={server.name}
            >
              <server.icon size={20} />
            </button>
          )
        })}
      </div>

      {state.serverScrollIndex < servers.length - 3 && (
        <button className="scroll-btn" onClick={() => handlers.scrollServers("right", servers)}>
          <ChevronRight size={16} />
        </button>
      )}
    </div>
  )
}

export default ServerList
