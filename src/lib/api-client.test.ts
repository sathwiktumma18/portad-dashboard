import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  FALLBACK_ENTRIES,
  fetchCapabilities,
  fetchWithTimeout,
} from "./api-client";

describe("api-client", () => {
  const originalFetch = globalThis.fetch;

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  describe("fetchWithTimeout", () => {
    it("returns parsed json data when request succeeds", async () => {
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => ({ status: "ok", count: 42 }),
      });

      const res = await fetchWithTimeout("https://api.example.com/test");
      expect(res.ok).toBe(true);
      if (res.ok) {
        expect(res.data).toEqual({ status: "ok", count: 42 });
      }
    });

    it("returns http error when response is not ok (404/500)", async () => {
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 404,
        statusText: "Not Found",
      });

      const res = await fetchWithTimeout("https://api.example.com/test");
      expect(res.ok).toBe(false);
      if (!res.ok) {
        expect(res.error.kind).toBe("http");
        expect(res.error.statusCode).toBe(404);
        expect(res.error.message).toContain("404");
      }
    });

    it("returns malformed error when response is not valid json", async () => {
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => {
          throw new SyntaxError("Unexpected token < in JSON");
        },
      });

      const res = await fetchWithTimeout("https://api.example.com/test");
      expect(res.ok).toBe(false);
      if (!res.ok) {
        expect(res.error.kind).toBe("malformed");
        expect(res.error.message).toContain("invalid or unparseable JSON");
      }
    });

    it("returns timeout error when AbortError is raised", async () => {
      const abortError = new Error("The operation was aborted");
      abortError.name = "AbortError";
      globalThis.fetch = vi.fn().mockRejectedValue(abortError);

      const res = await fetchWithTimeout("https://api.example.com/test", {}, 10);
      expect(res.ok).toBe(false);
      if (!res.ok) {
        expect(res.error.kind).toBe("timeout");
        expect(res.error.message).toContain("timed out");
      }
    });

    it("preserves timeout error when AbortError occurs while reading response json body", async () => {
      const abortError = new Error("The operation was aborted");
      abortError.name = "AbortError";

      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => {
          throw abortError;
        },
      });

      const res = await fetchWithTimeout("https://api.example.com/test", {}, 10);
      expect(res.ok).toBe(false);
      if (!res.ok) {
        expect(res.error.kind).toBe("timeout");
        expect(res.error.message).toContain("timed out");
      }
    });

    it("preserves timeout error when request abort signal is set while reading response json body", async () => {
      const callerController = new AbortController();

      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => {
          callerController.abort();
          throw new SyntaxError("Unexpected end of JSON input");
        },
      });

      const res = await fetchWithTimeout(
        "https://api.example.com/test",
        { signal: callerController.signal },
        5000,
      );
      expect(res.ok).toBe(false);
      if (!res.ok) {
        expect(res.error.kind).toBe("timeout");
        expect(res.error.message).toContain("timed out");
      }
    });

    it("returns network error when fetch throws network failure", async () => {
      globalThis.fetch = vi.fn().mockRejectedValue(new TypeError("Failed to fetch"));

      const res = await fetchWithTimeout("https://api.example.com/test");
      expect(res.ok).toBe(false);
      if (!res.ok) {
        expect(res.error.kind).toBe("network");
        expect(res.error.message).toContain("Failed to fetch");
      }
    });
  });

  describe("fetchCapabilities", () => {
    it("returns parsed capabilities from API when payload is valid", async () => {
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => ({
          status: "ok",
          adapters: [
            {
              id: "jira",
              name: "Jira",
              direction: "source",
              status: "Supported",
              description: "Issues and epics",
            },
            {
              id: "linear",
              name: "Linear",
              direction: "target",
              status: "Supported",
              description: "Issues and cycles",
            },
          ],
        }),
      });

      const res = await fetchCapabilities();
      expect(res.isFallback).toBe(false);
      expect(res.error).toBeNull();
      expect(res.data.length).toBe(2);
      expect(res.data[0].name).toBe("Jira");
      expect(res.data[0].kind).toBe("source");
      expect(res.data[1].name).toBe("Linear");
      expect(res.data[1].kind).toBe("target");
    });

    it("falls back to bundled entries when API returns non-200", async () => {
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 503,
        statusText: "Service Unavailable",
      });

      const res = await fetchCapabilities();
      expect(res.isFallback).toBe(true);
      expect(res.error?.kind).toBe("http");
      expect(res.data).toEqual(FALLBACK_ENTRIES);
    });

    it("falls back to bundled entries when payload is missing adapters array", async () => {
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => ({ status: "ok" }),
      });

      const res = await fetchCapabilities();
      expect(res.isFallback).toBe(true);
      expect(res.error?.kind).toBe("malformed");
      expect(res.data).toEqual(FALLBACK_ENTRIES);
    });

    it("falls back to bundled entries when adapters array contains malformed or null items", async () => {
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => ({
          status: "ok",
          adapters: [null, undefined, "invalid-adapter"],
        }),
      });

      const res = await fetchCapabilities();
      expect(res.isFallback).toBe(true);
      expect(res.error?.kind).toBe("malformed");
      expect(res.error?.message).toContain("malformed");
      expect(res.data).toEqual(FALLBACK_ENTRIES);
    });

    it("falls back to bundled entries when adapters array contains arrays, empty objects, or non-string ids", async () => {
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => ({
          status: "ok",
          adapters: [[], {}, { id: 123, name: "Invalid" }],
        }),
      });

      const res = await fetchCapabilities();
      expect(res.isFallback).toBe(true);
      expect(res.error?.kind).toBe("malformed");
      expect(res.error?.message).toContain("malformed");
      expect(res.data).toEqual(FALLBACK_ENTRIES);
    });
  });
});
