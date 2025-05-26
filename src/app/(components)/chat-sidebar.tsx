// src/components/chat/ChatSidebar.tsx
"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { MessageSquare, Plus, Trash2 } from "lucide-react";
import { useChat } from "../(contexts)/chat-context";

export const ChatSidebar = () => {
  const {
    conversations,
    currentConversation,
    createConversation,
    deleteConversation,
    selectConversation,
  } = useChat();

  const formatLastActivity = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return "Agora";
    if (minutes < 60) return `${minutes}m`;
    if (hours < 24) return `${hours}h`;
    return `${days}d`;
  };

  return (
    <div className="w-80 border-r border-border bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="p-4 border-b border-border">
        <Button
          onClick={createConversation}
          className="w-full flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Nova Conversa
        </Button>
      </div>
      <div className="flex-1 overflow-y-auto p-2">
        {conversations.map((conversation) => (
          <div
            key={conversation.id}
            className={cn(
              "group relative p-3 rounded-lg cursor-pointer mb-1",
              currentConversation?.id === conversation.id
                ? "bg-muted text-foreground"
                : "hover:bg-muted/50 text-muted-foreground"
            )}
            onClick={() => selectConversation(conversation.id)}
          >
            <div className="flex items-start gap-2">
              <MessageSquare className="w-4 h-4 mt-0.5" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">
                  {conversation.title}
                </p>
                <p className="text-xs opacity-70">
                  {formatLastActivity(conversation.lastActivity)}
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 p-0"
                onClick={(e) => {
                  e.stopPropagation();
                  deleteConversation(conversation.id);
                }}
              >
                <Trash2 className="w-3 h-3" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
