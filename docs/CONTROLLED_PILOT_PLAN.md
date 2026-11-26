
# Controlled Pilot Plan

**Status:** Draft - pending maintainer approval

**Related work:** Dashboard Issues #88 and #89, Sprint 5 Issue #33, PortaD Core controlled-pilot Issue #11.

## 1. Purpose

Define the boundaries, responsibilities, test participants, stop conditions, and data-handling rules for a controlled PortaD pilot.

The pilot must be bounded, observable, and safe. It must not be treated as authorization to migrate production customer data.

## 2. Proposed Pilot Scope

### Included

**A. Dashboard-only demonstration**

- Review the dashboard migration wizard and compatibility matrix.
- Test source and target selection.
- Test `.zip` and `.portad` file selection and basic file validation.
- Review the illustrative package preview.
- Verify that the dashboard clearly communicates that hosted migration execution is disabled.

**B. Optional PortaD Core CLI rehearsal**

- This activity requires prior approval from the Core maintainers.
- Use only approved test data in an approved environment.
- If approved, rehearse the workflow:

  `inspect -> export -> validate -> transform -> import -> verify`

**C. Observations**

- Record usability issues, errors, reliability observations, and support questions.

### Excluded

- Production customer migrations.
- Unapproved access to real customer workspaces.
- Use of real credentials or sensitive customer payloads in public evidence.
- Treating the dashboard wizard as a hosted migration execution system.
- Claiming lossless conversion, transactional rollback, or exactly-once execution without supporting Core implementation and test evidence.

**Scope approval:** Dashboard and Core maintainers must confirm the actual workflow and environment before execution.

## 3. Operator and Responsibilities

| Responsibility | Proposed owner |
|---|---|
| Pilot approval and scope | Project maintainer |
| Core CLI execution | Core-authorized operator |
| Dashboard workflow observation | Approved dashboard tester |
| Test account preparation | Authorized test-account owner |
| Security and data-handling review | Maintainer or designated reviewer |
| Findings and issue tracking | Pilot participants, coordinated by the project maintainer |
| Stop/pause decision during CLI rehearsal | Core-authorized operator, following the agreed escalation procedure |

**Pending:** Confirm individual names, responsibilities, and escalation contacts before starting the pilot.

## 4. Test Users and Test Data

- Only maintainer-approved participants may take part.
- Test accounts must be explicitly approved for the pilot.
- Participants must understand the test purpose and agree to participate.
- Use synthetic or explicitly consented, non-sensitive test data.
- Do not use production customer workspaces or sensitive personal information without explicit authorization and an approved data-handling procedure.
- Do not share credentials between participants.
- Record the approved participants and test environment privately, rather than publishing sensitive account details in repository documentation.

**Pending:** Confirm the participant list, test accounts, permissions, and test dataset with maintainers.

## 5. Controlled Environment

- Use an approved non-production or local test environment.
- If the Core team confirms that health and capability endpoints are available, check them before any CLI rehearsal.
- Verify the source and target environment before importing test data.
- Keep test data separate from production data.
- Confirm that the Core CLI commands and required recovery behavior are supported before execution.

The dashboard currently provides a frontend workflow. Hosted migration execution is disabled. File selection and the illustrative package preview must not be interpreted as proof of package ingestion or migration execution.

## 6. Stop Conditions

Immediately pause the affected pilot activity if any of the following occurs:

1. Unexpected data loss, corruption, or unexplained data modification.
2. Unauthorized access or permission-boundary failure.
3. Exposure of credentials, tokens, or sensitive information.
4. Migration output differs unexpectedly from the approved test scope.
5. Repeated failures prevent reliable completion or verification.
6. Cancellation, interruption, or recovery behavior creates an unsafe or inconsistent state.
7. The source, target, environment, or test-data authorization cannot be confirmed.

The operator must stop the affected activity, preserve only safe diagnostic evidence, and notify the designated maintainer through the approved private channel. Do not publish sensitive evidence in GitHub issues or pull requests. Document the incident using redacted information.

Resume only after the responsible maintainer reviews the issue and explicitly authorizes continuation.

## 7. Data-Handling Boundaries

### Data permitted

- Synthetic test workspaces.
- Approved non-sensitive test packages.
- Redacted diagnostic information.
- Test results and non-sensitive operational observations.

### Data prohibited in public evidence

- Access tokens, API keys, and credentials.
- Service-account credentials.
- Real customer migration payloads.
- Private workspace exports.
- Sensitive personal information.

### Logging and evidence

- Prefer correlation IDs and safe diagnostic summaries.
- Redact credentials and sensitive fields before sharing logs.
- Do not publish private migration payloads in issues, PRs, or screenshots.
- Capture only evidence needed to explain and reproduce an issue.
- Follow maintainer-approved retention and deletion requirements for test packages and logs.

**Pending:** Confirm storage location, access permissions, retention period, and deletion responsibility with maintainers.

## 8. Pilot Observations and Reporting

Record:

- Workflow and test scenario.
- Expected behavior.
- Actual behavior.
- Error messages and relevant redacted diagnostics.
- Usability issues and support questions.
- Reliability observations.
- Reproduction steps.
- Severity: Critical, High, Medium, or Low.
- Related issue, test, or corrective PR.

Do not dismiss critical findings to meet the sprint schedule.

## 9. Completion and Exit Criteria

The pilot is ready for review when:

- Approved scope and responsibilities are documented.
- Approved test users and environment are confirmed.
- Test scenarios and observations are recorded.
- Security and data-handling boundaries are reviewed.
- Findings are classified and linked to follow-up work.
- No unresolved critical issue is ignored.
- Maintainers record the resulting decisions.

## 10. Decisions Requiring Maintainer Confirmation

| Decision | Status |
|---|---|
| Dashboard-only demonstration or combined CLI rehearsal | Pending |
| Approved pilot environment | Pending |
| Named operator and escalation contact | Pending |
| Test participants and accounts | Pending |
| Approved test dataset | Pending |
| Stop and resume authority | Pending |
| Data retention and deletion requirements | Pending |
| Core-team alignment with Issue #11 | Pending |

This document is a proposed operating plan. It does not authorize pilot execution or override Core-team security, migration, or operational requirements.

## Related Documentation

- `SECURITY_AND_DATA_INTEGRITY.md`
- `PROJECT_OPERATING_SYSTEM.md`
- `MIGRATION_AND_ADAPTERS.md`
- Dashboard Issue #88
- Dashboard Issue #89
- Sprint 5 Issue #33
- PortaD Core controlled-pilot Issue #11
