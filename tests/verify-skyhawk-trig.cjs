#!/usr/bin/env node
'use strict';
// node tests/verify-skyhawk-trig.cjs
// Regression checks for SkyhawkTrig.html: rounding/grading (SH-001) and the
// seeded, DOM-free problem engine (SH-010).
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.resolve(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'SkyhawkTrig.html'), 'utf8');
const script = html.slice(html.lastIndexOf('<script>') + 8, html.lastIndexOf('</script>'));

const results = [];
function check(name, fn) {
    try { fn(); results.push(['PASS', name]); } catch (e) { results.push(['FAIL', name, e.message]); }
}

// Load only the engine block, with no DOM available: proves the logic is isolated.
function loadEngine() {
    const start = script.indexOf('// <skyhawk-engine>'), end = script.indexOf('// </skyhawk-engine>');
    assert.ok(start >= 0 && end > start, 'engine block markers not found');
    const context = { Math, Number, String, JSON, Object, Array, Error, console };
    vm.createContext(context);
    vm.runInContext(script.slice(start, end) + ';this.engine=SkyhawkEngine;', context);
    return context.engine;
}
let E;
check('engine block loads without a DOM', () => { E = loadEngine(); assert.ok(E && typeof E.generate === 'function'); });
if (!E) { report(); }

const SKILLS = ['elevation', 'bearing', 'depression', 'return'];
const plain = (v) => JSON.parse(JSON.stringify(v));

// --- Reproducibility (SH-010) ---
check('engine exposes the four Section 7.1 skills in flight order', () => {
    assert.deepEqual(plain(E.SKILLS), SKILLS);
});
check('same skill and seed reproduce prompt, answers, and solution exactly', () => {
    for (const type of SKILLS) for (const seed of [0, 1, 42, 2147483646, 123456789]) {
        assert.deepEqual(plain(E.generate(type, seed)), plain(E.generate(type, seed)), `${type} seed ${seed}`);
    }
});
check('different seeds produce varied problems', () => {
    for (const type of SKILLS) {
        const prompts = new Set();
        for (let s = 0; s < 500; s++) prompts.add(E.generate(type, s).prompt);
        assert.ok(prompts.size > 100, `${type}: only ${prompts.size} distinct prompts`);
    }
});
check('problem code round-trips to the identical problem', () => {
    for (const type of SKILLS) for (let s = 0; s < 200; s++) {
        const seed = (s * 2654435761) >>> 1, p = E.generate(type, seed);
        assert.match(p.code, /^[a-z]+-[0-9a-z]+$/, p.code);
        const parsed = E.parseCode(p.code);
        assert.deepEqual(plain(parsed), { type, seed });
        assert.deepEqual(plain(E.generate(parsed.type, parsed.seed)), plain(p));
        assert.deepEqual(plain(E.parseCode(p.code.toUpperCase())), { type, seed }, 'codes are case-insensitive');
    }
});
check('malformed problem codes are rejected', () => {
    for (const bad of ['', 'bearing', 'bearing-', 'climb-12', 'bearing-!!', 'bearing-zzzzzzzzzzzz', null, undefined, 42]) {
        assert.equal(E.parseCode(bad), null, String(bad));
    }
});
check('a parameter set rebuilds the same problem as its seed', () => {
    for (const type of SKILLS) for (let s = 0; s < 200; s++) {
        const p = E.generate(type, s);
        const rebuilt = E.build(type, plain(p.params), s);
        assert.deepEqual(plain(rebuilt), plain(p));
    }
});
check('newSeed returns valid 31-bit integer seeds', () => {
    for (let i = 0; i < 1000; i++) { const s = E.newSeed(); assert.ok(Number.isInteger(s) && s >= 0 && s < 2 ** 31, String(s)); }
});

// --- Known exact answers (cannot be fooled by a shared floating-point mistake) ---
const ans = (p) => plain(p.fields.map((f) => f.answer));
check('bearing 125 mph, 1.4 h, S 30 W -> 152 S, 88 W (87.5 exactly)', () => {
    assert.deepEqual(ans(E.build('bearing', { speed: 125, time: 1.4, angle: 30 })), [152, 88]);
});
check('bearing exact .5/.25/.75 components round correctly', () => {
    assert.equal(ans(E.build('bearing', { speed: 105, time: 1.0, angle: 60 }))[0], 53);
    assert.equal(ans(E.build('bearing', { speed: 107, time: 1.5, angle: 30 }))[1], 80);
    assert.equal(ans(E.build('bearing', { speed: 109, time: 2.5, angle: 30 }))[1], 136);
    assert.equal(ans(E.build('bearing', { speed: 111, time: 1.5, angle: 30 }))[1], 83);
    assert.equal(ans(E.build('bearing', { speed: 115, time: 1.3, angle: 30 }))[1], 75);
});
check('worked solution preserves the side of a rounding boundary (SH-012)', () => {
    const d = E.build('bearing', { speed: 105, time: 2.4, angle: 25 });
    assert.equal(ans(d)[1], 106);
    assert.match(d.solutionHtml, /106\.4998 &rarr; <b>106 miles/);
    assert.doesNotMatch(d.solutionHtml, /106\.500 &rarr;/);
    const half = E.build('bearing', { speed: 125, time: 1.4, angle: 30 });
    assert.match(half.solutionHtml, /87\.500 &rarr; <b>88 miles/);
    assert.match(E.build('depression', { speed: 86, angle: 5, timeMins: 6 }).solutionHtml, /&approx; 0\.749\d* &rarr; <b>0\.7 miles/);
});
check('return 3-4-5 and 45 degree cases', () => {
    assert.deepEqual(ans(E.build('return', { speed: 120, timeN: 0.8, timeW: 0.6 })), [120, 37]);
    assert.deepEqual(ans(E.build('return', { speed: 105, timeN: 1.0, timeW: 1.0 })), [148, 45]);
});
check('depression 90 mph, 5 deg, 5 min -> 0.7; elevation 6 deg, 80 mph, 1.0 mi -> 7', () => {
    assert.deepEqual(ans(E.build('depression', { speed: 90, angle: 5, timeMins: 5 })), [0.7]);
    assert.deepEqual(ans(E.build('elevation', { angle: 6, speed: 80, alt: 1.0 })), [7]);
});

// --- Generated cases: ranges, units, and correct rounding ---
const TRIALS = 10000;
const rad = (d) => d * Math.PI / 180;
function assertRounded(value, got, unit, label) {
    assert.ok(Number.isFinite(got), `${label}: nonfinite answer`);
    const scaled = value / unit, frac = scaled - Math.floor(scaled);
    const want = (Math.abs(frac - 0.5) > 1e-6 ? Math.round(scaled) : Math.ceil(scaled - 1e-6)) * unit;
    assert.ok(Math.abs(got - want) < 1e-9, `${label}: expected ${want}, got ${got} for ${value}`);
    assert.equal(got, Number(got.toFixed(unit < 1 ? 1 : 0)), `${label}: precision`);
}
const inRange = (v, lo, hi, step, label) => {
    assert.ok(v >= lo && v <= hi, `${label}: ${v} outside [${lo}, ${hi}]`);
    assert.ok(Math.abs(v / step - Math.round(v / step)) < 1e-9, `${label}: ${v} is not a multiple of ${step}`);
};
for (const type of SKILLS) {
    check(`${TRIALS} seeded ${type} cases: ranges, units, and rounding`, () => {
        for (let seed = 0; seed < TRIALS; seed++) {
            const p = E.generate(type, seed * 7919 + 13), d = p.params, a = ans(p), label = `${type} ${p.code}`;
            assert.equal(p.type, type);
            assert.ok(p.prompt && p.hint && p.solutionHtml, `${label}: missing text`);
            for (const f of p.fields) assert.match(f.label, /\((miles|minutes|degrees)\)/, `${label}: field label needs units`);
            if (type === 'elevation') {
                inRange(d.angle, 4, 9, 1, label); inRange(d.speed, 75, 90, 1, label); inRange(d.alt, 0.5, 1.5, 0.1, label);
                assertRounded(d.alt / (d.speed * Math.sin(rad(d.angle))) * 60, a[0], 1, label);
            } else if (type === 'bearing') {
                inRange(d.speed, 105, 125, 1, label); inRange(d.time, 1.0, 2.5, 0.1, label); inRange(d.angle, 25, 65, 1, label);
                assertRounded(d.speed * d.time * Math.cos(rad(d.angle)), a[0], 1, label);
                assertRounded(d.speed * d.time * Math.sin(rad(d.angle)), a[1], 1, label);
            } else if (type === 'depression') {
                inRange(d.speed, 85, 105, 1, label); inRange(d.angle, 3, 6, 1, label); inRange(d.timeMins, 3, 7, 1, label);
                assertRounded(d.speed * d.timeMins / 60 * Math.sin(rad(d.angle)), a[0], 0.1, label);
                assert.ok(a[0] > 0, `${label}: altitude loss must be positive`);
            } else {
                inRange(d.speed, 105, 120, 1, label); inRange(d.timeN, 0.5, 1.5, 0.1, label); inRange(d.timeW, 0.5, 1.5, 0.1, label);
                const n = d.speed * d.timeN, w = d.speed * d.timeW;
                assertRounded(Math.hypot(n, w), a[0], 1, label);
                assertRounded(Math.atan2(w, n) * 180 / Math.PI, a[1], 1, label);
            }
            assert.ok(!/\d\.\d{6,}/.test(p.solutionHtml + p.prompt), `${label}: unreadable precision`);
            // Check the values students actually see, independently of the formatter (SH-012).
            const steps = [...p.solutionHtml.matchAll(/&approx; ([\d.]+) &rarr; <b>([\d.]+)/g)];
            if (type !== 'return') assert.equal(steps.length, type === 'bearing' ? 2 : 1, label);
            for (const [, shown, answer] of steps) {
                const scale = type === 'depression' ? 10 : 1;
                assert.equal(Math.floor(Number(shown) * scale + 0.5) / scale, Number(answer), `${label}: displayed ${shown} must round to ${answer}`);
            }
        }
    });
}

// --- Grading ---
check('grading accepts 152/88 and 152.0/88.0; rejects 87, unrounded 87.5, and blanks', () => {
    const p = E.build('bearing', { speed: 125, time: 1.4, angle: 30 });
    assert.equal(E.grade(p, ['152', '88']).correct, true);
    assert.equal(E.grade(p, [' 152.0 ', '88.0']).correct, true);
    assert.deepEqual(plain(E.grade(p, ['152', '87'])), { parts: [true, false], correct: false });
    assert.equal(E.grade(p, ['151.55', '87.5']).correct, false);
    assert.deepEqual(plain(E.grade(p, ['', '88'])), { parts: [false, true], correct: false });
    assert.equal(E.grade(p, ['152']).correct, false);
});
check('grading accepts 0.7 and 0.70 for depression; rejects unrounded 0.654 and blank as zero', () => {
    const p = E.build('depression', { speed: 90, angle: 5, timeMins: 5 });
    assert.equal(E.grade(p, ['0.7']).correct, true);
    assert.equal(E.grade(p, ['0.70']).correct, true);
    assert.equal(E.grade(p, ['0.654']).correct, false);
    assert.equal(E.grade(E.build('depression', { speed: 85, angle: 3, timeMins: 3 }), ['']).correct, false);
});

// --- Page wiring: the page uses the engine and replays ?problem= codes ---
function loadPage(search) {
    const elements = {};
    const document = { getElementById: (id) => (elements[id] ||= { id, value: '', style: {}, innerHTML: '', innerText: '' }) };
    const context = { Math, document, console, location: { search }, URLSearchParams, crypto: { getRandomValues: (a) => { a[0] = 99; return a; } } };
    vm.createContext(context);
    vm.runInContext(script + ';this.page={get data(){return currentData},get stage(){return currentStageIndex},verifyAnswer};', context);
    return { page: context.page, elements };
}
check('?problem= opens that exact problem at its stage and shows the code', () => {
    const want = E.generate('depression', 424242);
    const { page, elements } = loadPage(`?problem=${want.code}`);
    assert.equal(page.stage, 2);
    assert.deepEqual(plain(page.data), plain(want));
    assert.ok(elements['modal-text'].innerHTML.includes(want.code), 'problem code is shown');
    assert.ok(elements['modal-text'].innerHTML.includes(want.prompt), 'prompt is rendered from the engine');
});
check('page grades through the engine (regression case accepted, 87 rejected)', () => {
    const p = E.build('bearing', { speed: 125, time: 1.4, angle: 30 }, 5);
    for (const [west, ok] of [['88', true], ['87', false]]) {
        const { page, elements } = loadPage('');
        Object.assign(page.data, plain(p));
        elements.inp1 = { value: '152', style: {} }; elements.inp2 = { value: west, style: {} };
        page.verifyAnswer();
        assert.equal(/Correct/.test(elements['modal-title'].innerHTML), ok, `west ${west}`);
    }
});
check('without ?problem= the page shows the welcome screen', () => {
    const { page, elements } = loadPage('?problem=nonsense-!!');
    assert.equal(page.stage, 0);
    assert.equal((elements['modal-text'] || {}).innerHTML || '', '', 'welcome screen untouched');
});

// --- Layout guards (SH-002/SH-003). Browser viewport checks are recorded in the tracker. ---
const css = html.slice(html.indexOf('<style>'), html.indexOf('</style>'));
const rule = (selector) => {
    // Find a top-level rule by its exact selector text and return its declarations.
    const escaped = selector.replace(/[#.*+?^${}()|[\]\\]/g, '\\$&');
    const m = css.match(new RegExp(String.raw`(?:^|\n)\s*${escaped}\s*\{([^}]*)\}`));
    return m ? m[1] : '';
};
check('page can scroll vertically (no overflow: hidden or fixed 100vh on html/body)', () => {
    const base = rule('body, html') + rule('html, body') + rule('body') + rule('html');
    assert.doesNotMatch(base, /overflow\s*:\s*hidden/);
    assert.doesNotMatch(base, /(^|[^-])height\s*:\s*100vh/);
    assert.doesNotMatch(base, /width\s*:\s*100vw/, '100vw causes horizontal scroll next to a scrollbar');
});
check('progress bar sits in normal flow below the course navigation', () => {
    assert.doesNotMatch(rule('#progress-container'), /position\s*:\s*(absolute|fixed)/);
    assert.ok(html.indexOf('class="m130-topbar"') < html.indexOf('id="progress-container"'));
});
check('question panel is in normal flow so it can grow and scroll', () => {
    assert.doesNotMatch(rule('#modal-overlay'), /position\s*:\s*(absolute|fixed)/);
    assert.match(rule('#game-area'), /overflow(-x)?\s*:\s*(hidden|clip)/, 'scene decorations must not cause horizontal scroll');
});

report();
function report() {
    let failed = 0;
    for (const [status, name, msg] of results) {
        console.log(`${status}  ${name}${msg ? `\n      ${msg.split('\n')[0]}` : ''}`);
        if (status === 'FAIL') failed++;
    }
    console.log(`\n${results.length - failed}/${results.length} checks passed`);
    process.exit(failed ? 1 : 0);
}
