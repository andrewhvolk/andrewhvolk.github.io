# Andrew H. Volk Teaching Site

This repository contains the source for a static academic website with course materials, projects, and professional information.

## Repository Structure

- `index.html`, `CV.html`, `learn.html`, `projects.html`: core public pages.
- `courses/`: course-specific pages, handouts, and lab resources.
- `pdfs/`: downloadable PDFs used by course and project pages.
- `slides/`: slide exports (`.pdf`, `.pptx`, image previews).
- `projects/`: project-specific assets and interactive pages.
- `styles.css`, `theme.js`: shared styling and theme behavior.

## Updating Content

1. Edit the relevant HTML page (for example, `courses/math114.html`).
2. Add/update referenced assets in the matching directory (`pdfs/`, `slides/`, `projects/`, etc.).
3. Verify that all local links still resolve.
4. Commit and publish.

## Recommended Validation

Run this local check before pushing to catch broken local `href` links:

```bash
python - <<'PY'
import os,re,glob
htmls=[p for p in glob.glob('**/*.html', recursive=True) if '.git/' not in p]
missing=[]
for f in htmls:
    txt=open(f,encoding='utf-8',errors='ignore').read()
    for m in re.finditer(r'href=["\']([^"\']+)["\']', txt, re.I):
        h=m.group(1)
        if h.startswith(('http://','https://','mailto:','tel:','#','javascript:')):
            continue
        h=h.split('#')[0].split('?')[0]
        if not h:
            continue
        p=os.path.normpath(os.path.join(os.path.dirname(f), h))
        if not os.path.exists(p):
            missing.append((f,h,p))
print(f"Scanned {len(htmls)} HTML files")
if missing:
    print("Missing local href targets:")
    for f,h,p in missing:
        print(f"- {f}: {h} -> {p}")
    raise SystemExit(1)
print("No missing local href targets found.")
PY
```

## Notes

- Prefer canonical PDFs for finalized handouts.
- If a resource is not yet available, avoid placeholder links and show clear "coming soon" text.
