# Public GitHub Pages release

Public URL: https://andrewhvolk.github.io/palabra/

The user explicitly selected the existing `andrewhvolk.github.io` repository as the public destination. Its Pages settings were inspected: deploy from `main`, `/ (root)`, with HTTPS enforced. No repository visibility, Pages publishing source, domain, access controls, or existing Sites audience was changed.

Run `npm test` and `npm run build:pages` from `projects/Palabra/app`. This builds the same app used by the private release, then copies only index.html, styles.css, src and content into `/palabra/`, with a public canonical URL. The generated runtime is checked into the Pages source branch; future releases must regenerate and commit it. Source remains in `projects/Palabra/app`.

The public source commit excludes the original handoff, private Sites manifest, development dist, QA screenshots, real personal backups and unrelated working-tree edits. Jekyll excludes the full `projects/Palabra/` development tree from the website. The Tools & Resources page links directly to Palabra.

No account or login is needed to open the public app. Student answers and profiles remain in the current browser’s IndexedDB. They are not uploaded to GitHub. Switching Chromebooks still requires export/import; Google sign-in does not enable app sync. Progress from the private Sites origin also needs manual backup transfer.

Publication verification and commit information are recorded after the public deployment completes. The old live vocabulary app and the new private Sites deployment remain available at their existing URLs.
