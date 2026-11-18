# Dashboard Known Limitations and Boundary Guarantees

This document records the current functional boundaries and intentional limitations of `portad-dashboard` (Sprint 2 hardening, tracking [Issue #30](https://github.com/IndianjobsTech/portad-dashboard/issues/30)).

## 1. Migration Package Validation (`/migrate`)
- **What the dashboard validates today:**
  - Rejects unsupported file extensions (only `.portad` and `.zip` are accepted).
  - Rejects empty (`0`-byte) files so empty files cannot advance as valid packages.
  - Displays a size warning above `250 MB` recommending local CLI execution.
  - Requires explicit confirmation before discarding an in-progress migration configuration.
- **Remaining limitation:**
  - Validation inspects file metadata (`name` and `size`) client-side only. It does **not** extract archive contents, check inner manifest schemas, or verify SHA-256 digests in the browser.
  - Authoritative package integrity verification stays in `PortaD` core (`portad verify`) and is tracked under [Core Issue #7](https://github.com/IndianjobsTech/PortaD/issues/7).

## 2. Hosted Execution & Job Reconciliation (`/migrate` & `/jobs`)
- **What is enforced today:**
  - `Run hosted migration` remains disabled in Step 4, and `/jobs` displays an empty state pointing to `portad jobs list`.
- **Remaining limitation:**
  - Background execution, server-side retries, throttling recovery, and checkpoint reconciliation are not active in the static dashboard yet. These rely on backend core contracts tracked in [Core Issue #8](https://github.com/IndianjobsTech/PortaD/issues/8) and [Core Issue #9](https://github.com/IndianjobsTech/PortaD/issues/9).

## 3. Authentication & Preview Mode (`/account`)
- **What is enforced today:**
  - Validates email format, non-empty credentials, maximum lengths (`254` email / `128` password), and minimum signup password length (`6` characters) client-side before invoking Firebase.
  - Falls back safely if browser `localStorage` or the clipboard API is unavailable or restricted.
  - Uses explicit sign-out state locking to prevent duplicate submissions.
- **Remaining limitation:**
  - Preview sessions (`preview@portad.local`) exist solely in the local browser, issue no Bearer token, and cannot authorize live API calls.
  - Live authentication depends on configured `NEXT_PUBLIC_FIREBASE_*` environment variables.

## 4. Core API Health Checks (`src/lib/api-health.ts`)
- **What is enforced today:**
  - Health checks enforce a bounded `5000 ms` `AbortController` timeout and reject `null`/malformed payloads so a stalled backend cannot freeze polling state.
  - User-facing errors remain sanitized (`friendlyApiError()`) without exposing stack traces or internal URLs.
- **Remaining limitation:**
  - Live dynamic capability fetching requires a reachable `PortaD` API endpoint (`/api/v1/capabilities`); otherwise, `/compatibility` renders the offline fallback catalog (`FALLBACK_ENTRIES`).
