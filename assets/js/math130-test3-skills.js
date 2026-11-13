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
    function bearingHeading(raw) {
        const s=String(raw).trim().toUpperCase().replace(/\s+/g,'');
        let m=s.match(/^([NS])(\d+(?:\.\d+)?)°?([EW])$/);
        if(m){const a=Number(m[2]);if(a>90)return null;return m[1]==='N'?(m[3]==='E'?a:(360-a)%360):(m[3]==='E'?180-a:180+a);}
        m=s.match(/^([EW])(\d+(?:\.\d+)?)°?([NS])$/);
        if(m){const a=Number(m[2]);if(a>90)return null;return m[1]==='E'?(m[3]==='N'?90-a:90+a):(m[3]==='N'?270+a:270-a);}
        const a=parseExact(s.replace(/°$/,''));
        return a!==null&&a>=0&&a<=360?a%360:null;
    }
    function grade(question, entries) {
        const close = (raw, answer, tol = 0) => {
            const v = parseExact(raw);
            return v !== null && Math.abs(v - answer) <= tol + 1e-10;
        };
        const bearingClose=(raw,answer,tolerance=0.1)=>{
            const actual=bearingHeading(raw),expected=bearingHeading(`${answer.ns}${answer.angle}${answer.ew}`);
            return actual!==null&&expected!==null&&Math.abs((actual-expected+540)%360-180)<=tolerance+1e-10;
        };
        let parts;
        if (question.fields) parts = question.fields.map((f, i) => f.inputType==='bearing'?bearingClose(entries[i],f.answer,f.tolerance):close(entries[i], f.answer, f.tolerance));
        else if (question.inputType === 'choice') parts = [String(entries[0]) === question.a];
        else if (question.inputType === 'bearing') {
            parts = [bearingClose(entries[0],question.a,question.tol===undefined?0.1:question.tol)];
        } else if (question.inputType.startsWith('coterminal_')) {
            const rad = question.inputType === 'coterminal_rad';
            const base = rad ? question.baseThetaRad : question.baseTheta;
            const period = rad ? 2 * Math.PI : 360;
            const v = parseExact(entries[0]);
            const k = v === null ? 0 : Math.round((v - base) / period);
            parts = [k !== 0 && close(entries[0], base + period * k, question.tol) && (!question.sign || Math.sign(v) === question.sign)];
        } else if (question.inputType === 'two_angle_solutions') {
            const direct=[close(entries[0],question.a.x,question.tol.x),close(entries[1],question.a.y,question.tol.y)];
            const swapped=[close(entries[0],question.a.y,question.tol.y),close(entries[1],question.a.x,question.tol.x)];
            parts=swapped.filter(Boolean).length>direct.filter(Boolean).length?swapped:direct;
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
                <line x1="30" y1="${center}" x2="270" y2="${center}" stroke="var(--diagram-axis-label)" stroke-width="2"></line>
                <line x1="${center}" y1="30" x2="${center}" y2="270" stroke="var(--diagram-axis-label)" stroke-width="2"></line>
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
                <line x1="10" y1="${center}" x2="290" y2="${center}" stroke="var(--diagram-axis-label)" stroke-width="2"></line>
                <line x1="${center}" y1="10" x2="${center}" y2="290" stroke="var(--diagram-axis-label)" stroke-width="2"></line>
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

    const approximation = (exact, value, places) => Number.isInteger(value) ? exact : `${exact}\\approx ${fixed(value, places)}`;
    function sampledAngle(r, denominator = 1, allowAxis = false) {
        const small = r() < 0.5;
        let n;
        do { n = int(r, small ? 1 : 2 * denominator + 1, small ? 2 * denominator - 1 : 8 * denominator - 1); }
        while (!allowAxis && (2 * n) % denominator === 0);
        return n * (r() < 0.5 ? -1 : 1);
    }
    function triangleSvg({ o, a, h, theta = 'θ', top = false, mirror = false, abc = false }) {
        const x = n => mirror ? 300 - n : n;
        const label = (px, py, value) => `<text x="${x(px)}" y="${py}" text-anchor="middle" fill="var(--diagram-axis-label)" font-size="16">${value}</text>`;
        const description = `Right triangle: ${o} opposite ${theta}, ${a} adjacent, ${h} hypotenuse. ${theta} is at the ${top ? 'upper' : 'lower'} acute vertex.`;
        return { svgAltText: description, svg: `<svg viewBox="0 0 300 220" width="300" height="220" role="img" aria-label="${description}">
            <rect width="300" height="220" fill="var(--diagram-bg)"/>
            <path d="M${x(50)} 170 L${x(235)} 170 L${x(235)} 40 Z M${x(220)} 170 V155 H${x(235)}" fill="none" stroke="var(--diagram-ray)" stroke-width="3"/>
            ${label(260,112,top?a:o)}${label(145,198,top?o:a)}${label(130,94,h)}${label(top?222:87,top?77:160,theta)}
            ${abc?label(33,180,'A')+label(244,28,'B')+label(250,183,'C'):''}</svg>` };
    }
    function createBasicAngleSvg({ thetaDeg, labelText, fallbackText }) {
        const remainder = thetaDeg % 360, turns = Math.trunc(thetaDeg / 360);
        const rad = thetaDeg * Math.PI / 180;
        const direction = thetaDeg < 0 ? 'clockwise' : 'counterclockwise';
        return `<svg viewBox="0 0 300 300" width="300" height="300" role="img" aria-label="${fallbackText}">
            <rect width="300" height="300" fill="var(--diagram-bg)"/>
            <defs><marker id="angle-tip" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0 0 L10 5 L0 10" fill="var(--diagram-arc)"/></marker></defs>
            <path d="M30 150 H270 M150 30 V270" stroke="var(--diagram-axis-label)" stroke-width="2"/>
            <line x1="150" y1="150" x2="${fixed(150+105*Math.cos(rad),2)}" y2="${fixed(150-105*Math.sin(rad),2)}" stroke="var(--diagram-ray)" stroke-width="3"/>
            <path data-angle-arc="main" d="${buildAngleArcPath({center:150,radius:48,startAngleDeg:0,sweepDeg:remainder})}" fill="none" stroke="var(--diagram-arc)" stroke-width="3" marker-end="url(#angle-tip)"/>
            ${turns?`<path d="M182 150 A32 32 0 1 ${turns<0?1:0} 118 150 A32 32 0 1 ${turns<0?1:0} 182 150" fill="none" stroke="var(--diagram-turn)" stroke-dasharray="4 4"/>`:''}
            <g fill="var(--diagram-axis-label)" font-size="13"><text x="272" y="145">x</text><text x="157" y="27">y</text><text x="24" y="262">${labelText}</text><text x="24" y="282">${turns>0?'+':''}${turns} full turns; ${direction}</text></g></svg>`;
    }
    function applicationSvg({ depression = false, two = false, h = 'h', d = 'd', angle = 'θ', farAngle = 'β', gap = 'gap' }) {
        const desc = two ? `Tower height ${h}; near angle ${angle}, far angle ${farAngle}; observation points separated by ${gap}.`
            : `Right triangle with vertical height ${h}, horizontal distance ${d}, and angle ${angle} of ${depression?'depression':'elevation'}.`;
        return { svgAltText:desc, svg:`<svg viewBox="0 0 360 240" width="360" height="240" role="img" aria-label="${desc}">
            <rect width="360" height="240" fill="var(--diagram-bg)"/>
            <path d="M35 185 H315 M285 185 V40" fill="none" stroke="var(--diagram-axis-label)" stroke-width="3"/>
            <path d="M${two?125:55} 185 L285 40" stroke="var(--diagram-ray)" stroke-width="3"/>
            ${two?'<path d="M40 185 L285 40" stroke="var(--diagram-reference)" stroke-width="3"/>':''}
            ${depression?'<path d="M55 40 H285" stroke="var(--diagram-grid)" stroke-dasharray="4 4"/>':''}
            <g font-size="14" fill="var(--diagram-axis-label)" text-anchor="middle"><text x="315" y="110">${h}</text><text x="195" y="207">${d}</text>
            <text x="${depression?250:two?155:92}" y="${depression?61:174}">${angle}</text>${two?`<text x="70" y="179">${farAngle}</text><text x="80" y="225">${gap}</text>`:''}</g></svg>` };
    }
    function additionSvg(ux, uy, vx, vy) {
        const points=[[0,0],[ux,uy],[ux+vx,uy+vy]];
        const extent=Math.max(1,...points.flatMap(p=>p.map(Math.abs))),scale=105/extent;
        const point=p=>[150+p[0]*scale,150-p[1]*scale];
        const line=(from,to,color,name)=>{const a=point(from),b=point(to);return `<line x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}" stroke="var(${color})" stroke-width="3" marker-end="url(#add-${name})"/><text x="${(a[0]+b[0])/2+8}" y="${(a[1]+b[1])/2-8}" text-anchor="middle" fill="var(${color})" font-size="15">${name}</text>`;};
        const colors={u:'--diagram-ray',v:'--emerald-main',resultant:'--danger-main'};
        return {svgAltText:`Tip-to-tail vectors u=(${ux}, ${uy}) and v=(${vx}, ${vy}), and their resultant.`,svg:`<svg viewBox="0 0 300 300" width="300" height="300" role="img" aria-label="Tip-to-tail vector addition"><rect width="300" height="300" fill="var(--diagram-bg)"/><defs>${Object.entries(colors).map(([name,color])=>`<marker id="add-${name}" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0 0 L10 5 L0 10" fill="var(${color})"/></marker>`).join('')}</defs><path d="M20 150 H280 M150 20 V280" stroke="var(--diagram-axis-label)"/>${line(points[0],points[1],colors.u,'u')}${line(points[1],points[2],colors.v,'v')}${line(points[0],points[2],colors.resultant,'resultant')}</svg>`};
    }
    function shuffleInPlace(list, r = Math.random) {
        for(let i=list.length-1;i>0;i--){const j=int(r,0,i);[list[i],list[j]]=[list[j],list[i]];}
        return list;
    }
    // Allocate section quotas by largest remainder, then sample each pool once.
    function buildCheckpoint(generators, config, r = Math.random) {
        const pool=generators.filter(g=>(!config.sections||config.sections.includes(g.section))&&!(config.excludedIds||[]).includes(g.id));
        const result=[];
        const take=(list,count)=>{let available=shuffleInPlace([...list],r);while(count--&&list.length){if(!available.length)available=shuffleInPlace([...list],r);result.push(available.shift());}};
        if(config.weights){
            const sections=Object.keys(config.weights),sum=Object.values(config.weights).reduce((a,b)=>a+b,0);
            const quotas=sections.map(section=>({section,exact:config.count*config.weights[section]/sum}));
            quotas.forEach(q=>q.count=Math.floor(q.exact));
            for(const q of [...quotas].sort((a,b)=>(b.exact-b.count)-(a.exact-a.count)).slice(0,config.count-quotas.reduce((a,q)=>a+q.count,0)))q.count++;
            for(const q of quotas)take(pool.filter(g=>g.section===q.section),q.count);
        }else{
            for(const id of config.requiredIds||[]){const g=pool.find(g=>g.id===id);if(g&&!result.includes(g)&&result.length<config.count)result.push(g);}
            const remaining=shuffleInPlace(pool.filter(g=>!result.includes(g)),r);
            result.push(...remaining.slice(0,Math.max(0,config.count-result.length)));
            if(result.length<config.count)take(pool,config.count-result.length);
        }
        return shuffleInPlace(result,r);
    }

    const definitions = [
        { id: 'angle_coterminal', section: 'Section 5.1', label: 'Coterminal Angles (Degrees)',
          generate: (r = Math.random) => {
            const theta = sampledAngle(r,180), wantPos = r() < 0.5;
            const answer = wantPos ? (theta >= 0 ? theta + 360 : theta + 360*(Math.floor(-theta/360)+1))
                                   : (theta <= 0 ? theta - 360 : theta - 360*(Math.floor(theta/360)+1));
            const word = wantPos ? 'positive' : 'negative';
            const normalizedThetaDeg = normalizeDegrees(theta), turnCount = Math.round((theta-normalizedThetaDeg)/360);
            const svgAltText = `Angle ${theta} degrees with terminal side at ${normalizedThetaDeg} degrees.`;
            const turns = Math.round((answer-theta)/360);
            return {q:`Find a <strong>${word}</strong> angle that is coterminal with $${theta}^\\circ$ and different from it. Enter an integer in degrees.`,
                svg:createCoterminalAngleSvg({originalThetaDeg:theta,normalizedThetaDeg,turnCount,fallbackText:svgAltText}),svgAltText,
                inputType:'coterminal_deg',baseTheta:theta,sign:wantPos?1:-1,tol:0,
                solution:`${turns>0?'Add':'Subtract'} ${Math.abs(turns)===1?'one full turn':Math.abs(turns)+' full turns'}: $${theta}^\\circ${turns>0?'+':'-'}${Math.abs(turns)*360}^\\circ=${answer}^\\circ$, which is ${word}. Any ${word} angle that differs from $${theta}^\\circ$ by a multiple of $360^\\circ$ is also correct.`};
          } },

        { id:'angle_coterminal_rad',section:'Section 5.1',label:'Coterminal Angles (Radians)',
          generate:(r = Math.random) => {
            const d=pick(r,[3,4,6,9,12]),n=int(r,1,8*d)*(r()<0.5?-1:1),wantPos=r()<0.5,full=2*d;
            const m = wantPos ? (n >= 0 ? n+full : n+full*(Math.floor(-n/full)+1)) : (n <= 0 ? n-full : n-full*(Math.floor(n/full)+1));
            const word = wantPos ? 'positive' : 'negative', turns = Math.round((m-n)/full);
            return {q:`Find a <strong>${word}</strong> angle that is coterminal with $${piFraction(n,d)}$ radians and different from it. Enter an exact value or round to 3 decimals.`,
                inputType:'coterminal_rad',baseThetaRad:n*Math.PI/d,sign:wantPos?1:-1,tol:0.001,
                entryNote:'Type pi for $\\pi$, for example 5pi/12.',
                solution:`${turns>0?'Add':'Subtract'} ${Math.abs(turns)===1?'$2\\pi$':'$'+(2*Math.abs(turns))+'\\pi$'}: $${piFraction(n,d)}${turns>0?'+':'-'}${piFraction(Math.abs(turns)*full,d)}=${piFraction(m,d)}\\approx ${fixed(m*Math.PI/d,3)}$ radians, which is ${word}.`};
          } },

        {id:'arc_length',section:'Section 5.1',label:'Arc Length and Central Angle',generate:(r=Math.random)=>{
            const radius=int(r,2,25),d=pick(r,[3,4,6,12]),n=int(r,1,2*d-1),degrees=r()<0.5,findAngle=r()<0.3;
            const theta=n*Math.PI/d,arc=radius*theta,a=findAngle?(degrees?180*n/d:theta):arc;
            const given=degrees?`$${180*n/d}^\\circ$`:`$${piFraction(n,d)}$ radians`;
            const q=findAngle?`A circle has radius $${radius}$ cm and arc length $${piFraction(radius*n,d)}$ cm. Find the central angle in ${degrees?'degrees':'radians'}.`:`A circle has radius $${radius}$ cm and central angle ${given}. Find the arc length in cm.`;
            const solution=findAngle?`Use $\\theta=s/r$: $\\theta=\\left(${piFraction(radius*n,d)}\\right)\\div ${radius}=${piFraction(n,d)}$ radians. ${degrees?`Convert to degrees: $${piFraction(n,d)}\\cdot\\frac{180^\\circ}{\\pi}=${fraction(180*n,d)}^\\circ$.`:`Thus $\\theta=${approximation(piFraction(n,d),a,3)}$ radians.`}`
                :`${degrees?`First convert: $${180*n/d}^\\circ\\cdot\\frac{\\pi}{180^\\circ}=${piFraction(n,d)}$ radians. `:''}Use $s=r\\theta$: $s=${radius}\\left(${piFraction(n,d)}\\right)=${approximation(piFraction(radius*n,d),a,3)}$ cm.`;
            return {q:q+' Enter an exact value or round to 3 decimals.',inputType:'exact',a,tol:0.001,solution,parameters:{radius,n,d,degrees,findAngle}};}},

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
                    q: `In a right triangle, opposite side $=${opp}$ and adjacent side $=${adj}$. Find $\\${pick}\\theta$. Enter an exact value or round to 4 decimals.`,
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

        {id:'right_triangle_word_problem',section:'Section 5.2',label:'Right Triangle Word Problems',generate:(r=Math.random)=>{
            const context=pick(r,['ladder','ramp','kite','shadow','guy wire']);
            const ranges={ramp:[3,12,2,15],ladder:[60,80,0.5,3],kite:[25,65,10,80],'guy wire':[40,70,2,20],shadow:[15,75,2,40]};
            const [lo,hi,min,max]=ranges[context],findAngle=r()<0.3,theta=int(r,lo+1,hi-1),d=int(r,min*10,max*10)/10;
            const h=Number((d*Math.tan(theta*Math.PI/180)).toFixed(2));
            const scene={ladder:'A ladder leans against a vertical wall.',ramp:'A ramp rises from level ground to a platform.',kite:'A taut kite string reaches a kite directly above a point on the ground.',shadow:'A vertical pole casts a shadow on level ground.','guy wire':'A taut guy wire joins a pole to an anchor on level ground.'}[context];
            const a=findAngle?Math.atan2(h,d)*180/Math.PI:d*Math.tan(theta*Math.PI/180);
            return {q:`${scene} The horizontal distance is ${d} m. ${findAngle?`The vertical height is ${h} m. Find the acute angle with the ground, in degrees. Round to 1 decimal.`:`The angle with the ground is $${theta}^\\circ$. Find the vertical height in meters. Round to 2 decimals.`}`,inputType:'number',a,tol:findAngle?0.1:0.01,
                solution:findAngle?`$\\theta=\\tan^{-1}(${h}/${d})\\approx ${fixed(a,1)}^\\circ$.`:`$h=${d}\\tan(${theta}^\\circ)\\approx ${fixed(a,2)}$ m.`,parameters:{context,theta,d,h,findAngle}};}},

        {
            id: 'solve_right_triangle_side', section: 'Section 7.1',
            label: 'Find a Side of a Right Triangle',
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
        {id:'reference_angle_rad',section:'Section 5.3',label:'Reference Angle (Radians)',generate:(r=Math.random)=>{
            const d=pick(r,[3,4,6,12]),n=sampledAngle(r,d),t=((n%(2*d))+2*d)%(2*d),fold=Math.min(t,2*d-t),ref=Math.min(fold,d-fold),a=ref*Math.PI/d;
            const svgAltText=`Angle ${n} pi/${d} radians in standard position.`;
            return {q:`Find the reference angle for $${piFraction(n,d)}$ radians. Enter an exact value or round to 4 decimals.`,inputType:'exact',a,tol:0.0001,
                svg:createBasicAngleSvg({thetaDeg:n*180/d,labelText:piFraction(n,d).replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g,'$1/$2').replace(/\\pi/g,'π')+' radians',fallbackText:svgAltText}),svgAltText,
                solution:`A coterminal angle in $[0,2\\pi)$ is $${piFraction(t,d)}$. The acute angle to the $x$-axis is $${approximation(piFraction(ref,d),a,4)}$ radians.`};}},

        {id:'reference_angle_deg',section:'Section 5.3',label:'Reference Angle (Degrees)',generate:(r=Math.random)=>{
            let raw;do{raw=sampledAngle(r,180);}while(raw%90===0);
            const a=getReferenceAngleDegrees(raw),svgAltText=`Angle ${raw} degrees in standard position.`;
            return {q:`Find the reference angle for $${raw}^\\circ$.`,inputType:'number',a,tol:0,
                ...{svg:createBasicAngleSvg({thetaDeg:raw,labelText:`${raw}°`,fallbackText:svgAltText}),svgAltText},
                entryNote:'Locate the terminal side, then find the acute angle between it and the x-axis.',
                solution:`The coterminal angle in $[0^\\circ,360^\\circ)$ is $${normalizeDegrees(raw)}^\\circ$. The acute angle to the $x$-axis is $${a}^\\circ$.`};}},

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

        {id:'solve_right_triangle',section:'Section 7.1',label:'Solve a Right Triangle',generate:(r=Math.random)=>{
            const mode=int(r,0,3),given=int(r,6,30),angle=int(r,20,70),leg=int(r,2,given-1);
            let a,b,c,A;
            if(mode===0){b=given;A=angle;a=b*Math.tan(A*Math.PI/180);c=Math.hypot(a,b);}
            if(mode===1){a=given;b=int(r,5,30);c=Math.hypot(a,b);A=Math.atan2(a,b)*180/Math.PI;}
            if(mode===2){c=given;A=angle;a=c*Math.sin(A*Math.PI/180);b=c*Math.cos(A*Math.PI/180);}
            if(mode===3){c=given;a=leg;b=Math.sqrt(c*c-a*a);A=Math.asin(a/c)*180/Math.PI;}
            const values={a,b,c,A,B:90-A},known=mode===0?['b','A']:mode===1?['a','b']:mode===2?['c','A']:['c','a'];
            const missing=Object.keys(values).filter(k=>!known.includes(k));
            const units=k=>k===k.toUpperCase()?'degrees':'cm';
            return {q:`In right triangle $ABC$, $C=90^\\circ$ and sides $a,b,c$ are opposite $A,B,C$. Given ${known.map(k=>`$${k}=${values[k]}${units(k)==='degrees'?'^\\circ':''}$${units(k)==='cm'?' cm':''}`).join(' and ')}, find all three missing parts. Round lengths to 2 decimals and angles to 1 decimal.`,
                ...triangleSvg({o:known.includes('a')?a:'a',a:known.includes('b')?b:'b',h:known.includes('c')?c:'c',theta:known.includes('A')?`${A}°`:'A',abc:true}),inputType:'parts',fields:missing.map(k=>({id:k,label:`${k} (${units(k)})`,answer:values[k],tolerance:units(k)==='degrees'?0.1:0.01})),
                solution:`Use the Pythagorean theorem, a suitable trigonometric ratio, and $A+B=90^\\circ$. ${missing.map(k=>`$${k}=${fixed(values[k],units(k)==='degrees'?1:2)}${units(k)==='degrees'?'^\\circ':''}$${units(k)==='cm'?' cm':''}`).join('; ')}.`,parameters:{mode,known:Object.fromEntries(known.map(k=>[k,values[k]]))}};}},

        {id:'angle_of_elevation',section:'Section 7.1',label:'Elevation and Depression',generate:(r=Math.random)=>{
            const depression=r()<0.5,context=pick(r,depression?['a lighthouse','a cliff','an airplane']:['a tower','a building','a hill']),kind=int(r,0,3);
            const word=depression?'depression':'elevation',heightName=depression?"the observer's height above the ground":'the vertical height above eye level';
            const scene=depression?`An observer on ${context} looks down at a point on level ground.`:`An observer on level ground looks up at the top of ${context}.`;
            if(kind<2){const h=int(r,20,150),d=int(r,30,180),a=Math.atan2(h,d)*180/Math.PI;
                return {q:`${scene} ${depression?`The observer is ${h} m above level ground`:`The vertical height above eye level is ${h} m`} and the horizontal distance is ${d} m. Find the angle of ${word}. Round to 1 decimal in degrees.`,inputType:'number',a,tol:0.1,
                    ...applicationSvg({depression,h:`${h} m`,d:`${d} m`}),solution:`$\\theta=\\tan^{-1}(${h}/${d})\\approx ${fixed(a,1)}^\\circ$.`,parameters:{depression,kind,h,d}};}
            const theta=int(r,15,70),height=kind===2,known=height?int(r,30,180):int(r,20,150),a=height?known*Math.tan(theta*Math.PI/180):known/Math.tan(theta*Math.PI/180);
            return {q:`${scene} The angle of ${word} is $${theta}^\\circ$. ${height?`The horizontal distance is ${known} m.`:depression?`The observer is ${known} m above level ground.`:`The vertical height above eye level is ${known} m.`} Find ${height?heightName:'the horizontal distance'} in meters. Round to 2 decimals.`,inputType:'number',a,tol:0.01,
                ...applicationSvg({depression,h:height?'h':`${known} m`,d:height?`${known} m`:'d',angle:`${theta}°`}),
                solution:`Use $\\tan(${theta}^\\circ)=h/d$. Thus $${height?'h':'d'}=${height?`${known}\\tan(${theta}^\\circ)`:`${known}/\\tan(${theta}^\\circ)`}\\approx ${fixed(a,2)}$ m.`,parameters:{depression,kind,theta,known}};}},

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
                    inputType: 'number', a: d, tol: 0.01, ...applicationSvg({two:true,d:'x',angle:`${angleA}°`,farAngle:`${angleB}°`,gap:`${gap} m`}),
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
                        <line x1="10" y1="150" x2="290" y2="150" stroke="var(--diagram-axis-label)" stroke-width="2"></line>
                        <line x1="150" y1="10" x2="150" y2="290" stroke="var(--diagram-axis-label)" stroke-width="2"></line>
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
            let a,b,c,d; do { a=int(r,-4,4); b=int(r,-4,4); } while(!a&&!b); do { c=int(r,-4,4); d=int(r,-4,4); } while(!c&&!d); const k=pick(r,[-3,-2,2,3]);
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
        {id:'vector_direction',section:'Section 8.4',label:'Direction Angle of Vector',generate:(r=Math.random)=>{
            const axis=r()<0.08;let x,y;do{x=int(r,-9,9);y=int(r,-9,9);}while((x===0&&y===0)||(!axis&&(x===0||y===0))||(axis&&x!==0&&y!==0));
            const ij=r()<0.8,term=(n,name)=>`${Math.abs(n)===1?'':Math.abs(n)}\\mathbf{${name}}`;
            const text=[x?`${x<0?'-':''}${term(x,'i')}`:'',y?`${x?(y<0?' - ':' + '):y<0?'-':''}${term(y,'j')}`:''].join('');
            const a=normalizeDegrees(Math.atan2(y,x)*180/Math.PI);
            return {q:`Find the direction angle in $[0^\\circ,360^\\circ)$ of vector $${ij?text:`\\langle ${x},${y}\\rangle`}$. Round to 1 decimal.`,inputType:'number',a,tol:0.1,
                solution:`Use the signs of the components to locate the terminal side. The standard-position direction angle is $${fixed(a,1)}^\\circ$.`,parameters:{x,y,ij}};}},

        {id:'trig_from_given_ratio',section:'Section 5.2',label:'Find Another Trigonometric Ratio',
         generate:(r = Math.random) => {
            if (r() < 0.45) {
                // Radical case: one leg is a square root, as in cos θ = √a/c.
                const [c,b]=pick(r,[[4,3],[6,5],[7,4],[7,5],[8,3],[8,7],[9,4],[9,7],[10,7],[11,6]]), a=c*c-b*b;
                const givenFn=pick(r,['sin','cos']), rootLeg=givenFn==='sin'?'opp':'adj';
                const opp=rootLeg==='opp'?Math.sqrt(a):b, adj=rootLeg==='adj'?Math.sqrt(a):b;
                const S=`\\sqrt{${a}}`;
                const exact={opp:rootLeg==='opp'?S:`${b}`,adj:rootLeg==='adj'?S:`${b}`};
                const rat=(num,den)=>{ // exact ratio with rationalized denominator
                    if (num==='root') return `\\frac{\\sqrt{${a}}}{${den}}`;
                    if (den==='root') { const g=gcd(num,a), k=num/g, q=a/g, top=(k===1?'':k)+`\\sqrt{${a}}`; return q===1?top:`\\frac{${top}}{${q}}`; }
                    return fraction(num,den);
                };
                const o=rootLeg==='opp'?'root':b, ad=rootLeg==='adj'?'root':b;
                const vals={sin:[o,c],cos:[ad,c],tan:[o,ad],csc:[c,o],sec:[c,ad],cot:[ad,o]};
                const target=pick(r,trigNames.filter(f=>f!==givenFn&&f!==(givenFn==='sin'?'csc':'sec')));
                const [tn,td]=vals[target], num=n=>n==='root'?Math.sqrt(a):n;
                return {q:`For an acute angle $\\theta$, $\\${givenFn}\\theta=\\frac{\\sqrt{${a}}}{${c}}$. Find $\\${target}\\theta$. Enter an exact value (type sqrt(${a}) for $\\sqrt{${a}}$) or round to 4 decimals.`,
                    inputType:'exact',a:num(tn)/num(td),tol:0.0001,
                    solution:`Label the triangle from $\\${givenFn}\\theta=\\frac{\\sqrt{${a}}}{${c}}$: ${rootLeg==='opp'?'opposite':'adjacent'} $=\\sqrt{${a}}$, hypotenuse $=${c}$. The Pythagorean theorem gives the other leg: $\\sqrt{${c}^2-(\\sqrt{${a}})^2}=\\sqrt{${c*c}-${a}}=${b}$. So opposite $=${exact.opp}$ and adjacent $=${exact.adj}$, and $\\${target}\\theta=${rat(tn,td)}\\approx ${fixed(num(tn)/num(td),4)}$. Rationalize any square root in the denominator.`};
            }
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
            return {q:`Solve $\\${fn}\\theta=${value}$ on ${radians?'$[0,2\\pi)$ radians':'$[0^\\circ,360^\\circ)$'}. Enter both solutions${radians?', exactly or rounded to 4 decimals':', in exact degrees'}.`,inputType:'two_angle_solutions',units:radians?'radians':'degrees',a:{x:answers[0],y:answers[1]},tol:{x:radians?0.0001:0,y:radians?0.0001:0},
                solution:`The reference angle is $${ref}^\\circ$. Use the signs in Quadrants ${quadrants.join(' and ')}. The solutions are $${radians?piFraction(angles[0],180):angles[0]+'^\\circ'}$ and $${radians?piFraction(angles[1],180):angles[1]+'^\\circ'}$.`};
         } },

        {id:'bearing_navigation',section:'Section 7.1',label:'Bearing and Navigation',generate:(r=Math.random)=>{
            const ns=pick(r,['N','S']),ew=pick(r,['E','W']),findBearing=r()<0.5;
            if(findBearing){const north=int(r,20,150),east=int(r,20,150),angle=Math.atan2(east,north)*180/Math.PI;
                return {q:`A boat travels ${north} km ${ns==='N'?'north':'south'} and ${east} km ${ew==='E'?'east':'west'}. Find its bearing from the starting point, for example, N 35° E. Round the angle to 1 decimal.`,inputType:'bearing',a:{ns,ew,angle},solution:`Measure from ${ns==='N'?'north':'south'} toward ${ew==='E'?'east':'west'}: $\\theta=\\tan^{-1}(${east}/${north})\\approx ${fixed(angle,1)}^\\circ$. The bearing is ${ns} ${fixed(angle,1)}° ${ew}.`};}
            const angle=int(r,10,80),distance=int(r,40,300),vertical=r()<0.5,a=distance*(vertical?Math.cos(angle*Math.PI/180):Math.sin(angle*Math.PI/180));
            const direction=vertical?(ns==='N'?'north':'south'):(ew==='E'?'east':'west');
            return {q:`A boat travels ${distance} km on bearing ${ns} ${angle}° ${ew}. Find how far ${direction} it travels. Round to 1 decimal in km.`,inputType:'number',a,tol:0.1,
                solution:`The ${direction} component is $${distance}\\${vertical?'cos':'sin'}(${angle}^\\circ)\\approx ${fixed(a,1)}$ km ${direction}.`,parameters:{distance,angle,vertical}};}},

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
        {id:'graph_vector_addition',section:'Section 8.4',label:'Tip-to-Tail Vector Addition',generate:(r=Math.random)=>{
            let ux,uy,vx,vy;do{ux=int(r,-4,4);uy=int(r,-4,4);}while(!ux&&!uy);do{vx=int(r,-4,4);vy=int(r,-4,4);}while((!vx&&!vy)||(vx===-ux&&vy===-uy));
            return {q:`Add the vectors shown, $\\vec u=\\langle ${ux},${uy}\\rangle$ and $\\vec v=\\langle ${vx},${vy}\\rangle$. Enter the exact resultant components.`,...additionSvg(ux,uy,vx,vy),inputType:'vector_xy',a:{x:ux+vx,y:uy+vy},tol:{x:0,y:0},
                solution:`Add corresponding components: $\\langle ${signedTerm(ux,vx)},${signedTerm(uy,vy)}\\rangle=\\langle ${ux+vx},${uy+vy}\\rangle$.`};}},

        {id:'trig_ratio_variables',section:'Section 5.2',label:'Trigonometric Ratios with Variables',generate:(r=Math.random)=>{
            const letters=pick(r,[['a','b','c'],['x','y','r'],['p','q','s'],['u','v','w'],['d','e','f'],['j','k','m']]),fn=pick(r,trigNames),top=r()<0.5,mirror=r()<0.5;
            const [o,a,h]=letters,ratios={sin:`${o}/${h}`,cos:`${a}/${h}`,tan:`${o}/${a}`,csc:`${h}/${o}`,sec:`${h}/${a}`,cot:`${a}/${o}`};
            return {q:`In the right triangle labeled $${letters.join(', ')}$, $\\theta$ is at the ${top?'upper':'lower'} acute vertex. Find $\\${fn}\\theta$.`,...triangleSvg({o,a,h,top,mirror}),inputType:'choice',a:ratios[fn],options:Object.values(ratios),
                solution:`Identify the opposite side $${o}$, adjacent side $${a}$, and hypotenuse $${h}$. Then $\\${fn}\\theta=${ratios[fn]}$.`,parameters:{letters,fn,top,mirror}};}},

        {id:'angle_terminal_quadrant',section:'Section 5.1',label:'Locate the Terminal Side',generate:(r=Math.random)=>{
            const radians=r()<0.5,d=radians?pick(r,[3,4,6,12]):180,n=sampledAngle(r,d,true),degrees=n*180/d,t=normalizeDegrees(degrees);
            const axes={0:'positive x-axis',90:'positive y-axis',180:'negative x-axis',270:'negative y-axis'};
            const a=axes[t]||`Quadrant ${['I','II','III','IV'][Math.floor(t/90)]}`,text=radians?piFraction(n,d):`${degrees}^\\circ`,svgAltText=`Angle ${degrees} degrees in standard position.`;
            return {q:`Where does the terminal side of $${text}$${radians?' radians':''} lie?`,inputType:'choice',choiceLabel:'Choose a location',a,options:['Quadrant I','Quadrant II','Quadrant III','Quadrant IV',...Object.values(axes)],
                solution:`A coterminal angle is $${t}^\\circ$. Its terminal side lies ${a.startsWith('Quadrant')?'in':'on the'} ${a}.`,solutionSvg:createBasicAngleSvg({thetaDeg:degrees,labelText:`${degrees}°`,fallbackText:svgAltText}),parameters:{degrees}};}},
        {id:'trig_ratios_several',section:'Section 5.2',label:'Find Several Ratios',generate:(r=Math.random)=>{
            const h=int(r,6,30),leg=int(r,2,h-1),knownOpp=r()<0.5,missing=Math.sqrt(h*h-leg*leg),o=knownOpp?leg:missing,a=knownOpp?missing:leg;
            const chosen=shuffleInPlace([...trigNames],r).slice(0,int(r,2,3)),values={sin:o/h,cos:a/h,tan:o/a,csc:h/o,sec:h/a,cot:a/o};
            const missingText=radical(h*h-leg*leg);
            const exact=(n,d)=>radical(Math.round(n*n*d*d),Math.round(d*d)); const ratios={sin:exact(o,h),cos:exact(a,h),tan:exact(o,a),csc:exact(h,o),sec:exact(h,a),cot:exact(a,o)};
            return {q:`A right triangle has hypotenuse $${h}$ and ${knownOpp?'opposite':'adjacent'} leg $${leg}$. Find $${chosen.map(f=>'\\'+f+'\\theta').join(', ')}$. Enter exact values or round to 4 decimals.`,
                ...triangleSvg({o:knownOpp?leg:'?',a:knownOpp?'?':leg,h}),inputType:'parts',fields:chosen.map(fn=>({id:fn,label:fn+' θ',answer:values[fn],tolerance:0.0001})),
                solution:`The missing leg is $\\sqrt{${h}^2-${leg}^2}=${missingText}$. ${chosen.map(fn=>`$\\${fn}\\theta=${ratios[fn]}$`).join('; ')}.`,parameters:{h,leg,knownOpp,chosen}};}},
        {id:'right_triangle_find_angle',section:'Section 7.1',label:'Find an Acute Angle',generate:(r=Math.random)=>{
            const fn=pick(r,['sin','cos','tan']),x=int(r,3,25),y=fn==='tan'?int(r,3,25):int(r,x+1,x+25),a=({sin:Math.asin,cos:Math.acos,tan:Math.atan})[fn](x/y)*180/Math.PI;
            const diagram=triangleSvg({o:fn==='sin'||fn==='tan'?x:'?',a:fn==='cos'?x:fn==='tan'?y:'?',h:fn==='tan'?'?':y});
            return {q:`In the right triangle, the ${fn==='sin'?'opposite leg and hypotenuse':fn==='cos'?'adjacent leg and hypotenuse':'opposite and adjacent legs'} have lengths $${x}$ and $${y}$ cm. Find $\\theta$ in degrees. Round to 1 decimal.`,...diagram,inputType:'number',a,tol:0.1,
                solution:`$\\${fn}\\theta=${fraction(x,y)}$, so $\\theta=\\${fn}^{-1}\\left(${fraction(x,y)}\\right)\\approx ${fixed(a,1)}^\\circ$.`,parameters:{fn,x,y}};}},
    ];



    definitions.push(
        {id:'trig_values_from_point',section:'Section 5.3',label:'All Six Functions from a Signed Point',generate:(r=Math.random)=>{
            const x=int(r,1,9)*(r()<0.5?-1:1),y=int(r,1,9)*(r()<0.5?-1:1),n=x*x+y*y,radius=Math.sqrt(n);
            const values={r:radius,sin:y/radius,cos:x/radius,tan:y/x,csc:radius/y,sec:radius/x,cot:x/y};
            const overRoot=k=>Number.isInteger(radius)?fraction(k,radius):radical(n*k*k,n,Math.sign(k));
            const exact={r:radical(n),sin:overRoot(y),cos:overRoot(x),tan:fraction(y,x),csc:radical(n,Math.abs(y),Math.sign(y)),sec:radical(n,Math.abs(x),Math.sign(x)),cot:fraction(x,y)};
            const scale=85/Math.max(Math.abs(x),Math.abs(y)),px=150+x*scale,py=145-y*scale;
            const svgAltText=`Equal-scale axes with terminal point P(${x}, ${y}); the radial length is unknown.`;
            return {q:`The terminal side of $\\theta$ passes through $P=(${x},${y})$. Find $r$ and all six trigonometric functions. Enter exact values or decimals rounded to 4 places.`,
                inputType:'parts',fields:Object.entries(values).map(([id,answer])=>({id,label:id==='r'?'r':id+' θ',answer,tolerance:0.00005})),
                svgAltText,svg:`<svg viewBox="0 0 300 290" width="300" height="290" role="img" aria-label="${svgAltText}"><rect width="300" height="290" fill="var(--diagram-bg)"/><path d="M25 145 H275 M150 25 V265" fill="none" stroke="var(--diagram-axis-label)" stroke-width="2"/><path d="M150 145 H${px} V${py} Z" fill="none" stroke="var(--diagram-ray)" stroke-width="3"/><circle cx="${px}" cy="${py}" r="4" fill="var(--diagram-ray)"/><g font-size="15" fill="var(--diagram-axis-label)"><text x="${px+10}" y="${py-12}">P(${x}, ${y})</text><text x="277" y="138">x</text><text x="158" y="25">y</text></g></svg>`,
                entryNote:'Use sqrt(65), -4/sqrt(65), or equivalent rationalized forms. Each field is checked separately.',
                solution:`$r=\\sqrt{${paren(x)}^2+${paren(y)}^2}=${exact.r}$. ${trigNames.map(fn=>`$\\${fn}\\theta=${exact[fn]}$`).join('; ')}.`,parameters:{x,y}};
        }},
        {id:'aviation_climb_time',section:'Section 7.1',label:'Aviation: Time to Reach Altitude',generate:(r=Math.random)=>{
            const speed=int(r,11,24)*20,angle=int(r,4,16),altitude=int(r,6,16)/2;
            const minutes=60*altitude/(speed*Math.sin(angle*Math.PI/180));
            return {q:`An airplane climbs at $${angle}^\\circ$ at an average airspeed of ${speed} mph along its flight path. How long will it take to gain ${altitude} miles of altitude? Round to the nearest minute.`,inputType:'number',a:Math.round(minutes),tol:0,
                entryNote:'Sketch the triangle. Enter the whole number of minutes, not hours.',
                solution:`Vertical speed is $${speed}\\sin(${angle}^\\circ)$ miles/hour. Thus $t=\\frac{${altitude}}{${speed}\\sin(${angle}^\\circ)}$ hours, or $60t\\approx${fixed(minutes,3)}$ minutes. Rounded answer: ${Math.round(minutes)} minutes.`,parameters:{speed,angle,altitude}};
        }},
        {id:'aviation_descent_loss',section:'Section 7.1',label:'Aviation: Altitude Lost in Minutes',generate:(r=Math.random)=>{
            const speed=int(r,8,16)*20,angle=int(r,2,8),minutes=int(r,3,12),distance=speed*minutes/60,loss=distance*Math.sin(angle*Math.PI/180);
            return {q:`An airplane descends at an average airspeed of ${speed} mph along its flight path, at an angle of depression of $${angle}^\\circ$. How much altitude does it lose in ${minutes} minutes? Round to the nearest tenth of a mile.`,inputType:'number',a:loss,tol:0.05,
                entryNote:'Report the positive amount of altitude lost in miles. Convert minutes to hours first.',
                solution:`Time is $${minutes}/60$ hours, so the flight-path distance is $d=${speed}(${minutes}/60)=${fixed(distance,3)}$ miles. Altitude lost is $d\\sin(${angle}^\\circ)\\approx${fixed(loss,1)}$ miles.`,parameters:{speed,angle,minutes}};
        }},
        {id:'aviation_bearing_displacement',section:'Section 7.1',label:'Aviation: Both Compass Components',generate:(r=Math.random)=>{
            const speed=int(r,18,36)*10,hours=pick(r,[0.8,1.2,1.5,1.8,2.4,2.6]),angle=int(r,10,80),ns=pick(r,['N','S']),ew=pick(r,['E','W']);
            const heading=ns==='N'?(ew==='E'?angle:360-angle):(ew==='E'?180-angle:180+angle),distance=speed*hours;
            const vertical=distance*Math.cos(angle*Math.PI/180),horizontal=distance*Math.sin(angle*Math.PI/180);
            const northSouth=ns==='N'?'north':'south',eastWest=ew==='E'?'east':'west';
            return {q:`An airplane flies at ${speed} knots on bearing ${ns}${angle}°${ew} (${heading}° compass heading) for ${hours} hours. How many nautical miles ${northSouth} and ${eastWest} does it travel? Round each answer to the nearest nautical mile.`,
                inputType:'parts',fields:[{id:'vertical',label:`Nautical miles ${northSouth}`,answer:Math.round(vertical),tolerance:0},{id:'horizontal',label:`Nautical miles ${eastWest}`,answer:Math.round(horizontal),tolerance:0}],
                entryNote:'Knots are nautical miles per hour. Enter positive distances in the two named directions.',
                solution:`Total distance is $d=${speed}(${hours})=${fixed(distance,1)}$ nautical miles. Measure from ${northSouth}: ${northSouth} $=d\\cos(${angle}^\\circ)\\approx${Math.round(vertical)}$ nautical miles; ${eastWest} $=d\\sin(${angle}^\\circ)\\approx${Math.round(horizontal)}$ nautical miles.`,parameters:{speed,hours,angle,ns,ew}};
        }},
        {id:'aviation_return_to_origin',section:'Section 7.1',label:'Aviation: Distance and Return Bearing',generate:(r=Math.random)=>{
            const speed=int(r,12,24)*20,firstHours=pick(r,[0.5,0.75,1,1.25,1.5]),secondHours=pick(r,[1,1.5,2,2.5]),ns=pick(r,['N','S']),ew=pick(r,['E','W']);
            const vertical=speed*firstHours,horizontal=speed*secondHours,distance=Math.hypot(vertical,horizontal),angle=Math.atan2(horizontal,vertical)*180/Math.PI;
            const backNS=ns==='N'?'S':'N',backEW=ew==='E'?'W':'E';
            return {q:`An airplane leaves an airport and flies ${ns==='N'?'north':'south'} for ${firstHours} hours, then ${ew==='E'?'east':'west'} for ${secondHours} hours, at an average speed of ${speed} mph on both legs. Find its direct distance back to the airport and the bearing for the return flight. Round miles and the bearing angle to 1 decimal.`,
                inputType:'parts',fields:[{id:'distance',label:'Distance back (miles)',answer:distance,tolerance:0.05},{id:'bearing',label:'Return bearing (example: S 35.2 E)',inputType:'bearing',answer:{ns:backNS,ew:backEW,angle},tolerance:0.05}],
                entryNote:'Sketch both flight legs. Return toward the airport. Equivalent quadrant bearings or a compass heading in degrees are accepted.',
                solution:`The legs are $${speed}(${firstHours})=${vertical}$ miles ${ns==='N'?'north':'south'} and $${speed}(${secondHours})=${horizontal}$ miles ${ew==='E'?'east':'west'}. Direct distance is $\\sqrt{${vertical}^2+${horizontal}^2}\\approx${fixed(distance,1)}$ miles. Reverse both directions for the return: ${backNS} $\\arctan(${horizontal}/${vertical})\\approx${fixed(angle,1)}^\\circ$ ${backEW}, so the bearing is ${backNS} ${fixed(angle,1)}° ${backEW}.`,parameters:{speed,firstHours,secondHours,ns,ew}};
        }}
    );

    const HINTS = {
    "trig_values_from_point":"Find the positive distance r using the Pythagorean theorem. Use signed x and y in the ratios and their reciprocals.",
    "aviation_climb_time":"The vertical component of airspeed uses sine. Divide the required altitude by vertical speed, then convert the time to minutes.",
    "aviation_descent_loss":"Convert the time to hours, find distance along the flight path, then take its vertical component with sine.",
    "aviation_bearing_displacement":"First multiply knots by hours. Bearings are measured from north or south: the component along that axis uses cosine; the other uses sine.",
    "aviation_return_to_origin":"Compute each leg with distance = speed × time. Use a right triangle for the direct distance, then reverse both compass directions to head back.",
    "angle_coterminal": "Add or subtract a nonzero whole number of full turns.",
    "angle_coterminal_rad": "Add or subtract a nonzero whole number of full turns, measured in radians.",
    "arc_length": "Use $s=r\\theta$ with $\\theta$ in radians. Rearrange when the angle is unknown.",
    "trig_ratio": "Find the hypotenuse with the Pythagorean theorem, then use the requested ratio.",
    "trig_calculator_values": "Check the angle mode. For a reciprocal ratio, take the reciprocal of the corresponding sine, cosine, or tangent value.",
    "angle_unit_conversion": "Use the relationship $\\pi$ radians equals a straight angle in degrees.",
    "right_triangle_word_problem": "Draw the right triangle and relate the vertical and horizontal distances with tangent.",
    "solve_right_triangle_side": "Identify the opposite, adjacent, and hypotenuse sides, then choose a ratio containing the known side and the unknown side.",
    "reference_angle_rad": "Reduce by whole turns, locate the terminal side, and measure the acute angle to the horizontal axis.",
    "reference_angle_deg": "Reduce by whole turns, locate the terminal side, and measure the acute angle to the horizontal axis.",
    "quadrant_signs": "Find where both given sign conditions hold.",
    "trig_values_from_info": "Use the reference angle and then apply the sign of the requested ratio in the given quadrant.",
    "solve_right_triangle": "Use the Pythagorean theorem, a suitable trigonometric ratio, and the sum of the acute angles.",
    "angle_of_elevation": "Draw a horizontal line through the observer. Use tangent to relate the vertical and horizontal distances.",
    "two_right_triangles": "Write the tower height using tangent at each observation point, then equate the two expressions.",
    "distance_rate_time": "First find the travel distance from speed and time. Then use the sine of the elevation angle.",
    "vector_components": "Subtract each initial coordinate from the corresponding terminal coordinate.",
    "vector_operations": "Multiply the components by the scalar, then perform the indicated addition or subtraction.",
    "vector_mag_direction": "Use the Pythagorean theorem for magnitude and the component signs to choose the direction quadrant.",
    "vector_magnitude": "Square each component, add the squares, and take the square root.",
    "vector_direction": "Use the component signs to locate the quadrant, then find the angle from the positive horizontal axis.",
    "trig_from_given_ratio": "Label the known side ratio, find the missing side with the Pythagorean theorem, and form the requested ratio.",
    "solve_trig_equation_special": "Find the reference angle, then use the sign of the function to locate both solutions.",
    "bearing_navigation": "Bearings are measured from north or south. Resolve the travel distance into perpendicular components, or use inverse tangent to find the bearing angle.",
    "oblique_triangle_area": "Multiply the two given sides and the sine of their included angle, then halve the product.",
    "vector_from_mag_dir": "Multiply the magnitude by cosine for the horizontal component and sine for the vertical component.",
    "resultant_from_direction_vectors": "Resolve both vectors into components and add. Use the resulting components for magnitude and direction.",
    "graph_vector_addition": "Follow the first vector with the second, then add their corresponding components.",
    "angle_terminal_quadrant": "Reduce by full turns, then locate the terminal side relative to the coordinate axes.",
    "trig_ratio_variables": "Identify the opposite and adjacent sides relative to the marked angle. Use a reciprocal when needed.",
    "trig_ratios_several": "Use the hypotenuse and known leg to find the missing leg, then form each requested side ratio.",
    "right_triangle_find_angle": "Choose the inverse trigonometric function whose ratio uses the two known sides."
};
    const generators = definitions.map(definition => ({...definition, generate(r = Math.random) {
        const question = definition.generate(r);
        question.hint = HINTS[definition.id];
        if (['vector_components','vector_mag_direction'].includes(definition.id)) {
            const coordinates = [...question.svgAltText.matchAll(/\((-?\d+),\s*(-?\d+)\)/g)].map(m=>[Number(m[1]),Number(m[2])]);
            question.parameters = {coordinates};
            question.graphOnly=r()<0.53;
            if(question.graphOnly) question.q=definition.id==='vector_components'?'Read the graph and find the vector from P to Q in exact component form.':'Read the graph and find the vector magnitude and direction angle in degrees. Round magnitude to 3 decimals and direction to 1 decimal.';
        }
        if(question.graphOnly) question.svg=question.svg.replace(/([PQ])\(-?\d+,\s*-?\d+\)/g,'$1').replace(/>\(-?\d+,\s*-?\d+\)<\/text>/g,'>v</text>').replace(/v = <-?\d+,\s*-?\d+>/g,'v');
        if (question.svg) question.svg=question.svg.replace(/<text([^>]*?)>/g,(all,attributes)=>/text-anchor=/.test(attributes)?all:'<text'+attributes+' text-anchor="'+(Number((attributes.match(/x="([\d.]+)"/)||[])[1])>245?'end':'start')+'">');
        question.solution=question.solution.replace(/(-?\d+)\\approx \1\.0+(?!\d)/g,'$1');
        return question;
    }}));

    const api = { generators, buildCheckpoint, createBasicAngleSvg, mulberry32, parseExact, grade, bearingHeading, piFraction, fraction, radical, signedTerm };
    if (typeof module === 'object' && module.exports) module.exports = api;
    root.Math130Test3Skills = api;
})(typeof window !== 'undefined' ? window : globalThis);
