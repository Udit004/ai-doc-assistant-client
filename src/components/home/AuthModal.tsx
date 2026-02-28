"use client";

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import AuthPanel from "@/feature/auth/components/AuthPanel";
import { useAuthModal } from "@/context/AuthModalContext";
import { useAuth } from "@/context/AuthContext";

export default function AuthModal() {
  const { isOpen, close } = useAuthModal();
  const { user } = useAuth();
  const overlayRef = useRef<HTMLDivElement>(null);

  // Close modal when user successfully authenticates
  useEffect(() => {
    if (user && isOpen) close();
  }, [user, isOpen, close]);

  // Lock body scroll while open
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") close(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [isOpen, close]);

  if (!isOpen) return null;

  return createPortal(
    <div
      ref={overlayRef}
      className="fixed inset-0 flex items-center justify-center px-4 py-8"
      style={{ zIndex: 9999 }}
      onClick={(e) => { if (e.target === overlayRef.current) close(); }}
      role="dialog"
      aria-modal="true"
      aria-label="Authentication"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0"
        style={{
          background: "rgba(27,26,23,0.55)",
          backdropFilter: "blur(6px)",
          WebkitBackdropFilter: "blur(6px)",
        }}
        aria-hidden="true"
      />

      {/* Modal Panel */}
      <div
        className="relative w-full max-w-md rounded-2xl shadow-2xl overflow-hidden"
        style={{
          animation: "modalIn 0.22s cubic-bezier(0.34,1.56,0.64,1) both",
        }}
      >
        {/* Close button */}
        <button
          onClick={close}
          aria-label="Close"
          className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center rounded-full text-muted hover:text-foreground transition-colors"
          style={{ background: "rgba(228,220,207,0.6)" }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>

        {/* AuthPanel renders inside the modal */}
        <AuthPanel />
      </div>

      {/* Keyframe animation injected once */}
      <style>{`
        @keyframes modalIn {
          from { opacity: 0; transform: scale(0.92) translateY(12px); }
          to   { opacity: 1; transform: scale(1)    translateY(0); }
        }
      `}</style>
    </div>,
    document.body
  );
}
