# Issue #26: `@grpc/grpc-js` Override Investigation

**Objective:** Document the dependency path, existing version override, verification evidence, and recommendation. No dependency change is proposed by this investigation.

## Dependency relationship

The dependency is pulled into the project through Firebase Firestore:

```text
portad-dashboard
└── firebase@12.19.0
    └── @firebase/firestore@4.17.2
        └── @grpc/grpc-js@1.13.6
```

## Existing override and lockfile version

The current `package.json` override is:

```json
"overrides": {
  "@firebase/firestore": {
    "@grpc/grpc-js": "1.13.6"
  }
}
```

The `package-lock.json` resolves `node_modules/@grpc/grpc-js` to **1.13.6**. The lockfile entry records the npm registry tarball for `grpc-js-1.13.6.tgz`.

`npm explain @grpc/grpc-js` reports that Firestore originally requested `~1.9.0` and that the project override replaces that request with `1.13.6`.

## Verification results

After a clean dependency installation with `npm ci`, the following commands were run:

- `npm ls @grpc/grpc-js` — showed `@grpc/grpc-js@1.13.6 overridden` beneath `firebase@12.19.0` and `@firebase/firestore@4.17.2`.
- `npm explain @grpc/grpc-js` — confirmed the dependency path and that `1.13.6` overrides Firestore's original `~1.9.0` request.

## Why the version is pinned

Git history identifies commit `2bf1b3f` (`Mitigate production dependency vulnerabilities`), dated October 18, 2026, as the commit that introduced the override and updated the lockfile to `1.13.6`.

This establishes that the change was included in production dependency vulnerability mitigation. The exact security advisory or CVE specifically addressed by this gRPC override has **not** been identified from the available evidence; no advisory ID is asserted here.

## Compatibility and security considerations

- The installed override is applied as configured.
- The project built and all reported test and lint checks passed with version `1.13.6`.
- `npm audit` reported 16 moderate vulnerabilities. The supplied audit output showed findings involving `minimatch` and related ESLint dependencies; it did not show a `@grpc/grpc-js` finding.
- A forced audit fix was not applied because npm proposed a potentially breaking ESLint downgrade.
- Passing tests and a successful build demonstrate compatibility with the current project snapshot; they do not, by themselves, prove that removing the override is safe.

## Build and test evidence

| Check | Result |
|---|---|
| `npm ci` | Completed successfully |
| `npm test` | 55/55 unit tests passed (6 test files) |
| `npm run test:e2e` | 7/7 end-to-end tests passed |
| `npm run build` | Production build completed successfully |
| `npm run lint` | Passed (exit code 0) |

The first E2E attempt could not start because the Playwright Chromium browser was missing. After `npx playwright install chromium`, all seven E2E tests passed.

## Recommendation

**Retain the existing `@grpc/grpc-js@1.13.6` override for now.** The override is correctly applied, and the current build and test checks pass with it. The original security rationale has not been traced to a specific advisory, so removing or changing the override would be premature.

**No change to `package.json` or `package-lock.json` should be made without maintainer approval.**

## Revisit Date and Ownership

**Revisit Date:** February 4, 2027

**Owner:** A PortaD maintainer will be assigned at the time of the revisit.

The assigned maintainer should review the original security rationale, current Firebase Firestore dependency requirements, and whether a compatible upstream version is available.

No changes to the existing `@grpc/grpc-js` override should be made without maintainer approval.
