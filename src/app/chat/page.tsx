"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import ChatSidebar from "@/feature/chat/components/ChatSidebar";
import ChatMain from "@/feature/chat/components/ChatMain";
import { useChat } from "@/feature/chat/hooks/useChat";

export default function ChatPage() {
  const router = useRouter();
  const { user, token, isLoading, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const {
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
  } = useChat(token);

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace("/");
    }
  }, [isLoading, user, router]);

  useEffect(() => {
    if (token) void refreshConversations(token);
  }, [token, refreshConversations]);

  function handleLogout() {
    logout();
    router.replace("/");
  }

  if (isLoading || !user) {
    return (
      <div className="chatLoadingScreen">
        <div className="chatLoadingSpinner" aria-label="Loading…" />
        <p>Loading session…</p>
      </div>
    );
  }

  return (
    <div className="chatLayout">
      <ChatSidebar
        conversations={conversations}
        activeConversationId={conversationId}
        isLoadingHistory={isLoadingHistory}
        isOpen={sidebarOpen}
        user={user}
        onSelectConversation={(id) => void openConversation(id)}
        onNewChat={resetSession}
        onClose={() => setSidebarOpen(false)}
        onLogout={handleLogout}
      />

      <ChatMain
        messages={messages}
        input={input}
        isSending={isSending}
        error={error}
        conversationId={conversationId}
        conversationSummary={conversationSummary}
        onInputChange={setInput}
        onSend={(e) => void handleSend(e)}
        onMenuOpen={() => setSidebarOpen(true)}
        onResetSession={resetSession}
      />
    </div>
  );
}
