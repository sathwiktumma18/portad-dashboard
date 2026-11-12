# Sprint 3 — End-to-End Pilot Scenario and Dashboard-Core Reconciliation

**Sprint window:** 12–18 November 2026  
**Tracking issue:** [IndianjobsTech/portad-dashboard#31](https://github.com/IndianjobsTech/portad-dashboard/issues/31)  
**Core coordination:** [IndianjobsTech/PortaD#9](https://github.com/IndianjobsTech/PortaD/issues/9)

---

## 1. Reproducible Pilot Scenario

### Scenario A — Happy Path (`Fixtures demo` / `Notion` → `Huly`)
- **Preconditions:** Dashboard running on `http://localhost:3000` (`npm run dev` or production build); hosted backend execution intentionally disabled.
- **Inputs:**
  - Source: `Fixtures demo` (or `Notion`)
  - Target: `Huly`
  - Package file: non-empty `.portad` archive (`pilot.portad`)
- **Expected & Verified Outcomes (Dashboard):**
  1. Step 1 (`Choose a source`): Planned sources (`Trello`, `ClickUp`) remain disabled; `Next` unlocks only after selecting an active source.
  2. Step 2 (`Choose a target`): `Notion` round-trip target remains disabled; `Huly` unlocks `Next`.
  3. Step 3 (`Attach a package`): Selecting `pilot.portad` renders the package tree preview (`preview · pilot.portad`) and enables `Continue`.
  4. Step 4 (`Run the migration`): `Run hosted migration` remains **disabled** with explicit notice `Hosted execution not enabled yet`, displaying the CLI workflow without claiming hosted execution succeeded.

### Scenario B — Failure & Recovery Paths
1. **Invalid Package Recovery (`/migrate`):**
   - Uploading an unsupported `.exe` file displays `role="alert"` (`Invalid file type...`) and disables `Continue`.
   - Replacing it with a valid `.portad` file clears the alert, restores the preview, and unlocks `Continue`.
2. **Compatibility Filtering & Empty State (`/compatibility`):**
   - Filtering by `Planned` shows `Trello` and `Asana` and hides `Huly`.
   - Searching for a non-existent query displays `role="status"` (`No platforms found...`).
3. **Jobs & Account Boundaries (`/jobs`, `/account`):**
   - `/jobs` displays `No jobs yet` and `portad jobs list` honestly.
   - `/account` rejects empty credentials (`Enter an email and password.`), allows browser-local preview sessions with explicit non-API warning, and resets cleanly on `Sign out`.

---

## 2. Core CLI Verification Snapshot (Cross-Check)

Executed against `IndianjobsTech/PortaD` (`f5d20a7`, `portad 0.1.0 (spec 0.1)`):

| Command | Observed Outcome |
| --- | --- |
| `uv run portad providers` | Lists 5 providers: `notion` (`source`, `implemented`, `M3`), `huly` (`target`, `implemented`, `M6`), `trello` (`source`, `planned`, `v0.3`), `clickup` (`source`, `planned`, `v0.4`), `asana` (`source`, `planned`, `v0.4`). |
| `uv run portad export fixtures --output fixtures.portad` | Exits `1`: `unknown provider: fixtures — run portad providers`. |
| `uv run portad import --help` | Requires two positional arguments: `portad import [OPTIONS] {target} {package}`. |
| `uv run portad validate` / `transform` / `import` / `verify` | Verified in `PortaD` `docs/audits/core-baseline-sprint1.md` against synthetic `fixtures.portad` (`11` entities, `5` preserved / `4` transformed / `2` unsupported / `0` failed, `7/7` UIF artifacts). |

---

## 3. Dashboard ↔ Core Reconciliation & Known Mismatches

Per Sprint 3 exit criteria, all mismatches observed between `portad-dashboard` (`main`) and `PortaD` core are recorded below without masking failures:

| ID | Mismatch Observed | Severity | Tracked / Owner |
| --- | --- | --- | --- |
| **R-1** | **Capabilities API schema mismatch:** Core `GET /api/v1/capabilities` returns `{"providers": [...]}` with `status: "implemented" \| "planned"`, whereas Dashboard PR #70 expects `adapters` with `Supported` / `Planned`. | **High** | Tracked in [Issue #72](https://github.com/IndianjobsTech/portad-dashboard/issues/72) (awaiting `@IndianjobsTech` contract sign-off). |
| **R-2** | **Provider catalog drift (`Fixtures demo` & `Asana`):** Dashboard `/migrate` & `/compatibility` list `Fixtures demo` (absent from `portad providers`) and `Notion` target (absent from `REGISTRY`), while `Asana` is in `/compatibility` but omitted in `/migrate`. | **Medium** | Tracked in [Issue #72](https://github.com/IndianjobsTech/portad-dashboard/issues/72); `portad export fixtures` is not a CLI provider. |
| **R-3** | **Step 4 CLI `import` syntax & static `export` command:** `/migrate` Step 4 displays `portad export notion` (even when `Fixtures demo` is chosen) and `portad import huly --resume` (missing required `{package}` argument per `portad import --help`). | **Low** | Follow-up UI copy update after Issue #72 source-of-truth confirmation. |
| **R-4** | **Hosted execution & real Notion run:** Hosted migration trigger stays disabled on `/migrate` and `/jobs` stays empty until hosted worker endpoints land; live Notion OAuth export remains unverified in CI. | **High** | Tracked in [Core Issue #9](https://github.com/IndianjobsTech/PortaD/issues/9) & Sprint 5 pilot. |

---

## 4. Verification Evidence

Run in `portad-dashboard` on branch `feat/sprint-3-e2e-reconciliation`:
- `npm test` — unit tests pass.
- `npm run lint` — 0 errors, 0 warnings.
- `npm run build` — production build & static route generation pass.
- `npm run test:e2e` (CI `web-ci`) — runs `tests/e2e/homepage.spec.ts`, `tests/e2e/migration.spec.ts`, and `tests/e2e/pilot-reconciliation.spec.ts` against Next.js + Playwright Chromium.
