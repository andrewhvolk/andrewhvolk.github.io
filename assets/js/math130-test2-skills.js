/*
 * MATH 130 Test 2 skills: one generator per question type on the Fall 2026 Test 2.
 *
 * Used by 130Test2Practice.html (a full practice test) and by the practice
 * generators on 130Test2.html. Every generator takes a random source and returns
 * a question in the review page's format:
 *
 *   { q, svg?, svgAltText?, display?, fields: [{ id, label, answer, tolerance, ... }],
 *     hint, solution, key }
 *
 * q and solution use $...$ for KaTeX. display is a formula printed on the test.
 * key is the short answer for the printed answer key.
 *
 * Numbers come from ranges that keep every draw at the difficulty of the real
 * test: the same steps, clean intermediate values where the test has them, and
 * the same rounding instructions. Tolerances follow the Test 2 rubric: money to
 * the cent, four-place answers to one unit in the last place, DMS to the second.
 */
(function (root) {
    'use strict';

    // ---------------------------------------------------------------- random
    function mulberry32(seed) {
        let a = seed >>> 0;
        return function () {
            a = (a + 0x6D2B79F5) >>> 0;
            let t = a;
            t = Math.imul(t ^ (t >>> 15), t | 1);
            t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
            return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
        };
    }

    function tools(rand) {
        const r = rand || Math.random;
        return {
            rand: r,
            int: (lo, hi) => lo + Math.floor(r() * (hi - lo + 1)),
            pick: list => list[Math.floor(r() * list.length)],
            chance: p => r() < p
        };
    }

    // ---------------------------------------------------------------- format
    const money = v => v.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    const moneyTex = v => money(v).replace(/,/g, '{,}');       // KaTeX spaces a bare comma
    const fix = (v, n) => Number(v).toFixed(n);
    const pct = v => `${Number(v.toFixed(2))}\\%`;
    const num = v => String(Number(v.toFixed(6)));

    function gcd(a, b) { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a; }

    // k*pi/m in lowest terms, as LaTeX.
    function piFrac(k, m) {
        const g = gcd(k, m);
        k /= g; m /= g;
        const top = k === 1 ? '\\pi' : `${k}\\pi`;
        return m === 1 ? top : `\\frac{${top}}{${m}}`;
    }

    function linear(a, b) {
        if (b === 0) return `${a}x`;
        return b > 0 ? `${a}x + ${b}` : `${a}x - ${-b}`;
    }

    function text(x, y, s, opts = {}) {
        const size = opts.size || 13;
        const anchor = opts.anchor || 'middle';
        const fill = opts.fill || 'var(--text-main, #1b2430)';
        const weight = opts.bold ? ' font-weight="700"' : '';
        const style = opts.italic ? ' font-style="italic"' : '';
        return `<text x="${fix(x, 1)}" y="${fix(y, 1)}" font-size="${size}" text-anchor="${anchor}" fill="${fill}"${weight}${style} stroke="var(--bg-surface, #fff)" stroke-width="4" stroke-linejoin="round" paint-order="stroke">${s}</text>`;
    }

    const STROKE = 'var(--primary-main, #1f3a5f)';
    const FILL = 'var(--primary-soft, #e6eef7)';
    const MUTED = 'var(--text-muted, #5b6675)';
    const WARN = 'var(--danger-main, #a33b20)';

    function svgWrap(w, h, body, label) {
        return `<svg viewBox="0 0 ${w} ${h}" class="svg-canvas t2-fig" role="img" aria-label="${label.replace(/"/g, '&quot;')}">${body}</svg>`;
    }

    // ------------------------------------------------------- 4.2 interest
    const COMPOUNDING = [
        { n: 12, word: 'monthly', rates: [2.4, 3.6, 4.2, 4.8, 5.4, 6] },
        { n: 4, word: 'quarterly', rates: [2.8, 3.2, 3.6, 4.4, 5.2, 6.4] },
        { n: 2, word: 'semiannually', rates: [3.4, 4.2, 4.6, 5.4, 5.8, 6.2] }
    ];

    function compound(rand, id = 'q') {
        const t = tools(rand);
        const P = t.int(20, 90) * 100;
        const c = t.pick(COMPOUNDING);
        const rPct = t.pick(c.rates);
        const years = t.int(4, 10);
        const r = rPct / 100;
        const A = P * Math.pow(1 + r / c.n, c.n * years);
        const per = num(r / c.n);
        return {
            q: `Find the value of $\\$${moneyTex(P)}$ invested at $${pct(rPct)}$ compounded ${c.word} ($n = ${c.n}$) for ${years} years, to the nearest cent.`,
            display: 'A = P\\left(1 + \\frac{r}{n}\\right)^{nt}',
            fields: [{ id: `${id}-A`, label: '$A =$ (dollars)', answer: A, tolerance: 0.01 }],
            hint: 'Divide the rate (as a decimal) by n, and multiply the years by n.',
            solution: `$A = ${P}\\left(1 + \\frac{${num(r)}}{${c.n}}\\right)^{${c.n}\\cdot ${years}} = ${P}(${num(1 + r / c.n)})^{${c.n * years}} \\approx \\$${moneyTex(A)}$`
                + `<br>The rate per period is $${num(r)} \\div ${c.n} = ${per}$.`,
            key: `$${money(A)}`
        };
    }

    function continuous(rand, id = 'q') {
        const t = tools(rand);
        const P = t.int(20, 90) * 100;
        const rPct = t.pick([2.4, 3.2, 3.6, 4.2, 4.5, 4.8, 5.4, 6]);
        const years = t.int(4, 12);
        const rt = rPct / 100 * years;
        const A = P * Math.exp(rt);
        return {
            q: `Find the value of $\\$${moneyTex(P)}$ invested at $${pct(rPct)}$ compounded continuously for ${years} years, to the nearest cent.`,
            display: 'A = Pe^{rt}',
            fields: [{ id: `${id}-A`, label: '$A =$ (dollars)', answer: A, tolerance: 0.01 }],
            hint: 'Compounded continuously means A = Pe^{rt}, with no n. Multiply r by t first.',
            solution: `$A = ${P}e^{(${num(rPct / 100)})(${years})} = ${P}e^{${num(rt)}} \\approx \\$${moneyTex(A)}$`,
            key: `$${money(A)}`
        };
    }

    // ------------------------------------------------------- 4.3 logs
    // Exponential to log form: a perfect power raised to p/2, always a whole result.
    function toLog(rand, id = 'q') {
        const t = tools(rand);
        const choices = [];
        [4, 9, 16, 25, 36, 49, 64, 81, 100].forEach(b => choices.push({ b, p: 3 }));
        [4, 9, 16, 25, 36].forEach(b => choices.push({ b, p: 5 }));
        const { b, p } = t.pick(choices);
        const x = Math.round(Math.pow(Math.sqrt(b), p));
        return {
            q: `Write the exponential equation in logarithmic form: $${b}^{${p}/2} = ${x}$`,
            fields: [
                { id: `${id}-b`, label: 'Log base $b$', answer: b, tolerance: 1e-6 },
                { id: `${id}-x`, label: 'Argument', answer: x, tolerance: 1e-6 },
                { id: `${id}-y`, label: 'Value (e.g. 1.5)', answer: p / 2, tolerance: 1e-6 }
            ],
            answerFormat: 'log',
            hint: 'The base stays the base, and the log equals the exponent: b^y = x means log_b x = y.',
            solution: `Base ${b}, exponent $${p}/2$, result ${x}: $\\log_{${b}} ${x} = ${p}/2$ (or ${p / 2}).`,
            key: `log_${b} ${x} = ${p}/2`
        };
    }

    // Log to exponential form: a perfect-square base and a half-integer value.
    function toExp(rand, id = 'q') {
        const t = tools(rand);
        const choices = [];
        [4, 9, 16, 25, 36, 49].forEach(b => [1.5, 2.5, 3.5].forEach(v => {
            const x = Math.round(Math.pow(b, v));
            if (x <= 120000) choices.push({ b, v, x });
        }));
        const { b, v, x } = t.pick(choices);
        return {
            q: `Write the logarithmic equation in exponential form: $\\log_{${b}} ${x} = ${v}$`,
            fields: [
                { id: `${id}-b`, label: 'Base', answer: b, tolerance: 1e-6 },
                { id: `${id}-e`, label: 'Exponent', answer: v, tolerance: 1e-6 },
                { id: `${id}-x`, label: 'Result', answer: x, tolerance: 1e-6 }
            ],
            answerFormat: 'exp',
            hint: 'log_b x = y means b^y = x: raise the base to the log\'s value.',
            solution: `The base ${b} is raised to the value ${v}: $${b}^{${v}} = ${x}$.`,
            key: `${b}^${v} = ${x}`
        };
    }

    function solveLn(rand, id = 'q') {
        const t = tools(rand);
        const c = t.pick([1.6, 1.8, 2, 2.2, 2.5, 2.8, 3, 3.2, 3.5, 3.7, 4, 4.2, 4.5, 5, 5.5, 6, 7]);
        const x = Math.exp(c);
        return {
            q: `Solve for $x$. Round to four decimal places. $\\ln x = ${c}$`,
            fields: [{ id: `${id}-x`, label: '$x =$', answer: Number(x.toFixed(4)), tolerance: 0.00011 }],
            hint: 'ln x = c is log base e, so x = e^c.',
            solution: `Rewrite in exponential form: $x = e^{${c}} \\approx ${fix(x, 4)}$`,
            key: fix(x, 4)
        };
    }

    // b^x = c with a non-integer answer between about 1.2 and 3.5.
    function solveBase(rand, id = 'q') {
        const t = tools(rand);
        let b, c, x;
        do {
            b = t.int(2, 9);
            c = t.int(Math.ceil(Math.pow(b, 1.2)), Math.floor(Math.pow(b, 3.5)));
            x = Math.log(c) / Math.log(b);
        } while (Math.abs(x - Math.round(x)) < 0.02 || c > 900);
        return {
            q: `Solve for $x$. Round to four decimal places. $${b}^{x} = ${c}$`,
            display: '\\text{Change of base: } \\log_b a = \\frac{\\ln a}{\\ln b}',
            fields: [{ id: `${id}-x`, label: '$x =$', answer: Number(x.toFixed(4)), tolerance: 0.00011 }],
            hint: 'b^x = c means x = log_b c. Change of base: ln c divided by ln b (not ln(c/b)).',
            solution: `$x = \\log_{${b}} ${c} = \\frac{\\ln ${c}}{\\ln ${b}} = \\frac{${fix(Math.log(c), 6)}}{${fix(Math.log(b), 6)}} \\approx ${fix(x, 4)}$`,
            key: fix(x, 4)
        };
    }

    // ------------------------------------------------------- polygons
    const PAIRS = {
        'alternate interior': { equal: true, up: 'br', low: 'al' },
        'alternate exterior': { equal: true, up: 'ar', low: 'bl' },
        'corresponding': { equal: true, up: 'ar', low: 'ar' },
        'same-side interior': { equal: false, up: 'br', low: 'ar' }
    };

    function parallelFigure(kind, lab1, lab2) {
        const pair = PAIRS[kind];
        const W = 300, H = 150;
        const yM = 45, yN = 108;
        const t0 = { x: 95, y: 146 }, t1 = { x: 205, y: 4 };
        const cross = y => ({ x: t0.x + (t1.x - t0.x) * (y - t0.y) / (t1.y - t0.y), y });
        const U = cross(yM), L = cross(yN);
        const slope = Math.atan2(t0.y - t1.y, t1.x - t0.x) * 180 / Math.PI;      // up is positive
        const sector = {
            ar: [0, slope], al: [slope, 180], bl: [180, 180 + slope], br: [180 + slope, 360]
        };
        const arc = (P, q) => {
            const [a0, a1] = sector[q];
            const r = 11;
            const p0 = { x: P.x + r * Math.cos(a0 * Math.PI / 180), y: P.y - r * Math.sin(a0 * Math.PI / 180) };
            const p1 = { x: P.x + r * Math.cos(a1 * Math.PI / 180), y: P.y - r * Math.sin(a1 * Math.PI / 180) };
            return `<path d="M${fix(p0.x, 1)},${fix(p0.y, 1)} A${r},${r} 0 0,0 ${fix(p1.x, 1)},${fix(p1.y, 1)}" fill="none" stroke="${WARN}" stroke-width="1.6"/>`;
        };
        const off = { ar: [14, -8, 'start'], al: [-14, -8, 'end'], bl: [-14, 17, 'end'], br: [14, 17, 'start'] };
        const lab = (P, q, s) => text(P.x + off[q][0], P.y + off[q][1], s, { anchor: off[q][2], size: 12 });
        const body = `
            <line x1="10" y1="${yM}" x2="285" y2="${yM}" stroke="${STROKE}" stroke-width="2"/>
            <line x1="10" y1="${yN}" x2="285" y2="${yN}" stroke="${STROKE}" stroke-width="2"/>
            <line x1="${t0.x}" y1="${t0.y}" x2="${t1.x}" y2="${t1.y}" stroke="${MUTED}" stroke-width="2"/>
            ${text(292, yM + 4, 'm', { italic: true, anchor: 'end', size: 12 })}${text(292, yN + 4, 'n', { italic: true, anchor: 'end', size: 12 })}
            ${arc(U, pair.up)}${arc(L, pair.low)}${lab(U, pair.up, lab1)}${lab(L, pair.low, lab2)}`;
        return svgWrap(W, H, body, `Parallel lines m and n cut by a transversal; the ${kind} angles measure ${lab1} and ${lab2}.`);
    }

    function parallel(rand, id = 'q') {
        const t = tools(rand);
        const kind = t.pick(Object.keys(PAIRS));
        const pair = PAIRS[kind];
        let x, a1, a2, b1, b2, ang1, ang2;
        do {
            x = t.int(8, 24);
            ang1 = t.int(42, 138);
            ang2 = pair.equal ? ang1 : 180 - ang1;
            a1 = t.int(2, 9);
            a2 = t.int(2, 9);
            b1 = ang1 - a1 * x;
            b2 = ang2 - a2 * x;
        } while (a1 === a2 || Math.abs(b1) > 60 || Math.abs(b2) > 60 || b1 === 0 || b2 === 0 || ang1 === 90);
        const e1 = linear(a1, b1), e2 = linear(a2, b2);
        const lab = e => `(${e.replace(/-/g, '−')})°`;
        const eq = pair.equal ? `${e1} = ${e2}` : `(${e1}) + (${e2}) = 180`;
        const fields = [{ id: `${id}-x`, label: '$x =$', answer: x, tolerance: 0.01, weight: 0.4 }];
        if (pair.equal) fields.push({ id: `${id}-a`, label: 'Angle (degrees)', answer: ang1, tolerance: 0.01, weight: 0.6 });
        else {
            fields.push({ id: `${id}-a1`, label: `$(${e1})^\\circ =$`, answer: ang1, tolerance: 0.01, weight: 0.3 });
            fields.push({ id: `${id}-a2`, label: `$(${e2})^\\circ =$`, answer: ang2, tolerance: 0.01, weight: 0.3 });
        }
        return {
            q: `Lines $m$ and $n$ are parallel. Two ${kind} angles measure $(${e1})^\\circ$ and $(${e2})^\\circ$. Write an equation, then find $x$ and ${pair.equal ? 'the angle' : 'both angles'}.`,
            svg: parallelFigure(kind, lab(e1), lab(e2)),
            svgAltText: `Parallel lines cut by a transversal with ${kind} angles (${e1}) and (${e2}) degrees.`,
            fields,
            hint: pair.equal ? `${kind[0].toUpperCase() + kind.slice(1)} angles are equal: set the expressions equal.`
                : 'Same-side interior angles add to 180°.',
            solution: `${kind[0].toUpperCase() + kind.slice(1)} angles are ${pair.equal ? 'equal' : 'supplementary'}: $${eq}$, so $x = ${x}$. `
                + (pair.equal ? `The angle is $${a1}(${x}) ${b1 < 0 ? '-' : '+'} ${Math.abs(b1)} = ${ang1}^\\circ$.`
                    : `The angles are $${ang1}^\\circ$ and $${ang2}^\\circ$.`),
            key: pair.equal ? `x = ${x}; ${ang1}°` : `x = ${x}; ${ang1}° and ${ang2}°`
        };
    }

    function similarFigure(ang, ratio, big, small, show) {
        const a = ang.A * Math.PI / 180, b = ang.B * Math.PI / 180;
        const cx = Math.tan(b) / (Math.tan(a) + Math.tan(b));
        const cy = cx * Math.tan(a);
        const unit = [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: cx, y: cy }];
        const k = 1 / Math.max(1, ratio);
        const S1 = 120 * k, S2 = 120 * k * ratio;
        const H = Math.max(cy * S1, cy * S2) + 40;
        const place = (s, ox) => unit.map(p => ({ x: ox + p.x * s, y: H - 22 - p.y * s }));
        const T1 = place(S1, 18), T2 = place(S2, 18 + S1 + 48);
        const W = 18 + S1 + 48 + S2 + 22;
        const poly = T => `<polygon points="${T.map(p => `${fix(p.x, 1)},${fix(p.y, 1)}`).join(' ')}" fill="${FILL}" stroke="${STROKE}" stroke-width="2"/>`;
        const names = (T, n) => T.map((p, i) => {
            const c = { x: (T[0].x + T[1].x + T[2].x) / 3, y: (T[0].y + T[1].y + T[2].y) / 3 };
            const dx = p.x - c.x, dy = p.y - c.y, d = Math.hypot(dx, dy) || 1;
            return text(p.x + dx / d * 11, p.y + dy / d * 11 + 4, n[i], { italic: true, size: 13 });
        }).join('');
        const sideLab = (T, n, labels) => Object.entries(labels).map(([side, s]) => {
            const i = n.indexOf(side[0]), j = n.indexOf(side[1]);
            const c = { x: (T[0].x + T[1].x + T[2].x) / 3, y: (T[0].y + T[1].y + T[2].y) / 3 };
            const m = { x: (T[i].x + T[j].x) / 2, y: (T[i].y + T[j].y) / 2 };
            const dx = m.x - c.x, dy = m.y - c.y, d = Math.hypot(dx, dy) || 1;
            return text(m.x + dx / d * 10, m.y + dy / d * 10 + 4, s, { size: 12, fill: s === '?' ? WARN : undefined, bold: s === '?' });
        }).join('');
        const angLab = show.map(v => {
            const i = 'ABC'.indexOf(v);
            const others = [0, 1, 2].filter(j => j !== i);
            const tx = (T1[others[0]].x + T1[others[1]].x) / 2 - T1[i].x, ty = (T1[others[0]].y + T1[others[1]].y) / 2 - T1[i].y;
            const d = Math.hypot(tx, ty) || 1;
            return text(T1[i].x + tx / d * 22, T1[i].y + ty / d * 22 + 4, `${ang[v]}°`, { size: 11, fill: MUTED });
        }).join('');
        const body = poly(T1) + poly(T2) + names(T1, 'ABC') + names(T2, 'DEF') + sideLab(T1, 'ABC', big) + sideLab(T2, 'DEF', small) + angLab;
        return svgWrap(Math.ceil(W), Math.ceil(H), body, 'Triangle ABC and a similar triangle DEF; the figure is not to scale.');
    }

    function similar(rand, id = 'q') {
        const t = tools(rand);
        const A = t.int(38, 70), B = t.int(40, 75), C = 180 - A - B;
        const ang = { A, B, C };
        const match = { A: 'D', B: 'E', C: 'F' };
        const findOf = t.pick(['A', 'B', 'C']);                 // the angle of ABC whose match is asked
        const given = ['A', 'B', 'C'].filter(v => v !== findOf);
        const SIDES = ['AB', 'BC', 'AC'];
        const DEF = { AB: 'DE', BC: 'EF', AC: 'DF' };
        const [s1, s2] = (() => { const s = SIDES.slice(); const i = t.int(0, 2); const a = s.splice(i, 1)[0]; return [a, t.pick(s)]; })();
        const ratio = t.pick([[2, 3], [3, 4], [3, 2], [4, 3], [5, 4], [4, 5], [5, 3], [3, 5]]);
        const [p, q] = ratio;                                     // DEF = ABC * p/q
        // Side lengths follow the angles (law of sines, rounded to a multiple of q),
        // so the longer side is opposite the larger angle, as in the figure.
        const opp = { AB: C, BC: A, AC: B };
        const sin = d => Math.sin(d * Math.PI / 180);
        const v1 = q * t.int(3, 9);
        const v2 = q * Math.max(2, Math.round(v1 * sin(opp[s2]) / sin(opp[s1]) / q));
        const g1 = v1 * p / q, ans = v2 * p / q;
        const fields = [
            { id: `${id}-ang`, label: `(a) $\\angle ${match[findOf]} =$`, answer: ang[findOf], tolerance: 0.01, weight: 0.4 },
            { id: `${id}-side`, label: `(b) $${DEF[s2]} =$`, answer: ans, tolerance: 0.01, weight: 0.6 }
        ];
        const big = { [s1]: String(v1), [s2]: String(v2) };
        const small = { [DEF[s1]]: String(g1), [DEF[s2]]: '?' };
        return {
            q: `Triangle $ABC$ is similar to triangle $DEF$. (a) $\\angle ${given[0]} = ${ang[given[0]]}^\\circ$ and $\\angle ${given[1]} = ${ang[given[1]]}^\\circ$. Find $\\angle ${match[findOf]}$. (b) $${s1} = ${v1}$, $${s2} = ${v2}$ and $${DEF[s1]} = ${g1}$. Find $${DEF[s2]}$.`,
            svg: similarFigure(ang, p / q, big, small, given),
            svgAltText: `Triangles ABC and DEF. Angle ${given[0]} = ${ang[given[0]]} degrees, angle ${given[1]} = ${ang[given[1]]} degrees; ${s1} = ${v1}, ${s2} = ${v2}, ${DEF[s1]} = ${g1}.`,
            fields,
            hint: 'Match letters in order (A↔D, B↔E, C↔F). Keep one triangle on top of the proportion.',
            solution: `(a) $\\angle ${match[findOf]} = \\angle ${findOf} = 180 - ${ang[given[0]]} - ${ang[given[1]]} = ${ang[findOf]}^\\circ$. `
                + `<br>(b) $\\frac{${DEF[s2]}}{${s2}} = \\frac{${DEF[s1]}}{${s1}}$, so $${DEF[s2]} = ${v2}\\cdot\\frac{${g1}}{${v1}} = ${num(ans)}$.`,
            key: `(a) ${ang[findOf]}° (b) ${num(ans)}`
        };
    }

    const UNITS = ['cm', 'm', 'in', 'ft'];
    // Height, overhang and slant from Pythagorean triples, so the slanted side is a
    // real length the figure can draw. The slanted side is a distractor.
    const LEGS = [[3, 4, 5], [4, 3, 5], [6, 8, 10], [8, 6, 10], [5, 12, 13], [12, 5, 13], [8, 15, 17], [9, 12, 15], [12, 9, 15], [15, 8, 17]];

    function trapezoid(rand, id = 'q') {
        const t = tools(rand);
        const u = t.pick(UNITS);
        let h, o, s, b1, b2;
        do {
            [h, o, s] = t.pick(LEGS);
            b1 = t.int(6, 22) + (t.chance(0.25) ? 0.5 : 0);
            b2 = b1 + o + t.int(1, 9);
        } while (b2 > 40);
        const A = (b1 + b2) * h / 2;
        // Figure: bottom b2, top b1, right leg = slant (overhang o), left leg the rest.
        const left = b2 - b1 - o;
        const k = Math.min(230 / b2, 95 / h);
        const X = v => 30 + v * k, Y = v => 112 - v * k;
        const P = [[0, 0], [b2, 0], [left + b1, h], [left, h]].map(([x, y]) => ({ x: X(x), y: Y(y) }));
        const body = `
            <polygon points="${P.map(p => `${fix(p.x, 1)},${fix(p.y, 1)}`).join(' ')}" fill="${FILL}" stroke="${STROKE}" stroke-width="2"/>
            <line x1="${fix(P[3].x, 1)}" y1="${fix(P[3].y, 1)}" x2="${fix(P[3].x, 1)}" y2="${fix(P[0].y, 1)}" stroke="${MUTED}" stroke-dasharray="4 3"/>
            <rect x="${fix(P[3].x, 1)}" y="${fix(P[0].y - 7, 1)}" width="7" height="7" fill="none" stroke="${MUTED}"/>
            ${text((P[0].x + P[1].x) / 2, P[0].y + 16, `${b2} ${u}`, { size: 12 })}
            ${text((P[2].x + P[3].x) / 2, P[3].y - 7, `${b1} ${u}`, { size: 12 })}
            ${text(P[3].x + 6, (P[3].y + P[0].y) / 2 + 4, `${h} ${u}`, { size: 12, anchor: 'start' })}
            ${text((P[1].x + P[2].x) / 2 + 8, (P[1].y + P[2].y) / 2, `${s} ${u}`, { size: 12, anchor: 'start' })}`;
        const W = Math.ceil(X(b2) + 60);
        return {
            q: `Find the area of a trapezoid with parallel sides ${b1} ${u} and ${b2} ${u}, slanted side ${s} ${u} and height ${h} ${u}.`,
            svg: svgWrap(W, 130, body, `Trapezoid with parallel sides ${b1} and ${b2} ${u}, a slanted side of ${s} ${u}, and a dashed perpendicular height of ${h} ${u}.`),
            svgAltText: `Trapezoid: parallel sides ${b1} and ${b2} ${u}, slanted side ${s} ${u}, height ${h} ${u}.`,
            fields: [{ id: `${id}-A`, label: `$A =$ (square ${u})`, answer: A, tolerance: 0.01 }],
            hint: 'A = ½(b₁ + b₂)h with the perpendicular height. The slanted side is not used.',
            solution: `$A = \\tfrac12(${b1} + ${b2})(${h}) = ${num(A)}$ square ${u}. The ${s} ${u} slanted side is not the height.`,
            key: `${num(A)} sq ${u}`
        };
    }

    // Heronian triangles: whole-number sides and area, as on the test.
    const HERONIAN = [[5, 12, 13], [13, 14, 15], [9, 10, 17], [10, 17, 21], [11, 13, 20], [13, 20, 21], [9, 40, 41], [17, 25, 28],
        [7, 15, 20], [8, 15, 17], [6, 25, 29], [15, 34, 35], [10, 13, 13], [12, 17, 25], [14, 30, 40], [20, 21, 29], [16, 25, 39],
        [10, 35, 39], [13, 37, 40], [11, 25, 30], [15, 28, 41], [25, 34, 39]];

    function heron(rand, id = 'q') {
        const t = tools(rand);
        const u = t.pick(UNITS);
        const sides = t.pick(HERONIAN).slice();
        for (let i = sides.length - 1; i > 0; i--) { const j = t.int(0, i); [sides[i], sides[j]] = [sides[j], sides[i]]; }
        const [a, b, c] = sides;
        const s = (a + b + c) / 2;
        const prod = s * (s - a) * (s - b) * (s - c);
        const A = Math.sqrt(prod);
        const [x, y, z] = sides.slice().sort((p, q) => p - q);
        const px = (y * y + z * z - x * x) / (2 * z), py = Math.sqrt(Math.max(y * y - px * px, 0));
        const k = Math.min(220 / z, 95 / py);
        const P = [{ x: 30, y: 115 }, { x: 30 + z * k, y: 115 }, { x: 30 + px * k, y: 115 - py * k }];
        const cen = { x: (P[0].x + P[1].x + P[2].x) / 3, y: (P[0].y + P[1].y + P[2].y) / 3 };
        const lab = (i, j, v) => {
            const m = { x: (P[i].x + P[j].x) / 2, y: (P[i].y + P[j].y) / 2 }, dx = m.x - cen.x, dy = m.y - cen.y, d = Math.hypot(dx, dy) || 1;
            return text(m.x + dx / d * 13, m.y + dy / d * 13 + 4, `${v} ${u}`, { size: 12 });
        };
        const body = `<polygon points="${P.map(p => `${fix(p.x, 1)},${fix(p.y, 1)}`).join(' ')}" fill="${FILL}" stroke="${STROKE}" stroke-width="2"/>${lab(0, 1, z)}${lab(1, 2, x)}${lab(0, 2, y)}`;
        return {
            q: `Find the area of a triangle with sides ${a} ${u}, ${b} ${u} and ${c} ${u}.`,
            display: 'A = \\sqrt{s(s-a)(s-b)(s-c)} \\quad\\text{where}\\quad s = \\frac{a+b+c}{2}',
            svg: svgWrap(Math.ceil(60 + z * k), 135, body, `Triangle with sides ${a}, ${b} and ${c} ${u}.`),
            svgAltText: `Triangle with sides ${a}, ${b} and ${c} ${u}.`,
            fields: [{ id: `${id}-A`, label: `$A =$ (square ${u})`, answer: A, tolerance: 0.01 }],
            hint: 'Semiperimeter first: s is half the perimeter. Then s − a, s − b and s − c.',
            solution: `$s = (${a} + ${b} + ${c})/2 = ${s}$, so $A = \\sqrt{${s}\\cdot${s - a}\\cdot${s - b}\\cdot${s - c}} = \\sqrt{${prod}} = ${num(A)}$ square ${u}.`,
            key: `${num(A)} sq ${u}`
        };
    }

    // ------------------------------------------------------- DMS
    function toDms(rand, id = 'q') {
        const t = tools(rand);
        let deg, d, m, s;
        do {
            deg = t.int(100000, 1700000) / 10000;          // four decimal places, 10° to 170°
            d = Math.floor(deg);
            const mins = (deg - d) * 60;
            m = Math.floor(mins + 1e-9);
            s = Math.round((mins - m) * 60);
        } while (s === 60 || m === 60);
        const mins = (deg - d) * 60;
        return {
            q: `Convert $${fix(deg, 4)}^\\circ$ to degrees, minutes and seconds, to the nearest second.`,
            fields: [
                { id: `${id}-d`, label: 'Degrees', answer: d, tolerance: 0, integer: true, min: 0, max: 359 },
                { id: `${id}-m`, label: 'Minutes', answer: m, tolerance: 0, integer: true, min: 0, max: 59 },
                { id: `${id}-s`, label: 'Seconds', answer: s, tolerance: 1, integer: true, min: 0, max: 59 }
            ],
            hint: 'Keep the whole degrees. Decimal part × 60 gives minutes; the new decimal part × 60 gives seconds.',
            solution: `$${fix(deg - d, 4)} \\times 60 = ${fix(mins, 3)}'$, then $${fix(mins - m, 3)} \\times 60 = ${fix((mins - m) * 60, 2)}''$, so $${d}^\\circ\\,${m}'\\,${s}''$.`,
            key: `${d}° ${m}′ ${s}″`
        };
    }

    function toDecimal(rand, id = 'q') {
        const t = tools(rand);
        const d = t.int(10, 170), m = t.int(1, 59), s = t.int(1, 59);
        const v = d + m / 60 + s / 3600;
        return {
            q: `Convert $${d}^\\circ\\,${String(m).padStart(2, '0')}'\\,${String(s).padStart(2, '0')}''$ to decimal degrees, to four decimal places.`,
            fields: [{ id: `${id}-v`, label: 'Decimal degrees', answer: Number(v.toFixed(4)), tolerance: 0.00011 }],
            hint: 'D + M/60 + S/3600.',
            solution: `$${d} + \\frac{${m}}{60} + \\frac{${s}}{3600} \\approx ${fix(v, 4)}^\\circ$`,
            key: `${fix(v, 4)}°`
        };
    }

    // ------------------------------------------------------- circles
    function inscribedArc(rand, id = 'q') {
        const t = tools(rand);
        const central = 2 * t.int(30, 80);
        const r = t.int(4, 15);
        const u = t.pick(UNITS);
        const s = r * central * Math.PI / 180;
        const g = gcd(central, 180);
        const R = 70, O = { x: 110, y: 92 };
        const at = deg => ({ x: O.x + R * Math.cos(deg * Math.PI / 180), y: O.y - R * Math.sin(deg * Math.PI / 180) });
        const A = at(-90 - central / 2), C = at(-90 + central / 2), B = at(90);
        const pts = (p, q) => `<line x1="${fix(p.x, 1)}" y1="${fix(p.y, 1)}" x2="${fix(q.x, 1)}" y2="${fix(q.y, 1)}"`;
        const body = `
            <circle cx="${O.x}" cy="${O.y}" r="${R}" fill="none" stroke="${STROKE}" stroke-width="2"/>
            ${pts(O, A)} stroke="${MUTED}" stroke-width="2"/>${pts(O, C)} stroke="${MUTED}" stroke-width="2"/>
            ${pts(B, A)} stroke="${STROKE}" stroke-width="1.6"/>${pts(B, C)} stroke="${STROKE}" stroke-width="1.6"/>
            ${text(A.x - 9, A.y + 12, 'A', { italic: true })}${text(C.x + 9, C.y + 12, 'C', { italic: true })}${text(B.x, B.y - 7, 'B', { italic: true })}${text(O.x + 10, O.y - 4, 'O', { italic: true })}
            ${text(O.x, O.y + 26, `${central}°`, { size: 11, fill: WARN })}${text(212, 16, `r = ${r} ${u}`, { size: 11, anchor: 'end', fill: MUTED })}`;
        return {
            q: `A circle has center $O$ and radius ${r} ${u}. Central angle $AOC$ measures $${central}^\\circ$, and $B$ is on the major arc. (a) Find inscribed angle $ABC$. (b) Find the length of arc $AC$ to two decimal places.`,
            svg: svgWrap(220, 175, body, `Circle with center O, radius ${r} ${u}, central angle AOC ${central} degrees, B on the major arc.`),
            svgAltText: `Circle with center O and radius ${r} ${u}; central angle AOC = ${central}°; B on the major arc.`,
            fields: [
                { id: `${id}-ang`, label: '(a) $\\angle ABC =$', answer: central / 2, tolerance: 0.01, weight: 0.4 },
                { id: `${id}-arc`, label: `(b) Arc $AC$ (${u})`, answer: s, tolerance: 0.01, weight: 0.6 }
            ],
            hint: 'An inscribed angle is half its arc. For the arc length, convert to radians first, then s = rθ.',
            solution: `(a) $\\angle ABC = ${central}/2 = ${central / 2}^\\circ$. <br>(b) $${central}^\\circ = ${piFrac(central / g, 180 / g)}$ rad, so $s = ${r}\\cdot${piFrac(central / g, 180 / g)} = ${piFrac(r * central / g, 180 / g)} \\approx ${fix(s, 2)}$ ${u}.`,
            key: `(a) ${central / 2}° (b) ${fix(s, 2)} ${u}`
        };
    }

    const SECTOR_ANGLES = [[1, 6], [1, 4], [1, 3], [2, 5], [1, 2], [3, 5], [2, 3], [3, 4], [5, 6], [5, 8], [3, 7], [4, 9], [7, 6], [5, 4], [4, 3], [7, 12], [5, 12], [7, 8]];

    function sector(rand, id = 'q') {
        const t = tools(rand);
        const r = t.int(4, 16);
        const [k, m] = t.pick(SECTOR_ANGLES);
        const A = 0.5 * r * r * k * Math.PI / m;
        const deg = 180 * k / m;
        const R = 62, O = { x: 80, y: 80 };
        const end = { x: O.x + R * Math.cos(deg * Math.PI / 180), y: O.y - R * Math.sin(deg * Math.PI / 180) };
        const body = `<circle cx="${O.x}" cy="${O.y}" r="${R}" fill="none" stroke="${STROKE}" stroke-width="1.5"/>
            <path d="M${O.x},${O.y} L${O.x + R},${O.y} A${R},${R} 0 ${deg > 180 ? 1 : 0},0 ${fix(end.x, 1)},${fix(end.y, 1)} Z" fill="${FILL}" stroke="${STROKE}" stroke-width="2"/>
            ${text(O.x + R / 2, O.y + 15, `r = ${r}`, { size: 11, fill: MUTED })}${text(150, 18, `θ = ${k === 1 ? '' : k}π/${m}`, { size: 12, anchor: 'start' })}`;
        return {
            q: `Find the area of a sector with radius ${r} and central angle $${piFrac(k, m)}$ radians, to two decimal places.`,
            svg: svgWrap(215, 160, body, `Sector of a circle with radius ${r} and central angle ${k}π/${m} radians.`),
            svgAltText: `Sector with radius ${r} and central angle ${k}π/${m} radians.`,
            fields: [{ id: `${id}-A`, label: '$A =$ (square units)', answer: A, tolerance: 0.01 }],
            hint: 'A = ½r²θ with θ in radians.',
            solution: `$A = \\tfrac12(${r})^2\\left(${piFrac(k, m)}\\right) = ${piFrac(r * r * k, 2 * m)} \\approx ${fix(A, 2)}$ square units.`,
            key: `${fix(A, 2)}`
        };
    }

    function speed(rand, id = 'q') {
        const t = tools(rand);
        const d = t.pick([2, 2.5, 3, 4, 5, 6, 7, 8]);
        const rpm = 5 * t.int(8, 50);
        const v = (d / 2) * rpm * 2 * Math.PI;
        return {
            q: `A wheel ${d} ft in diameter turns at ${rpm} rpm. Find the linear speed of a point on its rim in feet per minute, to two decimal places.`,
            fields: [{ id: `${id}-v`, label: '$v =$ (ft/min)', answer: v, tolerance: 0.01 }],
            hint: 'Halve the diameter for r. ω = rpm × 2π radians per minute, then v = rω.',
            solution: `$r = ${d}/2 = ${d / 2}$ ft, $\\omega = ${rpm}(2\\pi) = ${2 * rpm}\\pi$ rad/min, so $v = ${d / 2}(${2 * rpm}\\pi) = ${num(d * rpm)}\\pi \\approx ${fix(v, 2)}$ ft/min.`,
            key: `${fix(v, 2)} ft/min`
        };
    }

    // ------------------------------------------------------- the test
    // Question order and points of the Fall 2026 Test 2 (200 points).
    const TEST2 = [
        { skill: 'compound', points: 10, label: 'Compound interest', area: 'Section 4.2' },
        { skill: 'continuous', points: 10, label: 'Continuous compounding', area: 'Section 4.2' },
        { skill: 'toLog', points: 15, label: 'Exponential to logarithmic form', area: 'Section 4.3' },
        { skill: 'toExp', points: 15, label: 'Logarithmic to exponential form', area: 'Section 4.3' },
        { skill: 'solveLn', points: 15, label: 'Solve ln x = c', area: 'Section 4.3' },
        { skill: 'solveBase', points: 15, label: 'Solve b^x = c', area: 'Section 4.3' },
        { skill: 'parallel', points: 20, label: 'Angles across parallel lines', area: 'Angles and polygons' },
        { skill: 'similar', points: 20, label: 'Similar triangles', area: 'Angles and polygons' },
        { skill: 'trapezoid', points: 10, label: 'Trapezoid area', area: 'Angles and polygons' },
        { skill: 'heron', points: 10, label: "Heron's formula", area: 'Angles and polygons' },
        { skill: 'toDms', points: 10, label: 'Decimal degrees to DMS', area: 'Degrees, minutes, seconds' },
        { skill: 'toDecimal', points: 10, label: 'DMS to decimal degrees', area: 'Degrees, minutes, seconds' },
        { skill: 'inscribedArc', points: 20, label: 'Inscribed angle and arc length', area: 'Circles' },
        { skill: 'sector', points: 10, label: 'Sector area', area: 'Circles' },
        { skill: 'speed', points: 10, label: 'Linear speed', area: 'Circles' }
    ];
    const PAGES = [[1, 2, 3, 4, 5], [6, 7, 8], [9, 10, 11, 12], [13, 14, 15]];

    const skills = { compound, continuous, toLog, toExp, solveLn, solveBase, parallel, similar, trapezoid, heron, toDms, toDecimal, inscribedArc, sector, speed };

    // A whole practice test from one seed: the same seed always gives the same paper.
    function buildTest(seed) {
        const rand = mulberry32(seed);
        return TEST2.map((spec, i) => {
            const q = skills[spec.skill](rand, `t2q${i + 1}`);
            return { n: i + 1, ...spec, ...q };
        });
    }

    const api = { skills, TEST2, PAGES, buildTest, mulberry32 };
    if (typeof module === 'object' && module.exports) module.exports = api;
    root.Math130Test2Skills = api;
})(typeof globalThis !== 'undefined' ? globalThis : this);
