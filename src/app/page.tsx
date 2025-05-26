"use client";

import { ChatInput } from "./(components)/chat-input";
import { ChatMessages } from "./(components)/chat-messages";
import { ChatSidebar } from "./(components)/chat-sidebar";

export default function ChatPage() {
  return (
    <div className="flex h-screen bg-background base:flex-col md:flex-row">
      <ChatSidebar />
      <div className="flex-1 flex flex-col">
        <ChatMessages />
        <ChatInput />
      </div>
    </div>
  );
}
