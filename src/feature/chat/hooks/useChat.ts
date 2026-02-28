"use client";

import { FormEvent, useCallback, useState } from "react";
import {
  ConversationListItem,
  fetchConversation,
  fetchConversations,
  sendChatMessage,
} from "../services/chat.service";

export type MessageItem = {
  id: string;
  role: "user" | "assistant";
  content: string;
  context?: string[];
  pipeline?: string;
  routeReason?: string;
};

export function useChat(token: string | null) {
  const [input, setInput] = useState("");
  const [conversationId, setConversationId] = useState<number | undefined>(undefined);
  const [conversationSummary, setConversationSummary] = useState<string | null>(null);
  const [messages, setMessages] = useState<MessageItem[]>([]);
  const [conversations, setConversations] = useState<ConversationListItem[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState("");

  const refreshConversations = useCallback(async (authToken: string) => {
    try {
      const rows = await fetchConversations(authToken);
      setConversations(rows);
    } catch {
      /* non-critical */
    }
  }, []);

  async function openConversation(targetId: number) {
    if (!token) return;
    setError("");
    setIsLoadingHistory(true);
    try {
      const detail = await fetchConversation(targetId, token);
      setConversationId(detail.id);
      setConversationSummary(detail.summary);
      setMessages(
        detail.messages.map((item) => ({
          id: `history-${item.id}`,
          role: item.role === "user" ? "user" : "assistant",
          content: item.content,
        })),
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load conversation");
    } finally {
      setIsLoadingHistory(false);
    }
  }

  async function handleSend(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const message = input.trim();
    if (!message || !token) return;

    setError("");
    setMessages((prev) => [
      ...prev,
      { id: `user-${Date.now()}`, role: "user", content: message },
    ]);
    setInput("");

    setIsSending(true);
    try {
      const response = await sendChatMessage(message, token, conversationId);
      setConversationId(response.conversation_id);
      setConversationSummary(null);
      setMessages((prev) => [
        ...prev,
        {
          id: `assistant-${Date.now()}`,
          role: "assistant",
          content: response.answer,
          context: response.context,
          pipeline: response.pipeline,
          routeReason: response.route_reason,
        },
      ]);
      await refreshConversations(token);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send message");
    } finally {
      setIsSending(false);
    }
  }

  function resetSession() {
    setConversationId(undefined);
    setConversationSummary(null);
    setMessages([]);
    setError("");
    setInput("");
  }

  return {
    input,
    setInput,
    conversationId,
    conversationSummary,
    messages,
    conversations,
    isLoadingHistory,
    isSending,
    error,
    refreshConversations,
    openConversation,
    handleSend,
    resetSession,
  };
}
