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
        const { page, el } = pageWith(p); // defined with the SH-004 page checks below (hoisted)
        el('inp1').value = '152'; el('inp2').value = west;
        page.verifyAnswer();
        assert.equal(/Correct/.test(el('modal-title').innerHTML), ok, `west ${west}`);
    }
});
check('without ?problem= the page shows the welcome screen', () => {
    const { page, elements } = loadPage('?problem=nonsense-!!');
    assert.equal(page.stage, 0);
    assert.equal((elements['modal-text'] || {}).innerHTML || '', '', 'welcome screen untouched');
});

// --- SH-004: validation, per-part feedback, targeted hints, attempt honesty ---
const bearingCase = () => E.build('bearing', { speed: 125, time: 1.4, angle: 30 }, 7);
const hints = (d) => plain(d.parts.map((p) => p.hint));
check('validate flags blank, non-numeric, and nonfinite entries per field', () => {
    const p = bearingCase();
    const [blank, ok] = E.validate(p, ['', '88']);
    assert.match(blank, /South/); assert.equal(ok, null);
    for (const bad of ['abc', '   ', 'Infinity', '1e400', '12,5', '5 miles']) assert.ok(E.validate(p, [bad, '88'])[0], bad);
    assert.deepEqual(plain(E.validate(p, ['152', '88.0'])), [null, null]);
    assert.deepEqual(plain(E.validate(p, [' -5 ', '0'])), [null, null], 'finite numbers are valid input even when wrong');
});
check('diagnose keeps a correct part and targets only the wrong part', () => {
    const d = E.diagnose(bearingCase(), ['152', '90']);
    assert.equal(d.correct, false);
    assert.deepEqual(plain(d.parts.map((p) => p.correct)), [true, false]);
    assert.equal(d.parts[0].hint, null);
    assert.ok(d.parts[1].hint && d.parts[1].hint.length > 20);
});
check('sine/cosine swap is identified in each component', () => {
    const h = hints(E.diagnose(bearingCase(), ['88', '152']));
    assert.match(h[0], /cosine/i); assert.match(h[1], /sine/i);
});
check('using the total distance as a component is identified', () => {
    assert.match(hints(E.diagnose(bearingCase(), ['175', '88']))[0], /total distance/i);
});
check('unrounded and mis-rounded answers get rounding hints', () => {
    const h = hints(E.diagnose(bearingCase(), ['151.55', '87.5']));
    assert.match(h[0], /round/i); assert.match(h[1], /round/i);
    assert.match(hints(E.diagnose(bearingCase(), ['152', '87']))[1], /round/i);
});
check('climb: hours instead of minutes and cosine instead of sine', () => {
    const p = E.build('elevation', { angle: 6, speed: 80, alt: 1.0 });
    assert.match(hints(E.diagnose(p, ['0.12']))[0], /hours/i);
    assert.match(hints(E.diagnose(p, ['0.75']))[0], /sin/i);
});
check('descent: minutes used as hours and distance instead of altitude', () => {
    const p = E.build('depression', { speed: 90, angle: 5, timeMins: 5 });
    assert.match(hints(E.diagnose(p, ['39.2']))[0], /60/);
    assert.match(hints(E.diagnose(p, ['7.5']))[0], /sin/i);
});
check('return: added legs, complementary angle, and radian mode', () => {
    const p = E.build('return', { speed: 120, timeN: 0.8, timeW: 0.6 });
    assert.match(hints(E.diagnose(p, ['168', '37']))[0], /Pythagorean/i);
    assert.match(hints(E.diagnose(p, ['120', '53']))[1], /West distance ÷ North distance/i);
    assert.match(hints(E.diagnose(p, ['120', '0.64']))[1], /degree mode/i);
});
check('diagnose agrees with grade, and hints never reveal an answer', () => {
    const tenth = (v) => Math.round(v * 10) / 10;
    for (const type of SKILLS) for (let seed = 0; seed < 3000; seed++) {
        const p = E.generate(type, seed), answers = ans(p);
        const right = E.diagnose(p, answers.map(String));
        assert.equal(right.correct, true, `${p.code} correct answers`);
        assert.ok(right.parts.every((x) => x.hint === null));
        const offsets = [7, -3, 0.5, 1, 40];
        const wrong = answers.map((a, i) => String(tenth(a + offsets[(seed + i) % offsets.length] * (type === 'depression' ? 0.1 : 1))));
        const d = E.diagnose(p, wrong);
        assert.equal(d.correct, E.grade(p, wrong).correct, `${p.code} ${wrong}`);
        d.parts.forEach((x, i) => {
            if (x.correct) return;
            assert.ok(typeof x.hint === 'string' && x.hint.length > 0, `${p.code}: missing hint`);
            const answerPattern = new RegExp(`(^|[^\\d.])${String(answers[i]).replace('.', '\\.')}([^\\d]|$)`);
            assert.doesNotMatch(x.hint, answerPattern, `${p.code}: hint reveals ${answers[i]}`);
        });
    }
});

// Page flow: attempt -> per-part feedback -> retry / explicit worked solution -> fresh problem.
function pageWith(problem) {
    const elements = {};
    const el = (id) => (elements[id] ||= {
        id, value: '', style: {}, innerHTML: '', innerText: '', className: '', attrs: {},
        setAttribute(k, v) { this.attrs[k] = v; }, removeAttribute(k) { delete this.attrs[k]; }, focus() { elements.__focused = id; },
    });
    const context = { Math, document: { getElementById: el }, console, location: { search: '' }, URLSearchParams, __problem: problem };
    vm.createContext(context);
    vm.runInContext(script + ';currentStageIndex=SkyhawkEngine.SKILLS.indexOf(__problem.type);startProblem(__problem);' +
        'this.page={verifyAnswer,showSolution,loadStage,get attempt(){return attemptState},get data(){return currentData}};', context);
    return { page: context.page, el, elements };
}
const text = (e) => String(e.innerHTML || e.innerText || '');
check('blank entry shows an inline message, keeps the other entry, and costs no attempt', () => {
    const { page, el, elements } = pageWith(bearingCase());
    el('inp1').value = ''; el('inp2').value = '88';
    page.verifyAnswer();
    assert.equal(page.attempt.count, 0);
    assert.notEqual(el('solution-container').style.display, 'block', 'solution must not be revealed');
    assert.match(text(el('inp1-feedback')), /Enter a number/);
    assert.equal(el('inp2').value, '88');
    assert.match(text(el('inputs-container')), /id="inp1"/, 'inputs are not cleared');
    assert.equal(el('inp1').attrs['aria-invalid'], 'true');
    assert.equal(elements.__focused, 'inp1', 'focus moves to the first entry to fix');
});
check('partly correct attempt keeps both entries and marks each part in text', () => {
    const { page, el } = pageWith(bearingCase());
    el('inp1').value = '152'; el('inp2').value = '90';
    page.verifyAnswer();
    assert.equal(page.attempt.count, 1);
    assert.equal(el('inp1').value, '152'); assert.equal(el('inp2').value, '90');
    assert.match(text(el('inputs-container')), /id="inp2"/);
    assert.match(text(el('inp1-feedback')), /Correct/);
    assert.match(text(el('inp2-feedback')), /Needs attention/);
    assert.notEqual(el('solution-container').style.display, 'block');
    assert.doesNotMatch(text(el('modal-title')), /Correct/);
    assert.match(text(el('btn-container')), /Check Again/);
    assert.match(text(el('btn-container')), /Show Worked Solution/);
    assert.equal(page.attempt.assisted, true, 'a targeted hint was shown');
});
check('correct retry is reported as a later, assisted attempt', () => {
    const { page, el } = pageWith(bearingCase());
    el('inp1').value = '152'; el('inp2').value = '90'; page.verifyAnswer();
    el('inp2').value = '88'; page.verifyAnswer();
    assert.match(text(el('modal-title')), /Correct/);
    assert.match(text(el('modal-text')), /attempt 2/i);
    assert.match(text(el('modal-text')), /hint/i);
    assert.equal(page.attempt.firstTry, false);
    page.verifyAnswer(); page.verifyAnswer();
    assert.equal(page.attempt.count, 2, 'repeat submissions after solving are ignored');
});
check('first-attempt success is recorded as unassisted', () => {
    const { page, el } = pageWith(bearingCase());
    el('inp1').value = '152'; el('inp2').value = '88.0'; page.verifyAnswer();
    assert.equal(page.attempt.firstTry, true); assert.equal(page.attempt.assisted, false);
    assert.match(text(el('modal-text')), /first attempt/i);
});
check('worked solution is explicit, marks assistance, and leads to a fresh problem', () => {
    const p = bearingCase();
    const { page, el } = pageWith(p);
    el('inp1').value = '100'; el('inp2').value = '90'; page.verifyAnswer();
    page.showSolution();
    assert.equal(el('solution-container').style.display, 'block');
    assert.ok(text(el('solution-container')).includes('88 miles'));
    assert.match(text(el('modal-text')), /100/, 'student entries remain visible for comparison');
    assert.equal(page.attempt.solutionViewed, true); assert.equal(page.attempt.assisted, true);
    assert.match(text(el('btn-container')), /Fresh/);
    el('inp1').value = '152'; el('inp2').value = '88'; page.verifyAnswer();
    assert.equal(page.attempt.count, 1, 'answers after viewing the solution do not count');
    page.loadStage();
    assert.equal(page.data.type, 'bearing');
    assert.notEqual(page.data.seed, p.seed);
    assert.equal(page.attempt.count, 0); assert.equal(page.attempt.assisted, false);
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
