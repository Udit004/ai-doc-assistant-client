"use client";

import { useAuth } from "@/context/AuthContext";
import { useAuthModal } from "@/context/AuthModalContext";
import Link from "next/link";

type Step = {
  number: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  details: string[];
};

const steps: Step[] = [
  {
    number: "01",
    title: "Create an Account",
    description: "Sign up in seconds with just your email. No credit card required.",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
    details: ["Email + password signup", "Instant JWT session", "Secure private workspace"],
  },
  {
    number: "02",
    title: "Upload Your Documents",
    description:
      "Drag & drop or browse files. We support PDF, DOCX, TXT, Markdown and more.",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <polyline points="16 16 12 12 8 16" />
        <line x1="12" y1="12" x2="12" y2="21" />
        <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" />
      </svg>
    ),
    details: [
      "Automatic text extraction",
      "Smart semantic chunking",
      "Vector embedding generation",
    ],
  },
  {
    number: "03",
    title: "Ask Any Question",
    description:
      "Type natural-language questions. Ask follow-ups — the AI keeps context across the conversation.",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <circle cx="12" cy="12" r="10" />
        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
        <line x1="12" y1="17" x2="12.01" y2="17" />
      </svg>
    ),
    details: [
      "Natural language queries",
      "Multi-step AI reasoning",
      "Conversation memory",
    ],
  },
  {
    number: "04",
    title: "Get Cited Answers",
    description:
      "Every response includes source references so you know exactly where the information came from.",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <polyline points="9 11 12 14 22 4" />
        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
      </svg>
    ),
    details: [
      "Passage-level citations",
      "Confidence scoring",
      "Hallucination-resistant RAG",
    ],
  },
];

export default function HowItWorksSection() {
  const { user } = useAuth();
  const { open: openAuth } = useAuthModal();

  return (
    <section
      id="how-it-works"
      className="py-24 px-5 relative overflow-hidden"
      style={{
        background:
          "radial-gradient(ellipse 100% 80% at 50% 100%, rgba(20,184,166,0.06) 0%, transparent 70%), #fff8ec",
      }}
    >
      {/* Background grid pattern */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(#1b1a17 1px, transparent 1px), linear-gradient(90deg, #1b1a17 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      <div className="max-w-6xl mx-auto relative">
        {/* Section header */}
        <div className="text-center mb-20">
          <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold tracking-widest uppercase text-teal-700 bg-teal-50 border border-teal-200 mb-4">
            How It Works
          </span>
          <h2
            className="font-extrabold text-foreground"
            style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.75rem)" }}
          >
            From upload to insight in{" "}
            <span
              className="bg-clip-text text-transparent"
              style={{ backgroundImage: "linear-gradient(135deg, #0f766e, #14b8a6)" }}
            >
              four steps
            </span>
          </h2>
          <p className="mt-4 text-muted max-w-lg mx-auto">
            No training required. No complicated setup. Just upload and start asking.
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {steps.map((step, index) => (
            <StepCard key={step.number} step={step} index={index} />
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 flex justify-center">
          {user ? (
            <Link
              href="/chat"
              className="px-8 py-4 rounded-xl font-bold text-white shadow-xl transition-all hover:scale-105 hover:shadow-2xl text-base"
              style={{ background: "linear-gradient(135deg, #0f766e 0%, #14b8a6 100%)" }}
            >
              Open Chat →
            </Link>
          ) : (
            <button
              onClick={openAuth}
              className="px-8 py-4 rounded-xl font-bold text-white shadow-xl transition-all hover:scale-105 hover:shadow-2xl text-base border-0"
              style={{ background: "linear-gradient(135deg, #0f766e 0%, #14b8a6 100%)" }}
            >
              Start Now — It&apos;s Free →
            </button>
          )}
        </div>
      </div>
    </section>
  );
}

// ── Sub-component ─────────────────────────────────────────────────────────────
function StepCard({ step, index }: { step: Step; index: number }) {
  const isEven = index % 2 === 0;
  return (
    <div
      className="relative rounded-2xl border border-line bg-white p-8 shadow-sm hover:shadow-lg transition-shadow duration-300 group"
    >
      {/* Step number watermark */}
      <span
        className="absolute top-4 right-6 font-black text-6xl leading-none select-none pointer-events-none"
        style={{ color: isEven ? "#0f766e12" : "#7c3aed12" }}
      >
        {step.number}
      </span>

      {/* Icon + step number */}
      <div className="flex items-start gap-4 mb-5">
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-sm"
          style={{
            background: isEven
              ? "linear-gradient(135deg, #ccfbf1, #99f6e4)"
              : "linear-gradient(135deg, #ede9fe, #c4b5fd)",
            color: isEven ? "#0f766e" : "#7c3aed",
          }}
        >
          {step.icon}
        </div>
        <div>
          <span
            className="text-xs font-bold tracking-widest uppercase"
            style={{ color: isEven ? "#0f766e" : "#7c3aed" }}
          >
            Step {step.number}
          </span>
          <h3 className="font-bold text-foreground text-lg leading-tight">{step.title}</h3>
        </div>
      </div>

      <p className="text-muted text-sm leading-relaxed mb-5">{step.description}</p>

      {/* Detail chips */}
      <div className="flex flex-wrap gap-2">
        {step.details.map((detail) => (
          <span
            key={detail}
            className="px-3 py-1 rounded-full text-xs font-medium border"
            style={
              isEven
                ? {
                    background: "#f0fdf9",
                    color: "#0f766e",
                    borderColor: "#99f6e480",
                  }
                : {
                    background: "#faf5ff",
                    color: "#7c3aed",
                    borderColor: "#c4b5fd80",
                  }
            }
          >
            ✓ {detail}
          </span>
        ))}
      </div>
    </div>
  );
}
