"use client";

import { useState } from "react";
import { useSelector } from "react-redux";
import { selectCurrentServer } from "../../../../features/appSlice";
import { ChevronLeft, ChevronRight, Hash, Loader2 } from "lucide-react";

const ServerList = ({ servers, state, updateState, handlers }) => {
  const currentServer = useSelector(selectCurrentServer);
  const [loadingServerId, setLoadingServerId] = useState(null);
  
  const visibleServers =
    servers?.slice(
      state.serverScrollIndex || 0,
      (state.serverScrollIndex || 0) + 3
    ) || [];

  const handleServerClick = (_id) => {
    updateState(_id);
  };

  const API_BASE_URL = import.meta.env.VITE_BACKEND_BASE_URL;

  const renderServerIcon = (server) => {
      return (
        <>
          <img
            src={`${API_BASE_URL}${server.serverAvatar}`}
            alt={server.name}
            className="server-avatar"
            onError={(e) => {
              e.target.style.display = "none";
              const fallback = e.target.nextElementSibling;
              if (fallback) {
                fallback.style.display = "block";
              }
            }}
          />
          <span className="server-initial" style={{ display: "none" }}>
            {server.name?.charAt(0)?.toUpperCase()}
          </span>
        </>
      );
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
                currentServer?._id === server._id ? "server-btn--active" : ""
              } ${loadingServerId === server._id ? "server-btn--loading" : ""}`}
              onClick={() => handleServerClick(server._id)}
              style={{ "--server-color": server.color || "#5865f2" }}
              title={server.name}
              disabled={loadingServerId === server._id}
            >
              {renderServerIcon(server)}
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
