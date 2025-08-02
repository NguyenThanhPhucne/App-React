"use client"

import { Home, Bell, User } from "lucide-react"

const MobileBottomNav = () => {
  return (
    <div className="mobile-bottom-nav">
      <button className="bottom-nav-item bottom-nav-item--active">
        <Home size={20} />
        <span>Home</span>
      </button>
      <button className="bottom-nav-item">
        <Bell size={20} />
        <span>Notifications</span>
      </button>
      <button className="bottom-nav-item">
        <User size={20} />
        <span>You</span>
      </button>
    </div>
  )
}

export default MobileBottomNav
