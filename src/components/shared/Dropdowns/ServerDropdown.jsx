import React from 'react';
import './ServerDropdown.css';

const ServerDropdown = ({ 
  show, 
  items, 
  onSelect, 
  onClose 
}) => {
  if (!show) return null;

  return (
    <div className="dropdown-overlay" onClick={onClose}>
      <div className="server-dropdown" onClick={e => e.stopPropagation()}>
        {items.map((item) => (
          <button
            key={item.id}
            className={`dropdown-item ${item.color}`}
            onClick={() => onSelect(item.id)}
          >
            <item.icon className="dropdown-item__icon" />
            <span>{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ServerDropdown;
