# Sprint 3 — End-to-End Pilot Scenario and Dashboard-Core Reconciliation

**Sprint window:** 12–18 November 2026  
**Tracking issue:** [IndianjobsTech/portad-dashboard#31](https://github.com/IndianjobsTech/portad-dashboard/issues/31)  
**Core coordination:** [IndianjobsTech/PortaD#9](https://github.com/IndianjobsTech/PortaD/issues/9)  
**PR Scope:** Pilot validation, end-to-end user workflow verification, and known mismatch reporting.

---

## 1. Scope & Objectives

This document and the companion Playwright suite (`tests/e2e/pilot-reconciliation.spec.ts`) validate the end-to-end user journey across the PortaD Dashboard against actual `portad 0.1.0 (spec 0.1)` CLI behaviors.

Rather than masking divergence between the web UI and backend engine, this sprint:
1. Exercises the primary migration and configuration workflows using real package fixtures (`tests/fixtures/minimal.portad`).
2. Clearly delineates the **current verified state** (what the dashboard honestly executes and displays today) from the **future target behavior** (what is planned once hosted services and reconciled APIs land).
3. Explicitly catalogs every observed mismatch with an owner, tracking item, and target resolution.

---

## 2. Reproducible Pilot Scenario

### Scenario A — Happy Path (`Fixtures demo` / `Notion` → `Huly`)
- **Preconditions:** Dashboard running on `http://localhost:3000` (`npm run dev` or production build); hosted backend execution intentionally disabled.
- **Inputs:**
  - Source: `Fixtures demo` (or `Notion`)
  - Target: `Huly`
  - Package file: real minimal `.portad` ZIP archive (`tests/fixtures/minimal.portad` containing `manifest.json`, `workspace.json`, `checksums.json`).
- **Expected & Verified Outcomes (Dashboard):**
  1. **Step 1 (`Choose a source`):** Planned sources (`Trello`, `ClickUp`) remain disabled; `Next` unlocks only after selecting an active source.
  2. **Step 2 (`Choose a target`):** `Notion` round-trip target remains disabled; `Huly` unlocks `Next`.
  3. **Step 3 (`Attach a package`):** Selecting `minimal.portad` renders the package tree preview container (`preview · minimal.portad`) and enables `Continue`.
  4. **Step 4 (`Run the migration`):** `Run hosted migration` remains **disabled** with explicit notice `Hosted execution not enabled yet`, honestly displaying the terminal workflow (`portad export ...`, `portad transform ...`, `portad import ...`) without falsely claiming hosted execution succeeded.

### Scenario B — Failure & Recovery Paths
1. **Invalid Package Recovery (`/migrate`):**
   - Uploading an unsupported `.exe` file displays `role="alert"` (`Invalid file type...`) and disables `Continue`.
   - Replacing it with a valid `.portad` package fixture clears the alert, restores the preview container, and unlocks `Continue`.
2. **Compatibility Filtering & Empty State (`/compatibility`):**
   - Filtering by `Planned` shows `Trello` and `Asana` and hides `Huly`.
   - Searching for a non-existent query displays `role="status"` (`No platforms found...`).
3. **Jobs & Account Boundaries (`/jobs`, `/account`):**
   - `/jobs` displays `No jobs yet` and `portad jobs list` honestly.
   - `/account` rejects empty credentials (`Enter an email and password.`), allows browser-local preview sessions with explicit non-API warning, and resets cleanly on `Sign out`.

---

## 3. Current Verified State vs. Future Target Behavior

To maintain full transparency across the repository boundary, the table below highlights the operational boundaries between today's verified behavior and future targets:

| Area | Current Verified State (Sprint 3) | Future Target Behavior (Post-Sprint 3) |
| --- | --- | --- |
| **Package Upload (`/migrate` Step 3)** | Client checks file extension (`.portad`, `.zip`), rejects empty files, and renders a static preview schema for `minimal.portad`. | In-browser unzipping and client-side validation of `manifest.json` and `checksums.json` before upload. |
| **Execution Trigger (`/migrate` Step 4)** | Hosted button disabled with honest notice; CLI pipeline instructions rendered for local execution. | Hosted worker execution queue via backend REST API with job polling. |
| **Job Management (`/jobs`)** | Honest static empty state pointing users to CLI (`portad jobs list`) and new migrations. | Real-time SSE or polling job queue hooked to hosted worker execution runs. |
| **Account & Authentication (`/account`)** | Client-side input validation with browser-local preview session; no live user tokens transmitted. | Hosted authentication (OAuth/session tokens) against PortaD auth backend. |
| **Capabilities (`/compatibility`)** | Bundled static fallback catalog with live toggle checking `/api/v1/capabilities`. | Dynamic contract consumption aligned with Core's canonical `providers` registry. |

---

## 4. Dashboard ↔ Core Reconciliation & Known Mismatches

Per Sprint 3 exit criteria, all mismatches observed between `portad-dashboard` and `PortaD` core are cataloged below with explicit owners and tracking items:

| ID | Description | Severity | Current Status | Target Resolution | Explicit Owner / Tracking |
| --- | --- | --- | --- | --- | --- |
| **R-1** | **Capabilities API Schema Drift:** Core `GET /api/v1/capabilities` returns `{"providers": [...]}` with `status: "implemented" \| "planned"`, whereas Dashboard expects `{"adapters": [...]}` with `Supported` / `Planned`. | **High** | Blocked pending schema consensus. | Align dashboard `api-client.ts` to Core's canonical schema. | [Issue #72](https://github.com/IndianjobsTech/portad-dashboard/issues/72) (Owner: `@IndianjobsTech` / `@Dileep3015` / `@sathwiktumma18`) |
| **R-2** | **Provider Catalog Drift:** Dashboard lists `Fixtures demo` and `Notion` target, which do not exist in Core `REGISTRY`. `Asana` is listed in compatibility matrix but omitted in wizard. | **Medium** | Discrepancy documented. | Reconcile UI platform lists directly with Core's `REGISTRY`. | [Issue #72](https://github.com/IndianjobsTech/portad-dashboard/issues/72) (Owner: `@sathwiktumma18`) |
| **R-3** | **CLI Import Command Syntax:** Step 4 displays `portad import huly --resume`, but `portad import --help` requires positional `{target} {package}` arguments (`portad import huly <package> --resume`). | **Low** | Display copy discrepancy. | Update terminal copy in `src/app/migrate/page.tsx` to match canonical CLI invocation. | [Issue #31](https://github.com/IndianjobsTech/portad-dashboard/issues/31) (Owner: `@sathwiktumma18`) |
| **R-4** | **Hosted Execution & Live Pipeline:** Hosted migration trigger stays disabled on `/migrate` and `/jobs` stays empty; live Notion export remains CLI-only. | **High** | Deferred by design for Sprint 3. | Implement hosted worker API in Core and wire into Dashboard in Sprint 5. | [Core Issue #9](https://github.com/IndianjobsTech/PortaD/issues/9) (Owner: `@IndianjobsTech`) |

---

## 5. Verification Evidence

Run on branch `feat/sprint-3-e2e-reconciliation`:
- `npm test` — 81/81 unit & integration tests passing across 8 suites.
- `npm run lint` — 0 errors, 0 warnings.
- `npm run build` — 12/12 routes prerendered cleanly.
- `npm run test:e2e` (`web-ci`) — `tests/e2e/homepage.spec.ts`, `tests/e2e/migration.spec.ts`, and `tests/e2e/pilot-reconciliation.spec.ts` passing on Playwright Chromium.
