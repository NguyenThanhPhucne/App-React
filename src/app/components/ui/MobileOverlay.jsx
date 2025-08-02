"use client"

const MobileOverlay = ({ isVisible, onClick }) => {
  return <div className={`mobile-overlay ${isVisible ? "mobile-overlay--visible" : ""}`} onClick={onClick} />
}

export default MobileOverlay
