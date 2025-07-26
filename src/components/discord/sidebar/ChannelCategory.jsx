"use client"

import { ChevronDown, ChevronRight, Plus, Hash, Volume2 } from "lucide-react"

const ChannelCategory = ({ type, title, channels, state, updateState, handlers }) => {
  return (
    <div className="category" key={type}>
      <button className="category__header" onClick={() => handlers.toggleCategory(type)}>
        {state.collapsedCategories[type] ? <ChevronRight size={12} /> : <ChevronDown size={12} />}
        <span>{title}</span>
        <Plus size={16} className="category__add" />
      </button>

      <div className={`category__content ${state.collapsedCategories[type] ? "category__content--collapsed" : ""}`}>
        {channels[type].map((channel) => (
          <button
            key={channel.id}
            className={`channel ${state.activeChannel === channel.id ? "channel--active" : ""}`}
            onClick={() => updateState({ activeChannel: channel.id })}
          >
            {type === "text" ? <Hash size={16} /> : <Volume2 size={16} />}
            <span>{channel.name}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

export default ChannelCategory
