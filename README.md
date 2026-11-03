# PortaD Dashboard

[![CI](https://github.com/IndianjobsTech/portad-dashboard/actions/workflows/ci.yml/badge.svg)](https://github.com/IndianjobsTech/portad-dashboard/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![GitHub issues](https://img.shields.io/github/issues/IndianjobsTech/portad-dashboard)](https://github.com/IndianjobsTech/portad-dashboard/issues)
[![GitHub discussions](https://img.shields.io/badge/discussions-welcome-blue)](https://github.com/IndianjobsTech/portad-dashboard/discussions)

The public front-end for **[PortaD](https://portad.vishmuka.in)** — the open, local-first way to move your data between SaaS workspaces.

This repository contains the dashboard: the marketing site, the migration wizard, the compatibility matrix, and the job views. It is a static Next.js application — no proprietary migration logic ships in this bundle.

**Live:** [portad.vishmuka.in](https://portad.vishmuka.in)

## Quick Start

```bash
git clone https://github.com/IndianjobsTech/portad-dashboard.git
cd portad-dashboard
npm ci
npm run dev
```

Open http://localhost:3000 in your browser.

New contributor? See [QUICK_START.md](QUICK_START.md) for setup, environment variables, and troubleshooting.

## Stack

- **Next.js 16** (App Router, static export-friendly)
- **TypeScript** (strict)
- **Tailwind CSS 4**
- **motion/react** for entrance and section animation
- **Firebase Auth** (optional, environment-driven)

## Pages

| Route | What it shows |
| --- | --- |
| `/` | Overview, adapter marquee, process, CLI demo, FAQ |
| `/migrate` | Step-by-step migration wizard shell |
| `/jobs` | Job list with empty state |
| `/compatibility` | Searchable source → target compatibility matrix |
| `/account` | Session screen (auth wiring pending Firebase web config) |

## Develop

Requires Node.js 20.9+ (22 LTS recommended — `.nvmrc` pins 22).

```bash
npm ci
npm run dev        # http://localhost:3000
npm run lint
npm run build
```


### Testing

The project uses Vitest for unit tests and Playwright for browser-based end-to-end (E2E) tests.

Run the unit tests:

```bash
npm test
```

Run the unit tests in watch mode:

```bash
npm run test:watch
```

Install the Playwright Chromium browser for local E2E testing:

```bash
npx playwright install chromium
```

Run the E2E tests:

```bash
npm run test:e2e
```

Before opening a pull request, run all checks:

```bash
npm test
npm run test:e2e
npm run lint
npm run build
```


## Project structure

```text
src/
  app/          route pages + layout metadata
  components/  reusable UI sections: header, hero, terminal demo, process, footer
  lib/
    config.ts   API + GitHub URLs
    auth.ts     authFetch attaches the Firebase ID token as a Bearer header
    firebase.ts optional Firebase Auth wiring
public/         logos, icons, robots.txt, sitemap.xml
.github/        CI workflow and issue templates
```

## Environment

Copy `.env.example` to `.env.local` and fill in what you need:

```bash
cp .env.example .env.local
```

```env
NEXT_PUBLIC_API_URL=
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
```

If these values are unset, the dashboard falls back to a browser-local preview session.

## Authentication

Sign-in is powered by **Firebase Auth** when the `NEXT_PUBLIC_FIREBASE_*` values are present.

- Signed-in users get a real **ID token**
- API calls attach it as `Authorization: Bearer …`
- Without Firebase config, the site stays demo-friendly in preview mode

## Contributing

We welcome contributions to the dashboard, docs, UI, and product experience.

### Getting started

1. Read [CONTRIBUTING.md](CONTRIBUTING.md)
2. Clone the repo and install dependencies
3. Pick an issue or propose a change
4. Open a PR with a clear description and screenshots if relevant

### Good ways to contribute

- UI polish and layout improvements
- Accessibility fixes and motion improvements
- Documentation and onboarding improvements
- Bug fixes and smaller product improvements
- New dashboard pages or compatibility display updates

### Before opening a PR

```bash
npm run lint
npm run build
```

## Project handbook

The project uses GitHub Issues and pull requests as the source of truth for day-to-day work. Start here:

- [Migration and adapter guide](docs/MIGRATION_AND_ADAPTERS.md) — step-by-step migration process, source/target adapter architecture, and compatibility matrix guide.
- [Product requirements](docs/PRODUCT_REQUIREMENTS.md) — intended users, requirements, constraints, and open product/API questions.
- [Project operating system](docs/PROJECT_OPERATING_SYSTEM.md) — planning cadence, work lifecycle, review policy, and team metrics.
- [Engineering workflow](docs/ENGINEERING_WORKFLOW.md) — local checks, PR checklist, testing strategy, and release readiness.
- [30-day sprint plan](docs/SPRINT_PLAN_2026-10.md) — proposed priorities from 25 October to 23 November 2026.
- [Fresher mentoring guide](docs/FRESHER_MENTORING.md) — safe starter tasks, mentor expectations, and review guidance.
- [Security and data-integrity checklist](docs/SECURITY_AND_DATA_INTEGRITY.md) — dashboard-specific privacy, auth, migration UX, and error-handling checks.
- [Architecture decision records](docs/ARCHITECTURE_DECISIONS.md) — when and how to record technical decisions.
- [Weekly review template](docs/WEEKLY_REVIEW_TEMPLATE.md) — demo, quality, blocker, and retrospective template.

These documents are working agreements and planning proposals, not evidence that a feature is implemented. Confirm API contracts and current code before promising backend behavior.

## Organization workflow

See [the shared PortaD organization operating model](docs/ORGANIZATION_OPERATING_MODEL.md) for cross-repository ownership, sprint workflow, review expectations, release gates, and maintainer setup. See [CONTRIBUTING.md](CONTRIBUTING.md) and [SUPPORT.md](SUPPORT.md) for contribution and escalation guidance.

## Roadmap

See [ROADMAP.md](ROADMAP.md) for upcoming work, milestone planning, and contribution opportunities.

## Security

Do not open public issues for vulnerabilities. See [SECURITY.md](SECURITY.md) for private reporting instructions.

## License

[MIT](LICENSE) © 2026 VishMuKa TechWorks Private Limited.
