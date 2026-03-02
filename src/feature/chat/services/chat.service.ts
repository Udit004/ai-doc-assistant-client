import { apiRequest, buildApiUrl } from "@/services/http";

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

export type StreamDonePayload = {
  context: string[];
  route: string;
  route_reason: string;
  enhanced_query: string;
};

export type StreamCallbacks = {
  /** Called first — gives the conversation_id for new conversations */
  onInit?: (conversationId: number) => void;
  /** Called once the route is determined */
  onRoute?: (route: string, reason: string) => void;
  /** Called for every token chunk from the LLM */
  onToken: (token: string) => void;
  /** Called when streaming finishes — provides context and metadata */
  onDone: (payload: StreamDonePayload) => void;
  /** Called on backend error */
  onError?: (message: string) => void;
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

/**
 * Stream a chat message via Server-Sent Events.
 *
 * Connects to POST /api/v1/chat which now returns an SSE stream.
 * Parses each event and dispatches to the appropriate callback:
 *
 *   init   → onInit(conversation_id)
 *   route  → onRoute(route, reason)
 *   token  → onToken(chunk)   ← called many times, build up the message
 *   done   → onDone(payload)
 *   error  → onError(message)
 *   [DONE] → stream closed
 */
export async function sendChatMessageStream(
  message: string,
  token: string,
  conversationId: number | undefined,
  callbacks: StreamCallbacks,
): Promise<void> {
  const url = buildApiUrl("/api/v1/chat");

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      Accept: "text/event-stream",
    },
    body: JSON.stringify({
      message,
      conversation_id: conversationId ?? null,
    }),
  });

  if (!response.ok) {
    const text = await response.text().catch(() => "");
    let detail = `Request failed with status ${response.status}`;
    try {
      detail = (JSON.parse(text) as { detail?: string }).detail ?? detail;
    } catch {
      /* ignore */
    }
    throw new Error(detail);
  }

  if (!response.body) {
    throw new Error("No response body for SSE stream");
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  // eslint-disable-next-line no-constant-condition
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });

    // SSE events are separated by double newline
    const parts = buffer.split("\n\n");
    buffer = parts.pop() ?? ""; // keep incomplete last chunk

    for (const part of parts) {
      for (const line of part.split("\n")) {
        if (!line.startsWith("data: ")) continue;

        const raw = line.slice(6).trim();
        if (raw === "[DONE]") return; // terminal sentinel

        try {
          const event = JSON.parse(raw) as { type: string; data: unknown };
          switch (event.type) {
            case "init":
              callbacks.onInit?.((event.data as { conversation_id: number }).conversation_id);
              break;
            case "route": {
              const d = event.data as { route: string; reason: string };
              callbacks.onRoute?.(d.route, d.reason);
              break;
            }
            case "token":
              callbacks.onToken(event.data as string);
              break;
            case "done":
              callbacks.onDone(event.data as StreamDonePayload);
              break;
            case "error":
              callbacks.onError?.(event.data as string);
              return;
          }
        } catch {
          /* malformed JSON — skip */
        }
      }
    }
  }
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
