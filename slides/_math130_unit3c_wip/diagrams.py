"""Generate diagrams for Math 130 Unit 3C improvements.

Run from the _math130_unit3c_wip directory:
    python3 diagrams.py

Produces transparent PNGs in img/ at 220 dpi sized for the slide layout (~5.4 x 4.5 in).
Requires matplotlib.
"""

import os
import math
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import matplotlib.patches as mpatches
from matplotlib.patches import FancyArrowPatch, Arc

OUT = os.path.join(os.path.dirname(__file__), "img")
os.makedirs(OUT, exist_ok=True)

# Palette matching the deck
NAVY   = "#1E3A5F"
TEAL   = "#0891B2"
ORANGE = "#F97316"
PURPLE = "#7C3AED"
GREEN  = "#059669"
MUTED  = "#64748B"
BG     = "#F8FAFC"

DPI    = 220
W, H   = 4.8, 4.2   # figure size in inches


def save(fig, name):
    path = os.path.join(OUT, name)
    fig.savefig(path, dpi=DPI, transparent=True, bbox_inches="tight")
    plt.close(fig)
    print(f"  wrote {path}")


# ---------------------------------------------------------------------------
# 1. s_skill2_ladder.png
#    Right triangle: ground (horizontal), wall (vertical), ladder (hyp=20ft)
#    Angle at base = 65°, unknown h = opposite (wall height).
# ---------------------------------------------------------------------------
def make_skill2_ladder():
    fig, ax = plt.subplots(figsize=(W, H))
    ax.set_aspect("equal")
    ax.axis("off")
    fig.patch.set_alpha(0)

    angle_deg = 65
    angle_rad = math.radians(angle_deg)
    hyp = 4.0          # drawing units (represents 20 ft)
    base = hyp * math.cos(angle_rad)   # ≈ 1.69
    height = hyp * math.sin(angle_rad) # ≈ 3.62

    # --- Ground ---
    ax.plot([0, base], [0, 0], color=NAVY, lw=2.5, solid_capstyle="round")
    # --- Wall ---
    ax.plot([base, base], [0, height], color=NAVY, lw=2.5, solid_capstyle="round")
    # --- Ladder (hypotenuse) ---
    ax.plot([0, base], [0, height], color=ORANGE, lw=3, solid_capstyle="round", zorder=3)

    # Right-angle marker at base of wall
    sq = 0.15
    ax.plot([base - sq, base - sq, base], [0, sq, sq], color=NAVY, lw=1.5)

    # Angle arc at base of ladder
    arc_r = 0.55
    arc = Arc((0, 0), 2 * arc_r, 2 * arc_r,
              angle=0, theta1=0, theta2=angle_deg,
              color=TEAL, lw=2)
    ax.add_patch(arc)
    mid_angle = math.radians(angle_deg / 2)
    ax.text(arc_r * 0.75 * math.cos(mid_angle) + 0.12,
            arc_r * 0.75 * math.sin(mid_angle),
            f"{angle_deg}°", color=TEAL, fontsize=13, fontweight="bold",
            ha="left", va="bottom")

    # Labels
    # Ladder label (midpoint)
    mx, my = base / 2 - 0.25, height / 2 + 0.18
    ax.text(mx, my, "20 ft", color=ORANGE, fontsize=13, fontweight="bold",
            ha="center", va="center", rotation=angle_deg)

    # h label (wall midpoint, right side)
    ax.annotate("", xy=(base + 0.35, height), xytext=(base + 0.35, 0),
                arrowprops=dict(arrowstyle="<->", color=PURPLE, lw=1.8))
    ax.text(base + 0.55, height / 2, "h = ?", color=PURPLE,
            fontsize=13, fontweight="bold", ha="left", va="center")

    # Ground label
    ax.text(base / 2, -0.25, "ground", color=MUTED, fontsize=11,
            ha="center", va="top")

    ax.set_xlim(-0.4, base + 1.3)
    ax.set_ylim(-0.55, height + 0.5)

    save(fig, "s_skill2_ladder.png")


# ---------------------------------------------------------------------------
# 2. s_you_try.png
#    Angle-of-elevation problem: observer 80 ft from building base,
#    elevation angle 42°, find height h.
# ---------------------------------------------------------------------------
def make_you_try():
    fig, ax = plt.subplots(figsize=(W, H))
    ax.set_aspect("equal")
    ax.axis("off")
    fig.patch.set_alpha(0)

    angle_deg = 42
    angle_rad = math.radians(angle_deg)
    base = 3.8          # drawing units (represents 80 ft)
    height = base * math.tan(angle_rad)   # ≈ 3.42

    # --- Ground ---
    ax.plot([-0.3, base + 0.1], [0, 0], color=NAVY, lw=2.5, solid_capstyle="round")

    # --- Building (wall) ---
    ax.plot([base, base], [0, height], color=NAVY, lw=4, solid_capstyle="round")
    # Building roof cap
    ax.plot([base - 0.12, base + 0.12], [height, height], color=NAVY, lw=3)

    # Right-angle marker at base of building
    sq = 0.15
    ax.plot([base - sq, base - sq, base], [0, sq, sq], color=NAVY, lw=1.5)

    # --- Line of sight (elevation) ---
    ax.plot([0, base], [0, height], color=TEAL, lw=2,
            linestyle="--", solid_capstyle="round")

    # --- Horizontal dashed reference from observer ---
    ax.plot([0, base * 0.55], [0, 0], color=MUTED, lw=1.5, linestyle=":")

    # Angle arc at observer
    arc_r = 0.6
    arc = Arc((0, 0), 2 * arc_r, 2 * arc_r,
              angle=0, theta1=0, theta2=angle_deg,
              color=ORANGE, lw=2.2)
    ax.add_patch(arc)
    mid_angle = math.radians(angle_deg / 2)
    ax.text(arc_r * 0.8 * math.cos(mid_angle) + 0.1,
            arc_r * 0.8 * math.sin(mid_angle) + 0.05,
            f"{angle_deg}°", color=ORANGE, fontsize=13, fontweight="bold",
            ha="left", va="bottom")

    # Observer dot
    ax.plot(0, 0, "o", color=NAVY, markersize=7, zorder=5)
    ax.text(-0.15, -0.22, "observer", color=MUTED, fontsize=10,
            ha="center", va="top")

    # Base distance label
    ax.annotate("", xy=(base, -0.32), xytext=(0, -0.32),
                arrowprops=dict(arrowstyle="<->", color=NAVY, lw=1.6))
    ax.text(base / 2, -0.48, "80 ft", color=NAVY, fontsize=13,
            fontweight="bold", ha="center", va="top")

    # h label (wall, right side)
    ax.annotate("", xy=(base + 0.45, height), xytext=(base + 0.45, 0),
                arrowprops=dict(arrowstyle="<->", color=PURPLE, lw=1.8))
    ax.text(base + 0.65, height / 2, "h = ?", color=PURPLE,
            fontsize=13, fontweight="bold", ha="left", va="center")

    ax.set_xlim(-0.5, base + 1.4)
    ax.set_ylim(-0.75, height + 0.5)

    save(fig, "s_you_try.png")


if __name__ == "__main__":
    print("Generating Math 130 Unit 3C diagrams …")
    make_skill2_ladder()
    make_you_try()
    print("Done.")
