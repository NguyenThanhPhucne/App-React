"use client"

const Tooltip = ({ children, content, className = "" }) => {
  return (
    <div className={`tooltip-container ${className}`}>
      {children}
      <div className="action-tooltip">{content}</div>
    </div>
  )
}

export default Tooltip
