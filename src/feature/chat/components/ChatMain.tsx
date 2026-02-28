"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import type { MessageItem } from "../hooks/useChat";
import UploadModal from "@/feature/upload/components/UploadModal";

interface ChatMainProps {
  messages: MessageItem[];
  input: string;
  isSending: boolean;
  error: string;
  conversationId: number | undefined;
  conversationSummary: string | null;
  onInputChange: (value: string) => void;
  onSend: (e: FormEvent<HTMLFormElement>) => void;
  onMenuOpen: () => void;
  onResetSession: () => void;
}

function formatPipeline(pipeline: string): string {
  const map: Record<string, string> = {
    rag: "RAG",
    agent: "Agent",
    agent_fallback: "RAG → Agent fallback",
  };
  return map[pipeline] ?? pipeline;
}

export default function ChatMain({
  messages,
  input,
  isSending,
  error,
  conversationId,
  conversationSummary,
  onInputChange,
  onSend,
  onMenuOpen,
  onResetSession,
}: ChatMainProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [uploadOpen, setUploadOpen] = useState(false);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <>
      <div className="flex-1 flex flex-col h-screen bg-background overflow-hidden">
      {/* Top Header */}
      <header className="shrink-0 flex items-center gap-3 px-5 py-3 bg-card border-b border-line">
        <button
          type="button"
          className="md:hidden shrink-0 p-2 border border-line rounded-lg bg-transparent text-foreground hover:bg-gray-200"
          aria-label="Open sidebar"
          onClick={onMenuOpen}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>

        <div className="flex-1 min-w-0">
          <h1 className="text-lg font-bold text-foreground">Doc Assistant</h1>
          <span className="text-xs text-muted">
            {conversationId ? `Conversation #${conversationId}` : "New conversation"}
          </span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            className="hidden sm:inline-flex px-3 py-2 text-sm font-semibold bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
            onClick={onResetSession}
            title="Start a new conversation"
          >
            New Chat
          </button>
          <button
            type="button"
            className="hidden sm:inline-flex px-3 py-2 text-sm font-semibold bg-primary text-white rounded-lg hover:bg-primary-hover"
            onClick={() => setUploadOpen(true)}
          >
            Upload Docs
          </button>
        </div>
      </header>

      {/* Messages Area */}
      <div
        className="flex-1 overflow-y-auto px-5 py-6 space-y-5"
        role="log"
        aria-live="polite"
        aria-label="Chat messages"
      >
        {/* Summary banner */}
        {conversationSummary && (
          <div
            className="flex gap-3 p-3 bg-teal-50 border border-dashed border-teal-300 rounded-lg text-sm text-teal-800"
            role="note"
          >
            <span className="text-lg shrink-0">🧠</span>
            <div>
              <strong>Context from earlier:</strong>
              <p className="mt-1 text-xs leading-relaxed whitespace-pre-wrap">
                {conversationSummary}
              </p>
            </div>
          </div>
        )}

        {/* Empty state */}
        {messages.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center py-12 max-w-sm mx-auto">
            <div className="text-5xl mb-4 opacity-70">💬</div>
            <h2 className="text-xl font-bold text-foreground mb-2">Start a conversation</h2>
            <p className="text-sm text-muted leading-relaxed">
              Upload a document from the home page, then ask questions below. The assistant picks
              the best retrieval strategy automatically.
            </p>
          </div>
        ) : (
          messages.map((item) => (
            <article
              key={item.id}
              className={`flex w-full ${item.role === "user" ? "justify-end" : "justify-start"}`}
            >
              {item.role === "user" ? (
                /* User bubble: right-aligned green pill */
                <div className="max-w-[65%] bg-primary text-white rounded-2xl rounded-tr-sm px-4 py-2.5">
                  <p className="text-sm whitespace-pre-wrap leading-relaxed">{item.content}</p>
                </div>
              ) : (
                /* AI reply: full width, no background (ChatGPT style) */
                <div className="w-full max-w-3xl">
                  <p className="text-sm whitespace-pre-wrap leading-relaxed text-foreground">
                    {item.content}
                  </p>

                  {item.pipeline && (
                    <p className="mt-2 text-xs opacity-75">
                      <span className="inline-block px-2 py-1 rounded-full bg-teal-100 text-teal-700">
                        {formatPipeline(item.pipeline)}
                      </span>
                      {item.routeReason && (
                        <span className="italic ml-1"> · {item.routeReason}</span>
                      )}
                    </p>
                  )}

                  {item.context && item.context.length > 0 && (
                    <details className="mt-3 border-t border-dashed border-line/50 pt-2 text-xs">
                      <summary className="cursor-pointer font-semibold text-primary hover:underline">
                        View retrieved context ({item.context.length})
                      </summary>
                      <ol className="mt-2 pl-4 space-y-1 text-line">
                        {item.context.map((ctx, index) => (
                          <li key={`${item.id}-ctx-${index}`} className="text-xs opacity-75">
                            {ctx}
                          </li>
                        ))}
                      </ol>
                    </details>
                  )}
                </div>
              )}
            </article>
          ))
        )}

        {isSending && (
          <div className="flex gap-1 items-center" aria-label="Assistant is typing">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse typing-delay-1" />
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse typing-delay-2" />
          </div>
        )}

        <div ref={messagesEndRef} aria-hidden="true" />
      </div>

      {/* Error Banner */}
      {error && (
        <div
          className="shrink-0 mx-5 p-3 rounded-lg bg-red-50 text-danger font-semibold text-sm border border-red-200 flex items-center gap-2"
          role="alert"
        >
          <span>⚠</span> {error}
        </div>
      )}

      {/* Input Area */}
      <form
        className="shrink-0 px-5 py-4 bg-card border-t border-line"
        onSubmit={onSend}
        aria-label="Send a message"
      >
        <div className="flex gap-3 items-end bg-white border-2 border-line rounded-xl p-3 focus-within:border-teal-400 focus-within:shadow-md transition-all">
          <textarea
            className="flex-1 resize-none outline-none text-sm bg-transparent text-foreground placeholder-muted max-h-40"
            value={input}
            rows={1}
            placeholder="Ask a question about your documents…"
            disabled={isSending}
            aria-label="Message input"
            onChange={(e) => {
              onInputChange(e.target.value);
              e.target.style.height = "auto";
              e.target.style.height = `${Math.min(e.target.scrollHeight, 160)}px`;
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                if (input.trim() && !isSending) {
                  e.currentTarget.form?.requestSubmit();
                }
              }
            }}
          />
          <button
            type="submit"
            className="shrink-0 p-2 rounded-lg bg-primary text-white hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            disabled={isSending || !input.trim()}
            aria-label="Send message"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          </button>
        </div>
        <p className="text-xs text-muted mt-2 px-1">Enter to send · Shift+Enter for new line</p>
      </form>
    </div>

    {uploadOpen && <UploadModal onClose={() => setUploadOpen(false)} />}
    </>
  );
}
