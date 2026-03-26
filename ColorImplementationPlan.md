# Color Architecture Implementation Plan

This document outlines the step-by-step technical strategy for migrating the Prof. Volk's Office codebase from its current state (332 raw literal colors and 160 scattered tokens across 65 files) to the unified **Parchment, Emerald, and Ink** 3-tier token architecture.

---

## Phase 1: Establish the New Foundation

Before modifying any existing files, the new design system must be established in the global stylesheet. 

**Action:** Replace the existing `:root` and `[data-theme="dark"]` blocks in `styles.css` with the consolidated 3-tier architecture.

```css
/* ==========================================================================
   UNIFIED COLOR SYSTEM
   ========================================================================== */
:root {
  /* TIER 1: GLOBAL TOKENS (The Palette) */
  --color-parchment-elevated: #ffffff;
  --color-parchment-base:     #fcfaf7;
  --color-parchment-warm:     #f4f0e6;
  --color-parchment-muted:    #e8e2d2;
  --color-parchment-deep:     #d3cbb8;

  --color-emerald-mist:       #ecfdf5;
  --color-emerald-light:      #6ee7b7;
  --color-emerald-base:       #10b981;
  --color-emerald-surface:    #047857;
  --color-emerald-deep:       #064e3b;

  --color-ink-inverse:        #ffffff;
  --color-ink-muted:          #a8a29e;
  --color-ink-soft:           #78716c;
  --color-ink-base:           #44403c;
  --color-ink-earth:          #292524;
  --color-ink-strong:         #1c1917;

  --overlay-light:            rgba(28, 25, 23, 0.05);
  --overlay-medium:           rgba(28, 25, 23, 0.25);
  --overlay-dark:             rgba(28, 25, 23, 0.60);

  /* TIER 2: SEMANTIC TOKENS (Light Mode Defaults) */
  --bg-body:                  var(--color-parchment-base);
  --bg-surface:               var(--color-parchment-elevated);
  --bg-subtle:                var(--color-parchment-warm);
  --bg-inverse:               var(--color-ink-strong);
  
  --text-heading:             var(--color-ink-strong);
  --text-body:                var(--color-ink-base);
  --text-muted:               var(--color-ink-soft);
  --text-on-primary:          var(--color-ink-inverse);
  
  --primary-base:             var(--color-emerald-base);
  --primary-hover:            var(--color-emerald-light);
  --primary-surface:          var(--color-emerald-surface);
  --primary-text:             var(--color-emerald-mist);

  --border-subtle:            var(--color-parchment-muted);
  --border-base:              var(--color-parchment-deep);
}

/* DARK MODE OVERRIDES (Swapping Semantics) */
[data-theme="dark"] {
  --bg-body:                  var(--color-ink-earth);
  --bg-surface:               var(--color-ink-strong);
  --bg-subtle:                var(--color-ink-base);
  --bg-inverse:               var(--color-parchment-elevated);
  
  --text-heading:             var(--color-parchment-elevated);
  --text-body:                var(--color-parchment-warm);
  --text-muted:               var(--color-ink-muted);
  --text-on-primary:          var(--color-ink-inverse);
  
  --border-subtle:            var(--color-ink-base);
  --border-base:              var(--color-ink-soft);
  
  --overlay-light:            rgba(255, 255, 255, 0.05);
}