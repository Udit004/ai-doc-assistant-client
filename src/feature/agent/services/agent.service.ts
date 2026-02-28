import { buildApiUrl } from "@/services/http";

// ── Event types ──────────────────────────────────────────────────────────────

export type PlanTask = { id: number; query: string };

export type PlanEventData = { iteration: number; tasks: PlanTask[] };
export type StepStartEventData = { iteration: number; task_id: number; query: string };
export type StepResultEventData = {
  iteration: number;
  task_id: number;
  query: string;
  answer: string;
  context: string[];
  failed: boolean;
};
export type EvalEventData = {
  iteration: number;
  score: number;
  completeness: number;
  accuracy: number;
  sufficient: boolean;
  gaps: string[];
};
export type FinalEventData = {
  answer: string;
  context: string[];
  iterations: number;
  final_score: number | null;
};
export type ErrorEventData = { message: string; run_id?: number };

export type AgentEvent =
  | { type: "plan"; data: PlanEventData }
  | { type: "step_start"; data: StepStartEventData }
  | { type: "step_result"; data: StepResultEventData }
  | { type: "eval"; data: EvalEventData }
  | { type: "final"; data: FinalEventData }
  | { type: "error"; data: ErrorEventData };

export type AgentEventHandler = (event: AgentEvent) => void;

// ── SSE streaming client ──────────────────────────────────────────────────────

export function streamAgentRun(
  goal: string,
  token: string,
  conversationId: number | undefined,
  onEvent: AgentEventHandler,
  onDone: () => void,
  onError: (message: string) => void,
): AbortController {
  const controller = new AbortController();
  const url = buildApiUrl("/api/v1/agent");

  (async () => {
    let response: Response;
    try {
      response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ goal, conversation_id: conversationId ?? null }),
        signal: controller.signal,
      });
    } catch (err) {
      if ((err as Error).name !== "AbortError") {
        onError((err as Error).message ?? "Network error");
      }
      onDone();
      return;
    }

    if (!response.ok) {
      let detail = `Request failed with status ${response.status}`;
      try {
        const json = await response.json();
        if (typeof json?.detail === "string") detail = json.detail;
      } catch { /* ignore */ }
      onError(detail);
      onDone();
      return;
    }

    const reader = response.body!.getReader();
    const decoder = new TextDecoder();
    let buffer = "";

    while (true) {
      let done: boolean;
      let value: Uint8Array | undefined;
      try {
        ({ done, value } = await reader.read());
      } catch { break; }
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const blocks = buffer.split("\n\n");
      buffer = blocks.pop() ?? "";

      for (const block of blocks) {
        const lines = block.trim().split("\n");
        let dataLine = "";
        for (const line of lines) {
          if (line.startsWith("data:")) {
            dataLine = line.slice("data:".length).trim();
          }
        }
        if (!dataLine) continue;
        try {
          const parsed = JSON.parse(dataLine) as AgentEvent;
          onEvent(parsed);
        } catch { /* skip malformed */ }
      }
    }

    onDone();
  })();

  return controller;
}

// ── Run history ──────────────────────────────────────────────────────────────

export type AgentRunSummary = {
  id: number;
  goal: string;
  status: string;
  iterations: number;
  eval_score: number | null;
  created_at: string;
  completed_at: string | null;
};

export async function fetchAgentRuns(token: string): Promise<AgentRunSummary[]> {
  const url = buildApiUrl("/api/v1/agent");
  const resp = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!resp.ok) throw new Error(`Failed to fetch runs: ${resp.status}`);
  return resp.json() as Promise<AgentRunSummary[]>;
}
