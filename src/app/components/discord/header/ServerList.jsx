"use client";

import { ChevronLeft, ChevronRight, Hash } from "lucide-react";

const ServerList = ({ servers, state, updateState, handlers }) => {
  const visibleServers =
    servers?.slice(
      state.serverScrollIndex || 0,
      (state.serverScrollIndex || 0) + 3
    ) || [];

  const handleServerClick = (_id) => {
    updateState(_id);
  };

  return (
    <div className="header__servers">
      {(state.serverScrollIndex || 0) > 0 && (
        <button
          className="scroll-btn"
          onClick={() => handlers.scrollServers("left", servers)}
        >
          <ChevronLeft size={16} />
        </button>
      )}

      <div className="server-list">
        {visibleServers.map((server) => {
          return (
            <button
              key={server._id}
              className={`server-btn ${
                state.currentServer === server._id ? "server-btn--active" : ""
              }`}
              onClick={() => handleServerClick(server._id)}
              style={{ "--server-color": server.color || "#5865f2" }}
              title={server.name}
            >
              {/* Use a default icon since server.icon doesn't exist in your data */}
              {/*<Hash size={20} />*/}
              {/* Or display first letter of server name */}
              <span>{server.name?.charAt(0)?.toUpperCase()}</span>
            </button>
          );
        })}
      </div>

      {state.serverScrollIndex < servers.length - 3 && (
        <button
          className="scroll-btn"
          onClick={() => handlers.scrollServers("right", servers)}
        >
          <ChevronRight size={16} />
        </button>
      )}
    </div>
  );
};

export default ServerList;
