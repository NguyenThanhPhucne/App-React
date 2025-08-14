import React from 'react';
import { Sun, Moon } from 'lucide-react';
import useTheme from '../../../hooks/useTheme';
import Tooltip from './Tooltip';

const ThemeToggle = ({ className = "", size = 20, showTooltip = true }) => {
  const { isDarkMode, toggleTheme } = useTheme();

  const button = (
    <button 
      className={`theme-toggle ${className}`}
      onClick={toggleTheme}
      aria-label={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
    >
      {isDarkMode ? <Sun size={size} /> : <Moon size={size} />}
    </button>
  );

  if (showTooltip) {
    return (
      <Tooltip content={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}>
        {button}
      </Tooltip>
    );
  }

  return button;
};

export default ThemeToggle;
