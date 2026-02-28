type Stat = {
  value: string;
  label: string;
  description: string;
  icon: React.ReactNode;
};

const stats: Stat[] = [
  {
    value: "< 2s",
    label: "Avg. Response Time",
    description: "Lightning-fast answers with streaming",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
      </svg>
    ),
  },
  {
    value: "10+",
    label: "File Formats",
    description: "PDF, DOCX, TXT, MD, and more",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
      </svg>
    ),
  },
  {
    value: "61%",
    label: "Fewer Hallucinations",
    description: "Compared to standard LLM prompting",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
  },
  {
    value: "∞",
    label: "Documents Supported",
    description: "No hard limit on your library",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <ellipse cx="12" cy="12" rx="10" ry="4" />
        <path d="M2 12c0 4 4.5 8 10 8s10-4 10-8" />
      </svg>
    ),
  },
];

export default function StatsSection() {
  return (
    <section
      className="py-16 px-5"
      style={{ background: "linear-gradient(135deg, #0f766e 0%, #0d9488 50%, #14b8a6 100%)" }}
    >
      <div className="max-w-6xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <StatCard key={stat.label} stat={stat} />
        ))}
      </div>
    </section>
  );
}

function StatCard({ stat }: { stat: Stat }) {
  return (
    <div className="text-center text-white group">
      <div className="flex justify-center mb-3">
        <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center group-hover:bg-white/25 transition-colors">
          {stat.icon}
        </div>
      </div>
      <div className="text-3xl font-black mb-1 tracking-tight">{stat.value}</div>
      <div className="font-semibold text-white/90 text-sm mb-1">{stat.label}</div>
      <div className="text-white/60 text-xs">{stat.description}</div>
    </div>
  );
}
