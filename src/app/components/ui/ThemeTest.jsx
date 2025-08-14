import React from 'react';
import useTheme from '../../../hooks/useTheme';
import './ThemeTest.css';

const ThemeTest = () => {
  const { isDarkMode, toggleTheme, isTransitioning } = useTheme();

  return (
    <div className={`theme-test ${isTransitioning ? 'transitioning' : ''}`}>
      <div className="test-card">
        <h2>Theme Test Component</h2>
        <p>Current theme: <strong>{isDarkMode ? 'Dark' : 'Light'}</strong></p>
        <p>Transitioning: <strong>{isTransitioning ? 'Yes' : 'No'}</strong></p>
        
        <button 
          className="theme-test-btn" 
          onClick={toggleTheme}
          disabled={isTransitioning}
        >
          Switch to {isDarkMode ? 'Light' : 'Dark'} Mode
        </button>
        
        <div className="test-elements">
          <div className="test-element primary">Primary Background</div>
          <div className="test-element secondary">Secondary Background</div>
          <div className="test-element tertiary">Tertiary Background</div>
          
          <div className="test-text-elements">
            <div className="text-primary">Primary Text</div>
            <div className="text-secondary">Secondary Text</div>
            <div className="text-muted">Muted Text</div>
          </div>
          
          <div className="test-inputs">
            <input type="text" placeholder="Test input field" />
            <button className="test-accent-btn">Accent Button</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThemeTest;
