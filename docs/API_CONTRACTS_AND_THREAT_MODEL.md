# Dashboard-to-Core API Contracts, Error Handling & Threat Model

**Document Version:** 1.0.0  
**Associated Sprint:** [Sprint 1] Contracts, errors, and threat model (Issue #29)  
**Related Cross-Repo Issues:** [PortaD Core Issue #5](https://github.com/IndianjobsTech/PortaD/issues/5), [PortaD Core Issue #6](https://github.com/IndianjobsTech/PortaD/issues/6)  
**Author:** @sathwiktumma18

---

## 1. Executive Summary

This specification establishes the communication contracts, data validation models, user-visible failure states, and security threat model between **`portad-dashboard`** (Next.js frontend) and **`PortaD`** (Python/FastAPI core engine). It guarantees predictable behavior during network disruptions, air-gapped operations, malformed responses, and unauthorized requests.

---

## 2. API Contract Specifications

All API routes are served from the configured core base URL (`NEXT_PUBLIC_API_URL` or default `https://portad-production.up.railway.app`).

### 2.1 Health Check (`GET /healthz`)
- **Purpose:** Heartbeat and latency tracking for connection health.
- **Request:** No parameters or authorization headers required.
- **Success Response (200 OK):**
  ```json
  {
    "status": "ok",
    "version": "0.1.0"
  }
  ```
- **Client Contract:** `src/lib/api-health.ts` probes `/healthz` on a 30s interval with deduplication, computing latency in milliseconds.

### 2.2 Capabilities Catalog (`GET /api/v1/capabilities`)
- **Purpose:** Enumerates active and planned platform adapters and their supported feature set.
- **Success Response (200 OK):**
  ```json
  {
    "status": "ok",
    "adapters": [
      {
        "id": "notion",
        "name": "Notion",
        "direction": "both",
        "status": "Supported",
        "description": "Pages, databases, records, attachments, relations",
        "supported_features": ["pages", "databases", "records", "attachments"]
      },
      {
        "id": "huly",
        "name": "Huly",
        "direction": "target",
        "status": "Supported",
        "description": "Unified Import Format workspace",
        "supported_features": ["projects", "tasks", "documents"]
      }
    ]
  }
  ```
- **Client Contract:** `src/lib/api-client.ts` (`fetchCapabilities`) validates the schema, normalizes entries into direction-specific capabilities, and falls back to `FALLBACK_ENTRIES` if offline or malformed.

### 2.3 Source-Target Compatibility Matrix (`GET /api/v1/compatibility`)
- **Purpose:** Exposes point-to-point migration compatibility, fidelity expectations, and transformation notes.
- **Success Response (200 OK):**
  ```json
  {
    "status": "ok",
    "matrix": [
      {
        "source": "notion",
        "target": "huly",
        "status": "Supported",
        "fidelity": "high",
        "detail": "Pages, databases, records to Unified Import Format workspace"
      }
    ]
  }
  ```

---

## 3. Error Taxonomy & User-Visible States

The dashboard categorizes all API failure modes into 5 predictable, user-visible states:

| Error Kind | Technical Cause | Dashboard Behavior & UI Presentation | Fallback Action |
| :--- | :--- | :--- | :--- |
| **Loading** | Request in-flight (0–5000ms) | Displays animated skeleton / accessible `"Checking…"` label. | None (wait for resolve). |
| **Timeout** | Network exceeds 5000ms timeout | AbortController aborts fetch; sets error indicator. | Activates offline cached catalog; logs diagnostic warning. |
| **Network (Offline)** | DNS failure, server unreachable, CORS | Displays `"○ Offline Catalog"` badge in matrix header. | Retains cached data; does not crash or block navigation. |
| **HTTP 4xx / 5xx** | Server error or missing endpoint | Shows descriptive friendly error with status code. | Falls back to offline catalog; suggests retrying later. |
| **Malformed Payload** | Response body is invalid JSON or wrong schema | Catches parse exception; classifies as `"malformed"`. | Reverts to bundled schema-safe fallback catalog. |

---

## 4. Threat Model & Security Posture

### 4.1 Trust Boundaries
1. **Client Browser Boundary:**
   - Untrusted execution environment.
   - Code running in the user's browser must never possess sensitive master keys, production database credentials, or unrestricted API service tokens.
2. **Dashboard-to-Core Communication Boundary:**
   - Communication occurs via HTTPS with TLS 1.3 encryption.
   - Inputs sent to backend endpoints (such as uploaded `.portad` archives) are validated client-side for size and format, but must always be re-validated and sanitized server-side.
3. **Authentication Boundary:**
   - Firebase Client Auth (`src/lib/auth.ts`) manages authentication state.
   - Tokens are forwarded in `Authorization: Bearer <token>` headers to protected backend endpoints when required.

### 4.2 Handling of Secrets, Tokens, and Sensitive Configuration
- **No Secrets in Bundles:** `NEXT_PUBLIC_*` environment variables are strictly limited to public hostnames and Firebase client configuration. No backend API keys or database secrets are included.
- **No Sensitive Local Storage:** User passwords, OAuth client secrets, and full migration payload contents are never persisted to `localStorage` or `sessionStorage`.
- **Log Sanitization:** Sensitive identifiers, bearer tokens, and customer workspace documents are stripped before any telemetry or error logging occurs.

### 4.3 Package & Input Hardening
- **MIME & Extension Enforcement:** Migration Wizard Step 2 enforces strict client-side validation (`.portad`, `.zip`).
- **File Size Guardrails:** Packages exceeding 250 MB trigger explicit warning banners to prevent browser memory exhaustion prior to upload.
- **Path Traversal Mitigation:** Filenames are sanitized, preventing `../` path injection during archive parsing.

---

## 5. Verification & Test Evidence

All contracts, fallback states, and security error models are covered by automated unit tests:
- `src/lib/api-client.test.ts`: 8 unit tests covering 200 OK, 404/500 HTTP errors, JSON parse failures, AbortError timeouts, network failures, and fallback recovery.
- `src/app/compatibility/matrix.test.tsx`: 5 integration tests verifying offline indicators, live Core API connection, search filtering, empty states, and status filters.
- **Test Suite Status:** 68/68 passing tests.
