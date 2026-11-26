# PortaD Dashboard — Release, Deployment, and Rollback Guide

**Sprint Window:** Sprint 4 (19–25 November 2026)  
**Tracking Issue:** [IndianjobsTech/portad-dashboard#32](https://github.com/IndianjobsTech/portad-dashboard/issues/32)  
**Production URL:** [https://portad.vishmuka.in](https://portad.vishmuka.in)  
**Hosting Platform:** Vercel (Frontend Next.js Application)  
**Deployment & Rollback Owner:** `@IndianjobsTech` (Project Lead & Maintainer)

---

## 1. Overview & Operational Boundaries

The PortaD Dashboard is a Next.js (Turbopack) application deployed to **Vercel**, serving as the browser-local user interface for the PortaD open migration engine.

- **Frontend Plane (This repository):** Hosted on Vercel at `https://portad.vishmuka.in`. Contains no persistent user databases, server-side secret keys, or unredacted authentication tokens.
- **Backend Core Plane (Separate repository):** The `PortaD` engine and API (`/api/v1/capabilities`, `/healthz`) are deployed separately on **Railway** under `IndianjobsTech/PortaD`. Backend releases and rollbacks are governed independently via `IndianjobsTech/PortaD` (`docs/CORE_RELEASE_AND_OPERATIONS_GUIDE.md`).
- **Decoupled Fallback:** When the backend API is unreachable or times out, the dashboard falls back to bundled catalog entries (`FALLBACK_ENTRIES`) so the UI remains usable offline or during backend outages.

---

## 2. Pre-Release Verification Gates

Before approving or promoting any release candidate to production, all six verification gates MUST pass without waivers:

| Stage | Command / Check | Target Criteria | Evidence Link |
| --- | --- | --- | --- |
| **1. Unit Tests** | `npm test` | All unit test suites pass with 0 failures | Latest GitHub Actions [`web-ci`](https://github.com/IndianjobsTech/portad-dashboard/actions/workflows/ci.yml) run |
| **2. Code Quality** | `npm run lint` | 0 errors, 0 warnings (ESLint) | Latest GitHub Actions `web-ci` run |
| **3. Production Build** | `npm run build` | All app routes compile and build cleanly with Turbopack | Latest GitHub Actions `web-ci` run |
| **4. End-to-End Tests** | `npm run test:e2e` | Playwright Chromium passes using serial execution (`workers: 1`, `fullyParallel: false`) | Latest GitHub Actions `web-ci` run |
| **5. Secret Hygiene** | Tracked-file, bundle & history checks (see §2.1) | Only `.env.example` template tracked; no secrets in tracked files, client bundles, or history | `docs/KNOWN_LIMITATIONS.md` & Issue #32 audit |
| **6. Dependency Audit** | `npm audit --omit=dev` (and full `npm audit`) | **0 vulnerabilities** in production tree; any dev-dependency findings fixed or tracked with risk decision | Verified in Issue #32 audit |

### 2.1. Secret-Scanning & Configuration Verification Method

Checking `git status` alone only confirms untracked local files; release verification separates secret hygiene into three distinct checks:

1. **Tracked Environment Files (`git ls-files`):** Confirm that `.gitignore` excludes `.env*`, `.pem`, and `.vercel`, and that only `.env.example` (an empty/example environment template, **not** a production secret) is tracked in Git.
2. **Tracked Source & Client Bundle Scan:** Scan tracked source files and compiled `.next/` client assets for private keys (`-----BEGIN.*PRIVATE KEY-----`), service-account JSONs, or non-public tokens. Client configuration is restricted to public `NEXT_PUBLIC_FIREBASE_*` and `NEXT_PUBLIC_API_URL` values.
3. **Git-History Secret Scan:** Run repository secret scanning (GitHub Secret Scanning / `gitleaks` or `trufflehog` when available) across commit history before milestone sign-off; any missing history scan must be recorded as an explicit pending verification item.

---

## 3. Deployment Workflow

### 3.1. Staging & Preview Deployments
1. When Vercel Git integration and repository preview deployment settings are enabled, open pull requests receive an isolated preview deployment on Vercel (fork PRs may require Vercel team authorization from `@IndianjobsTech`).
2. Preview URLs typically follow the format: `https://portad-dashboard-git-<branch>-indianjobstechs-projects.vercel.app`.
3. Contributors and reviewers should verify responsive UI, keyboard accessibility, and navigation on the preview deployment (when generated) or local production build before approving a PR.

### 3.2. Production Deployment (Automatic on Merge to `main`)
1. The PR passes all required `web-ci` checks and receives peer review approval.
2. `@IndianjobsTech` (or an explicitly authorized repository maintainer) merges the PR into `main`.
3. Vercel detects the push to `main`, executes `npm run build`, and updates the production domains:
   - `portad.vishmuka.in` (Canonical)
   - `portad-dashboard.vercel.app` (Fallback)

### 3.3. Last Known Healthy Deployment Record
Maintainers should record the active healthy production baseline prior to promoting a new release candidate:

| Field | Value to Record |
| --- | --- |
| **Deployment ID / URL** | `dpl_...` / `https://portad-dashboard-<hash>-indianjobstechs-projects.vercel.app` |
| **Commit SHA (`main`)** | `<commit-sha>` |
| **Timestamp (IST)** | `YYYY-MM-DD HH:MM IST` |
| **Verified By** | `@IndianjobsTech` / `@Dileep3015` |

### 3.4. Post-Deployment Smoke Checklist
Immediately following deployment (or rollback), verify these routes on `https://portad.vishmuka.in` alongside backend connectivity:
- [ ] **`/` (Overview):** Renders hero, architectural overview, and navigation links.
- [ ] **`/migrate` (Wizard):** Four-step stepper advances cleanly; file upload accepts `.portad` archives and rejects non-package formats with `role="alert"`; Step 4 displays terminal instructions.
- [ ] **`/compatibility` (Matrix):** Shows `Sources` and `Targets`; search filtering and `Planned` toggles function; status badge accurately reflects live backend connectivity (`/healthz` and `/api/v1/capabilities`) or `○ Offline Catalog` fallback.
- [ ] **`/jobs` (Jobs Queue):** Displays honest empty state with terminal instruction (`portad jobs list`).
- [ ] **`/account` (Account):** Validates empty inputs; preview session activates and signs out cleanly.

---

## 4. Frontend Production Rollback Runbook (Vercel)

> **Scope note:** This section covers **Vercel frontend rollbacks** only. If the root cause is in the backend API (`/healthz`, `/api/v1/capabilities`), follow the Railway rollback procedure in `IndianjobsTech/PortaD` (`docs/CORE_RELEASE_AND_OPERATIONS_GUIDE.md`).

If a critical failure, regression, or unhandled exception occurs in production, execute one of the following procedures:

### Procedure A: Vercel Dashboard Rollback (Recommended for Rapid Recovery)
*Best for: Re-pointing production routing to the last known healthy deployment without waiting for a full rebuild. Actual propagation time depends on edge cache and deployment configuration.*

1. Open the [Vercel Project Dashboard](https://vercel.com/indianjobstechs-projects/portad-dashboard).
2. Go to the **Deployments** tab.
3. Locate the **last known healthy production deployment** (recorded in §3.3).
4. Click the menu icon (`...`) on the right side of that healthy deployment.
5. Select **Instant Rollback** (or **Promote to Production**).
6. Confirm the prompt. Vercel re-routes production traffic for `portad.vishmuka.in` to the selected deployment.

### Procedure B: CLI Rollback via Vercel CLI
*Best for: Terminal-driven operations by `@IndianjobsTech` or an authorized Vercel team member. Verified against **Vercel CLI 67.0.0**.*

```bash
# 1. Authenticate with Vercel team access
npx vercel login

# 2. List recent production deployments to locate the healthy deployment ID or URL
npx vercel ls --prod

# 3. Roll back using the deployment ID (dpl_...) or deployment URL (https://...vercel.app)
# Example with deployment URL:
npx vercel rollback https://portad-dashboard-abc123-indianjobstechs-projects.vercel.app --timeout 3m
# Example with deployment ID:
# npx vercel rollback dpl_9XyZ12345abcde6789 --timeout 3m

# 4. Check rollback completion status
npx vercel rollback status
```

### Procedure C: Auditable Git Revert via Pull Request
*Best for: Aligning `main` branch history after a production rollback is active, while respecting branch-protection rules and required CI checks.*

```bash
# 1. Sync main and create a dedicated revert branch
git checkout main
git pull upstream main
git checkout -b revert/<short-description-or-pr-number>

# 2. Revert the offending merge commit cleanly
git revert -m 1 <merge-commit-sha>

# 3. Verify locally before pushing
npm test
npm run lint
npm run build

# 4. Push the revert branch and open a Pull Request against main
git push -u origin revert/<short-description-or-pr-number>
gh pr create --repo IndianjobsTech/portad-dashboard --base main --title "revert: <reason>"
```

Normal branch-protection rules and `web-ci` checks continue to apply to revert PRs unless `@IndianjobsTech` invokes an explicitly authorized emergency maintainer procedure.

### 4.1. Post-Rollback Verification
After completing Procedure A, B, or C:
1. **Alias & Cache Verification:** Confirm `https://portad.vishmuka.in` and `https://portad-dashboard.vercel.app` serve the expected deployment (check response headers / `Cache-Control` and hard-refresh to verify no stale assets remain).
2. **Backend & Matrix Health:** Probe the configured backend `/healthz` endpoint and verify `/compatibility` renders expected adapter states (`Supported` / `Planned` or `○ Offline Catalog`).
3. **Smoke Checklist:** Re-run the 5-route smoke checklist in §3.4.

---

## 5. Resilience & Circuit Breakers

The dashboard includes built-in resilience mechanisms to prevent full-page crashes during partial outages:

1. **Root Error Boundary (`src/app/error.tsx`):**
   - Catches unhandled runtime render crashes.
   - Renders an accessible diagnostic alert with a unique `Error ID` (`digest`).
   - Surfaces a **"Try again"** recovery action and a link back to `/`.
2. **API Health Timeout & Fallback (`src/lib/api-health.ts` & `src/lib/api-client.ts`):**
   - Health probes are bounded by a `5000 ms` timeout.
   - If the backend Railway API is unreachable or times out, the dashboard falls back to `FALLBACK_ENTRIES` and sets `status: "offline"`, displaying `○ Offline Catalog`.
3. **Destructive Action Confirmation (`src/app/migrate/page.tsx`):**
   - Prevents accidental loss of in-progress migration configurations via an accessible confirmation dialog.

---

## 6. Incident Escalation, Ownership & Credential Rotation

### 6.1. Ownership Matrix

| Role | Contact | Primary Responsibility |
| --- | --- | --- |
| **Project Lead & Deployment Owner** | `@IndianjobsTech` | Production deployment/rollback authorization, Vercel & Railway access, secret rotation |
| **Delivery Lead & Core Coordinator** | `@Dileep3015` | Cross-repository alignment, CI workflow approvals, release-gate review |
| **Frontend Contributor** | `@sathwiktumma18` | Pre-release verification, smoke testing, error boundary & regression fixes |
| **Peer Reviewers** | `@k1j-kavitha`, `@nandinireddy3737`, `@GudaGangothri` | PR review, accessibility/UI checks, pilot feedback |

### 6.2. Exposed-Credential Incident Escalation Path
If a secret, private key, or non-public credential is suspected or confirmed exposed in a commit, log, or client bundle:
1. **Immediate Escalation:** Notify `@IndianjobsTech` (Deployment & Credential Owner) and `@Dileep3015` (Delivery Lead) immediately.
2. **Credential Rotation:** `@IndianjobsTech` revokes and rotates the affected credentials in the corresponding platform (Vercel environment variables, Firebase Console, or Railway) — only `@IndianjobsTech` holds production secret-rotation access.
3. **Purge & Redeploy:** Trigger a fresh production deployment (or rollback to a clean build) once rotated environment variables are updated, and verify no exposed value remains in active client bundles.
4. **Post-Incident Tracking:** Open a security tracking issue documenting root cause, rotated systems, and preventive CI/secret-scanning updates.
