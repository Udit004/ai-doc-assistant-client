"use client";

import { useAuth } from "@/context/AuthContext";
import {
  Navbar,
  HeroSection,
  FeaturesSection,
  HowItWorksSection,
  StatsSection,
  CtaSection,
  Footer,
} from "@/components/home";

export default function Home() {
  const { isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center"
        style={{ background: "#fff8ec" }}>
        <div className="flex flex-col items-center gap-4">
          <div
            className="w-12 h-12 rounded-2xl animate-pulse"
            style={{ background: "linear-gradient(135deg, #0f766e, #14b8a6)" }}
          />
          <p className="text-muted text-sm font-medium animate-pulse">Loading…</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <FeaturesSection />
        <HowItWorksSection />
        <StatsSection />
        <CtaSection />
      </main>
      <Footer />
    </>
  );
}
