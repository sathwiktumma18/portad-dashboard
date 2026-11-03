# Migration Workflow and Adapter Compatibility

## Overview

PortaD's dashboard provides a migration wizard and a compatibility matrix to help users understand the migration workflow and available source and target platforms.

The dashboard is a frontend interface. Hosted migration execution is not currently enabled, so the wizard illustrates the workflow rather than performing a complete migration.

## Migration Workflow

The migration wizard contains four steps:

1. **Source** — Select the platform from which data would be migrated. The wizard currently lists Notion and Fixtures demo as ready options. Trello and ClickUp are marked as planned.
2. **Target** — Select the destination platform. Huly is marked as ready, while Notion round-trip import is planned.
3. **Package** — The interface provides file selection for `.zip` and `.portad` files and displays an illustrative package structure.
4. **Run** — The interface displays an example command sequence for the migration workflow. Hosted execution is not enabled, and the wizard does not currently run these commands.

The wizard also provides navigation between steps.

## Source and Target Adapter Roles

### Source adapters

A source adapter represents a platform from which data is read or exported for migration.

The compatibility matrix currently lists these source entries:

| Source        | Status    | Details shown in the dashboard                        |
| ------------- | --------- | ----------------------------------------------------- |
| Notion        | Supported | Pages, databases, records, attachments, and relations |
| Fixtures demo | Supported | Synthetic workspace for tests and demos               |
| Trello        | Planned   | Milestone 0.3                                         |
| ClickUp       | Planned   | Milestone 0.4                                         |
| Asana         | Planned   | Milestone 0.4                                         |

### Target adapters

A target adapter represents a destination platform to which migrated data would be imported.

| Target | Status    | Details shown in the dashboard  |
| ------ | --------- | ------------------------------- |
| Huly   | Supported | Unified Import Format workspace |
| Notion | Planned   | Round-trip import               |

These tables describe the entries and labels in the dashboard's compatibility matrix. They do not independently verify the completeness of an adapter implementation or guarantee that every listed data type can be migrated successfully.

## Compatibility Status Definitions

The compatibility matrix uses two statuses:

- **Supported** — The dashboard currently labels the platform entry as supported. Check the relevant implementation and tests before assuming that every migration scenario is supported.
- **Planned** — The platform or capability is listed as planned and is not currently marked as supported in the matrix.

The matrix can be filtered by platform name or detail and by status. Source and target entries are displayed separately.

The migration wizard and compatibility matrix do not currently list exactly the same options. For example, Asana appears as a planned source in the matrix but is not listed among the wizard's source choices.

## Example CLI Workflow

The migration wizard displays the following illustrative command sequence:

```bash
portad export notion
portad transform --target huly
portad import huly --resume
```

This sequence illustrates the intended flow: export from a source, transform for a target, and import into the destination.

**Important:** These commands are displayed by the dashboard as an example. Hosted execution is disabled, and this documentation does not claim that the commands have been run successfully or that a complete migration has been verified.

## Package Preview

The Package step displays an illustrative structure containing entries such as:

```text
notion.portad/
├── manifest.json
├── report.json
└── data/
    ├── pages.json
    ├── databases.json
    ├── comments.json
    └── attachments/
```

This is a UI preview of a possible package layout, not a guarantee that the dashboard generates or validates every listed file.

## Related Documentation

- [Project README](../README.md) — Project overview, development commands, and dashboard routes.
- [Contributing Guide](../CONTRIBUTING.md) — Local setup and contribution workflow.
- [Contribution Roles](./CONTRIBUTING-ROLES.md) — Explains which work belongs in the dashboard repository and which belongs in the core PortaD repository.
- [Core PortaD Repository](https://github.com/IndianjobsTech/PortaD) — Repository identified by the project documentation for core migration logic, adapters, and CLI behavior.
- [Compatibility Matrix](../src/app/compatibility/matrix.tsx) — Source entries, target entries, statuses, and compatibility details shown by the dashboard.
- [Migration Wizard](../src/app/migrate/page.tsx) — Wizard steps, available choices, and the illustrative CLI workflow.

## Local Dashboard Setup

To run the dashboard locally, use the following commands from the repository root:

```bash
npm ci
npm run dev
```

Then open `http://localhost:3000` in your browser.

For the project overview and additional development commands, see the [Project README](../README.md) and [Contributing Guide](../CONTRIBUTING.md).

## Scope and Limitations

This document describes the behavior and labels found in the dashboard source code. It does not claim that the dashboard itself implements core migration logic, that all adapters are fully functional, or that a complete migration has been tested.

When implementation details change, update this document to match the current source code and verified behavior.
