"use client";

import { useAuth } from "@/context/AuthContext";
import { useAuthModal } from "@/context/AuthModalContext";
import UploadPanel from "@/feature/upload/components/UploadPanel";

export default function CtaSection() {
  const { user } = useAuth();
  const { open: openAuth } = useAuthModal();

  return (
    <section
      id="get-started"
      className="py-24 px-5 relative overflow-hidden"
      style={{
        background:
          "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(20,184,166,0.12) 0%, transparent 65%), " +
          "#fff8ec",
      }}
    >
      {/* Decorative ring */}
      <div
        className="absolute -bottom-32 left-1/2 -translate-x-1/2 w-175 h-175 rounded-full border border-teal-200/40 pointer-events-none"
        style={{ boxShadow: "inset 0 0 120px rgba(20,184,166,0.06)" }}
      />

      <div className="max-w-2xl mx-auto relative">
        {/* Section header (only for non-logged users) */}
        {!user && (
          <div className="text-center mb-10">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold tracking-widest uppercase text-teal-700 bg-teal-50 border border-teal-200 mb-4">
              Get Started
            </span>
            <h2
              className="font-extrabold text-foreground"
              style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.5rem)" }}
            >
              Ready to chat with your docs?
            </h2>
            <p className="mt-3 text-muted">
              Create a free account in 30 seconds and upload your first document.
            </p>
          </div>
        )}

        {user && (
          <div className="text-center mb-10">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold tracking-widest uppercase text-teal-700 bg-teal-50 border border-teal-200 mb-4">
              Dashboard
            </span>
            <h2
              className="font-extrabold text-foreground"
              style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.5rem)" }}
            >
              Upload a document to get started
            </h2>
            <p className="mt-3 text-muted">
              Once uploaded, head to the chat and start asking questions.
            </p>
          </div>
        )}

        {/* Upload panel for authenticated users, CTA button for guests */}
        {user ? (
          <div className="rounded-2xl border border-line shadow-2xl overflow-hidden bg-white">
            <UploadPanel />
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4">
            <button
              onClick={openAuth}
              className="w-full max-w-xs px-8 py-4 rounded-xl font-bold text-white shadow-xl transition-all hover:scale-105 hover:shadow-2xl text-base border-0"
              style={{ background: "linear-gradient(135deg, #0f766e 0%, #14b8a6 100%)" }}
            >
              Create Free Account →
            </button>
            <p className="text-sm text-muted">
              Already have an account?{" "}
              <button
                onClick={openAuth}
                className="font-semibold text-primary underline bg-transparent border-0 p-0 cursor-pointer hover:text-primary-hover"
                style={{ background: "transparent" }}
              >
                Sign in
              </button>
            </p>
          </div>
        )}

        {/* Trust signals — only for guests */}
        {!user && (
          <div className="mt-6 flex flex-wrap items-center justify-center gap-5 text-xs text-muted/70">
            <span className="flex items-center gap-1.5">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
              Encrypted & private
            </span>
            <span className="flex items-center gap-1.5">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="9 11 12 14 22 4" />
                <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
              </svg>
              No credit card required
            </span>
            <span className="flex items-center gap-1.5">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              Free to start
            </span>
          </div>
        )}
      </div>
    </section>
  );
}
