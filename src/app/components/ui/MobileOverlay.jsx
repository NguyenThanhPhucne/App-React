"use client"

import { useEffect } from 'react'

const MobileOverlay = ({ isVisible, onClick, className = '' }) => {
  // Prevent body scroll when overlay is visible
  useEffect(() => {
    if (isVisible) {
      document.body.style.overflow = 'hidden'
      document.body.style.position = 'fixed'
      document.body.style.width = '100%'
    } else {
      document.body.style.overflow = ''
      document.body.style.position = ''
      document.body.style.width = ''
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = ''
      document.body.style.position = ''
      document.body.style.width = ''
    }
  }, [isVisible])

  if (!isVisible) return null

  return (
    <div 
      className={`mobile-overlay mobile-overlay--visible ${className}`} 
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') {
          onClick(e)
        }
      }}
      aria-label="Close overlay"
    />
  )
}

export default MobileOverlay
