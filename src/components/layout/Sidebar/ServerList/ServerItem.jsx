import React from 'react';
import './ServerItem.css';

const ServerItem = ({ server, isActive, isHome, icon: Icon, onClick }) => {
  return (
    <div 
      className={`server-item ${isActive ? 'active' : ''}`}
      onClick={onClick}
    >
      <div className="server-item__button" style={{ backgroundColor: server?.color }}>
        {isHome ? <Icon /> : server?.icon && <server.icon />}
      </div>
      {server?.name && (
        <div className="server-item__tooltip">
          {server.name}
        </div>
      )}
    </div>
  );
};

export default ServerItem;
