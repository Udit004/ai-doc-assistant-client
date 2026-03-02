"use client";

import { FormEvent, useCallback, useState } from "react";
import {
  ConversationListItem,
  fetchConversation,
  fetchConversations,
  sendChatMessageStream,
} from "../services/chat.service";

export type MessageItem = {
  id: string;
  role: "user" | "assistant";
  content: string;
  context?: string[];
  pipeline?: string;
  routeReason?: string;
  /** True while tokens are still arriving — used to show a streaming cursor */
  isStreaming?: boolean;
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
    setInput("");

    // 1. Add user message immediately
    setMessages((prev) => [
      ...prev,
      { id: `user-${Date.now()}`, role: "user", content: message },
    ]);

    // 2. Add empty assistant bubble so something appears right away
    const assistantId = `assistant-${Date.now()}`;
    setMessages((prev) => [
      ...prev,
      { id: assistantId, role: "assistant", content: "", isStreaming: true },
    ]);

    setIsSending(true);
    try {
      await sendChatMessageStream(message, token, conversationId, {
        onInit(id) {
          // New conversation — update conversation id immediately
          setConversationId(id);
        },

        onToken(chunk) {
          // Append each token to the streaming assistant bubble
          setMessages((prev) =>
            prev.map((m) =>
              m.id === assistantId ? { ...m, content: m.content + chunk } : m,
            ),
          );
        },

        onDone(payload) {
          // Finalise the message with metadata and clear the streaming flag
          setMessages((prev) =>
            prev.map((m) =>
              m.id === assistantId
                ? {
                    ...m,
                    context: payload.context,
                    pipeline: payload.route,
                    routeReason: payload.route_reason,
                    isStreaming: false,
                  }
                : m,
            ),
          );
          setConversationSummary(null);
          if (token) refreshConversations(token);
        },

        onError(msg) {
          setMessages((prev) =>
            prev.map((m) =>
              m.id === assistantId
                ? { ...m, content: `[Error: ${msg}]`, isStreaming: false }
                : m,
            ),
          );
          setError(msg);
        },
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to send message";
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantId
            ? { ...m, content: `[Error: ${msg}]`, isStreaming: false }
            : m,
        ),
      );
      setError(msg);
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
