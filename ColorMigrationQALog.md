# Color Migration QA Log

This companion QA document is the **repeatable archive location** for required color-migration PR evidence.

## Required evidence per color migration PR

For every color migration PR, record and attach all four artifacts below:

1. `colors.md` **before/after excerpt** (inventory delta evidence).
2. **Generic alias collision check** result.
3. **Unapproved literal status-color check** result.
4. **Print + forced-colors presence verification** result.

> Policy: A color migration PR is not QA-complete until all four artifacts are present in this log.

## Command templates (repeatable)

Run these from repo root and paste results in the matching PR section.

### 1) Generic alias collision check
```bash
rg -n --no-heading --glob '*.css' --glob '*.html' -- "var\\(--(text|bg|surface|border|accent)\\)"
```

### 2) Unapproved literal status-color check
```bash
rg -n --no-heading --glob '*.css' --glob '*.html' -- "(success|warning|error|info)[^\\n]*?(#([0-9a-fA-F]{3,8})|rgba?\\()"
```

### 3) Print + forced-colors presence verification
```bash
rg -n --no-heading --glob '*.css' --glob '*.html' -- "@media\\s*print|@media\\s*\\(forced-colors:\\s*active\\)"
```

### 4) `colors.md` before/after excerpt capture
```bash
# Example pattern: capture summary block for attachment
sed -n '1,120p' colors.md
```

## PR Evidence Entries

Copy this template for each color migration PR.

---

### PR #<number> — <title>
- Date (UTC): `<YYYY-MM-DD>`
- Scope: `<files or bucket>`
- Owner: `<name>`

#### 1) `colors.md` before/after excerpt
- Before (commit `<sha>`):
```text
<paste excerpt>
```
- After (commit `<sha>`):
```text
<paste excerpt>
```

#### 2) Generic alias collision check result
Command:
```bash
rg -n --no-heading --glob '*.css' --glob '*.html' -- "var\\(--(text|bg|surface|border|accent)\\)"
```
Output:
```text
<paste output>
```

#### 3) Unapproved literal status-color check result
Command:
```bash
rg -n --no-heading --glob '*.css' --glob '*.html' -- "(success|warning|error|info)[^\\n]*?(#([0-9a-fA-F]{3,8})|rgba?\\()"
```
Output:
```text
<paste output>
```

#### 4) Print + forced-colors presence verification
Command:
```bash
rg -n --no-heading --glob '*.css' --glob '*.html' -- "@media\\s*print|@media\\s*\\(forced-colors:\\s*active\\)"
```
Output:
```text
<paste output>
```

#### Sign-off
- [ ] Evidence complete and attached to PR
- [ ] Reviewer verified outputs match PR diff
- [ ] Tracker + PR checklist updated
