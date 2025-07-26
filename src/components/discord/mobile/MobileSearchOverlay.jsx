"use client"

import { ArrowLeft } from "lucide-react"

const MobileSearchOverlay = ({ isVisible, onClose }) => {
  if (!isVisible) return null

  return (
    <div className="mobile-search-overlay">
      <div className="mobile-search-header">
        <button className="action-btn" onClick={onClose}>
          <ArrowLeft size={20} />
        </button>
        <input className="mobile-search-input" type="text" placeholder="Search" autoFocus />
      </div>
    </div>
  )
}

export default MobileSearchOverlay
