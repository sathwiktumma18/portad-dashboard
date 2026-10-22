"use client";

import { API_URL } from "@/lib/config";
import { useApiHealth } from "@/lib/api-health";

export default function ApiStatus({
  compact = false,
}: {
  compact?: boolean;
}) {
  const state = useApiHealth();

  const dot =
    state.kind === "online"
      ? "bg-emerald-400"
      : state.kind === "offline"
        ? "bg-rose-400"
        : "bg-amber-400 animate-pulse-dot";

  const label =
    state.kind === "checking"
      ? "Checking API…"
      : state.kind === "online"
        ? `API online · v${state.version}`
        : "API unreachable";

  const detail =
    state.kind === "online"
      ? `${state.latencyMs} ms`
      : state.kind === "offline"
        ? state.detail
        : "…";

  if (compact) {
    return (
      <span
        className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[11px] text-frost-400"
        title={API_URL}
        role="status"
        aria-live="polite"
      >
        <span aria-hidden="true" className={`h-1.5 w-1.5 rounded-full ${dot}`} />
        <span className="font-mono">{label}</span>
      </span>
    );
  }

  return (
    <div
      className="glass inline-flex items-center gap-3 rounded-full px-4 py-2.5 text-sm"
      title={API_URL}
      role="status"
      aria-live="polite"
    >
      <span aria-hidden="true" className={`h-2 w-2 rounded-full ${dot}`} />
      <span className="font-medium text-frost-100">{label}</span>
      <span className="font-mono text-xs text-frost-500">{detail}</span>
    </div>
  );
}