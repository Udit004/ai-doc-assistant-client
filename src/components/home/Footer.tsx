export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-line bg-card">
      <div className="max-w-6xl mx-auto px-5 py-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Brand */}
          <div className="flex items-center gap-2.5">
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center shadow-sm shrink-0"
              style={{ background: "linear-gradient(135deg, #0f766e, #14b8a6)" }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
              </svg>
            </div>
            <div>
              <span className="font-bold text-foreground text-sm block">DocAssistant</span>
              <span className="text-muted text-xs">AI-powered document chat</span>
            </div>
          </div>

          {/* Links */}
          <nav className="flex flex-wrap items-center justify-center gap-5 text-xs text-muted font-medium">
            <a href="#features" className="hover:text-primary transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-primary transition-colors">How It Works</a>
            <a href="#get-started" className="hover:text-primary transition-colors">Get Started</a>
          </nav>

          {/* Copyright */}
          <p className="text-xs text-muted/60">
            © {year} DocAssistant. Built with Next.js & FastAPI.
          </p>
        </div>

        {/* Tech stack strip */}
        <div className="mt-8 pt-6 border-t border-line/60 flex flex-wrap items-center justify-center gap-3">
          {[
            "Next.js 16",
            "FastAPI",
            "PostgreSQL",
            "pgvector",
            "OpenAI / Ollama",
            "Celery",
            "Docker",
          ].map((tech) => (
            <span
              key={tech}
              className="px-3 py-1 rounded-full text-xs font-medium border border-line bg-white text-muted"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>
    </footer>
  );
}
