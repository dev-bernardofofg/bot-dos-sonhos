"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";
import { useRef, useState } from "react";
import { useChat } from "../(contexts)/chat-context";

export const ChatInput = () => {
  const { sendMessage, isLoading } = useChat();
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSend = () => {
    if (!inputValue.trim()) return;
    sendMessage(inputValue);
    setInputValue("");
  };

  return (
    <div className="border-t border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-4xl mx-auto px-4 py-4">
        <div className="flex gap-2 items-end">
          <div className="flex-1">
            <Input
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Digite sua mensagem..."
              className="pr-12 min-h-[44px] resize-none rounded-xl border-input bg-background"
              disabled={isLoading}
            />
          </div>
          <Button
            onClick={handleSend}
            disabled={!inputValue.trim() || isLoading}
            size="icon"
            className="h-11 w-11 rounded-xl"
          >
            <Send className="w-4 h-4" />
            <span className="sr-only">Enviar mensagem</span>
          </Button>
        </div>
        <div className="text-xs text-muted-foreground mt-2 text-center">
          Pressione Enter para enviar, Shift + Enter para nova linha
        </div>
      </div>
    </div>
  );
};
