"use client";

import { cn } from "@/lib/utils";
import { Bot, ClipboardCheck, ClipboardCopy, User } from "lucide-react";
import { useState } from "react";
import { Message } from "../(contexts)/chat-context";

export const ChatMessageBubble = ({ message }: { message: Message }) => {
  const isJson =
    message.role === "assistant" && message.content.trim().startsWith("{");

  const tryParseJSON = (json: string) => {
    try {
      return JSON.parse(json);
    } catch {
      return null;
    }
  };

  const parsed = isJson ? tryParseJSON(message.content) : null;
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(message.content).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };

  return (
    <div
      className={cn(
        "flex gap-3 max-w-[85%]",
        message.role === "user" ? "ml-auto flex-row-reverse" : "mr-auto"
      )}
    >
      <div
        className={cn(
          "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center",
          message.role === "user"
            ? "bg-primary text-primary-foreground"
            : "bg-muted text-muted-foreground"
        )}
      >
        {message.role === "user" ? (
          <User className="w-4 h-4" />
        ) : (
          <Bot className="w-4 h-4" />
        )}
      </div>
      <div
        className={cn(
          "relative rounded-2xl px-4 py-3 max-w-full overflow-x-auto",
          message.role === "user"
            ? "bg-primary text-primary-foreground rounded-br-md"
            : "bg-muted text-muted-foreground rounded-bl-md"
        )}
      >
        {parsed ? (
          <div className="space-y-2 text-sm">
            <p>
              <strong>🔮 Interpretação:</strong> {parsed.interpretacao}
            </p>
            <p>
              <strong>🐾 Animal:</strong> {parsed.animal}
            </p>
            <div>
              <strong>🎯 Modalidade:</strong>
              <ul className="list-disc list-inside ml-2">
                {Object.entries(parsed.modalidade).map(([key, values]) => (
                  <li key={key}>
                    <strong>{key.replace(/_/g, " ")}:</strong>{" "}
                    {(values as string[]).join(", ")}
                  </li>
                ))}
              </ul>
            </div>
            <p>
              <strong>🍀 Números da Sorte:</strong>{" "}
              {parsed.numeros_da_sorte.join(", ")}
            </p>
          </div>
        ) : (
          <p className="text-sm leading-relaxed whitespace-pre-wrap">
            {message.content}
          </p>
        )}
        <div
          className={cn(
            "text-xs mt-2 opacity-70",
            message.role === "user" ? "text-right" : "text-left"
          )}
        >
          {message.timestamp.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>
        {isJson && (
          <button
            className="absolute top-2 right-2 text-xs text-muted-foreground hover:text-foreground transition"
            onClick={copyToClipboard}
            title="Copiar JSON"
          >
            {copied ? (
              <ClipboardCheck className="w-4 h-4" />
            ) : (
              <ClipboardCopy className="w-4 h-4" />
            )}
          </button>
        )}
      </div>
    </div>
  );
};
