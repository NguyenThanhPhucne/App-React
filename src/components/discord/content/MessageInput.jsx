"use client"

import { Paperclip, Smile, Mic } from "lucide-react"

const MessageInput = ({ activeChannel }) => {
  return (
    <div className="content__footer">
      <div className="message-input">
        <Paperclip size={20} />
        <input type="text" placeholder={`Message #${activeChannel}`} />
        <Smile size={20} />
        <Mic size={20} />
      </div>
    </div>
  )
}

export default MessageInput
