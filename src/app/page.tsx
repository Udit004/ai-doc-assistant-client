"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import AuthPanel from "@/feature/auth/components/AuthPanel";
import UploadPanel from "@/feature/upload/components/UploadPanel";
import { useAuth } from "@/context/AuthContext";

export default function Home() {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  // Optionally redirect to /chat after a successful upload — handled by UploadPanel's Link
  // No auto-redirect here so the user can upload documents on the home page

  if (isLoading) {
    return (
      <main className="page">
        <section className="card">
          <p className="hint">Loading session…</p>
        </section>
      </main>
    );
  }

  return (
    <main className="page">
      {user ? <UploadPanel /> : <AuthPanel />}
    </main>
  );
}
