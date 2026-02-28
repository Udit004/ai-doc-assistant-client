"use client";

import { FormEvent, useState } from "react";
import { useAuth } from "@/context/AuthContext";

export default function AuthPanel() {
  const { login, register } = useAuth();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    try {
      setIsSubmitting(true);
      if (mode === "login") {
        await login(email, password);
      } else {
        await register(email, password);
      }
    } catch (submissionError) {
      const message =
        submissionError instanceof Error ? submissionError.message : "Authentication failed";
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="card">
      <header className="mb-5">
        <p className="badge">AI Doc Assistant</p>
        <h1 className="mt-3 text-2xl font-bold text-foreground">
          {mode === "login" ? "Login" : "Register"}
        </h1>
        <p className="hint">Use email + password to create a JWT session.</p>
      </header>

      <form className="grid gap-4" onSubmit={handleSubmit}>
        <label className="field">
          <span>Email</span>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
          />
        </label>

        <label className="field">
          <span>Password</span>
          <input
            type="password"
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Minimum 8 characters"
          />
        </label>

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting
            ? "Please wait..."
            : mode === "login"
              ? "Login"
              : "Create Account"}
        </button>
      </form>

      <p className="switchText">
        {mode === "login" ? "New user?" : "Already have an account?"}{" "}
        <button
          className="linkButton"
          type="button"
          onClick={() => setMode(mode === "login" ? "register" : "login")}
        >
          {mode === "login" ? "Register here" : "Login here"}
        </button>
      </p>

      {error ? <p className="error">{error}</p> : null}
    </section>
  );
}
