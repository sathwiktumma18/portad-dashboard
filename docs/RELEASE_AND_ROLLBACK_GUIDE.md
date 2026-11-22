# PortaD Dashboard — Release, Deployment, and Rollback Guide

**Sprint Window:** Sprint 4 (19–25 November 2026)  
**Tracking Issue:** [IndianjobsTech/portad-dashboard#32](https://github.com/IndianjobsTech/portad-dashboard/issues/32)  
**Production URL:** [https://portad.vishmuka.in](https://portad.vishmuka.in)  
**Hosting Platform:** Vercel (Frontend Next.js Static & Edge Network)  
**Deployment Owner:** `@IndianjobsTech` (with release approval authority granted to all designated managers)

---

## 1. Overview & Operational Boundaries

The PortaD Dashboard is a Next.js (Turbopack) application deployed to **Vercel**, serving as the browser-local user interface for the PortaD open migration engine.

- **Frontend Plane (This repository):** Hosted on Vercel at `https://portad.vishmuka.in`. Contains no persistent user databases, secret server keys, or unredacted authentication tokens.
- **Backend Core Plane (Separate repository):** The `PortaD` engine and API (`/api/v1/capabilities`, `/healthz`) are deployed on **Railway**, coordinated under `IndianjobsTech/PortaD`.
- **Decoupled Fallback:** The dashboard operates safely offline or during backend outages using bundled catalog fallbacks (`FALLBACK_ENTRIES`), ensuring zero customer-facing breakage if backend services are interrupted.

---

## 2. Pre-Release Verification Gates

Before approving or promoting any release candidate to production, all six verification gates MUST pass without waivers:

| Stage | Command | Target Criteria | Evidence Link |
| --- | --- | --- | --- |
| **1. Unit Tests** | `npm test` | 81 / 81 tests passing across 8 suites | Local terminal or GitHub Actions `web-ci` |
| **2. Code Quality** | `npm run lint` | 0 errors, 0 warnings (ESLint) | Local terminal or GitHub Actions `web-ci` |
| **3. Production Build** | `npm run build` | 12 / 12 routes statically prerendered with Turbopack | Local terminal or GitHub Actions `web-ci` |
| **4. End-to-End Tests** | `npm run test:e2e` | Playwright Chromium passes using `workers: 1`, `fullyParallel: false` | GitHub Actions `web-ci` |
| **5. Secret Hygiene** | `git status` & secret scan | Only `.env.example` tracked; no `.env*`, `.pem`, or tokens in bundle | `docs/KNOWN_LIMITATIONS.md` |
| **6. Production Audit** | `npm audit --omit=dev` | **0 vulnerabilities** in production dependency tree | Verified in Issue #32 audit |

---

## 3. Deployment Workflow

### 3.1. Staging & Preview Deployments
1. Every open pull request automatically builds a isolated preview deployment on Vercel.
2. Preview URLs follow the format: `https://portad-dashboard-git-<branch>-indianjobstechs-projects.vercel.app`.
3. Contributors and mentors MUST verify responsive UI, keyboard accessibility, and navigation on the preview deployment before approving the PR.

### 3.2. Production Deployment (Automatic on Merge)
1. PR is peer-reviewed and approved by assigned reviewer.
2. Maintainer (`@IndianjobsTech`) or designated manager merges the PR into `main`.
3. Vercel automatically detects the push to `main`, executes `npm run build`, and assigns the production domains:
   - `portad.vishmuka.in` (Canonical)
   - `portad-dashboard.vercel.app` (Fallback)

### 3.3. Post-Deployment Smoke Checklist
Immediately following deployment, verify the following 5 routes on `https://portad.vishmuka.in`:
- [ ] **`/` (Overview):** Renders hero, architectural value props, and navigation links.
- [ ] **`/migrate` (Wizard):** Four-step stepper advances cleanly; file upload accepts `.portad` archives and rejects non-package formats with `role="alert"`; Step 4 displays terminal instructions.
- [ ] **`/compatibility` (Matrix):** Shows `Sources` and `Targets`; search filtering and `Planned` toggles function; live/offline status indicator reflects API state accurately.
- [ ] **`/jobs` (Jobs Queue):** Displays honest empty state with terminal instruction (`portad jobs list`).
- [ ] **`/account` (Account):** Validates empty inputs; preview session activates and signs out cleanly.

---

## 4. Zero-Downtime Rollback Runbook

If a critical failure, regression, or unhandled exception occurs in production, execute one of the following rollback procedures immediately.

### Procedure A: Instantaneous Edge Rollback (Recommended — < 10 seconds)
*Best for: Rapid recovery without waiting for a re-build.*

1. Open the [Vercel Project Dashboard](https://vercel.com/indianjobstechs-projects/portad-dashboard).
2. Go to the **Deployments** tab.
3. Locate the **last known healthy production deployment** (verified prior to the broken release).
4. Click the three dots (`...`) icon on the right side of the healthy deployment card.
5. Select **Instant Rollback** (or **Promote to Production**).
6. Confirm the prompt. Vercel instantly switches edge routing traffic to the selected deployment in **< 5 seconds** with zero downtime.

### Procedure B: CLI Rollback via Vercel CLI
*Best for: Automated or terminal-driven emergency operations.*

```bash
# 1. Log in with deployment authority
vercel login

# 2. List recent production deployments
vercel list --prod

# 3. Roll back to the target healthy deployment ID
vercel rollback <target-deployment-id>
```

### Procedure C: Git Revert on `main`
*Best for: Aligning git history after an emergency rollback is active.*

```bash
# 1. Check out latest main
git checkout main
git pull upstream main

# 2. Revert the offending merge commit
git revert -m 1 <merge-commit-sha>

# 3. Verify locally
npm test
npm run build

# 4. Push to main to establish clean permanent state
git push upstream main
```

---

## 5. Resilience & Circuit Breakers

The dashboard includes built-in resilience mechanisms to prevent production downtime:

1. **Root Error Boundary (`src/app/error.tsx`):**
   - Catches unhandled runtime render crashes.
   - Renders an accessible diagnostic alert with a unique `Error ID` (`digest`).
   - Surfaces a **"Try again"** recovery action and a direct link back to the homepage without requiring a full browser refresh.
2. **API Health Timeout & Fallback (`src/lib/api-health.ts` & `src/lib/api-client.ts`):**
   - Health probes are bounded by a strict `5000 ms` timeout.
   - If the backend Railway API is unreachable or times out, the dashboard falls back to `FALLBACK_ENTRIES` and sets `status: "offline"`.
   - The UI displays an honest `○ Offline Catalog` badge without crashing or hanging requests.
3. **Destructive Action Confirmation (`src/app/migrate/page.tsx`):**
   - Prevents accidental loss of in-progress migration configurations via an accessible modal dialog.

---

## 6. Incident Escalation & Roles

In the event of a release block, security advisory, or production outage:

| Role | Contact | Primary Responsibility |
| --- | --- | --- |
| **Project Lead & Deployment Owner** | `@IndianjobsTech` | Release authorization, Vercel production rollback, credential management |
| **Delivery Lead & Core Coordinator** | `@Dileep3015` | Cross-repository alignment, CI workflow approvals, release-gate sign-off |
| **Frontend Contributor** | `@sathwiktumma18` | Pre-release verification, smoke testing, error boundary & regression fixes |
| **Security & Reviewer** | Team Reviewers | Dependency vulnerability review, secret scan audits |
