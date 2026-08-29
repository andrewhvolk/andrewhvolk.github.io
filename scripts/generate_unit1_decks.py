"""Generate the five offline MATH 130 Unit 1 HTML lecture decks.

The decks share the Reveal/MathJax runtime already used by Units 2 and 3.
Canvas dates are shown as pacing anchors; assessment coverage remains instructor-controlled.
"""

from __future__ import annotations

import html
import json
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
SLIDES = ROOT / "slides"


def section(
    deck_id: str,
    number: int,
    title: str,
    body: str,
    *,
    component: str,
    phase: str,
    minutes: float,
    objectives: str,
    notes: str = "",
) -> str:
    note_html = f'<aside class="notes"><p>{html.escape(notes)}</p></aside>' if notes else ""
    return (
        f'<section class="component-slide component-{component}" '
        f'data-title="{html.escape(title, quote=True)}" '
        f'data-block-id="{deck_id.lower()}-{number:02d}" data-phase="{phase}" '
        f'data-component="{component}" data-objectives="{html.escape(objectives, quote=True)}" '
        f'data-minutes="{minutes:.1f}"><h2>{title}</h2>{body}'
        f'<p class="slide-meta"><span>{phase.title()} · {minutes:.0f} min</span>'
        f'<span>Unit 1 sequence</span></p>{note_html}</section>'
    )


def practice(deck_id: str, number: int, title: str, prompt: str, solution: str, objectives: str, minutes: float = 5) -> str:
    answer_id = f"{deck_id.lower()}-{number:02d}-answer"
    body = (
        '<div class="practice-panel"><span class="card-label">Work first · then reveal</span>'
        f'<p>{prompt}</p><button class="answer-toggle" type="button" '
        f'data-answer-toggle="{answer_id}">Reveal solution</button>'
        f'<div id="{answer_id}" class="solution-panel" data-answer hidden>'
        f'<span class="card-label">Solution and self-check</span>{solution}</div></div>'
    )
    return section(
        deck_id,
        number,
        title,
        body,
        component="practice",
        phase="practice",
        minutes=minutes,
        objectives=objectives,
        notes="Give individual work time before discussion. Ask for a method and a check, not only an answer.",
    )


def checkpoint(deck_id: str, number: int, label: str, tasks: list[str], solution: str, objectives: str) -> str:
    answer_id = f"{deck_id.lower()}-{number:02d}-answer"
    items = "".join(f"<li>{item}</li>" for item in tasks)
    body = (
        f'<span class="pacing-badge">{html.escape(label)}</span>'
        '<div class="practice-panel"><span class="card-label">Closed notes · show complete work</span>'
        f'<ol>{items}</ol><button class="answer-toggle" type="button" data-answer-toggle="{answer_id}">Reveal key</button>'
        f'<div id="{answer_id}" class="solution-panel" data-answer hidden>'
        f'<span class="card-label">Answer key</span>{solution}</div></div>'
    )
    return section(
        deck_id,
        number,
        f"{label}: readiness check",
        body,
        component="practice",
        phase="assess",
        minutes=8,
        objectives=objectives,
        notes="Collect or poll each item separately. Use the misses to choose the next warm-up.",
    )


DECKS = [
    {
        "id": "Math130Unit1A",
        "title": "Algebra Foundations: Factor First",
        "section": "Review R.1–R.5",
        "subtitle": "Sets, intervals, absolute value, exponent rules, factoring, and rational expressions",
        "assessment": "Quiz 1 · Sep 2 at 2:10 PM",
        "aleks": "ALEKS Review R.1–R.3 and R.4–R.5 due Sep 2 at 2:10 PM",
        "objective_ids": "u1a-interval u1a-exponents u1a-factor u1a-rational",
        "objectives": [
            "translate intervals and solve basic absolute-value equations",
            "simplify products and quotients using exponent rules",
            "factor completely by choosing a method in a reliable order",
            "simplify rational expressions while preserving restrictions",
        ],
        "slides": [
            ("Entrance retrieval", '<div class="poll-panel"><span class="card-label">3 minutes · no notes</span><ol><li>Write $-2&lt;x\\le4$ in interval notation.</li><li>Simplify $x^7/x^{10}$ with positive exponents.</li><li>Factor $6x^3-9x^2$ completely.</li></ol><p class="poll-instruction">Commit to all three before comparing.</p></div>', "poll", "activate", 4, "u1a-interval u1a-exponents u1a-factor"),
            ("Intervals and absolute value describe location", '<div class="comparison-grid"><div class="component-card"><span class="card-label">Interval endpoints</span><p>$x\\ge a\\Rightarrow[a,\\infty)$</p><p>$x&lt;b\\Rightarrow(-\\infty,b)$</p></div><div class="component-card"><span class="card-label">Distance from zero</span><p>$|u|=c\\Rightarrow u=c$ or $u=-c$, when $c\\ge0$.</p><p>$|u|$ cannot be negative.</p></div></div><div class="check-panel"><strong>Language check</strong><p>Union combines regions; intersection keeps only their overlap. Infinity always receives a parenthesis.</p></div>', "comparison", "explain", 5, "u1a-interval"),
            ("Exponent rules: name the operation first", '<div class="decision-guide"><div><span>×</span><p>Same base product: add exponents.</p></div><div><span>÷</span><p>Same base quotient: subtract exponents, top minus bottom.</p></div><div><span>^</span><p>Power of a power: multiply exponents.</p></div></div><div class="formula-focus"><p>$a^{-n}=1/a^n$ for $a\\ne0$. A negative exponent changes position, not sign.</p></div>', "decision", "explain", 5, "u1a-exponents"),
            ("Factoring: use the decision order", '<div class="decision-guide"><div><span>1</span><p>Take out the GCF.</p></div><div><span>2</span><p>Count terms: 2, 3, or 4.</p></div><div><span>3</span><p>Use a pattern, trinomial method, or grouping.</p></div><div><span>4</span><p>Multiply back to verify.</p></div></div>', "decision", "explain", 5, "u1a-factor"),
            ("Rational expressions inherit factoring", '<div class="worked-example"><div class="example-prompt"><p>Simplify $\\dfrac{3x-27}{x-8}\\cdot\\dfrac{5x-40}{6x-54}$.</p></div><ol class="worked-steps"><li class="fragment">Factor every polynomial.</li><li class="fragment">Cancel common factors, not terms: $\\dfrac{3(x-9)}{x-8}\\cdot\\dfrac{5(x-8)}{6(x-9)}$.</li><li class="fragment">Result: $5/2$, with $x\\ne8,9$ from the original expression.</li></ol></div>', "worked-example", "model", 6, "u1a-factor u1a-rational"),
            ("Error analysis: what is invalid?", '<div class="misconception-grid"><div class="warning-panel"><span class="card-label">Student claim</span><p>$\\dfrac{x+3}{x}=3$ after “canceling x.”</p></div><div class="check-panel"><strong>Diagnose</strong><p>Cancellation applies to factors. Since $x+3$ is a sum, no $x$ factor can cancel. A quick check at $x=1$ gives $4\\ne3$.</p></div></div>', "misconception", "feedback", 4, "u1a-rational"),
        ],
        "practice": [
            ("You try: connect the foundations", '<ol><li>Write $(-\\infty,5]\\cap[1,8)$ as one interval.</li><li>Solve $|x-2|=5$.</li><li>Simplify $\\dfrac{m^2n^{-1}}{m^{-4}n^3}$.</li><li>Factor $2x^3-18x$ completely.</li></ol>', '<ol><li>$[1,5]$</li><li>$x=7$ or $x=-3$</li><li>$m^6/n^4$</li><li>$2x(x-3)(x+3)$</li></ol>', "u1a-interval u1a-exponents u1a-factor"),
        ],
        "checkpoint": (
            "Quiz 1 checkpoint",
            [
                "Translate $x&lt;-1$ or $x\\ge3$ into interval notation.",
                "Solve $|2x-1|=7$.",
                "Simplify $(2x^{-2}y^3)^2$ with positive exponents.",
                "Factor $3x^2-12x+12$ completely.",
                "Simplify $\\dfrac{x^2-9}{x^2+x-6}$ and state restrictions.",
            ],
            '<ol><li>$(-\\infty,-1)\\cup[3,\\infty)$</li><li>$x=4$ or $x=-3$</li><li>$4y^6/x^4$</li><li>$3(x-2)^2$</li><li>$(x-3)/(x-2)$; $x\\ne-3,2$</li></ol>',
        ),
        "next": "Next: Unit 1B — linear equations, formulas, and lines",
    },
    {
        "id": "Math130Unit1B",
        "title": "Linear Equations and Lines",
        "section": "Review R.6 · Sections 1.1, 1.2, 1.4",
        "subtitle": "Solve, rearrange, interpret slope, and write line equations",
        "assessment": "Quiz 2 · Sep 9 at 2:10 PM",
        "aleks": "ALEKS Review R.6 and Sections 1.1, 1.2, 1.4 due Sep 9 at 2:10 PM",
        "objective_ids": "u1b-linear u1b-formula u1b-slope u1b-lines",
        "objectives": [
            "solve linear equations and identify special cases",
            "rearrange formulas for a specified variable",
            "interpret slope from points, equations, and context",
            "write parallel and perpendicular line equations",
        ],
        "slides": [
            ("Entrance retrieval", '<div class="poll-panel"><span class="card-label">4 minutes · no notes</span><ol><li>Solve $-9x+26=-4(x-9)$.</li><li>Find the slope through $(8,-8)$ and $(1,16)$.</li><li>What slope is perpendicular to $3$?</li></ol></div>', "poll", "activate", 4, "u1b-linear u1b-slope u1b-lines"),
            ("Linear equations: preserve equivalence", '<div class="decision-guide"><div><span>1</span><p>Distribute and clear grouping symbols.</p></div><div><span>2</span><p>Combine like terms on each side.</p></div><div><span>3</span><p>Move variable terms, then constants.</p></div><div><span>4</span><p>Divide and substitute back.</p></div></div><div class="check-panel"><strong>Special cases</strong><p>$0=0$ means all real numbers; a false statement such as $0=5$ means no solution.</p></div>', "decision", "explain", 5, "u1b-linear"),
            ("Literal equations: isolate the target", '<div class="worked-example"><div class="example-prompt"><p>Solve $A=P+Prt$ for $r$.</p></div><ol class="worked-steps"><li class="fragment">Subtract $P$: $A-P=Prt$.</li><li class="fragment">Divide by every factor attached to $r$.</li><li class="fragment">$r=\\dfrac{A-P}{Pt}$.</li></ol></div>', "worked-example", "model", 5, "u1b-formula"),
            ("Slope connects change to an equation", '<div class="formula-focus"><p>$m=\\dfrac{y_2-y_1}{x_2-x_1}$</p><p>Use one consistent point order. Units are “change in output per one unit of input.”</p></div><div class="comparison-grid"><div class="component-card"><p>$y=mx+b$: read $m$ and intercept quickly.</p></div><div class="component-card"><p>$y-y_1=m(x-x_1)$: write from a point and a slope.</p></div></div>', "formula", "explain", 5, "u1b-slope u1b-lines"),
            ("Model: write a line from two points", '<div class="worked-example"><div class="example-prompt"><p>Use $A(8,-8)$ and $B(1,16)$.</p></div><ol class="worked-steps"><li class="fragment">$m=(16-(-8))/(1-8)=-24/7$.</li><li class="fragment">Point-slope: $y+8=-\\frac{24}{7}(x-8)$.</li><li class="fragment">Check both original points in the equation.</li></ol></div>', "worked-example", "model", 6, "u1b-slope u1b-lines"),
            ("Parallel and perpendicular are slope decisions", '<div class="comparison-grid"><div class="component-card"><span class="card-label">Parallel</span><p>Same slope. Through $(-6,2)$ parallel to $y=3x+3$: $y-2=3(x+6)$.</p></div><div class="component-card"><span class="card-label">Perpendicular</span><p>Negative reciprocal. The perpendicular slope is $-1/3$.</p></div></div>', "comparison", "explain", 4, "u1b-lines"),
        ],
        "practice": [
            ("You try: equation-to-line chain", '<ol><li>Solve $-\\frac12x-\\frac43=\\frac{7x-7}{3}$.</li><li>Solve $d=rt$ for $t$.</li><li>Write the line through $(2,-1)$ perpendicular to $y=\\frac12x+4$.</li></ol>', '<ol><li>$x=6/17$</li><li>$t=d/r$</li><li>Slope $-2$: $y+1=-2(x-2)$, or $y=-2x+3$</li></ol>', "u1b-linear u1b-formula u1b-lines"),
        ],
        "checkpoint": (
            "Quiz 2 checkpoint",
            [
                "Solve $4(2x-3)=5x+9$ and check.",
                "Solve $V=\\frac13Bh$ for $h$.",
                "Find the slope through $(-2,5)$ and $(4,-7)$.",
                "Write the parallel line through $(1,4)$ to $2x+y=6$.",
            ],
            '<ol><li>$x=7$</li><li>$h=3V/B$</li><li>$m=-2$</li><li>$y=-2x+6$</li></ol>',
        ),
        "next": "Next: Unit 1C — functions, domain and range, and coordinate geometry",
    },
    {
        "id": "Math130Unit1C",
        "title": "Functions and Coordinate Geometry",
        "section": "Sections 2.1, 2.2, 2.4",
        "subtitle": "Relations, function notation, domain and range, distance, midpoint, and circles",
        "assessment": "Quiz 3 · Sep 16 at 2:10 PM",
        "aleks": "ALEKS Sections 2.1, 2.2, 2.4 due Sep 16 at 2:10 PM",
        "objective_ids": "u1c-function u1c-domain u1c-coordinate u1c-circle",
        "objectives": [
            "decide whether a relation defines a function",
            "evaluate functions and report domain and range",
            "use midpoint and distance formulas accurately",
            "interpret and write the standard equation of a circle",
        ],
        "slides": [
            ("Entrance retrieval", '<div class="poll-panel"><span class="card-label">4 minutes · no notes</span><ol><li>Does $\\{(1,4),(2,4),(1,7)\\}$ define $y$ as a function of $x$?</li><li>Evaluate $f(-2)$ for $f(x)=x^2-3x$.</li><li>Find the midpoint of $(2,-3)$ and $(8,5)$.</li></ol></div>', "poll", "activate", 4, "u1c-function u1c-coordinate"),
            ("A function gives each input one output", '<div class="comparison-grid"><div class="component-card"><span class="card-label">Function</span><p>Repeated outputs are allowed. Repeated inputs must keep the same output.</p></div><div class="component-card"><span class="card-label">Not a function</span><p>One input is paired with two different outputs.</p></div></div><div class="check-panel"><strong>Graph test</strong><p>A vertical line may intersect a function graph at most once.</p></div>', "comparison", "explain", 5, "u1c-function"),
            ("Function notation names an input-output rule", '<div class="worked-example"><div class="example-prompt"><p>For $f(x)=2x^2-5x+1$, find $f(-3)$.</p></div><ol class="worked-steps"><li class="fragment">Replace every $x$ with $(-3)$.</li><li class="fragment">$2(-3)^2-5(-3)+1=18+15+1$.</li><li class="fragment">$f(-3)=34$.</li></ol></div>', "worked-example", "model", 5, "u1c-function"),
            ("Domain comes from permissible inputs", '<div class="decision-guide"><div><span>1</span><p>Polynomial: all real inputs.</p></div><div><span>2</span><p>Rational expression: exclude denominator zeros.</p></div><div><span>3</span><p>Even root: require radicand $\\ge0$.</p></div></div><div class="formula-focus"><p>For $g(x)=1/(x-4)$, domain is $(-\\infty,4)\\cup(4,\\infty)$.</p></div>', "decision", "explain", 5, "u1c-domain"),
            ("Coordinate formulas are organized substitutions", '<div class="formula-focus"><p>$M=(\\frac{x_1+x_2}{2},\\frac{y_1+y_2}{2})$</p><p>$d=\\sqrt{(x_2-x_1)^2+(y_2-y_1)^2}$</p></div><div class="check-panel"><strong>Structure check</strong><p>Midpoint averages; distance subtracts, squares, adds, and square-roots.</p></div>', "formula", "explain", 5, "u1c-coordinate"),
            ("A circle records center and radius", '<div class="worked-example"><div class="example-prompt"><p>Write the circle with center $(4,2)$ and radius $5$.</p></div><ol class="worked-steps"><li class="fragment">Use $(x-h)^2+(y-k)^2=r^2$.</li><li class="fragment">Substitute $h=4$, $k=2$, $r=5$.</li><li class="fragment">$(x-4)^2+(y-2)^2=25$.</li></ol></div>', "worked-example", "model", 5, "u1c-circle"),
        ],
        "practice": [
            ("You try: connect representation and geometry", '<ol><li>For $f(x)=3x-7$, solve $f(x)=11$.</li><li>State the domain of $h(x)=\\sqrt{x+5}$.</li><li>For $A(-1,2)$ and $B(5,10)$, find midpoint and distance.</li></ol>', '<ol><li>$x=6$</li><li>$[-5,\\infty)$</li><li>Midpoint $(2,6)$; distance $10$</li></ol>', "u1c-function u1c-domain u1c-coordinate"),
        ],
        "checkpoint": (
            "Quiz 3 checkpoint",
            [
                "Explain why $\\{(-1,2),(0,4),(2,4)\\}$ is a function.",
                "Find the domain of $p(x)=1/(x^2-9)$.",
                "Find midpoint and distance for $(0,0)$ and $(6,8)$.",
                "Identify the center and radius of $(x+2)^2+(y-5)^2=16$.",
            ],
            '<ol><li>Every input appears once.</li><li>$(-\\infty,-3)\\cup(-3,3)\\cup(3,\\infty)$</li><li>Midpoint $(3,4)$; distance $10$</li><li>Center $(-2,5)$; radius $4$</li></ol>',
        ),
        "next": "Next: Unit 1D — quadratic equations, applications, and extrema",
    },
    {
        "id": "Math130Unit1D",
        "title": "Quadratic Equations and Applications",
        "section": "Sections 2.5 and 3.1 learning window",
        "subtitle": "Solve quadratics, interpret vertices, and connect solutions to context",
        "assessment": "Quiz 4 · Sep 21 at 2:10 PM",
        "aleks": "Sections 2.5 and 3.1 are due Sep 23 at 2:10 PM with Test 1",
        "objective_ids": "u1d-form u1d-solve u1d-vertex u1d-apply",
        "objectives": [
            "write a quadratic in standard form",
            "choose factoring or the quadratic formula",
            "find and interpret a quadratic vertex",
            "reject algebraic answers that do not fit a context",
        ],
        "slides": [
            ("Entrance retrieval", '<div class="poll-panel"><span class="card-label">4 minutes · no notes</span><ol><li>Factor $x^2-7x+12$.</li><li>Solve $x^2-7x+12=0$.</li><li>Does $f(x)=-2x^2+8x+1$ have a maximum or minimum?</li></ol></div>', "poll", "activate", 4, "u1d-form u1d-solve u1d-vertex"),
            ("Standard form makes the method visible", '<div class="formula-focus"><p>$ax^2+bx+c=0$, with $a\\ne0$</p></div><div class="decision-guide"><div><span>1</span><p>Move every term to one side.</p></div><div><span>2</span><p>Combine like terms and identify $a,b,c$.</p></div><div><span>3</span><p>Factor if structure is friendly; otherwise use the quadratic formula.</p></div></div>', "decision", "explain", 5, "u1d-form u1d-solve"),
            ("Model: solve by factoring", '<div class="worked-example"><div class="example-prompt"><p>Solve $5x^2=-3x+2$.</p></div><ol class="worked-steps"><li class="fragment">$5x^2+3x-2=0$.</li><li class="fragment">$(5x-2)(x+1)=0$.</li><li class="fragment">$x=2/5$ or $x=-1$.</li></ol></div>', "worked-example", "model", 5, "u1d-solve"),
            ("Quadratic formula: signs need parentheses", '<div class="formula-focus"><p>$x=\\dfrac{-b\\pm\\sqrt{b^2-4ac}}{2a}$</p></div><div class="misconception-grid"><div class="warning-panel"><p>Write $a$, $b$, and $c$ before substituting, including their signs.</p></div><div class="check-panel"><p>The discriminant $b^2-4ac$ predicts two real, one repeated, or no real solutions.</p></div></div>', "formula", "explain", 5, "u1d-solve"),
            ("The vertex answers an optimization question", '<div class="worked-example"><div class="example-prompt"><p>$h(t)=80t-16t^2$. Find the maximum height.</p></div><ol class="worked-steps"><li class="fragment">$a=-16$, $b=80$, so $t=-b/(2a)=2.5$.</li><li class="fragment">$h(2.5)=100$.</li><li class="fragment">Interpret: maximum height is $100$ feet at $2.5$ seconds.</li></ol></div>', "worked-example", "model", 6, "u1d-vertex u1d-apply"),
            ("Applications require an interpretation check", '<div class="decision-guide"><div><span>1</span><p>Define the variable and its units.</p></div><div><span>2</span><p>Build or identify the quadratic model.</p></div><div><span>3</span><p>Solve for roots or vertex as requested.</p></div><div><span>4</span><p>Reject times, lengths, or counts that violate the context.</p></div></div>', "decision", "explain", 4, "u1d-apply"),
        ],
        "practice": [
            ("You try: solve and interpret", '<ol><li>Solve $2x^2-5x-3=0$.</li><li>Find the vertex of $f(x)=2x^2-12x+7$ and state max/min.</li><li>A height model has roots $-1$ and $6$. Which time is physically meaningful?</li></ol>', '<ol><li>$x=3$ or $x=-1/2$</li><li>Vertex $(3,-11)$; minimum</li><li>$t=6$ if time begins at $0$</li></ol>', "u1d-solve u1d-vertex u1d-apply"),
        ],
        "checkpoint": (
            "Quiz 4 checkpoint",
            [
                "Solve $3x^2+x-2=0$ by factoring.",
                "Use the quadratic formula on $x^2+4x-1=0$.",
                "Find the maximum of $g(t)=-5t^2+30t+4$.",
                "Explain the difference between the vertex time and vertex value.",
            ],
            '<ol><li>$x=2/3,-1$</li><li>$x=-2\\pm\\sqrt5$</li><li>Maximum $49$ at $t=3$</li><li>The first is the input/location; the second is the output/extreme quantity.</li></ol>',
        ),
        "next": "Next: Unit 1E — spaced Test 1 review across all four checkpoints",
    },
    {
        "id": "Math130Unit1E",
        "title": "Test 1 Mixed Retrieval",
        "section": "Unit 1 cumulative review",
        "subtitle": "Interleave the four quiz windows and use errors to direct final practice",
        "assessment": "Test 1 · Sep 23 at 2:10 PM",
        "aleks": "Canvas dates are master; confirm any announced adjustment to official coverage",
        "objective_ids": "u1e-foundation u1e-linear u1e-function u1e-quadratic",
        "objectives": [
            "retrieve foundations without relying on topic labels",
            "connect equations, lines, functions, and coordinate geometry",
            "select an efficient quadratic method",
            "diagnose errors and choose targeted follow-up practice",
        ],
        "slides": [
            ("Use the review as four spaced passes", '<ol class="objective-roadmap"><li><span>1</span><p>Foundations: intervals, exponents, factoring, rational expressions.</p></li><li><span>2</span><p>Linear equations, formulas, slope, and lines.</p></li><li><span>3</span><p>Functions, domain/range, midpoint, distance, and circles.</p></li><li><span>4</span><p>Quadratics, vertices, and applications.</p></li></ol>', "roadmap", "activate", 4, "u1e-foundation u1e-linear u1e-function u1e-quadratic"),
            ("Pass 1: foundations", '<div class="practice-panel"><ol><li>Write $x\\le-2$ or $x&gt;4$ in interval notation.</li><li>Simplify $x^{-3}y^5/(x^2y^{-1})$.</li><li>Factor $4x^3-36x$ completely.</li><li>Simplify $(x^2-16)/(x^2-x-12)$ and state restrictions.</li></ol></div>', "practice", "practice", 8, "u1e-foundation"),
            ("Pass 2: equations and lines", '<div class="practice-panel"><ol><li>Solve $3(x-4)+7=2x+1$.</li><li>Solve $A=bh/2$ for $h$.</li><li>Write a line through $(3,-2)$ perpendicular to $y=-4x+1$.</li></ol></div>', "practice", "practice", 7, "u1e-linear"),
            ("Pass 3: functions and geometry", '<div class="practice-panel"><ol><li>State the domain of $f(x)=1/(x+5)$.</li><li>For $(-2,1)$ and $(4,9)$, find midpoint and distance.</li><li>Write the circle with center $(-3,2)$ and radius $6$.</li></ol></div>', "practice", "practice", 7, "u1e-function"),
            ("Pass 4: quadratics", '<div class="practice-panel"><ol><li>Solve $2x^2+x-6=0$.</li><li>Find the vertex of $f(x)=-x^2+10x-18$.</li><li>State what the vertex means if $f$ models height.</li></ol></div>', "practice", "practice", 7, "u1e-quadratic"),
            ("Triage by error type", '<div class="comparison-grid"><div class="component-card"><span class="card-label">Concept error</span><p>You chose the wrong rule or representation. Return to the matching A–D slide deck.</p></div><div class="component-card"><span class="card-label">Process error</span><p>You knew the rule but lost a sign, factor, restriction, or unit. Redo one same-type problem slowly.</p></div></div><div class="check-panel"><strong>Confidence is not evidence</strong><p>Mark a skill ready only after a correct closed-notes solution with a check.</p></div>', "comparison", "feedback", 5, "u1e-foundation u1e-linear u1e-function u1e-quadratic"),
        ],
        "practice": [
            ("Mixed correction round", '<ol><li>Choose one missed problem from each pass.</li><li>Write the rule that applies before doing algebra.</li><li>Redo it without looking, then verify by substitution, expansion, or units.</li></ol>', '<p>A complete correction contains the original error, the applicable rule, a clean solution, and an independent check.</p>', "u1e-foundation u1e-linear u1e-function u1e-quadratic"),
        ],
        "checkpoint": (
            "Test 1 checkpoint",
            [
                "Complete one foundation problem selected by a partner.",
                "Complete one equation/line problem selected by a partner.",
                "Complete one function/geometry problem selected by a partner.",
                "Complete one quadratic/application problem selected by a partner.",
            ],
            '<p>Ready means at least 3 of 4 are correct with complete work, and the fourth can be corrected without notes. Use the Test 1 page for the full mixed checkpoint.</p>',
        ),
        "next": "Finish with targeted practice on the Test 1 review page; Canvas remains the date authority",
    },
]


def render_deck(deck: dict) -> str:
    deck_id = deck["id"]
    sections: list[str] = []
    sections.append(
        f'<section class="title-slide" data-title="{html.escape(deck["title"], quote=True)}" '
        f'data-block-id="{deck_id.lower()}-title" data-phase="activate" data-component="title" '
        f'data-objectives="" data-minutes="0"><p class="eyebrow">MATH 130 · {html.escape(deck["section"])}</p>'
        f'<h1>{deck["title"]}</h1><p class="subtitle">{deck["subtitle"]}</p>'
        f'<p class="lecture-meta">50–55 minutes · Offline capable · {deck["assessment"]}</p></section>'
    )

    roadmap_items = "".join(
        f"<li><span>{index}</span><p>{html.escape(objective)}</p></li>"
        for index, objective in enumerate(deck["objectives"], start=1)
    )
    roadmap_body = (
        f'<ol class="objective-roadmap">{roadmap_items}</ol>'
        '<div class="comparison-grid"><div class="component-card"><span class="card-label">Canvas pacing anchor</span>'
        f'<p><strong>{deck["assessment"]}</strong></p><p>{deck["aleks"]}</p></div>'
        '<div class="component-card"><span class="card-label">Coverage note</span>'
        '<p>This deck is the sequential study path. Official quiz and test coverage can be adjusted in Canvas or in class.</p></div></div>'
    )
    sections.append(section(deck_id, 1, "Learning roadmap and pacing", roadmap_body, component="roadmap", phase="activate", minutes=2, objectives=deck["objective_ids"]))

    number = 2
    for title, body, component, phase, minutes, objectives in deck["slides"]:
        sections.append(section(deck_id, number, title, body, component=component, phase=phase, minutes=minutes, objectives=objectives))
        number += 1
    for title, prompt, solution, objectives in deck["practice"]:
        sections.append(practice(deck_id, number, title, prompt, solution, objectives))
        number += 1
    label, tasks, solution = deck["checkpoint"]
    sections.append(checkpoint(deck_id, number, label, tasks, solution, deck["objective_ids"]))
    number += 1
    closing_body = (
        '<div class="summary-grid"><div class="component-card"><span class="card-label">Before you leave</span>'
        '<ol><li>Name one skill you can now complete without notes.</li><li>Name one error pattern to watch.</li>'
        '<li>Schedule the next short practice before the checkpoint.</li></ol></div>'
        f'<div class="exit-card"><strong>Next step</strong><p>{html.escape(deck["next"])}</p></div></div>'
    )
    sections.append(section(deck_id, number, "Exit ticket and next step", closing_body, component="summary", phase="synthesize", minutes=3, objectives=deck["objective_ids"]))

    metadata = {
        "id": deck_id,
        "title": deck["title"],
        "section": deck["section"],
        "session": deck_id[-2:].lower(),
        "duration": 55,
    }
    return f'''<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="description" content="MATH 130 Unit 1 lecture deck: {html.escape(deck['title'], quote=True)}">
  <title>MATH 130 - {html.escape(deck['title'])}</title>
  <link rel="stylesheet" href="vendor/reveal/reset.css">
  <link rel="stylesheet" href="vendor/reveal/reveal.css">
  <link rel="stylesheet" href="framework/math130-slides.css">
  <script>window.MathJax={{tex:{{inlineMath:[["$","$"],["\\\\(","\\\\)"]],displayMath:[["$$","$$"],["\\\\[","\\\\]"]]}}}};</script>
  <script defer src="vendor/mathjax/tex-chtml.js"></script>
</head>
<body>
  <a class="skip-link" href="#lecture-slides">Skip to lecture slides</a>
  <div class="reveal" id="lecture-slides"><div class="slides">
{''.join(sections)}
  </div></div>
  <script src="vendor/reveal/reveal.js"></script>
  <script>window.MATH130_DECK={json.dumps(metadata, ensure_ascii=False)};</script>
  <script src="framework/math130-slides.js"></script>
</body>
</html>
'''


def main() -> None:
    for deck in DECKS:
        path = SLIDES / f'{deck["id"]}.html'
        path.write_text(render_deck(deck), encoding="utf-8")
        print(f"wrote {path.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
