"use client";

import { useSyncExternalStore } from "react";

import { API_URL } from "@/lib/config";

export type ApiHealth =
  | { kind: "checking" }
  | { kind: "online"; version: string; latencyMs: number }
  | { kind: "offline"; detail: string };

const POLL_INTERVAL = 30_000;

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
    void probe();
    timer = setInterval(() => void probe(), POLL_INTERVAL);
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

async function probe() {
  if (requestInProgress) return;

  requestInProgress = true;
  const started = performance.now();

  try {
    const response = await fetch(`${API_URL}/healthz`, {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const body = (await response.json()) as {
      status?: string;
      version?: string;
    };

    if (body.status !== "ok") {
      throw new Error("Unexpected health response");
    }

    snapshot = {
      kind: "online",
      version: body.version ?? "unknown",
      latencyMs: Math.round(performance.now() - started),
    };
  } catch (error) {
    snapshot = {
      kind: "offline",
      detail: error instanceof Error ? error.message : "Unknown error",
    };
  } finally {
    requestInProgress = false;
    lastCheckedAt = Date.now();
    emit();
  }
}

export function useApiHealth(): ApiHealth {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export function getApiHealthLastCheckedAt() {
  return lastCheckedAt;
}