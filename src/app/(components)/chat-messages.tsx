"use client";

import { useEffect, useRef } from "react";
import { useChat } from "../(contexts)/chat-context";
import { ChatMessageBubble } from "./chat-message-bubble";
import { LoadingIndicator } from "./loading-indicator";

export const ChatMessages = () => {
  const { currentConversation, isLoading } = useChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [currentConversation?.messages.length]);

  return (
    <div className="flex-1 overflow-y-auto px-4">
      <div className="max-w-4xl mx-auto py-6 space-y-6">
        {currentConversation?.messages.map((msg) => (
          <ChatMessageBubble key={msg.id} message={msg} />
        ))}

        {isLoading && <LoadingIndicator />}

        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};
