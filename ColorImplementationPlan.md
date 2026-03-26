Color Architecture Implementation Plan

This document outlines the step-by-step technical strategy for migrating the Prof. Volk's Office codebase from its current state (332 raw literal colors and 160 scattered tokens across 65 files) to the unified Parchment, Emerald, and Ink 3-tier token architecture.

Phase 1: Establish the New Foundation

Before modifying any existing files, the new design system must be established in the global stylesheet.

Action: Replace the existing :root and [data-theme="dark"] blocks in styles.css with the consolidated 3-tier architecture.

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


Pro-Tip: Never use Tier 1 tokens (e.g., --color-emerald-base) directly in your component CSS. Always use Tier 2 tokens (e.g., --primary-base) so that dark mode toggling works automatically.

Phase 2: The Literal Color Purge

This phase involves running global "Find and Replace" operations across all 65 files to eliminate hardcoded hex codes, RGBs, and browser color names.

Hex Code Consolidation Mapping

Use this mapping table to snap your "Gray Smear" and rogue brand colors to the new Semantic Tokens.

Old Literal Colors

Target Context

Replace With Semantic Token

#ccc, #d1d5db, #ddd, #e0e0e0, #e5e7eb

Borders / Dividers

var(--border-subtle)

#333, #44403c, #555, #4b5563

Body Text

var(--text-body)

#000, #111827, #1f2937, #1c1917

Headings / Bold Text

var(--text-heading)

#f0f0f0, #f3f4f6, #f4f4f4, #f5f5f5

Secondary Backgrounds

var(--bg-subtle)

#fff, #ffffff, white

Cards / Main Backgrounds

var(--bg-surface)

#fff, #ffffff, white

Text inside Primary Buttons

var(--text-on-primary)

#10b981, #059669, #2ecc71, green

Primary Buttons / Links

var(--primary-base)

#ecfdf5, #d1fae5, #d5f5e3

Success/Accent Backgrounds

var(--primary-surface)

Opacity Flattening

You currently have 80+ unique rgba() strings with granular opacities (e.g., 0.02, 0.86, 0.98).

Action: Strip all rgba() definitions and replace them with standard Overlays or standard Surface tokens.

Shadows and Light Borders: Replace rgba(0,0,0,0.05) through rgba(0,0,0,0.15) with var(--overlay-light).

Modal Backdrops / Dimming: Replace rgba(0,0,0,0.3) through rgba(0,0,0,0.8) with var(--overlay-dark).

Glassmorphism Backgrounds: Replace rgba(255,255,255,0.85) with var(--bg-surface). Rely on solid colors to improve performance and dark-mode compatibility.

Phase 3: Token Consolidation

You currently have 160 unique tokens. Many are duplicates doing the exact same job. You must redirect these legacy tokens to the new Semantic Tier.

Action: Execute a global search and replace for these legacy variables.

Legacy Token Name

Semantic Role

Replace With New Token

--text, --text-color, --semantic-body

Standard Paragraph Text

var(--text-body)

--text-muted, --muted-text-color, --review-muted

Helper Text / Subtitles

var(--text-muted)

--light-text, --on-primary, --on-secondary

Text on Dark Backgrounds

var(--text-on-primary)

--bg, --background-color, --review-bg

Page Background

var(--bg-body)

--surface, --card-background, --review-surface

Elevated Cards

var(--bg-surface)

--border, --review-border, --ghost-outline

Standard Lines

var(--border-subtle)

--primary, --accent, --primary-color

Main Brand Actions

var(--primary-base)

Phase 4: Workflow & Execution Strategy

To avoid breaking the UI, do not attempt to replace all 332 colors in a single commit. Follow this incremental workflow:

Inject the New System: Add the new :root variables to styles.css. Leave the old variables at the bottom of the file temporarily.

Tackle the HTML/Inline Styles First: Search your .html files for style="color: # or style="background: #. Replace these with standard utility classes or map them to the new CSS variables.

Purge Legacy Tokens: Search through styles.css for references to --text-color and replace them with --text-body.

Prune the Literals in CSS: Go through styles.css rule by rule. When you see border: 1px solid #ccc;, change it to border: 1px solid var(--border-subtle);.

The Final Deletion: Once all components are mapped to the new Semantic Tokens, delete the legacy :root definitions at the bottom of styles.css.

Pro-Tip (Dark Mode QA): The biggest point of failure during color refactoring is hardcoding a light color where a dark color should go. After mapping a component, immediately toggle Dark Mode to ensure the Semantic Token swaps correctly. If text becomes invisible, you likely hardcoded var(--color-ink-strong) instead of using the semantic var(--text-heading).