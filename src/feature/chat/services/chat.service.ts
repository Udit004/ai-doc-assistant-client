import { apiRequest } from "@/services/http";

export type ChatResponse = {
  conversation_id: number;
  answer: string;
  context: string[];
  pipeline: string;
  route_reason: string;
  query_expansions: string[];
  context_coverage: number | null;
  context_sufficient: boolean | null;
};

export type ConversationListItem = {
  id: number;
  title: string | null;
  updated_at: string;
  message_count: number;
  last_message_preview: string | null;
  last_message_at: string | null;
};

export type ConversationMessage = {
  id: number;
  conversation_id: number;
  role: string;
  content: string;
  created_at: string;
};

export type ConversationDetail = {
  id: number;
  title: string | null;
  summary: string | null;
  created_at: string;
  updated_at: string;
  messages: ConversationMessage[];
};

export async function sendChatMessage(
  message: string,
  token: string,
  conversationId?: number,
): Promise<ChatResponse> {
  return apiRequest<ChatResponse>("/api/v1/chat", {
    method: "POST",
    token,
    body: {
      message,
      conversation_id: conversationId ?? null,
    },
  });
}

export async function fetchConversations(token: string): Promise<ConversationListItem[]> {
  return apiRequest<ConversationListItem[]>("/api/v1/chat/conversations", { token });
}

export async function fetchConversation(
  conversationId: number,
  token: string,
): Promise<ConversationDetail> {
  return apiRequest<ConversationDetail>(`/api/v1/chat/conversations/${conversationId}`, { token });
}
