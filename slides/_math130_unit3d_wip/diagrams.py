"""Generate all vector diagrams as transparent PNGs with matplotlib.

Colors match the deck palette. Arrow styles are consistent across figures.
"""
import os
import math
import matplotlib.pyplot as plt
import matplotlib.patches as mpatches
from matplotlib.patches import FancyArrowPatch, Arc

OUT = os.path.dirname(os.path.abspath(__file__)) + "/img"
os.makedirs(OUT, exist_ok=True)

# Palette (match deck colors)
NAVY   = "#1E3A5F"
TEAL   = "#0891B2"
ORANGE = "#F97316"
PURPLE = "#7C3AED"
RED    = "#DC2626"
MUTED  = "#64748B"
BG     = "#F8FAFC"
GRID   = "#CBD5E1"
DARK   = "#0F2B46"

plt.rcParams["font.family"] = "DejaVu Serif"
plt.rcParams["mathtext.fontset"] = "dejavuserif"


def _axes(ax, xlim, ylim, *, grid=True, tick_step=1, bg=None):
    if bg:
        ax.set_facecolor(bg)
    ax.set_xlim(*xlim); ax.set_ylim(*ylim)
    ax.set_aspect("equal")
    ax.axhline(0, color=MUTED, lw=1, zorder=1)
    ax.axvline(0, color=MUTED, lw=1, zorder=1)
    if grid:
        import numpy as np
        xs = list(range(int(xlim[0]), int(xlim[1]) + 1, tick_step))
        ys = list(range(int(ylim[0]), int(ylim[1]) + 1, tick_step))
        for x in xs:
            ax.axvline(x, color=GRID, lw=0.4, zorder=0)
        for y in ys:
            ax.axhline(y, color=GRID, lw=0.4, zorder=0)
    ax.set_xticks([]); ax.set_yticks([])
    for s in ("top", "right", "bottom", "left"):
        ax.spines[s].set_visible(False)


def arrow(ax, start, end, color, lw=2.6, style="-|>", ls="-"):
    ax.add_patch(FancyArrowPatch(
        start, end, arrowstyle=style, mutation_scale=18,
        color=color, lw=lw, linestyle=ls, zorder=5,
        shrinkA=0, shrinkB=0,
    ))


def save(fig, name):
    path = f"{OUT}/{name}.png"
    fig.savefig(path, dpi=220, transparent=True, bbox_inches="tight", pad_inches=0.05)
    plt.close(fig)
    return path


# --- Slide 5: Writing a Vector in Component Form ---------------------------
# Example MUST match text: A(-2, 5) to B(3, -1), v = <5, -6>
def fig_component_form():
    fig, ax = plt.subplots(figsize=(5.4, 5.0))
    _axes(ax, (-4, 5), (-3, 6))
    A = (-2, 5); B = (3, -1)
    # dashed right-triangle legs
    ax.plot([A[0], B[0]], [A[1], A[1]], ls="--", color=PURPLE, lw=1.6, zorder=3)
    ax.plot([B[0], B[0]], [A[1], B[1]], ls="--", color=RED,    lw=1.6, zorder=3)
    # vector arrow
    arrow(ax, A, B, TEAL, lw=3)
    # points
    for p, c in [(A, ORANGE), (B, TEAL)]:
        ax.plot(*p, "o", color=c, markersize=8, zorder=6)
    # labels
    ax.annotate("A(−2, 5)", A, xytext=(-10, 10), textcoords="offset points",
                color=ORANGE, fontsize=13, fontweight="bold")
    ax.annotate("B(3, −1)", B, xytext=(8, -4), textcoords="offset points",
                color=TEAL, fontsize=13, fontweight="bold")
    ax.text((A[0] + B[0]) / 2, A[1] + 0.35, "5", color=PURPLE,
            ha="center", fontsize=14, fontweight="bold")
    ax.text(B[0] + 0.25, (A[1] + B[1]) / 2, "−6", color=RED,
            va="center", fontsize=14, fontweight="bold")
    ax.text(0.5, -2.3, r"$\vec{v} = \langle 3-(-2),\ -1-5 \rangle = \langle 5,\ -6 \rangle$",
            color=NAVY, fontsize=12, ha="center",
            bbox=dict(boxstyle="round,pad=0.35", facecolor="white",
                      edgecolor=NAVY, lw=1))
    return save(fig, "s_component_form")


# --- Slide 6: Magnitude & Direction (v = <-3, 4>) --------------------------
# CORRECT angle arc sweeping from +x counterclockwise to the vector (126.9 deg)
def fig_magnitude_direction():
    fig, ax = plt.subplots(figsize=(5.4, 5.0))
    _axes(ax, (-5, 4), (-1, 5))
    V = (-3, 4)
    # legs
    ax.plot([0, V[0]], [0, 0], ls="--", color=RED, lw=1.5)
    ax.plot([V[0], V[0]], [0, V[1]], ls="--", color=PURPLE, lw=1.5)
    # vector
    arrow(ax, (0, 0), V, TEAL, lw=3)
    ax.plot(*V, "o", color=TEAL, markersize=8, zorder=6)
    # angle arc from +x axis CCW to vector direction (~126.87 deg)
    theta_deg = math.degrees(math.atan2(V[1], V[0]))
    arc = Arc((0, 0), 1.8, 1.8, angle=0, theta1=0, theta2=theta_deg,
              color=ORANGE, lw=2.4)
    ax.add_patch(arc)
    # label theta near middle of arc (upper region)
    mid = math.radians(theta_deg / 2)
    ax.text(1.25 * math.cos(mid), 1.25 * math.sin(mid) + 0.15, r"$\theta$",
            color=ORANGE, fontsize=17, fontweight="bold",
            ha="center", va="center")
    # point labels
    ax.annotate("(−3, 4)", V, xytext=(-12, 10), textcoords="offset points",
                color=NAVY, fontsize=13, fontweight="bold")
    ax.text(-1.5, -0.55, "−3", color=RED, ha="center", fontsize=13, fontweight="bold")
    ax.text(-3.3, 2, "4", color=PURPLE, va="center", fontsize=13, fontweight="bold")
    # magnitude label along the vector (kept horizontal for legibility)
    ax.text(-2.0, 2.5, r"$|\vec{v}|=5$", color=TEAL, fontsize=14,
            fontweight="bold")
    return save(fig, "s_magnitude_direction")


# --- Slide 9 helper: quadrant mini arrows (for overview slide) -------------
def fig_quadrant_arrows():
    fig, ax = plt.subplots(figsize=(4.2, 4.2))
    _axes(ax, (-3, 3), (-3, 3), grid=False)
    # sample vectors, one per quadrant
    samples = [((2, 2), TEAL,   "Q I"),
               ((-2, 2), PURPLE, "Q II"),
               ((-2, -2), RED,   "Q III"),
               ((2, -2), ORANGE, "Q IV")]
    for (x, y), c, label in samples:
        arrow(ax, (0, 0), (x, y), c, lw=2.5)
        ax.text(x * 1.15, y * 1.15, label, color=c, fontsize=13,
                fontweight="bold", ha="center", va="center")
    return save(fig, "s_quadrant_arrows")


# --- Slide 10: Components from |v| and theta -------------------------------
def fig_components_from_mag_theta():
    fig, ax = plt.subplots(figsize=(5.4, 5.0))
    _axes(ax, (-1, 6), (-1, 5))
    # |v| = 5, theta = 53.13 deg -> v = <3, 4>
    mag = 5.0; theta = math.radians(53.13)
    V = (mag * math.cos(theta), mag * math.sin(theta))
    # legs
    ax.plot([0, V[0]], [0, 0], ls="--", color=TEAL, lw=1.6)
    ax.plot([V[0], V[0]], [0, V[1]], ls="--", color=PURPLE, lw=1.6)
    # vector
    arrow(ax, (0, 0), V, ORANGE, lw=3)
    ax.plot(*V, "o", color=ORANGE, markersize=8, zorder=6)
    # angle arc
    arc = Arc((0, 0), 1.6, 1.6, angle=0, theta1=0,
              theta2=math.degrees(theta), color=NAVY, lw=2)
    ax.add_patch(arc)
    ax.text(1.0, 0.35, r"$\theta$", color=NAVY, fontsize=15, fontweight="bold")
    # leg labels
    ax.text(V[0] / 2, -0.4, r"$v_x=|\vec{v}|\cos\theta$", color=TEAL,
            ha="center", fontsize=12, fontweight="bold")
    ax.text(V[0] + 0.2, V[1] / 2, r"$v_y=|\vec{v}|\sin\theta$", color=PURPLE,
            va="center", fontsize=12, fontweight="bold")
    # magnitude label
    ax.text(V[0] / 2 - 0.5, V[1] / 2 + 0.25, r"$|\vec{v}|$", color=ORANGE,
            fontsize=14, fontweight="bold",
            rotation=math.degrees(theta))
    ax.annotate(f"({V[0]:.0f}, {V[1]:.0f})", V, xytext=(8, 6),
                textcoords="offset points", color=NAVY, fontsize=12,
                fontweight="bold")
    return save(fig, "s_components_from_mag_theta")


# --- Slide 11: Vector Addition tip-to-tail (correct) -----------------------
def fig_vector_addition():
    fig, ax = plt.subplots(figsize=(5.6, 5.0))
    _axes(ax, (-2, 5), (-3, 5))
    u = (3, -2); v = (-1, 5)
    s = (u[0] + v[0], u[1] + v[1])  # <2, 3>
    # u from origin
    arrow(ax, (0, 0), u, TEAL, lw=3)
    # v FROM TIP OF U
    arrow(ax, u, s, ORANGE, lw=3)
    # resultant from origin
    arrow(ax, (0, 0), s, PURPLE, lw=3, ls="--")
    # labels
    # labels offset clear of the arrows
    ax.text(1.2, -2.4, r"$\vec{u}=\langle 3,-2\rangle$",
            color=TEAL, fontsize=12, fontweight="bold")
    ax.text(3.1, 1.2, r"$\vec{v}=\langle -1,5\rangle$",
            color=ORANGE, fontsize=12, fontweight="bold")
    ax.text(-1.6, 2.2, r"$\vec{u}+\vec{v}$", color=PURPLE,
            fontsize=13, fontweight="bold")
    ax.text(-1.6, 1.5, r"$=\langle 2,3\rangle$", color=PURPLE,
            fontsize=12, fontweight="bold")
    # points
    ax.plot(0, 0, "o", color=NAVY, markersize=6, zorder=6)
    ax.plot(*u, "o", color=TEAL, markersize=6, zorder=6)
    ax.plot(*s, "o", color=PURPLE, markersize=6, zorder=6)
    return save(fig, "s_vector_addition")


# --- Slide 12: Scalar multiplication (CORRECT -v direction) ---------------
def fig_scalar_multiplication():
    fig, ax = plt.subplots(figsize=(6.2, 4.6))
    _axes(ax, (-5, 6), (-4, 4))
    v = (2, 1)
    two_v = (4, 2)
    half_v = (1, 0.5)
    neg_v = (-2, -1)
    arrow(ax, (0, 0), two_v,  ORANGE, lw=3)
    arrow(ax, (0, 0), v,      TEAL,   lw=3)
    arrow(ax, (0, 0), half_v, PURPLE, lw=3)
    arrow(ax, (0, 0), neg_v,  RED,    lw=3)
    ax.annotate(r"$2\vec{v}=\langle 4,2\rangle$", two_v,
                xytext=(6, 4), textcoords="offset points",
                color=ORANGE, fontsize=12, fontweight="bold")
    ax.annotate(r"$\vec{v}=\langle 2,1\rangle$", v,
                xytext=(-70, 14), textcoords="offset points",
                color=TEAL, fontsize=12, fontweight="bold")
    ax.annotate(r"$\frac{1}{2}\vec{v}$", half_v,
                xytext=(6, -14), textcoords="offset points",
                color=PURPLE, fontsize=12, fontweight="bold")
    ax.annotate(r"$-\vec{v}=\langle -2,-1\rangle$", neg_v,
                xytext=(-120, -4), textcoords="offset points",
                color=RED, fontsize=12, fontweight="bold")
    return save(fig, "s_scalar_multiplication")


# --- Slide for "You Try" problem (a vector from (-4,-2) to (2,1)) ---------
def fig_you_try():
    fig, ax = plt.subplots(figsize=(5.4, 4.6))
    _axes(ax, (-6, 4), (-4, 3))
    P = (-4, -2); Q = (2, 1)
    arrow(ax, P, Q, TEAL, lw=3)
    ax.plot(*P, "o", color=ORANGE, markersize=8, zorder=6)
    ax.plot(*Q, "o", color=TEAL, markersize=8, zorder=6)
    ax.annotate("P(−4, −2)", P, xytext=(-12, -16), textcoords="offset points",
                color=ORANGE, fontsize=12, fontweight="bold")
    ax.annotate("Q(2, 1)", Q, xytext=(8, 6), textcoords="offset points",
                color=TEAL, fontsize=12, fontweight="bold")
    # legs
    ax.plot([P[0], Q[0]], [P[1], P[1]], ls="--", color=PURPLE, lw=1.3)
    ax.plot([Q[0], Q[0]], [P[1], Q[1]], ls="--", color=RED, lw=1.3)
    return save(fig, "s_you_try")


if __name__ == "__main__":
    for fn in [fig_component_form, fig_magnitude_direction,
               fig_quadrant_arrows, fig_components_from_mag_theta,
               fig_vector_addition, fig_scalar_multiplication,
               fig_you_try]:
        print("Wrote:", fn())
