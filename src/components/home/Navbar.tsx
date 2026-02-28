"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useAuthModal } from "@/context/AuthModalContext";
import { useState, useEffect } from "react";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { open: openAuth } = useAuthModal();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/90 backdrop-blur-md shadow-md"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto px-5 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center shadow-sm"
            style={{ background: "linear-gradient(135deg, #0f766e, #14b8a6)" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
              <line x1="16" y1="13" x2="8" y2="13"/>
              <line x1="16" y1="17" x2="8" y2="17"/>
              <polyline points="10 9 9 9 8 9"/>
            </svg>
          </div>
          <span className="font-bold text-foreground text-lg tracking-tight group-hover:text-primary transition-colors">
            DocAssistant
          </span>
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center gap-6 text-sm font-medium text-muted">
          <a href="#features" className="hover:text-primary transition-colors">Features</a>
          <a href="#how-it-works" className="hover:text-primary transition-colors">How It Works</a>
          <a href="#get-started" className="hover:text-primary transition-colors">Get Started</a>
        </div>

        {/* Auth Buttons */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <>
              <Link
                href="/chat"
                className="px-4 py-2 rounded-lg text-sm font-semibold text-primary border border-primary hover:bg-primary hover:text-white transition-all"
              >
                Open Chat
              </Link>
              <button
                onClick={logout}
                className="px-4 py-2 rounded-lg text-sm font-semibold text-muted bg-transparent border border-line hover:border-danger hover:text-danger transition-all"
                style={{ background: "transparent" }}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <button
                onClick={openAuth}
                className="px-4 py-2 rounded-lg text-sm font-semibold text-muted bg-transparent border-0 hover:text-foreground transition-colors"
                style={{ background: "transparent" }}
              >
                Sign In
              </button>
              <button
                onClick={openAuth}
                className="px-4 py-2 rounded-lg text-sm font-semibold text-white shadow-sm transition-all hover:opacity-90 border-0"
                style={{ background: "linear-gradient(135deg, #0f766e, #0d9488)" }}
              >
                Get Started →
              </button>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 rounded-lg border border-line text-muted"
          style={{ background: "transparent" }}
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {mobileOpen ? (
              <path d="M18 6L6 18M6 6l12 12"/>
            ) : (
              <path d="M3 12h18M3 6h18M3 18h18"/>
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-line px-5 py-4 flex flex-col gap-3 text-sm font-medium">
          <a href="#features" className="text-muted hover:text-primary" onClick={() => setMobileOpen(false)}>Features</a>
          <a href="#how-it-works" className="text-muted hover:text-primary" onClick={() => setMobileOpen(false)}>How It Works</a>
          {user ? (
            <>
              <Link href="/chat" className="text-primary font-semibold">Open Chat</Link>
              <button onClick={logout} className="text-left text-danger bg-transparent" style={{ background: "transparent" }}>Logout</button>
            </>
          ) : (
            <button
              className="text-left text-primary font-semibold bg-transparent border-0 p-0"
              style={{ background: "transparent" }}
              onClick={() => { setMobileOpen(false); openAuth(); }}
            >Get Started →</button>
          )}
        </div>
      )}
    </nav>
  );
}
