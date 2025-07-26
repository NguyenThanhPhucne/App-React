"use client"

import "./MobileOverlay.css"

const MobileOverlay = ({ show, onClose }) => {
  if (!show) return null

  return <div className={`mobile-overlay ${show ? "mobile-overlay--visible" : ""}`} onClick={onClose} />
}

export default MobileOverlay
