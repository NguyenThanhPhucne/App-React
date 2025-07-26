"use client"

import ContentHeader from "./ContentHeader"
import ContentBody from "./ContentBody"
import MessageInput from "./MessageInput"

const DiscordContent = ({ state, handlers, members, notificationRef }) => {
  return (
    <main className={`content ${state.showMemberList ? "content--with-members" : "content--without-members"}`}>
      <ContentHeader state={state} handlers={handlers} members={members} notificationRef={notificationRef} />

      <ContentBody activeChannel={state.activeChannel} />

      <MessageInput activeChannel={state.activeChannel} />
    </main>
  )
}

export default DiscordContent
