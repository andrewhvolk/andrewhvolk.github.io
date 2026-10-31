# Google-account resume: configuration and release gate

Status: **not enabled**. Public hosting, PWA installation and Chromebook Google login do not sync Palabra progress. The existing public app remains usable without credentials. This document is a concrete readiness plan, not a claim that authentication or cloud storage has shipped.

## Owner inputs still needed

Choose a project owned by the intended operator, preferably a new Google Cloud/Firebase project dedicated to Palabra. Provide only its project ID and public Firebase web configuration. Do not put private keys, OAuth client secrets, refresh tokens or service-account credentials in this repository or chat.

Enable the Google authentication provider and establish `andrewhvolk.github.io` as an authorized domain. An OAuth web client must allow JavaScript origin `https://andrewhvolk.github.io`. Confirm the intended school accounts can authorize the app; test actual managed accounts before advertising classroom sign-in. The connected assistant's Google Drive account is not application infrastructure and must not be reused for students.

Review provider quotas and the operator's storage/billing policy before enabling writes. Core local study must continue when cloud authorization or quotas are unavailable. No paid API is needed for the existing curriculum.

## Proposed implementation boundary

- Use Google's authenticated identity through Firebase Auth. A local display name never establishes identity. Require the authenticated user ID on every server read/write path.
- Keep Auth persistence in memory by default on shared devices. Signing out of Palabra must clear its private UI, pending account state and tokens; explain that it does not sign out of the Chromebook itself. Keep the current guest option.
- Store per-user card schedules, immutable assessment events and resumable sessions separately. Do not put an entire multi-year export in one Firestore document: the document limit is 1 MiB. Preserve all 940 vocabulary IDs and v1 due timestamps. Keep a versioned migration boundary.
- Enforce ownership in database rules, test it in the emulator, and deploy the rules before enabling the client. A public API key is configuration, not authorization. One account must never read or write another account's progress.
- Commit assessment evidence and schedule changes transactionally with idempotent event IDs. Use server revisions/transactions to detect concurrent work. Preserve both branches on conflict; show a reviewable resolution instead of silently selecting a last writer. Undo must not erase later work on another device.
- Queue interrupted writes and retry after reconnection. For a shared-device session with memory-only private data, require a download before closing if an upload is pending. Any optional durable offline account cache needs an explicit privacy design and tests; do not silently leave student data readable on a shared browser.
- Upload only the active authenticated learner. Never sync the all-profile recovery archive. Retain profile-scoped portable backups, including when authorization expires.

## Required verification before enabling sign-in

1. Two real accounts: A cannot access B's document paths, including crafted direct requests.
2. Two separate browser/device sessions: finish work on one, sign in on the other, resume the exact queue/cursor/draft and schedules.
3. Network interruption and token expiry: no false “synced” status, duplicate scheduling or dropped attempts.
4. Concurrent and offline edits: detect conflict; preserve both sets of evidence and resolve deliberately.
5. Shared-device sign-out: no previous learner's private content or tokens remain available in the next session.
6. v1 import and a full-course, three-year history: round-trip through the provider without document-size or migration failure.
7. Managed Chromebook accounts and classroom network: verify allowed sign-in, audio fallback and end-of-session behavior.

Until the project configuration and these checks exist, keep Google sign-in disabled and state clearly that progress is browser-local. No existing Site or unrelated repository deployment target needs rebinding.

## Primary references

- [Google sign-in with Firebase](https://firebase.google.com/docs/auth/web/google-signin)
- [Firebase Auth persistence choices](https://firebase.google.com/docs/auth/web/auth-state-persistence)
- [Firestore rules and authenticated ownership](https://firebase.google.com/docs/firestore/security/rules-conditions)
- [Firestore limits](https://firebase.google.com/docs/firestore/quotas)
- [Google browser token model](https://developers.google.com/identity/oauth2/web/guides/use-token-model)

Google Drive's private app-data folder is an alternative storage adapter, not a shortcut around authentication, conflict handling or shared-device privacy. Its scope is narrow, but the app would still need a project-owned OAuth client and real cross-account testing. See [Drive app-data documentation](https://developers.google.com/workspace/drive/api/guides/appdata).
