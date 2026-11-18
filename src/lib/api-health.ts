"use client";
import { useSyncExternalStore } from "react";
import { API_URL } from "@/lib/config";
export type ApiHealth =
  | { kind: "checking" }
  | { kind: "online"; version: string; latencyMs: number }
  | { kind: "offline"; detail: string };
export function friendlyApiError(): string {
  return "The API is temporarily unavailable. Please try again later.";
}
const POLL_INTERVAL = 30_000;
const PROBE_TIMEOUT_MS = 5_000;
const SERVER_SNAPSHOT: ApiHealth = { kind: "checking" };
let snapshot: ApiHealth = SERVER_SNAPSHOT;
let requestInProgress = false;
let timer: ReturnType<typeof setInterval> | undefined;
let lastCheckedAt = 0;
const listeners = new Set<() => void>();
function emit() {
  listeners.forEach((listener) => listener());
}
function subscribe(listener: () => void) {
  listeners.add(listener);
  if (listeners.size === 1) {
    void probeApiHealth();
    timer = setInterval(() => void probeApiHealth(), POLL_INTERVAL);
  }
  return () => {
    listeners.delete(listener);

    if (listeners.size === 0 && timer) {
      clearInterval(timer);
      timer = undefined;
    }
  };
}
function getSnapshot(): ApiHealth {
  return snapshot;
}
function getServerSnapshot(): ApiHealth {
  return SERVER_SNAPSHOT;
}
export async function probeApiHealth(timeoutMs: number = PROBE_TIMEOUT_MS): Promise<ApiHealth> {
  if (requestInProgress) return snapshot;
  requestInProgress = true;
  const started = performance.now();
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(`${API_URL}/healthz`, {
      cache: "no-store",
      signal: controller.signal,
    });
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    const body = (await response.json()) as {
      status?: unknown;
      version?: unknown;
    } | null;
    if (!body || typeof body !== "object" || body.status !== "ok") {
      throw new Error("Unexpected health response");
    }
    const version =
      typeof body.version === "string" && body.version.trim().length > 0
        ? body.version.trim()
        : "unknown";
    snapshot = {
      kind: "online",
      version,
      latencyMs: Math.max(0, Math.round(performance.now() - started)),
    };
  } catch {
    snapshot = {
      kind: "offline",
      detail: friendlyApiError(),
    };
  } finally {
    clearTimeout(timeoutId);
    requestInProgress = false;
    lastCheckedAt = Date.now();
    emit();
  }
  return snapshot;
}
export function useApiHealth(): ApiHealth {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
export function getApiHealthLastCheckedAt() {
  return lastCheckedAt;
}
export function resetApiHealthForTests(): void {
  if (timer) {
    clearInterval(timer);
    timer = undefined;
  }
  snapshot = SERVER_SNAPSHOT;
  requestInProgress = false;
  lastCheckedAt = 0;
  emit();
}