import React from 'react';
import { 
  Menu, Home, ChevronLeft, ChevronRight, 
  Plus, Sun, Moon, MicOff, Mic,
  Headphones, Settings, LogOut
} from 'lucide-react';
import './Header.css';

const Header = ({
  state,
  user,
  servers,
  handlers,
  handleLogout
}) => {
  const visibleServers = servers.slice(state.serverScrollIndex, state.serverScrollIndex + 3);

  return (
    <header className="header">
      <div className="header__home">
        <button className="mobile-menu-btn" onClick={handlers.toggleMobileSidebar}>
          <Menu size={20} />
        </button>
        <button className="home-btn">
          <Home size={20} />
        </button>
      </div>

      <div className="header__servers">
        {state.serverScrollIndex > 0 && (
          <button className="scroll-btn" onClick={() => handlers.scrollServers("left")}>
            <ChevronLeft size={16} />
          </button>
        )}

        <div className="server-list">
          {visibleServers.map((server, index) => {
            const actualIndex = state.serverScrollIndex + index;
            return (
              <button
                key={server.id}
                className={`server-btn ${state.currentServer === actualIndex ? "server-btn--active" : ""}`}
                onClick={() => handlers.updateState({ currentServer: actualIndex })}
                style={{ "--server-color": server.color }}
                title={server.name}
              >
                {React.createElement(server.icon, { size: 20 })}
              </button>
            );
          })}
        </div>

        {state.serverScrollIndex < servers.length - 3 && (
          <button className="scroll-btn" onClick={() => handlers.scrollServers("right")}>
            <ChevronRight size={16} />
          </button>
        )}
      </div>

      <div className="header__controls">
        <div className="tooltip-container">
          <button className="add-server-btn">
            <Plus size={20} />
          </button>
          <div className="action-tooltip">Add a Server</div>
        </div>

        <div className="tooltip-container">
          <button className="theme-toggle" onClick={handlers.toggleTheme}>
            {state.isDarkTheme ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <div className="action-tooltip">
            {state.isDarkTheme ? "Switch to Light Mode" : "Switch to Dark Mode"}
          </div>
        </div>

        <div className="user-panel">
          <div className="user-info">
            <div className="user-avatar">
              <span>U</span>
              <div className="status-dot" />
            </div>
            <div className="user-details">
              <span className="username">{user.username}</span>
              <span className="status">Online</span>
            </div>
          </div>
          
          <div className="user-actions">
            <div className="tooltip-container">
              <button
                className={`action-btn ${state.isMuted ? "action-btn--muted" : ""}`}
                onClick={handlers.toggleMute}
              >
                {state.isMuted ? <MicOff size={16} /> : <Mic size={16} />}
              </button>
              <div className="action-tooltip">{state.isMuted ? "Unmute" : "Mute"}</div>
            </div>

            <div className="tooltip-container">
              <button
                className={`action-btn ${state.isDeafened ? "action-btn--deafened" : ""}`}
                onClick={handlers.toggleDeafen}
              >
                <Headphones size={16} />
                {state.isDeafened && <div className="deafen-indicator" />}
              </button>
              <div className="action-tooltip">
                {state.isDeafened ? "Undeafen" : "Deafen"}
              </div>
            </div>

            <div className="tooltip-container">
              <button className="action-btn">
                <Settings size={16} />
              </button>
              <div className="action-tooltip">User Settings</div>
            </div>

            <div className="tooltip-container">
              <button className="action-btn logout-btn" onClick={handleLogout}>
                <LogOut size={16} />
              </button>
              <div className="action-tooltip">Logout</div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
