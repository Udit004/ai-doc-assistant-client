"use client";

export default function HeroSection() {
  return (
    <section
      className="relative min-h-screen flex flex-col items-center justify-center px-5 pt-24 pb-16 overflow-hidden"
      style={{
        background:
          "radial-gradient(ellipse 80% 60% at 50% -10%, rgba(20,184,166,0.18) 0%, transparent 65%), " +
          "radial-gradient(ellipse 60% 50% at 0% 100%, rgba(247,233,206,0.7) 0%, transparent 50%), " +
          "radial-gradient(ellipse 60% 50% at 100% 100%, rgba(209,239,230,0.5) 0%, transparent 50%), " +
          "#fff8ec",
      }}
    >
      {/* Decorative blobs */}
      <div
        className="absolute -top-24 -left-24 w-96 h-96 rounded-full opacity-20 blur-3xl pointer-events-none"
        style={{ background: "radial-gradient(circle, #14b8a6, transparent)" }}
      />
      <div
        className="absolute -bottom-16 -right-16 w-80 h-80 rounded-full opacity-20 blur-3xl pointer-events-none"
        style={{ background: "radial-gradient(circle, #f59e0b, transparent)" }}
      />

      {/* Badge */}
      <div className="mb-6 flex items-center gap-2 px-4 py-1.5 rounded-full border border-teal-200 bg-teal-50 text-teal-700 text-xs font-semibold tracking-wide shadow-sm">
        <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" />
        Powered by RAG + AI Agents
      </div>

      {/* Headline */}
      <h1 className="text-center font-extrabold text-foreground leading-tight max-w-4xl"
        style={{ fontSize: "clamp(2.2rem, 5vw, 4rem)" }}>
        Chat with Your Documents,{" "}
        <span
          className="bg-clip-text text-transparent"
          style={{ backgroundImage: "linear-gradient(135deg, #0f766e 0%, #0d9488 50%, #14b8a6 100%)" }}
        >
          Instantly
        </span>
      </h1>

      {/* Subheading */}
      <p className="mt-6 text-center text-muted max-w-2xl leading-relaxed"
        style={{ fontSize: "clamp(1rem, 2vw, 1.2rem)" }}>
        Upload PDFs, Word files, or text documents and get accurate, cited answers
        within seconds — powered by Retrieval-Augmented Generation and autonomous AI agents.
      </p>

      {/* CTA Buttons */}
      <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
        <a
          href="#get-started"
          className="px-7 py-3.5 rounded-xl font-bold text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl text-base"
          style={{ background: "linear-gradient(135deg, #0f766e 0%, #14b8a6 100%)" }}
        >
          Get Started — It&apos;s Free
        </a>
        <a
          href="#how-it-works"
          className="px-7 py-3.5 rounded-xl font-semibold border border-line bg-white text-foreground shadow-sm transition-all hover:border-teal-400 hover:shadow-md text-base"
        >
          See How It Works ↓
        </a>
      </div>

      {/* Social proof strip */}
      <p className="mt-8 text-xs text-muted/70 font-medium tracking-wide uppercase">
        Supports PDF · DOCX · TXT · Markdown · and more
      </p>

      {/* Hero visual / mock UI card */}
      <div className="mt-16 w-full max-w-3xl">
        <div className="rounded-2xl border border-line bg-white shadow-2xl overflow-hidden">
          {/* Window chrome */}
          <div className="flex items-center gap-2 px-5 py-3 bg-card border-b border-line">
            <span className="w-3 h-3 rounded-full bg-red-400" />
            <span className="w-3 h-3 rounded-full bg-yellow-400" />
            <span className="w-3 h-3 rounded-full bg-green-400" />
            <span className="ml-3 text-xs text-muted font-mono">DocAssistant — AI Chat</span>
          </div>
          {/* Mock chat */}
          <div className="p-6 space-y-4">
            <MockMessage
              role="user"
              text="What are the key findings in the uploaded research paper?"
            />
            <MockMessage
              role="assistant"
              text='The paper identifies three key findings: (1) transformer-based models outperform RNNs on long-context tasks by 34%, (2) retrieval augmentation reduces hallucinations by 61%, and (3) hybrid search (BM25 + dense vectors) achieves the best precision@5 scores. — Source: §3.2, §4.1'
            />
            <div className="flex items-center gap-2 mt-2">
              <div className="flex-1 rounded-lg border border-line px-4 py-2.5 text-sm text-muted bg-background">
                Ask another question…
              </div>
              <button
                aria-label="Send message"
                className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                style={{ background: "linear-gradient(135deg, #0f766e, #14b8a6)" }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" aria-hidden="true">
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Sub-component: mock chat bubble ──────────────────────────────────────────
function MockMessage({ role, text }: { role: "user" | "assistant"; text: string }) {
  const isUser = role === "user";
  return (
    <div className={`flex gap-3 ${isUser ? "flex-row-reverse" : ""}`}>
      <div
        className="w-8 h-8 rounded-full shrink-0 flex items-center justify-center text-xs font-bold text-white shadow-sm"
        style={{
          background: isUser
            ? "linear-gradient(135deg, #6366f1, #818cf8)"
            : "linear-gradient(135deg, #0f766e, #14b8a6)",
        }}
      >
        {isUser ? "U" : "AI"}
      </div>
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm ${
          isUser
            ? "bg-indigo-50 text-indigo-900 rounded-tr-sm"
            : "bg-teal-50 text-teal-900 rounded-tl-sm border border-teal-100"
        }`}
      >
        {text}
      </div>
    </div>
  );
}
