"use client";

import { useEffect, useRef } from "react";
import type { ConversationListItem } from "../services/chat.service";
import type { AuthUser } from "@/feature/auth/services/auth.service";

interface ChatSidebarProps {
  conversations: ConversationListItem[];
  activeConversationId: number | undefined;
  isLoadingHistory: boolean;
  isOpen: boolean;
  user: AuthUser | null;
  onSelectConversation: (id: number) => void;
  onNewChat: () => void;
  onClose: () => void;
  onLogout: () => void;
}

export default function ChatSidebar({
  conversations,
  activeConversationId,
  isLoadingHistory,
  isOpen,
  user,
  onSelectConversation,
  onNewChat,
  onClose,
  onLogout,
}: ChatSidebarProps) {
  const sidebarRef = useRef<HTMLElement>(null);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && isOpen) onClose();
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/45 backdrop-blur-sm"
          aria-hidden="true"
          onClick={onClose}
        />
      )}

      <aside
        ref={sidebarRef}
        className={`fixed left-0 top-0 bottom-0 z-50 w-72 flex flex-col bg-card border-r border-line transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:relative md:translate-x-0 md:shadow-none`}
        aria-label="Conversation sidebar"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-line">
          <div className="flex items-center gap-2">
            <span className="text-xl">📄</span>
            <span className="font-bold text-foreground">DocAssist</span>
          </div>
          <button
            type="button"
            className="md:hidden px-2 py-1 text-sm bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
            aria-label="Close sidebar"
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        {/* New Chat */}
        <div className="px-4 py-3">
          <button
            type="button"
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-primary text-white font-semibold rounded-lg hover:bg-primary-hover transition-colors"
            onClick={() => {
              onNewChat();
              onClose();
            }}
          >
            <span>＋</span>
            New Chat
          </button>
        </div>

        {/* Conversation List */}
        <nav
          className="flex-1 overflow-y-auto px-2 py-3"
          aria-label="Conversations"
        >
          <p className="text-xs font-bold uppercase tracking-wider text-muted px-1 mb-3">
            Conversations
          </p>

          {conversations.length === 0 ? (
            <p className="text-sm text-muted px-1">No conversations yet.</p>
          ) : (
            <ul className="space-y-1">
              {conversations.map((item) => (
                <li key={item.id}>
                  <button
                    type="button"
                    className={`w-full flex items-start gap-2 px-3 py-2 rounded-lg text-left transition-colors ${
                      activeConversationId === item.id
                        ? "bg-primary/10 border border-primary/25"
                        : "border border-transparent hover:bg-primary/5"
                    }`}
                    disabled={isLoadingHistory}
                    onClick={() => {
                      onSelectConversation(item.id);
                      onClose();
                    }}
                    title={item.title ?? `Conversation ${item.id}`}
                  >
                    <span className="text-sm shrink-0 mt-0.5">💬</span>
                    <span className="min-w-0 flex-1">
                      <span
                        className={`block text-sm font-semibold truncate ${
                          activeConversationId === item.id
                            ? "text-primary"
                            : "text-foreground"
                        }`}
                      >
                        {item.title ?? `Conversation ${item.id}`}
                      </span>
                      {item.last_message_preview && (
                        <span className="block text-xs text-muted truncate mt-0.5">
                          {item.last_message_preview}
                        </span>
                      )}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </nav>

        {/* User Footer */}
        <div className="border-t border-line px-4 py-3 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-teal-700 text-white flex items-center justify-center shrink-0 text-xs font-bold">
            {user?.email?.charAt(0).toUpperCase() ?? "U"}
          </div>
          <div className="min-w-0 flex-1">
            <span className="block text-xs font-semibold truncate text-foreground">
              {user?.email ?? "User"}
            </span>
            <span className="block text-xs text-muted">Signed in</span>
          </div>
          <button
            type="button"
            className="shrink-0 p-2 text-muted border border-line rounded-lg hover:bg-red-50 hover:text-danger hover:border-red-300 transition-colors"
            onClick={onLogout}
            title="Sign out"
            aria-label="Sign out"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
          </button>
        </div>
      </aside>
    </>
  );
}
