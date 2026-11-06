import { API_URL } from "@/lib/config";

/**
 * Formal API contracts and data models for PortaD dashboard-to-core communication.
 * Ref: Sprint 1 (Issue #29) & Core Contracts (Core Issue #5).
 */

export type AdapterKind = "source" | "target";
export type AdapterStatus = "Supported" | "Planned";

export interface AdapterCapability {
  id: string;
  name: string;
  kind: AdapterKind;
  status: AdapterStatus;
  detail: string;
}

export interface CompatibilityPair {
  source: string;
  target: string;
  status: AdapterStatus;
  fidelity?: "high" | "medium" | "low";
  detail?: string;
}

export type ApiErrorKind =
  | "network"
  | "timeout"
  | "http"
  | "malformed"
  | "unknown";

export interface ApiError {
  kind: ApiErrorKind;
  message: string;
  statusCode?: number;
}

export interface ApiResult<T> {
  data: T;
  error: ApiError | null;
  isFallback: boolean;
}

/**
 * Standard offline fallback entries guaranteeing UI operational continuity
 * when core API service is unreachable or during air-gapped deployments.
 */
export const FALLBACK_ENTRIES: AdapterCapability[] = [
  {
    id: "notion-source",
    name: "Notion",
    status: "Supported",
    detail: "Pages, databases, records, attachments, relations",
    kind: "source",
  },
  {
    id: "fixtures-source",
    name: "Fixtures demo",
    status: "Supported",
    detail: "Synthetic workspace for tests and demos",
    kind: "source",
  },
  {
    id: "trello-source",
    name: "Trello",
    status: "Planned",
    detail: "Milestone 0.3",
    kind: "source",
  },
  {
    id: "clickup-source",
    name: "ClickUp",
    status: "Planned",
    detail: "Milestone 0.4",
    kind: "source",
  },
  {
    id: "asana-source",
    name: "Asana",
    status: "Planned",
    detail: "Milestone 0.4",
    kind: "source",
  },
  {
    id: "huly-target",
    name: "Huly",
    status: "Supported",
    detail: "Unified Import Format workspace",
    kind: "target",
  },
  {
    id: "notion-target",
    name: "Notion",
    status: "Planned",
    detail: "Round-trip import",
    kind: "target",
  },
];

/**
 * Fetch wrapper with timeout and standardized error classification.
 */
export async function fetchWithTimeout(
  url: string,
  options: RequestInit = {},
  timeoutMs: number = 5000,
): Promise<{ ok: true; data: unknown } | { ok: false; error: ApiError }> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });

    if (!response.ok) {
      return {
        ok: false,
        error: {
          kind: "http",
          message: `Request failed with status ${response.status} (${response.statusText || "HTTP Error"})`,
          statusCode: response.status,
        },
      };
    }

    try {
      const data = await response.json();
      return { ok: true, data };
    } catch {
      return {
        ok: false,
        error: {
          kind: "malformed",
          message: "API returned an invalid or unparseable JSON payload.",
        },
      };
    }
  } catch (err: unknown) {
    if (err instanceof Error) {
      if (err.name === "AbortError") {
        return {
          ok: false,
          error: {
            kind: "timeout",
            message: `Request timed out after ${timeoutMs}ms.`,
          },
        };
      }
      return {
        ok: false,
        error: {
          kind: "network",
          message: err.message || "Network connection failed.",
        },
      };
    }
    return {
      ok: false,
      error: {
        kind: "unknown",
        message: "An unknown network error occurred.",
      },
    };
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Fetches dynamic platform adapter capabilities from PortaD core API.
 * Gracefully falls back to bundled catalog if network or server fails.
 */
export async function fetchCapabilities(): Promise<ApiResult<AdapterCapability[]>> {
  const result = await fetchWithTimeout(`${API_URL}/api/v1/capabilities`);

  if (!result.ok) {
    return {
      data: FALLBACK_ENTRIES,
      error: result.error,
      isFallback: true,
    };
  }

  // Validate response schema
  const payload = result.data as {
    status?: string;
    adapters?: Array<{
      id?: string;
      name?: string;
      direction?: "source" | "target" | "both";
      status?: "Supported" | "Planned";
      description?: string;
      supported_features?: string[];
    }>;
  };

  if (!payload || !Array.isArray(payload.adapters)) {
    return {
      data: FALLBACK_ENTRIES,
      error: {
        kind: "malformed",
        message: "Response missing expected 'adapters' list.",
      },
      isFallback: true,
    };
  }

  const entries: AdapterCapability[] = [];
  for (const a of payload.adapters) {
    const name = a.name || a.id || "Unknown";
    const status: AdapterStatus = a.status === "Supported" ? "Supported" : "Planned";
    const detail = a.description || (a.supported_features ? a.supported_features.join(", ") : "");
    const direction = a.direction || "both";

    if (direction === "source" || direction === "both") {
      entries.push({
        id: `${a.id || name.toLowerCase()}-source`,
        name,
        kind: "source",
        status,
        detail,
      });
    }
    if (direction === "target" || direction === "both") {
      entries.push({
        id: `${a.id || name.toLowerCase()}-target`,
        name,
        kind: "target",
        status,
        detail,
      });
    }
  }

  return {
    data: entries.length > 0 ? entries : FALLBACK_ENTRIES,
    error: null,
    isFallback: entries.length === 0,
  };
}
