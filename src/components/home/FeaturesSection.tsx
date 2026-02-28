type Feature = {
  icon: React.ReactNode;
  title: string;
  description: string;
  accent: string;
};

const features: Feature[] = [
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.35-4.35" />
        <path d="M11 8v6M8 11h6" />
      </svg>
    ),
    title: "Semantic Search",
    description:
      "Hybrid BM25 + dense vector retrieval finds the most relevant passages, even when keywords don't match exactly.",
    accent: "#0f766e",
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 2a10 10 0 1 0 10 10" />
        <path d="M12 6v6l4 2" />
        <circle cx="19" cy="5" r="3" />
      </svg>
    ),
    title: "AI Agents",
    description:
      "An autonomous planner-executor-synthesizer pipeline breaks complex multi-step queries into precise sub-tasks.",
    accent: "#7c3aed",
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
      </svg>
    ),
    title: "Multi-Format Support",
    description:
      "Upload PDFs, DOCX, TXT, Markdown, and more. Smart chunking preserves structure for accurate retrieval.",
    accent: "#d97706",
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        <line x1="8" y1="10" x2="16" y2="10" />
        <line x1="8" y1="14" x2="12" y2="14" />
      </svg>
    ),
    title: "Source Citations",
    description:
      "Every answer cites the exact chunk, page, and document it was drawn from — so you can verify instantly.",
    accent: "#0891b2",
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
    title: "Secure & Private",
    description:
      "JWT-based auth, isolated storage per user, and encrypted data at rest. Your documents stay yours.",
    accent: "#16a34a",
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
      </svg>
    ),
    title: "Conversation Memory",
    description:
      "Context-aware follow-up questions. The AI remembers what you discussed earlier in the conversation.",
    accent: "#e11d48",
  },
];

export default function FeaturesSection() {
  return (
    <section id="features" className="py-24 px-5 bg-white">
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-16">
          <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold tracking-widest uppercase text-teal-700 bg-teal-50 border border-teal-200 mb-4">
            Features
          </span>
          <h2
            className="font-extrabold text-foreground leading-tight"
            style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.75rem)" }}
          >
            Everything you need to unlock
            <br />
            <span
              className="bg-clip-text text-transparent"
              style={{ backgroundImage: "linear-gradient(135deg, #0f766e, #14b8a6)" }}
            >
              your documents&apos; full potential
            </span>
          </h2>
          <p className="mt-4 text-muted max-w-xl mx-auto">
            Built on state-of-the-art retrieval and language model technology — designed for accuracy,
            speed, and auditability.
          </p>
        </div>

        {/* Feature grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f) => (
            <FeatureCard key={f.title} feature={f} />
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Sub-component ─────────────────────────────────────────────────────────────
function FeatureCard({ feature }: { feature: Feature }) {
  return (
    <div className="group relative rounded-2xl border border-line bg-card p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden">
      {/* Subtle accent glow on hover */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-300 pointer-events-none rounded-2xl"
        style={{ background: feature.accent }}
      />

      {/* Icon */}
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 shadow-sm"
        style={{ background: `${feature.accent}18`, color: feature.accent }}
      >
        {feature.icon}
      </div>

      <h3 className="font-bold text-foreground text-base mb-2">{feature.title}</h3>
      <p className="text-muted text-sm leading-relaxed">{feature.description}</p>
    </div>
  );
}
