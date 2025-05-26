/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { interpretarSonho } from "../api/interpretar/api";

export type Message = {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
};

export type Conversation = {
  id: string;
  title: string;
  messages: Message[];
  lastActivity: Date;
};

interface ChatContextProps {
  conversations: Conversation[];
  currentConversation: Conversation | null;
  sendMessage: (content: string) => void;
  createConversation: () => void;
  deleteConversation: (id: string) => void;
  selectConversation: (id: string) => void;
  isLoading: boolean;
}

const ChatContext = createContext({} as ChatContextProps);

export const ChatProvider = ({ children }: { children: React.ReactNode }) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("conversas");
    if (stored) {
      const parsed = JSON.parse(stored);
      const formatted = parsed.map((c: Conversation) => ({
        ...c,
        lastActivity: new Date(c.lastActivity),
        messages: c.messages.map((m: Message) => ({
          ...m,
          timestamp: new Date(m.timestamp),
        })),
      }));

      setConversations(formatted);
      setCurrentId(formatted[0]?.id ?? null);
    } else {
      // Se não houver nada no localStorage, cria a primeira conversa
      const firstConv: Conversation = {
        id: Date.now().toString(),
        title: "Nova Conversa",
        lastActivity: new Date(),
        messages: [
          {
            id: "1",
            content: "Me conte sobre seu sonho.",
            role: "assistant",
            timestamp: new Date(),
          },
        ],
      };
      setConversations([firstConv]);
      setCurrentId(firstConv.id);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("conversas", JSON.stringify(conversations));
  }, [conversations]);

  const currentConversation =
    conversations.find((c) => c.id === currentId) ?? null;

  const createConversation = () => {
    const newConv: Conversation = {
      id: Date.now().toString(),
      title: "Nova Conversa",
      lastActivity: new Date(),
      messages: [
        {
          id: "1",
          content: "Me conte sobre seu sonho.",
          role: "assistant",
          timestamp: new Date(),
        },
      ],
    };
    setConversations([newConv, ...conversations]);
    setCurrentId(newConv.id);
  };

  const deleteConversation = (id: string) => {
    const filtered = conversations.filter((c) => c.id !== id);
    setConversations(filtered);
    if (id === currentId) {
      setCurrentId(filtered[0]?.id ?? null);
    }
  };

  const selectConversation = (id: string) => {
    setCurrentId(id);
  };

  const sendMessage = async (content: string) => {
    if (!currentId || !content.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      content,
      role: "user",
      timestamp: new Date(),
    };

    setConversations((prev) =>
      prev.map((conv) =>
        conv.id === currentId
          ? {
              ...conv,
              messages: [...conv.messages, userMsg],
              lastActivity: new Date(),
            }
          : conv
      )
    );

    setIsLoading(true);

    try {
      const resposta = await interpretarSonho(content);
      const formatted = JSON.stringify(resposta, null, 2);

      const assistantMsg: Message = {
        id: (Date.now() + 1).toString(),
        content: formatted,
        role: "assistant",
        timestamp: new Date(),
      };

      setConversations((prev) =>
        prev.map((conv) =>
          conv.id === currentId
            ? {
                ...conv,
                messages: [...conv.messages, assistantMsg],
                lastActivity: new Date(),
              }
            : conv
        )
      );

      if (
        resposta.interpretacao &&
        currentConversation?.title === "Nova Conversa"
      ) {
        setConversations((prev) =>
          prev.map((conv) =>
            conv.id === currentId
              ? {
                  ...conv,
                  title:
                    resposta.interpretacao.slice(0, 40) +
                    (resposta.interpretacao.length > 40 ? "..." : ""),
                }
              : conv
          )
        );
      }
    } catch (err: any) {
      const errorMsg: Message = {
        id: (Date.now() + 2).toString(),
        content: "❌ Erro ao interpretar o sonho. Tente novamente.",
        role: "assistant",
        timestamp: new Date(),
      };

      setConversations((prev) =>
        prev.map((conv) =>
          conv.id === currentId
            ? {
                ...conv,
                messages: [...conv.messages, errorMsg],
                lastActivity: new Date(),
              }
            : conv
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ChatContext.Provider
      value={{
        conversations,
        currentConversation,
        createConversation,
        deleteConversation,
        selectConversation,
        sendMessage,
        isLoading,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => useContext(ChatContext);
