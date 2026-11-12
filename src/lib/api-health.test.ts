import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  friendlyApiError,
  probeApiHealth,
  resetApiHealthForTests,
} from "./api-health";

describe("friendlyApiError", () => {
  it("returns a clear message when the API is unavailable", () => {
    expect(friendlyApiError()).toBe(
      "The API is temporarily unavailable. Please try again later.",
    );
  });

  it("does not expose technical error details", () => {
    const message = friendlyApiError();

    expect(message).not.toContain("HTTP 500");
    expect(message).not.toContain("ECONNREFUSED");
    expect(message).not.toContain("Internal server error");
  });
});

describe("probeApiHealth", () => {
  const originalFetch = globalThis.fetch;

  beforeEach(() => {
    resetApiHealthForTests();
    vi.restoreAllMocks();
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
    resetApiHealthForTests();
  });

  it("reports online status with sanitized version on healthy response", async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ status: "ok", version: " 0.2.1 " }),
    });

    const state = await probeApiHealth();
    expect(state.kind).toBe("online");
    if (state.kind === "online") {
      expect(state.version).toBe("0.2.1");
      expect(state.latencyMs).toBeGreaterThanOrEqual(0);
    }
  });

  it("falls back to version 'unknown' when version field is non-string or blank", async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ status: "ok", version: 123 }),
    });

    const state = await probeApiHealth();
    expect(state.kind).toBe("online");
    if (state.kind === "online") {
      expect(state.version).toBe("unknown");
    }
  });

  it("reports friendly offline detail on HTTP failure, null payload, or unexpected status", async () => {
    globalThis.fetch = vi
      .fn()
      .mockResolvedValueOnce({ ok: false, status: 503 })
      .mockResolvedValueOnce({ ok: true, status: 200, json: async () => null })
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({ status: "degraded" }),
      });

    for (let i = 0; i < 3; i++) {
      const state = await probeApiHealth();
      expect(state.kind).toBe("offline");
      if (state.kind === "offline") {
        expect(state.detail).toBe(friendlyApiError());
      }
    }
  });

  it("aborts hanging health checks on timeout and recovers on next probe", async () => {
    globalThis.fetch = vi
      .fn()
      .mockImplementationOnce(
        (_input, init?: RequestInit) =>
          new Promise((_, reject) => {
            init?.signal?.addEventListener("abort", () => {
              const err = new Error("Aborted");
              err.name = "AbortError";
              reject(err);
            });
          }),
      )
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({ status: "ok", version: "0.2.1" }),
      });

    const timedOut = await probeApiHealth(15);
    expect(timedOut.kind).toBe("offline");

    const recovered = await probeApiHealth();
    expect(recovered.kind).toBe("online");
  });
});