"use client"

import { ArrowLeft } from "lucide-react"
import "./MobileSearchOverlay.css"

const MobileSearchOverlay = ({ show, onClose, onSearch }) => {
  if (!show) return null

  return (
    <div className="mobile-search-overlay">
      <div className="mobile-search-header">
        <button className="action-btn" onClick={onClose}>
          <ArrowLeft size={20} />
        </button>
        <input
          className="mobile-search-input"
          type="text"
          placeholder="Search"
          autoFocus
          onChange={(e) => onSearch(e.target.value)}
        />
      </div>
    </div>
  )
}

export default MobileSearchOverlay
