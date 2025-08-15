import React from "react";

const LoadingSpinner = ({ size = 20, className = "", simple = false }) => {
  if (simple) {
    return (
      <div 
        className={`simple-spinner ${className}`}
        style={{ width: size, height: size }}
      >
        <div className="simple-spinner-circle"></div>
      </div>
    );
  }

  return (
    <div 
      className={`loading-spinner ${className}`}
      style={{ width: size, height: size }}
    >
      <div className="spinner-ring"></div>
      <div className="spinner-ring"></div>
      <div className="spinner-ring"></div>
    </div>
  );
};

export default LoadingSpinner;
