/* Shared Test 3 skills for browser and seeded Node verification. */
(function (root) {
    'use strict';
    function mulberry32(seed) {
        let a = seed >>> 0;
        return () => {
            a = (a + 0x6D2B79F5) >>> 0;
            let t = Math.imul(a ^ (a >>> 15), a | 1);
            t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
            return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
        };
    }
    const int = (r, lo, hi) => lo + Math.floor(r() * (hi - lo + 1));
    const pick = (r, list) => list[int(r, 0, list.length - 1)];
    const gcd = (a, b) => b ? gcd(b, a % b) : Math.abs(a);
    function fraction(n, d = 1) {
        if (d < 0) { n = -n; d = -d; }
        const g = gcd(n, d); n /= g; d /= g;
        return d === 1 ? String(n) : `${n < 0 ? '-' : ''}\\frac{${Math.abs(n)}}{${d}}`;
    }
    function piFraction(n, d = 1) {
        if (!n) return '0';
        if (d < 0) { n = -n; d = -d; }
        const g = gcd(n, d); n /= g; d /= g;
        const top = `${Math.abs(n) === 1 ? '' : Math.abs(n)}\\pi`;
        return `${n < 0 ? '-' : ''}${d === 1 ? top : `\\frac{${top}}{${d}}`}`;
    }
    function radical(n, d = 1, sign = 1) {
        let outside = 1;
        for (let k = 2; k * k <= n; k++) while (n % (k * k) === 0) { outside *= k; n /= k * k; }
        if (n === 1) return fraction(sign * outside, d);
        const g = gcd(outside, d); outside /= g; d /= g;
        const top = `${outside === 1 ? '' : outside}\\sqrt{${n}}`;
        return `${sign < 0 ? '-' : ''}${d === 1 ? top : `\\frac{${top}}{${d}}`}`;
    }
    const fixed = (v, places) => (Math.abs(v) < 0.5 * 10 ** -places ? 0 : v).toFixed(places);
    const paren = n => n < 0 ? `(${n})` : String(n);
    const signedTerm = (a, b) => `${a} ${b < 0 ? '-' : '+'} ${Math.abs(b)}`;
    const trigNames = ['sin', 'cos', 'tan', 'csc', 'sec', 'cot'];
    const trig = (fn, a) => ({ sin: () => Math.sin(a), cos: () => Math.cos(a), tan: () => Math.tan(a),
        csc: () => 1 / Math.sin(a), sec: () => 1 / Math.cos(a), cot: () => 1 / Math.tan(a) })[fn]();
    const signOf = (fn, q) => (fn === 'sin' || fn === 'csc') ? (q <= 2 ? 1 : -1)
        : (fn === 'cos' || fn === 'sec') ? ([1, 4].includes(q) ? 1 : -1) : ([1, 3].includes(q) ? 1 : -1);
    const exactSpecial = (fn, degrees, sign = 1) => {
        const values = { sin: {30: fraction(1,2),45: radical(2,2),60: radical(3,2)},
            cos: {30: radical(3,2),45: radical(2,2),60: fraction(1,2)},
            tan: {30: radical(3,3),45:'1',60:radical(3)} };
        return `${sign < 0 ? '-' : ''}${values[fn][degrees]}`;
    };
    // A small expression grammar, never eval: sums, products, fractions, pi and sqrt.
    function parseExact(raw) {
        const s = String(raw).toLowerCase().replace(/\s+/g, '').replace(/π/g, 'pi').replace(/−/g, '-');
        if (!s || s.length > 160) return null;
        const tokens = s.match(/sqrt|pi|(?:\d+\.?\d*|\.\d+)(?:e[+-]?\d+)?|[()+*/-]/g) || [];
        if (tokens.join('') !== s) return null;
        let i = 0, depth = 0;
        function atom() {
            if (++depth > 24) throw Error('depth');
            let v; const t = tokens[i++];
            if (t === '+' || t === '-') v = (t === '-' ? -1 : 1) * atom();
            else if (t === '(') { v = sum(); if (tokens[i++] !== ')') throw Error('parenthesis'); }
            else if (t === 'sqrt') { if (tokens[i++] !== '(') throw Error('sqrt'); v = Math.sqrt(sum()); if (tokens[i++] !== ')') throw Error('sqrt'); }
            else if (t === 'pi') v = Math.PI;
            else if (t && /^(?:\d|\.)/.test(t)) v = Number(t);
            else throw Error('atom');
            depth--; return v;
        }
        function product() {
            let v = atom();
            while (i < tokens.length) {
                const t = tokens[i];
                if (t === '*' || t === '/') { i++; const w = atom(); v = t === '*' ? v * w : v / w; }
                else if (t === 'pi' || t === 'sqrt' || t === '(') v *= atom();
                else break;
            }
            return v;
        }
        function sum() { let v = product(); while (tokens[i] === '+' || tokens[i] === '-') { const t = tokens[i++]; const w = product(); v = t === '+' ? v + w : v - w; } return v; }
        try { const v = sum(); return i === tokens.length && Number.isFinite(v) ? v : null; } catch (_) { return null; }
    }
    function grade(question, entries) {
        const close = (raw, answer, tol = 0) => {
            const v = parseExact(raw);
            return v !== null && Math.abs(v - answer) <= tol + 1e-10;
        };
        let parts;
        if (question.fields) parts = question.fields.map((f, i) => close(entries[i], f.answer, f.tolerance));
        else if (question.inputType === 'choice') parts = [String(entries[0]) === question.a];
        else if (question.inputType === 'bearing') {
            const m = String(entries[0]).trim().toUpperCase().match(/^([NS])\s*(\d+(?:\.\d+)?)\s*°?\s*([EW])$/);
            parts = [!!m && m[1] === question.a.ns && m[3] === question.a.ew && close(m[2], question.a.angle, 0.1)];
        } else if (question.inputType.startsWith('coterminal_')) {
            const rad = question.inputType === 'coterminal_rad';
            const base = rad ? question.baseThetaRad : question.baseTheta;
            const period = rad ? 2 * Math.PI : 360;
            const v = parseExact(entries[0]);
            const k = v === null ? 0 : Math.round((v - base) / period);
            parts = [k !== 0 && close(entries[0], base + period * k, question.tol)];
        } else if (typeof question.a === 'object') parts = Object.keys(question.a).map((k, i) => close(entries[i], question.a[k], question.tol[k]));
        else parts = [close(entries[0], question.a, question.tol)];
        return { parts, correct: parts.every(Boolean) };
    }
    function letterTriangle(letters) {
        return `<svg viewBox="0 0 300 210" width="300" height="210" role="img" aria-label="Right triangle: ${letters[0]} opposite theta, ${letters[1]} adjacent, ${letters[2]} hypotenuse">
            <rect width="300" height="210" fill="var(--diagram-bg)"/>
            <path d="M50 160 L250 160 L250 35 Z M235 160 V145 H250" fill="none" stroke="var(--diagram-ray)" stroke-width="3"/>
            <g fill="var(--diagram-axis-label)" text-anchor="middle" font-size="18"><text x="268" y="105">${letters[0]}</text><text x="150" y="187">${letters[1]}</text><text x="140" y="82">${letters[2]}</text><text x="90" y="152">θ</text></g></svg>`;
    }

    function normalizeDegrees(angle) {
        let t = angle % 360;
        if (t < 0) t += 360;
        return t;
    }

    function getReferenceAngleDegrees(rawAngle) {
        const t = normalizeDegrees(rawAngle);
        // Axis-aligned terminal sides (0, 90, 180, 270) are excluded in this generator.
        if (t % 90 === 0) return null;
        if (t < 90) return t;
        if (t < 180) return 180 - t;
        if (t < 270) return t - 180;
        return 360 - t;
    }

    function assertReferenceAngleConvention(ans) {
        if (!(ans > 0 && ans < 90)) {
            throw new Error(`Reference-angle convention failed: expected 0 < ans < 90, got ${ans}`);
        }
    }

    function buildAngleArcPath({
        center,
        radius,
        startAngleDeg,
        sweepDeg
    }) {
        const startRad = startAngleDeg * Math.PI / 180;
        const endRad = (startAngleDeg + sweepDeg) * Math.PI / 180;
        const startX = center + radius * Math.cos(startRad);
        const startY = center - radius * Math.sin(startRad);
        const endX = center + radius * Math.cos(endRad);
        const endY = center - radius * Math.sin(endRad);
        const largeArcFlag = Math.abs(sweepDeg) > 180 ? 1 : 0;
        const sweepFlag = sweepDeg >= 0 ? 0 : 1;
        return `M ${fixed(startX,2)} ${fixed(startY,2)} A ${radius} ${radius} 0 ${largeArcFlag} ${sweepFlag} ${fixed(endX,2)} ${fixed(endY,2)}`;
    }

    function createBasicAngleSvg({
        thetaDeg,
        labelText,
        fallbackText,
        referenceDeg = null,
        showReferenceLabel = false,
        turnCount = null,
        showGrid = true
    }) {
        const size = 300;
        const center = size / 2;
        const radius = 105;
        const thetaRad = thetaDeg * Math.PI / 180;
        const terminalX = center + radius * Math.cos(thetaRad);
        const terminalY = center - radius * Math.sin(thetaRad);
        const arcR = 42;
        const norm = normalizeDegrees(thetaDeg);
        const normalizedSweep = thetaDeg >= 0 ? norm : -(360 - norm);
        const arcPath = buildAngleArcPath({
            center,
            radius: arcR,
            startAngleDeg: 0,
            sweepDeg: normalizedSweep
        });
        const thetaLabelX = center + (arcR + 20) * Math.cos(thetaRad / 2);
        const thetaLabelY = center - (arcR + 20) * Math.sin(thetaRad / 2);
        const rawTurnCount = turnCount === null
            ? 0
            : turnCount;
        const resolvedTurnCount = Number.isFinite(rawTurnCount)
            ? Math.round(rawTurnCount)
            : 0;
        const hasExtraTurns = resolvedTurnCount !== 0;
        const wrapR = 30;
        const wrapMidX = center - wrapR;
        const wrapMidY = center;
        const wrapSweepFlag = resolvedTurnCount > 0 ? 0 : 1;
        const turnLabel = `${resolvedTurnCount > 0 ? '+' : ''}${resolvedTurnCount} turn${Math.abs(resolvedTurnCount) === 1 ? '' : 's'}`;

        const refMarkup = referenceDeg === null ? '' : (() => {
            const refR = 66;
            const refStartAngle = thetaDeg >= 0 ? 0 : 360;
            const refSweepDeg = thetaDeg >= 0 ? referenceDeg : -referenceDeg;
            const refArcPath = buildAngleArcPath({
                center,
                radius: refR,
                startAngleDeg: refStartAngle,
                sweepDeg: refSweepDeg
            });
            const refLabelAngle = (refStartAngle + refSweepDeg / 2) * Math.PI / 180;
            const refLabelX = center + (refR + 16) * Math.cos(refLabelAngle);
            const refLabelY = center - (refR + 16) * Math.sin(refLabelAngle);
            return `
                <path d="${refArcPath}"
                    fill="none" stroke="var(--diagram-reference)" stroke-width="3" stroke-dasharray="4 4"></path>
                ${showReferenceLabel ? `<text x="${fixed(refLabelX,2)}" y="${fixed(refLabelY,2)}" fill="var(--diagram-reference)" font-size="13" font-weight="600">ref = ${referenceDeg}°</text>` : ''}
            `;
        })();

        const turnMarkup = hasExtraTurns ? `
            <path d="M ${center + wrapR} ${center} A ${wrapR} ${wrapR} 0 1 ${wrapSweepFlag} ${wrapMidX} ${wrapMidY}
                A ${wrapR} ${wrapR} 0 1 ${wrapSweepFlag} ${center + wrapR} ${center}"
                fill="none" stroke="var(--diagram-turn)" stroke-width="2" stroke-dasharray="3 4" opacity="0.75"></path>
            <text x="36" y="42" fill="var(--diagram-turn)" font-size="12" font-weight="600">${turnLabel}</text>
        ` : '';

        return `
            <svg viewBox="0 0 ${size} ${size}" width="300" height="300" role="img" aria-label="${fallbackText.replace(/"/g, '&quot;')}">
                <rect x="0" y="0" width="${size}" height="${size}" fill="var(--diagram-bg)"></rect>
                ${showGrid ? `<g stroke="var(--diagram-grid)" stroke-width="0.75">
                    ${Array.from({ length: 13 }, (_, i) => {
                        const p = 30 + i * 20;
                        return `<line x1="${p}" y1="30" x2="${p}" y2="270"></line><line x1="30" y1="${p}" x2="270" y2="${p}"></line>`;
                    }).join('')}
                </g>` : ''}
                <line x1="30" y1="${center}" x2="270" y2="${center}" stroke="var(--diagram-axis)" stroke-width="2"></line>
                <line x1="${center}" y1="30" x2="${center}" y2="270" stroke="var(--diagram-axis)" stroke-width="2"></line>
                <text x="273" y="${center - 5}" fill="var(--diagram-axis-label)" font-size="12">x</text>
                <text x="${center + 6}" y="26" fill="var(--diagram-axis-label)" font-size="12">y</text>
                <line x1="${center}" y1="${center}" x2="${fixed(terminalX,2)}" y2="${fixed(terminalY,2)}" stroke="var(--diagram-ray)" stroke-width="3"></line>
                <circle cx="${center}" cy="${center}" r="4" fill="var(--diagram-origin)"></circle>
                <path d="${arcPath}" fill="none" stroke="var(--diagram-arc)" stroke-width="3"></path>
                <text x="${fixed(thetaLabelX,2)}" y="${fixed(thetaLabelY,2)}" fill="var(--diagram-arc)" font-size="13" font-weight="600">${labelText}</text>
                ${showGrid ? `<text x="36" y="286" fill="var(--diagram-turn)" font-size="12">grid: 1 square = 1 unit</text>` : ''}
                ${turnMarkup}
                ${refMarkup}
            </svg>
        `;
    }

    function createCoterminalAngleSvg({
        originalThetaDeg,
        normalizedThetaDeg,
        turnCount,
        fallbackText
    }) {
        const size = 300;
        const center = size / 2;
        const radius = 105;
        const terminalRad = normalizedThetaDeg * Math.PI / 180;
        const terminalX = center + radius * Math.cos(terminalRad);
        const terminalY = center - radius * Math.sin(terminalRad);
        const direction = originalThetaDeg >= 0 ? 'counterclockwise' : 'clockwise';
        const remainderSweep = originalThetaDeg - (turnCount * 360);
        const mainArc = buildAngleArcPath({
            center,
            radius: 48,
            startAngleDeg: 0,
            sweepDeg: remainderSweep
        });
        const remainderLabelAngle = (remainderSweep / 2) * Math.PI / 180;
        const remainderLabelX = center + 70 * Math.cos(remainderLabelAngle);
        const remainderLabelY = center - 70 * Math.sin(remainderLabelAngle);
        const turnDirectionWord = turnCount >= 0 ? 'CCW' : 'CW';

        const turnMarkup = turnCount === 0 ? '' : `
            <path d="${buildAngleArcPath({
                center,
                radius: 82,
                startAngleDeg: 20,
                sweepDeg: turnCount > 0 ? 300 : -300
            })}"
                fill="none" stroke="var(--diagram-turn)" stroke-width="2.5"
                stroke-dasharray="5 6" marker-end="url(#arcArrowTurn)" opacity="0.9"></path>
            <text x="28" y="42" fill="var(--diagram-turn)" font-size="12" font-weight="600">${turnCount > 0 ? '+' : ''}${turnCount} turn${Math.abs(turnCount) === 1 ? '' : 's'} (${turnDirectionWord})</text>
        `;

        return `
            <svg viewBox="0 0 ${size} ${size}" width="300" height="300" role="img" aria-label="${fallbackText.replace(/"/g, '&quot;')}">
                <defs>
                    <marker id="arcArrowMain" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
                        <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--diagram-arc)"></path>
                    </marker>
                    <marker id="arcArrowTurn" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
                        <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--diagram-turn)"></path>
                    </marker>
                </defs>
                <rect x="0" y="0" width="${size}" height="${size}" fill="var(--diagram-bg)"></rect>
                <line x1="30" y1="${center}" x2="270" y2="${center}" stroke="var(--diagram-axis)" stroke-width="2"></line>
                <line x1="${center}" y1="30" x2="${center}" y2="270" stroke="var(--diagram-axis)" stroke-width="2"></line>
                <text x="273" y="${center - 5}" fill="var(--diagram-axis-label)" font-size="12">x</text>
                <text x="${center + 6}" y="26" fill="var(--diagram-axis-label)" font-size="12">y</text>
                <line x1="${center}" y1="${center}" x2="${fixed(terminalX,2)}" y2="${fixed(terminalY,2)}" stroke="var(--diagram-ray)" stroke-width="3"></line>
                <circle cx="${center}" cy="${center}" r="4" fill="var(--diagram-origin)"></circle>
                <path d="${mainArc}" fill="none" stroke="var(--diagram-arc)" stroke-width="3.5" marker-end="url(#arcArrowMain)"></path>
                ${turnMarkup}
                <text x="24" y="248" fill="var(--diagram-axis-label)" font-size="12" font-weight="600">Original: ${originalThetaDeg}° (${direction})</text>
                <text x="24" y="266" fill="var(--diagram-ray)" font-size="12" font-weight="600">Terminal side = ${normalizedThetaDeg}°</text>
                <text x="${fixed(remainderLabelX,2)}" y="${fixed(remainderLabelY,2)}" fill="var(--diagram-arc)" font-size="12" font-weight="600">${remainderSweep}°</text>
            </svg>
        `;
    }

    function createVectorSvg({ x, y, labelText, fallbackText }) {
        const size = 300;
        const center = size / 2;
                const scale = 16;
        const endX = center + x * scale;
        const endY = center - y * scale;
        return `
            <svg viewBox="0 0 ${size} ${size}" width="300" height="300" role="img" aria-label="${fallbackText.replace(/"/g, '&quot;')}">
                <defs>
                    <marker id="vec-arrow" markerWidth="9" markerHeight="9" refX="8" refY="4.5" orient="auto">
                        <polygon points="0 0, 9 4.5, 0 9" fill="var(--danger-main)"></polygon>
                    </marker>
                </defs>
                <rect x="0" y="0" width="${size}" height="${size}" fill="var(--diagram-bg)"></rect>
                <g stroke="var(--diagram-grid)" stroke-width="1">
                    ${Array.from({ length: 19 }, (_, i) => `<line x1="${i * 16 + 6}" y1="10" x2="${i * 16 + 6}" y2="290"></line>`).join('')}
                    ${Array.from({ length: 19 }, (_, i) => `<line x1="10" y1="${i * 16 + 6}" x2="290" y2="${i * 16 + 6}"></line>`).join('')}
                </g>
                <line x1="10" y1="${center}" x2="290" y2="${center}" stroke="var(--diagram-axis)" stroke-width="2"></line>
                <line x1="${center}" y1="10" x2="${center}" y2="290" stroke="var(--diagram-axis)" stroke-width="2"></line>
                <text x="293" y="${center - 5}" fill="var(--diagram-axis-label)" font-size="12">x</text>
                <text x="${center + 6}" y="16" fill="var(--diagram-axis-label)" font-size="12">y</text>
                <line x1="${center}" y1="${center}" x2="${fixed(endX,2)}" y2="${fixed(endY,2)}" stroke="var(--danger-main)" stroke-width="3" marker-end="url(#vec-arrow)"></line>
                <circle cx="${center}" cy="${center}" r="4" fill="var(--diagram-origin)"></circle>
                <circle cx="${fixed(endX,2)}" cy="${fixed(endY,2)}" r="4" fill="var(--emerald-main)"></circle>
                <text x="${Math.min(258, endX + 8).toFixed(2)}" y="${Math.max(18, endY - 8).toFixed(2)}" fill="var(--emerald-main)" font-size="13">(${x}, ${y})</text>
                <text x="36" y="286" fill="var(--text-muted)" font-size="12">scale: 1 unit per grid line</text>
                <text x="18" y="28" fill="var(--primary-hover)" font-size="13" font-weight="600">${labelText}</text>
            </svg>
        `;
    }

    const definitions = [
        { id: 'angle_coterminal', section: 'Section 5.1', label: 'Coterminal Angles (Degrees)',
          generate: (r = Math.random) => {
            const theta = int(r,-1440,1440), answer = theta + 360;
            const normalizedThetaDeg = normalizeDegrees(theta), turnCount = Math.round((theta-normalizedThetaDeg)/360);
            const svgAltText = `Angle ${theta} degrees with terminal side at ${normalizedThetaDeg} degrees.`;
            return {q:`Find one coterminal angle for $${theta}^\\circ$ different from the given angle. Enter an integer in degrees.`,
                svg:createCoterminalAngleSvg({originalThetaDeg:theta,normalizedThetaDeg,turnCount,fallbackText:svgAltText}),svgAltText,
                inputType:'coterminal_deg',baseTheta:theta,tol:0,
                solution:`Add a full turn: $${signedTerm(theta,360)}=${answer}^\\circ$. Any nonzero integer number of full turns gives another coterminal angle.`};
          } },

        { id:'angle_coterminal_rad',section:'Section 5.1',label:'Coterminal Angles (Radians)',
          generate:(r = Math.random) => {
            const d=pick(r,[3,4,6,12]),n=int(r,1,8*d)*(r()<0.5?-1:1);
            return {q:`Find one coterminal angle for $${piFraction(n,d)}$ radians different from the given angle. Enter an exact value or round to 3 decimals.`,
                inputType:'coterminal_rad',baseThetaRad:n*Math.PI/d,tol:0.001,
                entryNote:'Type pi for $\\pi$, for example 5pi/12.',
                solution:`Add $2\\pi$: $${piFraction(n,d)}+2\\pi=${piFraction(n+2*d,d)}\\approx ${fixed((n+2*d)*Math.PI/d,3)}$ radians.`};
          } },

        {id:'arc_length',section:'Section 5.1',label:'Arc Length and Central Angle',
         generate:(r = Math.random) => {
            const radius=int(r,2,25), d=pick(r,[3,4,6,12]), n=int(r,1,2*d-1), degrees=r()<0.5, findAngle=r()<0.3;
            const theta=n*Math.PI/d, arc=radius*theta;
            const given=degrees?`$${180*n/d}^\\circ$`:`$${piFraction(n,d)}$ radians`;
            const q=findAngle ? `A circle has radius $${radius}$ cm and arc length $${piFraction(radius*n,d)}$ cm. Find the central angle in ${degrees?'degrees':'radians'}.`
                :`A circle has radius $${radius}$ cm and central angle ${given}. Find the arc length in cm.`;
            const exact=findAngle?(degrees?fraction(180*n,d):piFraction(n,d)):piFraction(radius*n,d);
            const a=findAngle?(degrees?180*n/d:theta):arc;
            return {q:`${q} Enter an exact value or round to 3 decimals.`,inputType:'exact',a,tol:0.001,
                solution:`Convert angles using $180^\\circ=\\pi$ radians. Use $s=r\\theta$: $s=${radius}\\left(${piFraction(n,d)}\\right)=${piFraction(radius*n,d)}$ cm. ${findAngle?'Solving $\\theta=s/r$, ':''}The answer is $${exact}\\approx ${fixed(a,3)}$ ${findAngle?(degrees?'degrees':'radians'):'cm'}.`};
         } },

        {
            id: 'trig_ratio', section: 'Section 5.2',
            label: 'Evaluate Basic Trig Ratio',
            generate: (random = Math.random) => {
                const opp = Math.floor(random() * 10) + 3;
                const adj = Math.floor(random() * 10) + 4;
                const hyp = Math.sqrt(opp*opp + adj*adj);
                const pick = ['sin','cos','tan'][Math.floor(random()*3)];
                const ans = pick === 'sin' ? opp/hyp : pick === 'cos' ? adj/hyp : opp/adj;
                const sum = opp * opp + adj * adj;
                const exact = pick === 'tan' ? fraction(opp, adj)
                    : radical((pick === 'sin' ? opp * opp : adj * adj) * sum, sum);
                return {
                    q: `In a right triangle, opposite side $=${opp}$ and adjacent side $=${adj}$. Find $${pick}(\\theta)$. Enter an exact value or round to 4 decimals.`,
                    inputType: 'exact', a: ans, tol: 0.0001,
                    solution: `The hypotenuse is $${radical(sum)}$. Thus $\\${pick}\\theta=${exact}\\approx ${fixed(ans,4)}$.`
                };
            }
        },
        {id:'trig_calculator_values',section:'Section 5.2',label:'Calculator Trig Values',
         generate:(r = Math.random) => {
            const fn=pick(r,trigNames), degrees=r()<0.7;
            const angle=degrees?pick(r,[int(r,1,89),int(r,91,179)]):int(r,1,28)/10;
            const a=trig(fn,degrees?angle*Math.PI/180:angle);
            const text=degrees?`${angle}^\\circ`:String(angle);
            return {q:`Use a calculator to approximate $\\${fn}(${text})$${degrees?'':' in radian mode'}. Round to 4 decimals.`,inputType:'number',a,tol:0.0001,
                solution:`Use ${degrees?'degree':'radian'} mode${['csc','sec','cot'].includes(fn)?' and the reciprocal of '+({csc:'sine',sec:'cosine',cot:'tangent'})[fn]:''}. $\\${fn}(${text})\\approx ${fixed(a,4)}$.`};
         } },

        {id:'angle_unit_conversion',section:'Section 5.2',label:'Convert Degrees and Radians',
         generate:(r = Math.random) => {
            const mode=int(r,0,2), n=int(r,1,23),d=pick(r,[2,3,4,5,6,12]);
            if(mode===0){ const degrees=n*15,a=degrees*Math.PI/180;
                return {q:`Convert $${degrees}^\\circ$ to radians. Enter an exact value or round to 2 decimals.`,inputType:'exact',a,tol:0.01,
                    solution:`$${degrees}\\cdot\\frac{\\pi}{180}=${piFraction(degrees,180)}\\approx ${fixed(a,2)}$ radians.`}; }
            if(mode===1){const a=180*n/d;return {q:`Convert $${piFraction(n,d)}$ radians to degrees. Enter an exact value.`,inputType:'exact',a,tol:0,
                solution:`$${piFraction(n,d)}\\cdot\\frac{180}{\\pi}=${fraction(n*180,d)}^\\circ$.`};}
            const rad=int(r,5,55)/10,a=rad*180/Math.PI;
            return {q:`Convert $${rad}$ radians to degrees. Round to 1 decimal.`,inputType:'number',a,tol:0.1,
                solution:`$${rad}\\cdot\\frac{180}{\\pi}\\approx ${fixed(a,1)}^\\circ$.`};
         } },

        {id:'right_triangle_word_problem',section:'Section 5.2',label:'Right Triangle Word Problems',
         generate:(r = Math.random) => {
            const context=int(r,0,4), angle=int(r,20,70),length=int(r,8,45), findAngle=r()<0.3;
            const contexts=[['A ladder','the ground','the ladder reaches up a wall'],['A ramp','level ground','the ramp rises to a platform'],['A taut kite string','level ground','the kite is above the point directly below it'],['A ray of sunlight','level ground','a pole casts a shadow'],['A taut guy wire','level ground','the wire attaches to a pole']];
            const [subject,base,detail]=contexts[context];
            if(findAngle){const h=int(r,3,25),a=Math.atan2(h,length)*180/Math.PI;
                return {q:`${subject} forms a right triangle: ${detail}. The vertical height is ${h} m and the horizontal distance is ${length} m. Find the acute angle with ${base}. Round to 1 decimal in degrees.`,inputType:'number',a,tol:0.1,
                    solution:`$\\theta=\\tan^{-1}(${h}/${length})\\approx ${fixed(a,1)}^\\circ$.`};}
            const a=length*Math.tan(angle*Math.PI/180);
            return {q:`${subject} makes an angle of $${angle}^\\circ$ with ${base}; ${detail}. The horizontal distance is ${length} m. Find the vertical height in meters. Round to 2 decimals.`,inputType:'number',a,tol:0.01,
                solution:`$h=${length}\\tan(${angle}^\\circ)\\approx ${fixed(a,2)}$ m.`};
         } },

        {
            id: 'solve_right_triangle_side', section: 'Section 7.1',
            label: 'Solve Right Triangle Side (Section 7.1)',
            generate: (random = Math.random) => {
                const angle = [25, 30, 35, 40, 45, 50, 60][Math.floor(random() * 7)];
                const known = Math.floor(random() * 14) + 6;
                const caseType = ['sinOpp', 'cosAdj', 'tanOpp', 'tanAdj', 'sinHyp', 'cosHyp'][Math.floor(random() * 6)];
                const angleRad = angle * Math.PI / 180;
                let q, ans, solution;
                if (caseType === 'sinOpp') {
                    // given hyp, find opp: opp = hyp * sin
                    ans = known * Math.sin(angleRad);
                    q = `A right triangle has angle $${angle}^\\circ$ and hypotenuse $${known}$. Find the opposite side. (Round to 2 decimals)`;
                    solution = `$\\sin(${angle}^\\circ)=\\frac{x}{${known}}\\Rightarrow x=${known}\\sin(${angle}^\\circ)=${fixed(ans,2)}$.`;
                } else if (caseType === 'cosAdj') {
                    // given hyp, find adj: adj = hyp * cos
                    ans = known * Math.cos(angleRad);
                    q = `A right triangle has angle $${angle}^\\circ$ and hypotenuse $${known}$. Find the adjacent side. (Round to 2 decimals)`;
                    solution = `$\\cos(${angle}^\\circ)=\\frac{x}{${known}}\\Rightarrow x=${known}\\cos(${angle}^\\circ)=${fixed(ans,2)}$.`;
                } else if (caseType === 'tanOpp') {
                    // given adj, find opp: opp = adj * tan
                    ans = known * Math.tan(angleRad);
                    q = `A right triangle has angle $${angle}^\\circ$ and adjacent side $${known}$. Find the opposite side. (Round to 2 decimals)`;
                    solution = `$\\tan(${angle}^\\circ)=\\frac{x}{${known}}\\Rightarrow x=${known}\\tan(${angle}^\\circ)=${fixed(ans,2)}$.`;
                } else if (caseType === 'tanAdj') {
                    // given opp, find adj: adj = opp / tan
                    ans = known / Math.tan(angleRad);
                    q = `A right triangle has angle $${angle}^\\circ$ and opposite side $${known}$. Find the adjacent side. (Round to 2 decimals)`;
                    solution = `$\\tan(${angle}^\\circ)=\\frac{${known}}{x}\\Rightarrow x=\\frac{${known}}{\\tan(${angle}^\\circ)}=${fixed(ans,2)}$.`;
                } else if (caseType === 'sinHyp') {
                    // given opp, find hyp: hyp = opp / sin
                    ans = known / Math.sin(angleRad);
                    q = `A right triangle has angle $${angle}^\\circ$ and opposite side $${known}$. Find the hypotenuse. (Round to 2 decimals)`;
                    solution = `$\\sin(${angle}^\\circ)=\\frac{${known}}{x}\\Rightarrow x=\\frac{${known}}{\\sin(${angle}^\\circ)}=${fixed(ans,2)}$.`;
                } else {
                    // given adj, find hyp: hyp = adj / cos
                    ans = known / Math.cos(angleRad);
                    q = `A right triangle has angle $${angle}^\\circ$ and adjacent side $${known}$. Find the hypotenuse. (Round to 2 decimals)`;
                    solution = `$\\cos(${angle}^\\circ)=\\frac{${known}}{x}\\Rightarrow x=\\frac{${known}}{\\cos(${angle}^\\circ)}=${fixed(ans,2)}$.`;
                }
                return { q, inputType: 'number', a: ans, tol: 0.01, solution };
            }
        },
        {id:'reference_angle_rad',section:'Section 5.3',label:'Reference Angle (Radians)',
         generate:(r = Math.random) => {
            const d=pick(r,[3,4,6,12]);let n;do{n=int(r,-8*d,8*d);}while((2*n)%d===0);
            const normalized=((n%(2*d))+2*d)%(2*d), folded=Math.min(normalized,2*d-normalized), ref=Math.min(folded,d-folded);
            return {q:`Find the reference angle for $${piFraction(n,d)}$ radians. Enter an exact value or round to 4 decimals.`,inputType:'exact',a:ref*Math.PI/d,tol:0.0001,
                solution:`A coterminal angle in $[0,2\\pi)$ is $${piFraction(normalized,d)}$. Measure the acute angle to the $x$-axis: $${piFraction(ref,d)}\\approx ${fixed(ref*Math.PI/d,4)}$ radians.`};
         } },

        {
            id: 'reference_angle_deg', section: 'Section 5.3',
            label: 'Reference Angle (Degrees)',
            generate: (random = Math.random) => {
                let raw;
                let t;
                let ans;
                do {
                    raw = (Math.floor(random()*32)+1)*15 * (random()>0.5?1:-1);
                    t = normalizeDegrees(raw);
                    ans = getReferenceAngleDegrees(raw);
                } while (ans === null);

                // Guard: by our convention with non-axis terminal sides, answer must be acute.
                assertReferenceAngleConvention(ans);
                const turnCount = Math.round((raw - t) / 360);
                const fallbackText = `Angle ${raw} degrees in standard position. Terminal side matches ${t} degrees with ${turnCount > 0 ? `${turnCount} counterclockwise` : `${Math.abs(turnCount)} clockwise`} full turn${Math.abs(turnCount) === 1 ? '' : 's'}.`;
                const entryNote = 'Use the diagram to locate the terminal side, then measure the acute angle to the x-axis. The visual intentionally does not label the reference angle value.';
                return {
                    q: `Find the reference angle for $${raw}^\\circ$.`,
                    svg: createBasicAngleSvg({
                        thetaDeg: t,
                        labelText: `${raw}\u00b0`,
                        fallbackText,
                        turnCount
                    }),
                    svgAltText: fallbackText,
                    entryNote,
                    inputType: 'number', a: ans, tol: 0.1,
                    solution: `First find a coterminal angle between $0^\\circ$ and $360^\\circ$: $${t}^\\circ$. The reference angle is the acute angle to the $x$-axis: $${ans}^\\circ$.`
                };
            }
        },
        {id:'quadrant_signs',section:'Section 5.3',label:'Quadrant from Signs',
         generate:(r = Math.random) => {
            const quadrant=int(r,1,4),first=pick(r,trigNames);
            const second=pick(r,trigNames.filter(fn=>trigNames.indexOf(fn)%3!==trigNames.indexOf(first)%3));
            return {q:`Determine the quadrant if $\\${first}\\theta${signOf(first,quadrant)>0?'>':'<'}0$ and $\\${second}\\theta${signOf(second,quadrant)>0?'>':'<'}0$. Enter 1, 2, 3, or 4.`,inputType:'quadrant_int',a:quadrant,tol:0,
                solution:`Use the signs of the two ratios. Both conditions hold in Quadrant ${quadrant}.`};
         } },

        {id:'trig_values_from_info',section:'Section 5.3',label:'Trig Values from Quadrant/Reference Angle',
         generate:(r = Math.random) => {
            const ref=pick(r,[30,45,60]),quadrant=int(r,1,4),target=pick(r,['sin','cos','tan']);
            const known=pick(r,['sin','cos','tan'].filter(f=>f!==target)),givenRatio=r()<0.55;
            const a=signOf(target,quadrant)*trig(target,ref*Math.PI/180),exact=exactSpecial(target,ref,signOf(target,quadrant));
            return {q:`An angle $\\theta$ lies in Quadrant ${quadrant} and ${givenRatio?`$\\${known}\\theta=${exactSpecial(known,ref,signOf(known,quadrant))}$`:`has reference angle $${ref}^\\circ$`}. Find $\\${target}\\theta$. Enter an exact value or round to 4 decimals.`,inputType:'exact',a,tol:0.0001,
                solution:`The reference angle is $${ref}^\\circ$. Apply the sign in Quadrant ${quadrant}: $\\${target}\\theta=${exact}\\approx ${fixed(a,4)}$.`};
         } },

        {id:'solve_right_triangle',section:'Section 7.1',label:'Solve a Right Triangle',
         generate:(r = Math.random) => {
            const knownAngle=r()<0.5,angle=int(r,20,70),b=int(r,5,40),a=int(r,5,40);
            const theta=knownAngle?angle:Math.atan2(a,b)*180/Math.PI;
            const opposite=knownAngle?b*Math.tan(theta*Math.PI/180):a;
            const hyp=Math.hypot(opposite,b);
            const fields=knownAngle?[{id:'a',label:'Side a (cm)',answer:opposite,tolerance:0.01},{id:'c',label:'Side c (cm)',answer:hyp,tolerance:0.01},{id:'B',label:'Angle B (degrees)',answer:90-theta,tolerance:0.1}]
                :[{id:'c',label:'Side c (cm)',answer:hyp,tolerance:0.01},{id:'A',label:'Angle A (degrees)',answer:theta,tolerance:0.1},{id:'B',label:'Angle B (degrees)',answer:90-theta,tolerance:0.1}];
            return {q:`In right triangle $ABC$, $C=90^\\circ$; side $a$ is opposite $A$, $b$ opposite $B$, and $c$ is the hypotenuse. Given $b=${b}$ cm and ${knownAngle?`$A=${angle}^\\circ$`:`$a=${a}$ cm`}, find all three missing parts. Round lengths to 2 decimals and angles to 1 decimal.`,inputType:'parts',fields,
                solution:`Use $\\tan A=a/b$, $c=\\sqrt{a^2+b^2}$, and $B=90^\\circ-A$. ${fields.map(f=>`${f.label}: $${fixed(f.answer,f.tolerance===0.01?2:1)}$`).join('; ')}.`};
         } },

        {id:'angle_of_elevation',section:'Section 7.1',label:'Elevation and Depression',
         generate:(r = Math.random) => {
            const depression=r()<0.5,context=pick(r,depression?['a lighthouse','a cliff','an airplane']:['a tower','a building','a hill']);
            const h=int(r,20,150),distance=int(r,30,180),angle=int(r,15,70),kind=int(r,0,3);
            const word=depression?'depression':'elevation';
            const scene=depression?`An observer on ${context} looks down at a point on level ground.`:`An observer on level ground looks up at the top of ${context}.`;
            if(kind<2){const a=Math.atan2(h,distance)*180/Math.PI;return {q:`${scene} The vertical height above eye level is ${h} m and the horizontal distance is ${distance} m. Find the angle of ${word}. Round to 1 decimal in degrees.`,inputType:'number',a,tol:0.1,
                solution:`$\\theta=\\tan^{-1}(${h}/${distance})\\approx ${fixed(a,1)}^\\circ$.`};}
            const height=kind===2,a=height?distance*Math.tan(angle*Math.PI/180):h/Math.tan(angle*Math.PI/180);
            return {q:`${scene} The angle of ${word} is $${angle}^\\circ$ and the ${height?`horizontal distance is ${distance}`:`vertical height above eye level is ${h}`} m. Find the ${height?'vertical height above eye level':'horizontal distance'} in meters. Round to 2 decimals.`,inputType:'number',a,tol:0.01,
                solution:`The angle with the horizontal gives $\\tan(${angle}^\\circ)=h/d$. Thus $${height?'h':'d'}=${height?`${distance}\\tan(${angle}^\\circ)`:`${h}/\\tan(${angle}^\\circ)`}\\approx ${fixed(a,2)}$ m.`};
         } },

        {
            id: 'two_right_triangles', section: 'Section 7.1',
            label: 'Two Right Triangles (Length)',
            generate: (random = Math.random) => {
                const gap = Math.floor(random() * 10) + 8;
                const angleA = [40, 42, 45, 48, 50][Math.floor(random() * 5)];
                const angleB = [20, 24, 28, 30, 32][Math.floor(random() * 5)];
                const tanA = Math.tan(angleA * Math.PI / 180);
                const tanB = Math.tan(angleB * Math.PI / 180);
                const d = (gap * tanB) / (tanA - tanB);
                return {
                    q: `Two observation points $A$ and $B$ are on the same straight line from the base of a tower, with $B$ ${gap} m farther from the tower than $A$. The angle of elevation to the top is $${angleA}^\\circ$ at $A$ and $${angleB}^\\circ$ at $B$. Find the horizontal distance from $A$ to the tower base. (Round to 2 decimals)`,
                    inputType: 'number', a: d, tol: 0.01,
                    solution: `Let $x$ be the distance from $A$ to the tower base and $h$ the tower height. Then $h=x\\tan(${angleA}^\\circ)$ and $h=(x+${gap})\\tan(${angleB}^\\circ)$. Set equal and solve: $x(\\tan(${angleA}^\\circ)-\\tan(${angleB}^\\circ))=${gap}\\tan(${angleB}^\\circ)$, so $x=${fixed(d,2)}$ m.`
                };
            }
        },
        {
            id: 'distance_rate_time', section: 'Section 7.1',
            label: 'Distance-Rate-Time with Trig',
            generate: (random = Math.random) => {
                const speed = Math.floor(random()*40)+20;
                const angle = [20,25,30,35,40][Math.floor(random()*5)];
                const t = Math.floor(random()*4)+2;
                const ans = speed * t * Math.sin(angle*Math.PI/180);
                return {
                    q: `A plane travels ${speed} miles/hour for ${t} hours at an angle of elevation of $${angle}^\\circ$. Approximate the vertical rise. (Round to 1 decimal)`,
                    inputType: 'number', a: ans, tol: 0.1,
                    solution: `Distance traveled is $d=rt=${speed}(${t})=${speed*t}$. Vertical rise $=d\\sin(${angle}^\\circ)=${fixed(ans,1)}$.`
                };
            }
        },
        {
            id: 'vector_components', section: 'Section 8.4',
            label: 'Vector Components from Points',
            generate: (random = Math.random) => {
                const x1 = Math.floor(random() * 8) - 4;
                const y1 = Math.floor(random() * 8) - 4;
                let x2 = Math.floor(random() * 12) - 6;
                let y2 = Math.floor(random() * 12) - 6;
                if (x2 === x1 && y2 === y1) x2 += 2;
                const dx = x2 - x1;
                const dy = y2 - y1;
                const fallbackText = `Coordinate graph with P(${x1}, ${y1}) and Q(${x2}, ${y2}). Find vector PQ.`;
                const svg = `
                    <svg viewBox="0 0 300 300" width="300" height="300" role="img" aria-label="${fallbackText}">
                        <defs>
                            <marker id="arrowhead-pq" markerWidth="9" markerHeight="9" refX="8" refY="4.5" orient="auto">
                                <polygon points="0 0, 9 4.5, 0 9" fill="var(--danger-main)"></polygon>
                            </marker>
                        </defs>
                        <rect x="0" y="0" width="300" height="300" fill="var(--diagram-bg)"></rect>
                        <g stroke="var(--diagram-grid)" stroke-width="1">
                            ${Array.from({ length: 15 }, (_, i) => `<line x1="${i * 20 + 10}" y1="10" x2="${i * 20 + 10}" y2="290"></line>`).join('')}
                            ${Array.from({ length: 15 }, (_, i) => `<line x1="10" y1="${i * 20 + 10}" x2="290" y2="${i * 20 + 10}"></line>`).join('')}
                        </g>
                        <line x1="10" y1="150" x2="290" y2="150" stroke="var(--diagram-axis)" stroke-width="2"></line>
                        <line x1="150" y1="10" x2="150" y2="290" stroke="var(--diagram-axis)" stroke-width="2"></line>
                        <text x="293" y="145" fill="var(--diagram-axis-label)" font-size="12">x</text>
                        <text x="156" y="16" fill="var(--diagram-axis-label)" font-size="12">y</text>
                        <line x1="${150 + x1 * 20}" y1="${150 - y1 * 20}" x2="${150 + x2 * 20}" y2="${150 - y2 * 20}" stroke="var(--danger-main)" stroke-width="3" marker-end="url(#arrowhead-pq)"></line>
                        <circle cx="${150 + x1 * 20}" cy="${150 - y1 * 20}" r="4" fill="var(--primary-hover)"></circle>
                        <circle cx="${150 + x2 * 20}" cy="${150 - y2 * 20}" r="4" fill="var(--emerald-main)"></circle>
                        <text x="${158 + x1 * 20}" y="${142 - y1 * 20}" fill="var(--primary-hover)" font-size="13">P(${x1},${y1})</text>
                        <text x="${158 + x2 * 20}" y="${142 - y2 * 20}" fill="var(--emerald-main)" font-size="13">Q(${x2},${y2})</text>
                        <text x="36" y="286" fill="var(--text-muted)" font-size="12">scale: 1 unit per grid line</text>
                    </svg>
                `;

                return {
                    q: `Use the graph to find $\\vec{PQ}$ in component form. (Coordinates: Given points $P(${x1},${y1})$ and $Q(${x2},${y2})$.)`,
                    svg,
                    svgAltText: fallbackText,
                    inputType: 'vector_xy',
                    a: { x: dx, y: dy },
                    tol: { x: 0, y: 0 },
                    solution: `$\\vec{PQ}=\\langle x_2-x_1, y_2-y_1\\rangle=\\langle ${x2} - ${paren(x1)}, ${y2} - ${paren(y1)}\\rangle=\\langle ${dx}, ${dy}\\rangle$. So the components are $x=${dx}$ and $y=${dy}$.`
                };
            }
        },
        {id:'vector_operations',section:'Section 8.4',label:'Vector Addition and Scalar Multiplication',
         generate:(r = Math.random) => {
            const a=int(r,-4,4),b=int(r,-4,4),c=int(r,-4,4),d=int(r,-4,4),k=pick(r,[-3,-2,2,3]);
            const op=k<0?'-':'+',m=Math.abs(k),x=a+k*c,y=b+k*d;
            return {q:`Let $\\vec u=\\langle ${a},${b}\\rangle$ and $\\vec v=\\langle ${c},${d}\\rangle$. Find $\\vec u ${op} ${m}\\vec v$. Enter exact components.`,inputType:'vector_xy',a:{x,y},tol:{x:0,y:0},
                solution:`$${m}\\vec v=\\langle ${m*c},${m*d}\\rangle$. Then $\\vec u ${op} ${m}\\vec v=\\langle ${a} ${op} ${paren(m*c)},${b} ${op} ${paren(m*d)}\\rangle=\\langle ${x},${y}\\rangle$.`};
         } },

        {
            id: 'vector_mag_direction', section: 'Section 8.4',
            label: 'Vector Magnitude and Direction',
            generate: (random = Math.random) => {
                let a = Math.floor(random() * 16) - 8;
                let b = Math.floor(random() * 16) - 8;
                if (a === 0 && b === 0) b = 6;
                let direction = Math.atan2(b, a) * 180 / Math.PI;
                if (direction < 0) direction += 360;
                const magnitude = Math.sqrt(a * a + b * b);
                const fallbackText = `Vector from origin to (${a}, ${b}) on a coordinate grid.`;
                return {
                    q: `Use the graph to enter BOTH the magnitude and direction angle (in degrees, from $0^\\circ$ to $360^\\circ$) of the vector. Round magnitude to 3 decimals and direction to 1 decimal. (Coordinates: vector $\\langle ${a}, ${b}\\rangle$.)`,
                    svg: createVectorSvg({ x: a, y: b, labelText: `v = <${a}, ${b}>`, fallbackText }),
                    svgAltText: fallbackText,
                    inputType: 'vector_mag_dir',
                    a: { mag: magnitude, dir: direction },
                    tol: { mag: 0.001, dir: 0.1 },
                    solution: `Magnitude: $\\sqrt{(${a})^2 + (${b})^2} = ${fixed(magnitude,3)}$. Direction: use $\\theta = \\operatorname{atan2}(${b}, ${a}) = ${fixed(direction,1)}^\\circ$.`
                };
            }
        },
        {
            id: 'vector_magnitude', section: 'Section 8.4',
            label: 'Vector Magnitude',
            generate: (random = Math.random) => {
                const a = Math.floor(random()*16)-8;
                let b = Math.floor(random()*16)-8;
                if (a===0 && b===0) b=5;
                const ans = Math.sqrt(a*a+b*b);
                return {
                    q: `Find the magnitude of vector $\\langle ${a}, ${b}\\rangle$. (Round to 3 decimals)`,
                    inputType: 'number', a: ans, tol: 0.001,
                    solution: `$|\\vec v|=\\sqrt{a^2+b^2}=\\sqrt{(${a})^2+(${b})^2}=${fixed(ans,3)}$.`
                };
            }
        },
        {
            id: 'vector_direction', section: 'Section 8.4',
            label: 'Direction Angle of Vector',
            generate: (random = Math.random) => {
                let a = Math.floor(random()*18)-9;
                let b = Math.floor(random()*18)-9;
                if (a===0) a = 4;
                if (b===0) b = -6;
                let ans = Math.atan2(b,a)*180/Math.PI;
                if (ans < 0) ans += 360;
                return {
                    q: `Find the direction angle (between $0^\\circ$ and $360^\\circ$) of vector $${random() < 0.5 ? `${a}i ${b < 0 ? '-' : '+'} ${Math.abs(b)}j` : `\\langle ${a}, ${b}\\rangle`}$. Round to 1 decimal.`,
                    inputType: 'number', a: ans, tol: 0.1,
                    solution: (() => {
                        const rawDeg = Math.atan2(b, a) * 180 / Math.PI;
                        const needsAdjust = rawDeg < 0;
                        return `Use $\\operatorname{atan2}(${b},\\,${a}) = ${fixed(rawDeg,1)}^\\circ$${needsAdjust ? `. Since the result is negative, add $360^\\circ$: $${fixed(rawDeg,1)} + 360 = ${fixed(ans,1)}^\\circ$` : `. This is already in $[0^\\circ,360^\\circ)$, so the direction angle is $${fixed(ans,1)}^\\circ$`}.`;
                    })()
                };
            }
        }
        ,
        {id:'trig_from_given_ratio',section:'Section 5.2',label:'Find Another Trigonometric Ratio',
         generate:(r = Math.random) => {
            const [adj,opp,hyp]=pick(r,[[3,4,5],[5,12,13],[8,15,17],[7,24,25],[20,21,29],[9,40,41],[12,35,37],[11,60,61],[28,45,53],[33,56,65]]);
            const ratios={sin:[opp,hyp],cos:[adj,hyp],tan:[opp,adj],csc:[hyp,opp],sec:[hyp,adj],cot:[adj,opp]};
            const known=pick(r,trigNames),target=pick(r,trigNames.filter(f=>f!==known)),[n,d]=ratios[target];
            return {q:`For an acute angle $\\theta$, $\\${known}\\theta=${fraction(...ratios[known])}$. Find $\\${target}\\theta$. Enter an exact value or round to 4 decimals.`,inputType:'exact',a:n/d,tol:0.0001,
                solution:`The Pythagorean theorem gives opposite $${opp}$, adjacent $${adj}$, hypotenuse $${hyp}$. Thus $\\${target}\\theta=${fraction(n,d)}\\approx ${fixed(n/d,4)}$.`};
         } },

        {id:'solve_trig_equation_special',section:'Section 5.3',label:'Solve a Special-Angle Trig Equation',
         generate:(r = Math.random) => {
            const fn=pick(r,['sin','cos','tan']),ref=pick(r,[30,45,60]),sign=r()<0.5?-1:1,radians=r()<0.5;
            const quadrants=[1,2,3,4].filter(q=>signOf(fn,q)===sign);
            const angles=quadrants.map(q=>({1:ref,2:180-ref,3:180+ref,4:360-ref})[q]).sort((a,b)=>a-b);
            const value=exactSpecial(fn,ref,sign),answers=angles.map(a=>radians?a*Math.PI/180:a);
            return {q:`Solve $\\${fn}\\theta=${value}$ on ${radians?'$[0,2\\pi)$ radians':'$[0^\\circ,360^\\circ)$'}. Enter both solutions in increasing order${radians?', exactly or rounded to 4 decimals':', in exact degrees'}.`,inputType:'two_angle_solutions',units:radians?'radians':'degrees',a:{x:answers[0],y:answers[1]},tol:{x:radians?0.0001:0,y:radians?0.0001:0},
                solution:`The reference angle is $${ref}^\\circ$. Use the signs in Quadrants ${quadrants.join(' and ')}. The solutions are $${radians?piFraction(angles[0],180):angles[0]+'^\\circ'}$ and $${radians?piFraction(angles[1],180):angles[1]+'^\\circ'}$.`};
         } },

        {id:'bearing_navigation',section:'Section 7.1',label:'Bearing and Navigation',
         generate:(r = Math.random) => {
            const ns=pick(r,['N','S']),ew=pick(r,['E','W']),angle=int(r,10,80),distance=int(r,40,300),findBearing=r()<0.5;
            if(findBearing){const north=int(r,20,150),east=int(r,20,150),a=Math.atan2(east,north)*180/Math.PI;
                return {q:`A boat travels ${north} km ${ns==='N'?'north':'south'} and ${east} km ${ew==='E'?'east':'west'}. Find its bearing from the starting point in the form ${ns} 35° ${ew}. Round the angle to 1 decimal.`,inputType:'bearing',a:{ns,ew,angle:a},
                    solution:`Measure from ${ns==='N'?'north':'south'} toward ${ew==='E'?'east':'west'}: $\\theta=\\tan^{-1}(${east}/${north})\\approx ${fixed(a,1)}^\\circ$. The bearing is ${ns} ${fixed(a,1)}° ${ew}.`};}
            const a=distance*Math.sin(angle*Math.PI/180);
            return {q:`A boat travels ${distance} km on bearing ${ns} ${angle}° ${ew}. Find how far ${ew==='E'?'east':'west'} it travels. Round to 1 decimal in km.`,inputType:'number',a,tol:0.1,
                solution:`For bearing ${ns} ${angle}° ${ew}, the ${ew==='E'?'east':'west'} component is $${distance}\\sin(${angle}^\\circ)\\approx ${fixed(a,1)}$ km ${ew==='E'?'east':'west'}.`};
         } },

        {
            id: 'oblique_triangle_area', section: 'Section 7.1',
            label: 'Area of Non-Right Triangle',
            generate: (random = Math.random) => {
                const b = Math.floor(random()*14)+8;
                const c = Math.floor(random()*14)+8;
                const A = [30,45,60,120][Math.floor(random()*4)];
                const ans = 0.5*b*c*Math.sin(A*Math.PI/180);
                return {
                    q: `Find the area of a triangle with sides $b=${b}$, $c=${c}$ and included angle $A=${A}^\\circ$. (Round to 2 decimals)`,
                    inputType: 'number', a: ans, tol: 0.01,
                    solution: `Use $K=\\frac12 bc\\sin A$: $K=\\frac12(${b})(${c})\\sin(${A}^\\circ)=${fixed(ans,2)}$.`
                };
            }
        },
        {id:'vector_from_mag_dir',section:'Section 8.4',label:'Vector from Magnitude and Direction to Components',
         generate:(r = Math.random) => {
            const mag=int(r,4,20),dir=int(r,1,359),x=mag*Math.cos(dir*Math.PI/180),y=mag*Math.sin(dir*Math.PI/180);
            return {q:`A vector has magnitude $${mag}$ and direction angle $${dir}^\\circ$. Find its components. Round to 3 decimals.`,inputType:'vector_xy',a:{x,y},tol:{x:0.001,y:0.001},
                solution:`$\\langle x,y\\rangle=\\langle ${mag}\\cos(${dir}^\\circ),${mag}\\sin(${dir}^\\circ)\\rangle\\approx\\langle ${fixed(x,3)},${fixed(y,3)}\\rangle$.`};
         } },

        {
            id: 'resultant_from_direction_vectors', section: 'Section 8.4',
            label: 'Resultant from Direction-Form Vectors',
            generate: (random = Math.random) => {
                const r1 = [8,10,12][Math.floor(random()*3)];
                const r2 = [6,8,10][Math.floor(random()*3)];
                const t1 = [0,30,45,60][Math.floor(random()*4)];
                let t2 = [120,135,150,210,300][Math.floor(random()*5)];
                if (r1 === r2 && t2 - t1 === 180) t2 = 135;
                const x = r1*Math.cos(t1*Math.PI/180) + r2*Math.cos(t2*Math.PI/180);
                const y = r1*Math.sin(t1*Math.PI/180) + r2*Math.sin(t2*Math.PI/180);
                const mag = Math.sqrt(x*x+y*y);
                let dir = Math.atan2(y,x)*180/Math.PI;
                if (dir < 0) dir += 360;
                return {
                    q: `Vectors $\\vec u$ and $\\vec v$ have magnitudes/directions $(${r1}, ${t1}^\\circ)$ and $(${r2}, ${t2}^\\circ)$. Find the resultant magnitude and direction in degrees. Round magnitude to 3 decimals and direction to 1 decimal.`,
                    inputType: 'vector_mag_dir', a: {mag, dir}, tol: {mag: 0.001, dir: 0.1},
                    solution: `Convert: $\\vec u = \\langle ${r1}\\cos(${t1}^\\circ), ${r1}\\sin(${t1}^\\circ)\\rangle$, $\\vec v = \\langle ${r2}\\cos(${t2}^\\circ), ${r2}\\sin(${t2}^\\circ)\\rangle$. Sum: $\\langle ${fixed(x,3)}, ${fixed(y,3)}\\rangle$. Magnitude: $\\sqrt{(${fixed(x,3)})^2+(${fixed(y,3)})^2}=${fixed(mag,3)}$. Direction: $\\operatorname{atan2}(${fixed(y,3)},${fixed(x,3)})=${fixed(dir,1)}^\\circ$.`
                };
            }
        },
        {
            id: 'graph_vector_addition', section: 'Section 8.4',
            label: 'Graph-Style Vector Addition Resultant',
            generate: (random = Math.random) => {
                const ux = Math.floor(random()*9)-4;
                const uy = Math.floor(random()*9)-4;
                const vx = Math.floor(random()*9)-4;
                const vy = Math.floor(random()*9)-4;
                const x = ux + vx;
                const y = uy + vy;
                return {
                    q: `On a coordinate grid, add vectors $\\langle ${ux}, ${uy}\\rangle$ and $\\langle ${vx}, ${vy}\\rangle$. Enter resultant components in x and y.`,
                    inputType: 'vector_xy', a: {x, y}, tol: {x: 0, y: 0},
                    solution: `Resultant is componentwise sum: $\\langle ${signedTerm(ux,vx)}, ${signedTerm(uy,vy)}\\rangle=\\langle ${x}, ${y}\\rangle$.`
                };
            }
        },
        {id:'trig_ratio_variables',section:'Section 5.2',label:'Trigonometric Ratios with Variables',
         generate:(r = Math.random) => {
            const letters=pick(r,[['a','b','c'],['x','y','r']]),fn=pick(r,['sin','cos','tan']);
            const [o,a,h]=letters,ratios={sin:`${o}/${h}`,cos:`${a}/${h}`,tan:`${o}/${a}`};
            return {q:`In the right triangle, find $\\${fn}\\theta$ using the labeled sides $${letters.join(", ")}$.`,svg:letterTriangle(letters),
                svgAltText:`Right triangle with ${o} opposite theta, ${a} adjacent to theta, and hypotenuse ${h}.`,inputType:'choice',options:[`${o}/${a}`,`${a}/${o}`,`${o}/${h}`,`${h}/${o}`,`${a}/${h}`,`${h}/${a}`],a:ratios[fn],
                solution:`Use ${fn==='sin'?'opposite / hypotenuse':fn==='cos'?'adjacent / hypotenuse':'opposite / adjacent'}: $\\${fn}\\theta=${ratios[fn]}$.`};
         } },
    ];


    const api = { generators: definitions, mulberry32, parseExact, grade, piFraction, fraction, radical, signedTerm };
    if (typeof module === 'object' && module.exports) module.exports = api;
    root.Math130Test3Skills = api;
})(typeof window !== 'undefined' ? window : globalThis);
