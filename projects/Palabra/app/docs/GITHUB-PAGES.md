# Public GitHub Pages release

Public URL: https://andrewhvolk.github.io/palabra/

The user explicitly selected the existing `andrewhvolk.github.io` repository as the public destination. Its Pages settings were inspected: deploy from `main`, `/ (root)`, with HTTPS enforced. No repository visibility, Pages publishing source, domain, access controls, or existing Sites audience was changed.

Run `npm test` and `npm run build:pages` from `projects/Palabra/app`. This builds the same app used by the private release, then copies only index.html, styles.css, src and content into `/palabra/`, with a public canonical URL. The generated runtime is checked into the Pages source branch; future releases must regenerate and commit it. Source remains in `projects/Palabra/app`.

The public source commit excludes the original handoff, private Sites manifest, development dist, QA screenshots, real personal backups and unrelated working-tree edits. Jekyll excludes the full `projects/Palabra/` development tree from the website. The Tools & Resources page links directly to Palabra.

No account or login is needed to open the public app. Student answers and profiles remain in the current browser’s IndexedDB. They are not uploaded to GitHub. Switching Chromebooks still requires export/import; Google sign-in does not enable app sync. Progress from the private Sites origin also needs manual backup transfer.

Publication verification and commit information are recorded after the public deployment completes. The old live vocabulary app and the new private Sites deployment remain available at their existing URLs.

## Verified public release

- Source commit: https://github.com/andrewhvolk/andrewhvolk.github.io/commit/de0df729ec84868e9725dbd20f7a6031aaa79b37
- Pages workflow: https://github.com/andrewhvolk/andrewhvolk.github.io/actions/runs/41155807729 — completed successfully.
- Repository checks: https://github.com/andrewhvolk/andrewhvolk.github.io/actions/runs/41155808243 — completed successfully.
- Anonymous HTTP requests returned 200 for `/palabra/`, the entry module (`text/javascript`), the full vocabulary JSON (940 cards), and the Tools & Resources page containing the public link.
- Chrome visibly loaded the public app’s fresh onboarding, navigation, and class positions through 9B without a sign-in prompt.
- All 16 learning tests, content validation, public build, and repository CSS/link/HTML/date checks passed before publication.

Publication used the GitHub connector on top of the latest remote main commit, preserving newer unrelated remote changes. The original local Git HEAD/index and unrelated working-tree edits were left untouched. This local verification receipt was added after the immutable public release commit; the published runtime is unchanged.

## Current public release checks

The audit remediation was pushed and validated sequentially. See REMEDIATION.md for patch receipts. The current runtime includes an explicit-update offline cache, learner-scoped backups, temporary guests and previewed class links. The private Site and original vocabulary Site were not rebound.

CI now runs 34 learning tests, six Chromium smoke flows, full content checks, deterministic 25-asset Pages parity and educator-packet freshness. Live anonymous verification compares every public runtime byte. Google account resume remains disabled pending project-owned configuration and real account/device testing; independent educator findings remain pending.
