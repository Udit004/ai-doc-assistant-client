"use client";

import { FormEvent, useRef, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import {
  AgentEvent,
  EvalEventData,
  FinalEventData,
  PlanTask,
  StepResultEventData,
  streamAgentRun,
} from "../services/agent.service";

// ── Internal types ───────────────────────────────────────────────────────────

type TaskState = PlanTask & { done: boolean; failed: boolean };
type StepDetail = {
  taskId: number;
  iteration: number;
  query: string;
  answer: string;
  context: string[];
  failed: boolean;
};
type Phase =
  | "idle"
  | "planning"
  | "executing"
  | "evaluating"
  | "looping"
  | "synthesizing"
  | "done"
  | "error";

function phaseLabel(phase: Phase): string {
  const map: Record<Phase, string> = {
    idle: "",
    planning: "Planning…",
    executing: "Executing…",
    evaluating: "Evaluating…",
    looping: "Refining…",
    synthesizing: "Synthesizing…",
    done: "Done",
    error: "Error",
  };
  return map[phase];
}

function scoreColor(score: number): string {
  if (score >= 8) return "text-primary";
  if (score >= 5) return "text-yellow-600";
  return "text-danger";
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function AgentPanel() {
  const { token } = useAuth();
  const [goal, setGoal] = useState("");
  const [phase, setPhase] = useState<Phase>("idle");
  const [iteration, setIteration] = useState(0);
  const [tasks, setTasks] = useState<TaskState[]>([]);
  const [steps, setSteps] = useState<StepDetail[]>([]);
  const [evals, setEvals] = useState<EvalEventData[]>([]);
  const [finalData, setFinalData] = useState<FinalEventData | null>(null);
  const [error, setError] = useState("");
  const abortRef = useRef<AbortController | null>(null);

  function handleAgentEvent(event: AgentEvent) {
    switch (event.type) {
      case "plan": {
        setIteration(event.data.iteration);
        setPhase(event.data.iteration === 1 ? "planning" : "looping");
        const newTasks: TaskState[] = event.data.tasks.map((t) => ({
          ...t,
          done: false,
          failed: false,
        }));
        setTasks((prev) =>
          event.data.iteration === 1 ? newTasks : [...prev, ...newTasks],
        );
        break;
      }
      case "step_start":
        setPhase("executing");
        break;
      case "step_result": {
        const d = event.data as StepResultEventData;
        setSteps((prev) => [
          ...prev,
          { taskId: d.task_id, iteration: d.iteration, query: d.query, answer: d.answer, context: d.context, failed: d.failed },
        ]);
        setTasks((prev) =>
          prev.map((t) => (t.id === d.task_id && !t.done ? { ...t, done: true, failed: d.failed } : t)),
        );
        break;
      }
      case "eval":
        setPhase("evaluating");
        setEvals((prev) => [...prev, event.data as EvalEventData]);
        break;
      case "final":
        setPhase("synthesizing");
        setFinalData(event.data as FinalEventData);
        break;
      case "error":
        setError(event.data.message ?? "An unknown error occurred");
        setPhase("error");
        break;
    }
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const trimmed = goal.trim();
    if (!trimmed || !token) return;

    setPhase("planning");
    setIteration(0);
    setTasks([]);
    setSteps([]);
    setEvals([]);
    setFinalData(null);
    setError("");

    abortRef.current = streamAgentRun(
      trimmed,
      token,
      undefined,
      handleAgentEvent,
      () => setPhase((p) => (p !== "error" ? "done" : p)),
      (msg) => { setError(msg); setPhase("error"); },
    );
  }

  function handleStop() {
    abortRef.current?.abort();
    setPhase("done");
  }

  function handleReset() {
    abortRef.current?.abort();
    setGoal("");
    setPhase("idle");
    setIteration(0);
    setTasks([]);
    setSteps([]);
    setEvals([]);
    setFinalData(null);
    setError("");
  }

  const isRunning = phase !== "idle" && phase !== "done" && phase !== "error";
  const lastEval = evals[evals.length - 1] ?? null;

  return (
    <section className="card">
      {/* Header */}
      <header className="flex items-start justify-between mb-5">
        <div>
          <p className="badge">Goal Agent</p>
          <h1 className="mt-3 text-2xl font-bold text-foreground">Document Goal Agent</h1>
          <p className="hint">
            Describe a complex goal. The agent decomposes it, retrieves evidence, evaluates its own
            answers, and synthesizes a final response.
          </p>
        </div>
        <div className="flex gap-2 shrink-0">
          {isRunning && (
            <button type="button" className="secondaryButton" onClick={handleStop}>
              Stop
            </button>
          )}
          <button type="button" className="secondaryButton" onClick={handleReset}>
            Reset
          </button>
        </div>
      </header>

      {/* Goal Input */}
      <form className="flex gap-3 mt-4" onSubmit={handleSubmit}>
        <input
          type="text"
          className="flex-1 px-3 py-2.5 border border-line rounded-lg bg-white text-foreground outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-200 transition-shadow text-sm disabled:opacity-60"
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
          placeholder="e.g. Explain how authentication, chunking and retrieval work together..."
          disabled={isRunning}
        />
        <button type="submit" disabled={isRunning || !goal.trim()}>
          {isRunning ? phaseLabel(phase) : "Run Agent"}
        </button>
      </form>

      {/* Phase indicator */}
      {isRunning && (
        <p className="hint mt-3">
          <span className="text-primary font-semibold">{phaseLabel(phase)}</span>
          {iteration > 0 && ` — iteration ${iteration}`}
        </p>
      )}

      {/* Plan: task checklist */}
      {tasks.length > 0 && (
        <div className="mt-5">
          <p className="badge mb-3">Plan</p>
          <ul className="grid gap-2">
            {tasks.map((t, idx) => (
              <li key={`task-${idx}`} className="flex items-center gap-3 text-sm">
                <span className="text-base">
                  {t.failed ? "✗" : t.done ? "✓" : "○"}
                </span>
                <span
                  className={
                    t.failed ? "text-danger" : t.done ? "text-primary" : "text-foreground"
                  }
                >
                  {t.query}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Step results */}
      {steps.length > 0 && (
        <div className="mt-5 grid gap-4">
          <p className="badge">Sub-answers</p>
          {steps.map((s, idx) => (
            <article
              key={`step-${idx}`}
              className={`rounded-xl p-4 bg-card border border-line ${s.failed ? "opacity-55" : ""}`}
            >
              <p className="text-xs font-semibold text-muted mb-1">
                {s.failed ? "Failed" : `Step ${idx + 1}`} — iter {s.iteration}
              </p>
              <p className="font-semibold text-sm mb-2">{s.query}</p>
              <p className="text-sm text-foreground">{s.answer}</p>
              {s.context.length > 0 && (
                <details className="mt-3 border-t border-dashed border-line pt-2 text-xs">
                  <summary className="cursor-pointer font-semibold text-primary hover:underline">
                    Retrieved context ({s.context.length})
                  </summary>
                  <ul className="mt-2 pl-4 space-y-1 text-muted">
                    {s.context.map((c, ci) => (
                      <li key={ci}>[{ci + 1}] {c}</li>
                    ))}
                  </ul>
                </details>
              )}
            </article>
          ))}
        </div>
      )}

      {/* Evaluation badges */}
      {evals.length > 0 && (
        <div className="mt-5">
          <p className="badge mb-3">Self-evaluation</p>
          {evals.map((ev, idx) => (
            <div
              key={`eval-${idx}`}
              className="border border-line rounded-xl px-4 py-3 mb-3 text-sm flex flex-wrap gap-x-4 gap-y-1"
            >
              <span>
                <strong>Iteration {ev.iteration}</strong>
              </span>
              <span>
                Score:{" "}
                <strong className={scoreColor(ev.score)}>{ev.score}/10</strong>
              </span>
              <span>Completeness: {ev.completeness}/5</span>
              <span>Accuracy: {ev.accuracy}/5</span>
              <span className={ev.sufficient ? "text-primary" : "text-danger"}>
                {ev.sufficient ? "✓ Sufficient" : "↻ Looping"}
              </span>
              {ev.gaps.length > 0 && (
                <p className="w-full text-xs text-muted mt-1">Gaps: {ev.gaps.join(" · ")}</p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Final answer */}
      {finalData && (
        <article className="mt-5 rounded-xl p-4 bg-card border border-line">
          <p className="text-xs font-semibold text-muted mb-2">
            Final Answer
            {finalData.final_score != null && (
              <span className={`ml-2 ${scoreColor(finalData.final_score)}`}>
                · Score {finalData.final_score}/10
              </span>
            )}
            <span className="ml-2 text-muted">
              · {finalData.iterations} iteration{finalData.iterations !== 1 ? "s" : ""}
            </span>
          </p>
          <p className="text-sm whitespace-pre-wrap text-foreground">{finalData.answer}</p>
          {finalData.context.length > 0 && (
            <details className="mt-3 border-t border-dashed border-line pt-2 text-xs">
              <summary className="cursor-pointer font-semibold text-primary hover:underline">
                All retrieved chunks ({finalData.context.length})
              </summary>
              <ul className="mt-2 pl-4 space-y-1 text-muted">
                {finalData.context.map((c, ci) => (
                  <li key={ci}>[{ci + 1}] {c}</li>
                ))}
              </ul>
            </details>
          )}
        </article>
      )}

      {/* Summary eval */}
      {lastEval && phase === "done" && (
        <p className="hint mt-3 text-center">
          Final score:{" "}
          <span className={`font-bold ${scoreColor(lastEval.score)}`}>{lastEval.score}/10</span>
        </p>
      )}

      {error && <p className="error mt-4">{error}</p>}

      <div className="navActions">
        <Link href="/" className="navLinkButton">Back to Upload</Link>
      </div>
    </section>
  );
}
