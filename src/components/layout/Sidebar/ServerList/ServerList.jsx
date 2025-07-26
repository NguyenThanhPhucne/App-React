import React from 'react';
import ServerItem from './ServerItem';
import { Home } from 'lucide-react';
import './ServerList.css';

const ServerList = ({ 
  servers, 
  currentServer, 
  serverScrollIndex,
  onServerSelect,
  onScrollServers 
}) => {
  return (
    <div className="server-list">
      <ServerItem
        isHome={true}
        icon={Home}
        isActive={currentServer === 0}
        onClick={() => onServerSelect(0)}
      />
      <div className="server-list__divider" />
      
      {servers.slice(serverScrollIndex, serverScrollIndex + 3).map((server) => (
        <ServerItem
          key={server.id}
          server={server}
          isActive={currentServer === server.id}
          onClick={() => onServerSelect(server.id)}
        />
      ))}
      
      {servers.length > 3 && (
        <div className="server-list__navigation">
          <button
            className="server-list__nav-button"
            onClick={() => onScrollServers('left')}
            disabled={serverScrollIndex === 0}
          >
            &lt;
          </button>
          <button
            className="server-list__nav-button"
            onClick={() => onScrollServers('right')}
            disabled={serverScrollIndex >= servers.length - 3}
          >
            &gt;
          </button>
        </div>
      )}
    </div>
  );
};

export default ServerList;
