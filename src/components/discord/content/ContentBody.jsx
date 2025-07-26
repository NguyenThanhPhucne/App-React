"use client"

import { Hash } from "lucide-react"

const ContentBody = ({ activeChannel }) => {
  return (
    <div className="content__body">
      <div className="welcome">
        <div className="welcome__icon">
          <Hash size={48} />
        </div>
        <h2>Welcome to #{activeChannel}!</h2>
        <p>This is the start of the #{activeChannel} channel.</p>
      </div>
    </div>
  )
}

export default ContentBody
