import React from 'react';
import { Paperclip, Smile } from 'lucide-react';
import './ChatInput.css';

const ChatInput = ({ onSendMessage }) => {
  return (
    <div className="chat-input">
      <button className="chat-input__button">
        <Paperclip />
      </button>
      <input
        type="text"
        placeholder="Message #chung"
        className="chat-input__text"
      />
      <button className="chat-input__button">
        <Smile />
      </button>
    </div>
  );
};

export default ChatInput;
