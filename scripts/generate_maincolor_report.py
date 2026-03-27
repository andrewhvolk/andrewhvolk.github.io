#!/usr/bin/env python3
"""Generate maincolor.md from index.html and directly linked internal HTML pages.

Includes:
- inline/style-block color usage inside each analyzed HTML file
- shared linked CSS files used by those pages
"""

from __future__ import annotations

from collections import Counter
from datetime import datetime, timezone
from pathlib import Path
import re

ROOT = Path('.')
INDEX = ROOT / 'index.html'

HREF_RE = re.compile(r'href\s*=\s*["\']([^"\']+)["\']', re.IGNORECASE)
STYLE_BLOCK_RE = re.compile(r'<style\b[^>]*>(.*?)</style>', re.IGNORECASE | re.DOTALL)
INLINE_STYLE_RE = re.compile(r'\bstyle\s*=\s*(["\'])(.*?)\1', re.IGNORECASE | re.DOTALL)
SVG_ATTR_RE = re.compile(r'\b(fill|stroke|stop-color|flood-color|lighting-color|color|bgcolor)\s*=\s*(["\'])(.*?)\2', re.IGNORECASE | re.DOTALL)
DECL_RE = re.compile(r'([a-zA-Z-]+)\s*:\s*([^;}{]+)')
VAR_RE = re.compile(r'var\(--[a-zA-Z0-9_-]+\)', re.IGNORECASE)
HEX_RE = re.compile(r'#[0-9a-fA-F]{3,8}\b')
FUNC_RE = re.compile(r'(?i)(?:rgba?|hsla?|hwb|lab|lch|oklab|oklch|color|device-cmyk|color-mix)\([^\)]*\)')
WORD_RE = re.compile(r'\b[a-zA-Z]+\b')

COLOR_PROPS = {
    'color','background','background-color','border','border-top','border-right','border-bottom','border-left',
    'border-color','border-top-color','border-right-color','border-bottom-color','border-left-color','outline',
    'outline-color','box-shadow','text-shadow','fill','stroke','stop-color','flood-color','lighting-color',
    'column-rule','column-rule-color','caret-color','accent-color','text-decoration-color','text-emphasis-color',
    '-webkit-text-fill-color','-webkit-text-stroke-color'
}

BASIC_COLORS = {
    'black','white','gray','grey','red','green','blue','purple','transparent','currentcolor','canvas','canvastext',
    'highlight','highlighttext','yellow','orange','pink','teal','indigo','lime'
}


def is_internal(path_text: str) -> bool:
    return not (
        path_text.startswith('http://')
        or path_text.startswith('https://')
        or path_text.startswith('mailto:')
        or path_text.startswith('#')
        or path_text.startswith('tel:')
    )


def norm_internal(path_text: str) -> str:
    return path_text.lstrip('/')


def is_color_prop(prop: str) -> bool:
    p = prop.lower().strip()
    return p in COLOR_PROPS or p.startswith('background-') or (p.startswith('border-') and p.endswith('color'))


def collect_from_value(value: str, counts: Counter, type_counts: dict[str, int]) -> None:
    for m in VAR_RE.finditer(value):
        counts[m.group(0).lower()] += 1
        type_counts['tokenized'] += 1
    for m in HEX_RE.finditer(value):
        counts[m.group(0).lower()] += 1
        type_counts['literal'] += 1
    for m in FUNC_RE.finditer(value):
        counts[re.sub(r'\s+', '', m.group(0).lower())] += 1
        type_counts['literal'] += 1
    for m in WORD_RE.finditer(value):
        w = m.group(0).lower()
        if w in BASIC_COLORS:
            counts[w] += 1
            type_counts['basic'] += 1


def analyze_css_text(css_text: str) -> tuple[Counter, dict[str, int]]:
    counts = Counter()
    type_counts = {'tokenized': 0, 'literal': 0, 'basic': 0}
    for prop, value in DECL_RE.findall(css_text):
        if is_color_prop(prop):
            collect_from_value(value, counts, type_counts)
    return counts, type_counts


def analyze_html(path: Path) -> tuple[Counter, dict[str, int], list[str]]:
    text = path.read_text(encoding='utf-8', errors='ignore')
    counts = Counter()
    type_counts = {'tokenized': 0, 'literal': 0, 'basic': 0}

    # Analyze style-bearing HTML segments
    chunks = [m.group(1) for m in STYLE_BLOCK_RE.finditer(text)]
    chunks.extend(m.group(2) for m in INLINE_STYLE_RE.finditer(text))
    chunks.extend(m.group(3) for m in SVG_ATTR_RE.finditer(text))

    for chunk in chunks:
        c_counts, c_types = analyze_css_text(chunk)
        counts.update(c_counts)
        for k in type_counts:
            type_counts[k] += c_types[k]

    # Collect linked CSS files
    linked_css: list[str] = []
    for m in HREF_RE.finditer(text):
        href = m.group(1).strip()
        if href.endswith('.css') and is_internal(href):
            linked_css.append(norm_internal(href))

    return counts, type_counts, linked_css


def main() -> None:
    index_html = INDEX.read_text(encoding='utf-8', errors='ignore')

    html_refs = {'index.html'}
    for m in HREF_RE.finditer(index_html):
        href = m.group(1).strip()
        if href.endswith('.html') and is_internal(href):
            html_refs.add(norm_internal(href))

    html_files = sorted(f for f in html_refs if (ROOT / f).exists())

    # Analyze HTML files and collect linked CSS files from them.
    per_html: dict[str, tuple[Counter, dict[str, int]]] = {}
    css_refs: set[str] = set()
    aggregate_html = Counter()

    for file_rel in html_files:
        counts, types, css_links = analyze_html(ROOT / file_rel)
        per_html[file_rel] = (counts, types)
        aggregate_html.update(counts)
        css_refs.update(css_links)

    css_files = sorted(f for f in css_refs if (ROOT / f).exists())
    per_css: dict[str, tuple[Counter, dict[str, int]]] = {}
    aggregate_css = Counter()

    for css_rel in css_files:
        css_text = (ROOT / css_rel).read_text(encoding='utf-8', errors='ignore')
        counts, types = analyze_css_text(css_text)
        per_css[css_rel] = (counts, types)
        aggregate_css.update(counts)

    lines: list[str] = []
    lines.append('# Main Navigation Color Analysis')
    lines.append(f'_Generated: {datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M UTC")}_')
    lines.append('')
    lines.append('## Scope')
    lines.append('- Entry page: `index.html`.')
    lines.append('- Included HTML: `index.html` + each internal `.html` linked directly from it.')
    lines.append('- Included CSS: internal `.css` files linked by those pages.')
    lines.append('')

    lines.append('## HTML files analyzed')
    for rel in html_files:
        lines.append(f'- `{rel}`')
    lines.append('')
    lines.append('## HTML inline/style color summary')
    lines.append('')
    lines.append('| File | Tokenized | Literal | Basic | Unique entries | Top entries |')
    lines.append('|---|---:|---:|---:|---:|---|')
    for rel in html_files:
        counts, types = per_html[rel]
        top = ', '.join(f'`{k}` ({v})' for k, v in counts.most_common(5)) if counts else 'None detected'
        lines.append(f'| `{rel}` | {types["tokenized"]} | {types["literal"]} | {types["basic"]} | {len(counts)} | {top} |')

    lines.append('')
    lines.append('## Linked CSS files analyzed')
    for rel in css_files:
        lines.append(f'- `{rel}`')

    lines.append('')
    lines.append('## Linked CSS color summary')
    lines.append('')
    lines.append('| CSS file | Tokenized | Literal | Basic | Unique entries | Top entries |')
    lines.append('|---|---:|---:|---:|---:|---|')
    for rel in css_files:
        counts, types = per_css[rel]
        top = ', '.join(f'`{k}` ({v})' for k, v in counts.most_common(8)) if counts else 'None detected'
        lines.append(f'| `{rel}` | {types["tokenized"]} | {types["literal"]} | {types["basic"]} | {len(counts)} | {top} |')

    lines.append('')
    lines.append('## Aggregate (HTML inline/style only)')
    lines.append('| Color | Uses |')
    lines.append('|---|---:|')
    for color, uses in aggregate_html.most_common(20):
        lines.append(f'| `{color}` | {uses} |')

    lines.append('')
    lines.append('## Aggregate (linked CSS only)')
    lines.append('| Color | Uses |')
    lines.append('|---|---:|')
    for color, uses in aggregate_css.most_common(30):
        lines.append(f'| `{color}` | {uses} |')

    lines.append('')
    lines.append('## Notes')
    lines.append('- For this navigation set, most color usage comes from shared stylesheet tokens in linked CSS rather than inline HTML styles.')

    Path('maincolor.md').write_text('\n'.join(lines) + '\n', encoding='utf-8')
    print(f'Wrote maincolor.md (HTML files: {len(html_files)}, CSS files: {len(css_files)})')


if __name__ == '__main__':
    main()
