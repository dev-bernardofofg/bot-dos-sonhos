"use client";

import { Bot } from "lucide-react";

export const LoadingIndicator = () => {
  return (
    <div className="flex gap-3 max-w-[85%] mr-auto">
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-muted text-muted-foreground flex items-center justify-center">
        <Bot className="w-4 h-4" />
      </div>
      <div className="bg-muted text-muted-foreground rounded-2xl rounded-bl-md px-4 py-3">
        <div className="flex items-center gap-1">
          <div className="flex gap-1">
            <div className="size-2 bg-current rounded-full animate-bounce [animation-delay:-0.3s]" />
            <div className="size-2 bg-current rounded-full animate-bounce [animation-delay:-0.15s]" />
            <div className="size-2 bg-current rounded-full animate-bounce" />
          </div>
          <span className="text-xs ml-2 opacity-70">Digitando...</span>
        </div>
      </div>
    </div>
  );
};
