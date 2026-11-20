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
// Normalize line endings: Windows checkouts with core.autocrlf=true have CRLF, and the
// CSS/markup checks below match LF-delimited text.
const html = fs.readFileSync(path.join(root, 'SkyhawkTrig.html'), 'utf8').replace(/\r\n/g, '\n');
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
    assert.deepEqual(ans(E.build('return', { speed: 120, timeN: 0.8, timeW: 0.6 })), [120, 'S 37° E']);
    assert.deepEqual(ans(E.build('return', { speed: 105, timeN: 1.0, timeW: 1.0 })), [148, 'S 45° E']);
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
                const b = p.fields[1];
                assertRounded(Math.atan2(w, n) * 180 / Math.PI, b.angle, 1, label);
                assert.equal(b.ns, d.ns === 'N' ? 'S' : 'N', `${label}: return reverses the north/south leg`);
                assert.equal(b.ew, d.ew === 'E' ? 'W' : 'E', `${label}: return reverses the east/west leg`);
                assert.equal(a[1], `${b.ns} ${b.angle}° ${b.ew}`);
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
    const document = { getElementById: (id) => (elements[id] ||= { id, value: '', style: {}, innerHTML: '', innerText: '', setAttribute() {}, removeAttribute() {}, focus() {} }) };
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
    assert.match(hints(E.diagnose(p, ['120', 'S 53 E']))[1], /West distance ÷ North distance/i);
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
        const wrong = answers.map((a, i) => {
            const off = offsets[(seed + i) % offsets.length], f = p.fields[i];
            // Bearing answers are quadrant strings: offset the angle but keep the directions.
            if (f.kind === 'bearing') return `${f.ns} ${tenth(Math.min(89, f.angle + off))} ${f.ew}`;
            return String(tenth(a + off * (type === 'depression' ? 0.1 : 1)));
        });
        const d = E.diagnose(p, wrong);
        assert.equal(d.correct, E.grade(p, wrong).correct, `${p.code} ${wrong}`);
        d.parts.forEach((x, i) => {
            if (x.correct) return;
            assert.ok(typeof x.hint === 'string' && x.hint.length > 0, `${p.code}: missing hint`);
            const f = p.fields[i], secret = f.kind === 'bearing' ? f.angle : answers[i];
            const answerPattern = new RegExp(`(^|[^\\d.])${String(secret).replace('.', '\\.')}([^\\d]|$)`);
            assert.doesNotMatch(x.hint, answerPattern, `${p.code}: hint reveals ${secret}`);
            if (f.kind === 'bearing') assert.doesNotMatch(x.hint, new RegExp(`\\b${f.ns}\\s*\\d|\\d\\D*\\b${f.ew}\\b`), `${p.code}: hint reveals return directions`);
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
        'this.page={verifyAnswer,showSolution,loadStage,submitOnEnter:typeof submitOnEnter==="function"?submitOnEnter:()=>{throw Error("submitOnEnter missing")},initGame,continueFlight,endGame,get attempt(){return attemptState},get data(){return currentData}};', context);
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

// --- SH-013: one-decimal flight times and altitudes are always shown with their tenth ---
check('times and altitudes drawn in tenths always display one decimal ("1.0 hours", never "1 hours")', () => {
    const tenthsParams = { elevation: ['alt'], bearing: ['time'], return: ['timeN', 'timeW'] };
    let wholeValues = 0;
    for (const [type, keys] of Object.entries(tenthsParams)) for (let seed = 0; seed < 4000; seed++) {
        const p = E.generate(type, seed), shown = p.prompt + p.solutionHtml;
        assert.doesNotMatch(shown, /(^|[^\d.])\d+ (hours|hrs)\b/, `${p.code}: time without a tenth`);
        assert.doesNotMatch(p.prompt, /altitude of \d+ miles/, `${p.code}: altitude without a tenth`);
        for (const k of keys) {
            assert.ok(p.prompt.includes(p.params[k].toFixed(1)), `${p.code}: ${k} shown as ${p.params[k].toFixed(1)}`);
            if (Number.isInteger(p.params[k])) wholeValues++;
        }
    }
    assert.ok(wholeValues > 100, 'the sample must include whole-number values to exercise the fix');
});
check('SH-013 regression: bearing 116 mph for 1.0 h reads "1.0 hours" and "1.0 hrs"', () => {
    const p = E.build('bearing', { speed: 116, time: 1, angle: 29 });
    assert.match(p.prompt, /for 1\.0 hours\./);
    assert.match(p.solutionHtml, /116 mph \* 1\.0 hrs = 116\.00 miles/);
    const r = E.build('return', { speed: 110, timeN: 1, timeW: 0.5 });
    assert.match(r.prompt, /North for 1\.0 hours and West for 0\.5 hours/);
    assert.match(r.solutionHtml, /North = 110 \* 1\.0 = 110\.0 mi/);
    assert.match(E.build('elevation', { angle: 6, speed: 80, alt: 1 }).prompt, /altitude of 1\.0 miles/);
});

// --- SH-007: varied quadrants, student-chosen return directions, equivalent bearings ---
check('bearing and return problems cover all four quadrants', () => {
    const outbound = new Set(), back = new Set();
    for (let seed = 0; seed < 400; seed++) {
        const b = E.generate('bearing', seed).params; outbound.add(b.ns + b.ew);
        const f = E.generate('return', seed).fields[1]; back.add(f.ns + f.ew);
    }
    assert.deepEqual([...outbound].sort(), ['NE', 'NW', 'SE', 'SW']);
    assert.deepEqual([...back].sort(), ['NE', 'NW', 'SE', 'SW']);
});
check('existing problem codes keep their numbers (direction picks are drawn last)', () => {
    for (const type of ['bearing', 'return']) for (let seed = 0; seed < 200; seed++) {
        const { params } = E.generate(type, seed);
        const r = E.mulberry32(seed), int = (lo, hi) => lo + Math.floor(r() * (hi - lo + 1));
        const expected = type === 'bearing'
            ? { speed: int(105, 125), time: int(10, 25) / 10, angle: int(25, 65) }
            : { speed: int(105, 120), timeN: int(5, 15) / 10, timeW: int(5, 15) / 10 };
        for (const [k, v] of Object.entries(expected)) assert.equal(params[k], v, `${type} seed ${seed} ${k}`);
    }
});
check('component fields name the flown directions and ask for positive distances', () => {
    const p = E.build('bearing', { speed: 125, time: 1.4, angle: 30, ns: 'N', ew: 'E' });
    assert.match(p.prompt, /bearing of N 30&deg; E/);
    assert.match(p.prompt, /How many miles North and East/);
    assert.deepEqual(plain(p.fields.map((f) => f.label)), ['North (miles)', 'East (miles)']);
    assert.deepEqual(ans(p), [152, 88]);
    assert.match(p.hint, /positive/i);
    assert.match(hints(E.diagnose(p, ['-152', '88']))[0], /positive/i);
    assert.match(hints(E.diagnose(p, ['88', '152']))[0], /cosine for North/);
    assert.match(p.solutionHtml, /North = Distance \* cos\(30&deg;\)/);
});
const returnSE = () => E.build('return', { speed: 120, timeN: 0.8, timeW: 0.6, ns: 'S', ew: 'E' });
check('return: student chooses directions; equivalent bearings and headings are accepted', () => {
    const p = returnSE(); // flew south then east, so the return heads N 37° W (heading 323°)
    assert.match(p.prompt, /flying South for 0\.8 hours and East for 0\.6 hours/);
    assert.equal(ans(p)[1], 'N 37° W');
    assert.equal(p.fields[1].kind, 'bearing');
    assert.doesNotMatch(p.fields[1].label + p.hint + p.prompt, /N\s*_+|_+\s*°?\s*W|North and West/, 'directions are not supplied');
    for (const ok of ['N 37° W', 'N37W', 'n 37 w', 'N 37.0° W', 'W 53° N', '323', '323°', '323.0', ' 323 degrees ']) {
        assert.equal(E.grade(p, ['120', ok]).correct, true, ok);
    }
});
check('return: wrong directions, complements, radians, and unrounded angles get targeted hints', () => {
    const p = returnSE(), h = (entry) => hints(E.diagnose(p, ['120', entry]))[1];
    assert.match(h('S 37° E'), /Reverse both outbound directions/);
    assert.match(h('N 37° E'), /Reverse both outbound directions/);
    assert.match(h('37'), /Reverse both outbound directions/);
    assert.match(h('N 53° W'), /East distance ÷ South distance/);
    assert.match(h('0.64'), /degree mode/);
    assert.match(h('N 36.87° W'), /nearest degree/);
    assert.match(h('N 38° W'), /Close/);
});
check('return: malformed bearings get an inline message', () => {
    const p = returnSE();
    for (const bad of ['', 'north-ish', 'N 95 W', 'N W', '400', '-20', 'NE 37']) {
        assert.match(E.validate(p, ['120', bad])[1], /bearing/i, JSON.stringify(bad));
    }
    assert.equal(E.validate(p, ['120', 'N 37° W'])[1], null);
});
check('return bearing field renders as text entry and grades a heading through the page', () => {
    const { page, el } = pageWith(returnSE());
    assert.match(text(el('inputs-container')), /id="inp2" type="text"|type="text"[^>]*id="inp2"/);
    assert.match(text(el('inputs-container')), /id="inp1" aria-describedby[^>]*type="number"|type="number"[^>]*id="inp1"/);
    el('inp1').value = '120'; el('inp2').value = '323';
    page.verifyAnswer();
    assert.match(text(el('modal-title')), /Correct/);
});

check('every return parameter set accepts all equivalent answer forms and rejects the outbound bearing', () => {
    let n = 0;
    for (let speed = 105; speed <= 120; speed++) for (let a = 5; a <= 15; a++) for (let b = 5; b <= 15; b++) {
        for (const ns of ['N', 'S']) for (const ew of ['E', 'W']) {
            const p = E.build('return', { speed, timeN: a / 10, timeW: b / 10, ns, ew }), f = p.fields[1];
            // Independent expectation: atan in degrees, rounded half up, directions reversed.
            const theta = Math.atan2(speed * b / 10, speed * a / 10) * 180 / Math.PI;
            const want = Math.floor(theta + 0.5 + 1e-9), back = { N: 'S', S: 'N', E: 'W', W: 'E' };
            assert.equal(f.answer, `${back[ns]} ${want}° ${back[ew]}`, p.prompt);
            const heading = { NE: want, NW: 360 - want, SE: 180 - want, SW: 180 + want }[back[ns] + back[ew]] % 360;
            const ewForm = `${back[ew]} ${90 - want} ${back[ns]}`;
            for (const ok of [f.answer, `${back[ns]}${want}${back[ew]}`, String(heading), ewForm]) {
                assert.equal(E.grade(p, [String(f.answer && ans(p)[0]), ok]).parts[1], true, `${f.answer}: ${ok}`);
            }
            assert.equal(E.grade(p, ['0', `${ns} ${want} ${ew}`]).parts[1], false, `${f.answer}: outbound bearing must be rejected`);
            n++;
        }
    }
    assert.equal(n, 16 * 11 * 11 * 4);
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

// --- SH-005: keyboard, focus, announcements, contrast, and motion ---
const contrast = (a, b) => {
    const lum = (h) => {
        const [r, g, bl] = [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16) / 255)
            .map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
        return 0.2126 * r + 0.7152 * g + 0.0722 * bl;
    };
    const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p);
    return (x + 0.05) / (y + 0.05);
};
const colorIn = (selector, prop) => {
    // Accept the longhand property or its shorthand (border-color inside `border: 2px solid #hex`).
    const shorthand = prop.replace(/-color$/, '');
    const m = rule(selector).match(new RegExp(`(?:^|[;\\s])(?:${prop}|${shorthand})\\s*:[^;]*?(#[0-9a-fA-F]{6})`));
    assert.ok(m, `${selector} needs a 6-digit hex ${prop}`);
    return m[1];
};
check('button text has at least 4.5:1 contrast in every state', () => {
    for (const sel of ['button', 'button:hover', 'button.secondary', 'button.secondary:hover']) {
        const ratio = contrast(colorIn(sel, 'background'), '#ffffff');
        assert.ok(ratio >= 4.5, `${sel}: ${ratio.toFixed(2)}:1`);
    }
});
check('input borders have at least 3:1 non-text contrast', () => {
    for (const sel of ['input[type="number"]', 'input[aria-invalid="true"]']) {
        const ratio = contrast(colorIn(sel, 'border-color'), '#ffffff');
        assert.ok(ratio >= 3, `${sel}: ${ratio.toFixed(2)}:1`);
    }
});
check('reduced-motion preference turns off plane and progress animation', () => {
    const at = css.indexOf('@media (prefers-reduced-motion: reduce)');
    assert.ok(at >= 0, 'missing prefers-reduced-motion media query');
    const block = css.slice(at, css.indexOf('}\n        }', at) + 1);
    assert.match(block, /#plane/); assert.match(block, /#progress-bar-fill/);
    assert.match(block, /transition\s*:\s*none/);
});
check('keyboard focus is clearly visible on buttons, links, and inputs', () => {
    assert.match(css, /:focus-visible/);
    assert.match(css, /outline\s*:\s*3px solid/);
});
check('static markup: status region, focusable heading, decorative content hidden, progressbar role', () => {
    assert.match(html, /<div id="error-msg" role="status"/);
    assert.match(html, /<main id="game-area">[\s\S]*<\/main>/, 'activity is the main landmark');
    assert.match(html, /<h2 id="modal-title" tabindex="-1"/);
    assert.match(html, /<div id="plane" aria-hidden="true">/);
    assert.match(html, /id="progress-bar-bg" role="progressbar"/);
    assert.doesNotMatch(html.slice(html.indexOf('<ul class="checklist">'), html.indexOf('</ul>')), /<li>☑/, 'checkbox glyphs should be hidden from screen readers');
});
check('inputs are described by the question and their own feedback', () => {
    const { el } = pageWith(bearingCase());
    const inputs = text(el('inputs-container'));
    assert.match(inputs, /id="inp1" aria-describedby="modal-text inp1-feedback"/);
    assert.match(inputs, /id="inp2" aria-describedby="modal-text inp2-feedback"/);
    assert.doesNotMatch(inputs, /aria-live/, 'one status region announces results; field feedback is read with its input');
});
check('Enter submits the active answer once; repeats and other keys do nothing', () => {
    const { page, el } = pageWith(bearingCase());
    let prevented = 0;
    const key = (k, repeat = false) => page.submitOnEnter({ key: k, repeat, preventDefault() { prevented++; } });
    el('inp1').value = '152'; el('inp2').value = '90';
    key('Tab'); assert.equal(page.attempt.count, 0);
    key('Enter'); assert.equal(page.attempt.count, 1); assert.equal(prevented, 1);
    key('Enter', true); assert.equal(page.attempt.count, 1, 'held-down Enter does not resubmit');
    el('inp2').value = '88'; key('Enter');
    assert.equal(page.attempt.count, 2); assert.match(text(el('modal-title')), /Correct/);
    key('Enter'); assert.equal(page.attempt.count, 2, 'Enter after solving does not count');
});
check('focus moves predictably on each screen change', () => {
    const { page, el, elements } = pageWith(bearingCase());
    page.initGame(); assert.equal(elements.__focused, 'inp1', 'new question focuses its first input');
    el('inp1').value = String(page.data.fields[0].answer); page.verifyAnswer();
    assert.equal(elements.__focused, 'modal-title', 'result screen focuses its heading');
    page.continueFlight(); assert.equal(elements.__focused, 'inp1');
    el('inp1').value = '1'; el('inp2').value = '2'; page.verifyAnswer();
    assert.equal(elements.__focused, 'inp1', 'feedback focuses the first part needing attention');
    page.showSolution(); assert.equal(elements.__focused, 'modal-title');
    page.endGame(); assert.equal(elements.__focused, 'modal-title');
});
check('status region announces validation and attempt results', () => {
    const { page, el } = pageWith(bearingCase());
    el('inp1').value = ''; el('inp2').value = '88'; page.verifyAnswer();
    assert.match(text(el('error-msg')), /did not count/);
    el('inp1').value = '152'; el('inp2').value = '90'; page.verifyAnswer();
    assert.match(text(el('error-msg')), /1 of 2 parts correct/);
});
check('progressbar exposes completed stages', () => {
    const { page, el } = pageWith(bearingCase());
    page.initGame();
    assert.equal(el('progress-bar-bg').attrs['aria-valuenow'], '0');
    assert.match(el('progress-bar-bg').attrs['aria-valuetext'], /Stage 1 of 4/);
    page.continueFlight();
    assert.equal(el('progress-bar-bg').attrs['aria-valuenow'], '1');
    page.endGame();
    assert.equal(el('progress-bar-bg').attrs['aria-valuenow'], '4');
});

// --- SH-006: instructional diagrams ---
const degBetween = (v, a, b) => {
    const ux = a.x - v.x, uy = a.y - v.y, wx = b.x - v.x, wy = b.y - v.y;
    return Math.acos((ux * wx + uy * wy) / (Math.hypot(ux, uy) * Math.hypot(wx, wy))) * 180 / Math.PI;
};
const textOf = (svg) => svg.replace(/<[^>]+>/g, ' ');
const numbersIn = (s) => new Set((s.replace(/&[a-z]+;/g, ' ').match(/\d+(?:\.\d+)?/g) || []).map(Number));
check('every skill has an accessible diagram with a title and description', () => {
    for (const type of SKILLS) {
        const { svg } = E.diagram(E.generate(type, 11));
        assert.match(svg, /^<svg [^>]*role="img"[^>]*aria-labelledby="dg-title dg-desc"/);
        assert.match(svg, /<title id="dg-title">[^<]+<\/title>/);
        assert.match(svg, /<desc id="dg-desc">[^<]{40,}<\/desc>/);
    }
});
check('plan views use one scale and draw the bearing angle and quadrant exactly', () => {
    for (let seed = 0; seed < 500; seed++) {
        const p = E.generate('bearing', seed), g = E.diagram(p).geometry, d = p.params;
        assert.equal(g.kind, 'plan');
        assert.ok(Math.abs(degBetween(g.start, g.corner, g.end) - d.angle) < 0.01, `${p.code}: drawn ${degBetween(g.start, g.corner, g.end)} vs ${d.angle}`);
        assert.ok(Math.abs(degBetween(g.corner, g.start, g.end) - 90) < 0.01, `${p.code}: right angle at the corner`);
        assert.equal(Math.sign(g.end.x - g.start.x), d.ew === 'E' ? 1 : -1, `${p.code}: east is right`);
        assert.equal(Math.sign(g.end.y - g.start.y), d.ns === 'N' ? -1 : 1, `${p.code}: north is up`);
        assert.ok(Math.abs(g.start.x - g.corner.x) < 1e-9, `${p.code}: the ${d.ns} leg lies on the North–South axis`);
        // Equal scales: drawn leg lengths are proportional to the true component distances.
        const dist = d.speed * d.time, rad = d.angle * Math.PI / 180;
        assert.ok(Math.abs(Math.abs(g.corner.y - g.start.y) / (dist * Math.cos(rad)) - g.scale) < 1e-9);
        assert.ok(Math.abs(Math.abs(g.end.x - g.corner.x) / (dist * Math.sin(rad)) - g.scale) < 1e-9);
        for (const pt of [g.start, g.corner, g.end]) assert.ok(pt.x >= 0 && pt.x <= 340 && pt.y >= 0 && pt.y <= 230, `${p.code}: point inside the view`);
    }
});
check('return view: legs at right angles, true scale, and return angle measured from North–South at the final position', () => {
    for (let seed = 0; seed < 500; seed++) {
        const p = E.generate('return', seed), g = E.diagram(p).geometry, d = p.params, f = p.fields[1];
        assert.ok(Math.abs(degBetween(g.turn, g.start, g.now) - 90) < 0.01, `${p.code}: legs perpendicular`);
        assert.ok(Math.abs(Math.abs(g.turn.y - g.start.y) / (d.speed * d.timeN) - g.scale) < 1e-9, `${p.code}: north–south leg to scale`);
        assert.ok(Math.abs(Math.abs(g.now.x - g.turn.x) / (d.speed * d.timeW) - g.scale) < 1e-9, `${p.code}: east–west leg to scale`);
        const ref = { x: g.now.x, y: g.start.y }; // straight toward the start's side along North–South
        assert.ok(Math.abs(degBetween(g.now, ref, g.start) - f.exact) < 0.01, `${p.code}: return angle`);
        assert.equal(Math.sign(g.start.y - g.now.y), f.ns === 'N' ? -1 : 1, `${p.code}: return heads ${f.ns}`);
        assert.equal(Math.sign(g.start.x - g.now.x), f.ew === 'E' ? 1 : -1, `${p.code}: return heads ${f.ew}`);
    }
});
check('side views mark the angle at the correct vertex with its true value', () => {
    for (let seed = 0; seed < 200; seed++) {
        const c = E.generate('elevation', seed), gc = E.diagram(c).geometry;
        assert.equal(gc.kind, 'side');
        assert.ok(Math.abs(gc.horizontalEnd.y - gc.vertex.y) < 1e-9 && gc.horizontalEnd.x > gc.vertex.x, 'climb: level ground to the right of takeoff');
        assert.ok(gc.pathEnd.y < gc.vertex.y && Math.abs(gc.pathEnd.x - gc.horizontalEnd.x) < 1e-9, 'climb: altitude is vertical, above the ground');
        assert.ok(Math.abs(degBetween(gc.vertex, gc.horizontalEnd, gc.pathEnd) - gc.drawnAngle) < 0.01);
        assert.equal(gc.trueAngle, c.params.angle);
        const want = Math.tan(gc.drawnAngle * Math.PI / 180) / Math.tan(c.params.angle * Math.PI / 180);
        assert.ok(Math.abs(gc.exaggeration - want) < 1e-9 && gc.exaggeration >= 1);
        assert.match(E.diagram(c).svg, />[^<]*not to scale[^<]*</i, 'side views say they are not to scale');
        assert.match(textOf(E.diagram(c).svg), new RegExp(`${c.params.angle}°`));
        const s = E.generate('depression', seed), gs = E.diagram(s).geometry;
        assert.ok(Math.abs(gs.horizontalEnd.y - gs.vertex.y) < 1e-9, 'descent: horizontal starts at the plane');
        assert.ok(gs.pathEnd.y > gs.vertex.y, 'descent: the path goes down from the upper horizontal');
        assert.ok(Math.abs(gs.pathEnd.x - gs.horizontalEnd.x) < 1e-9, 'descent: altitude lost is vertical');
        assert.ok(Math.abs(degBetween(gs.vertex, gs.horizontalEnd, gs.pathEnd) - gs.drawnAngle) < 0.01);
        assert.equal(gs.trueAngle, s.params.angle);
    }
});
check('before an answer, diagrams show only given values and unknown markers', () => {
    for (const type of SKILLS) for (let seed = 0; seed < 1000; seed++) {
        const p = E.generate(type, seed), { svg } = E.diagram(p);
        const allowed = numbersIn(p.prompt);
        for (const n of numbersIn(textOf(svg))) assert.ok(allowed.has(n), `${p.code}: diagram shows ${n}, which is not given in the prompt`);
        assert.match(textOf(svg), /\?/, `${p.code}: unknowns are marked`);
        if (type === 'return') assert.doesNotMatch(textOf(svg), /\b[NS] *\d+ *°? *[EW]\b/, `${p.code}: no return bearing shown`);
    }
});
check('revealed diagrams label each unknown with its answer', () => {
    for (const type of SKILLS) for (let seed = 0; seed < 200; seed++) {
        const p = E.generate(type, seed), t = textOf(E.diagram(p, { reveal: true }).svg);
        for (const f of p.fields) assert.ok(t.includes(String(f.answer)), `${p.code}: revealed diagram shows ${f.answer}`);
        assert.doesNotMatch(t, /\?/, `${p.code}: no unknown markers remain`);
    }
});
check('independent diagrams drop side-name cues that guided diagrams show', () => {
    for (const type of ['elevation', 'bearing', 'depression']) {
        const p = E.generate(type, 3);
        assert.match(textOf(E.diagram(p, { guided: true }).svg), /adjacent|opposite|hypotenuse/);
        assert.doesNotMatch(textOf(E.diagram(p, { guided: false }).svg), /adjacent|opposite|hypotenuse|\b(sin|cos|tan)\b/i);
    }
});
check('page shows the diagram: unknowns while answering, answers after success or the worked solution', () => {
    const { page, el } = pageWith(bearingCase());
    assert.match(text(el('diagram-container')), /<svg[\s\S]*\?/);
    el('inp1').value = '152'; el('inp2').value = '90'; page.verifyAnswer();
    assert.match(text(el('diagram-container')), /\?/, 'a wrong attempt does not reveal the answers');
    page.showSolution();
    assert.match(text(el('diagram-container')), /≈ 88 mi/);
    const second = pageWith(bearingCase());
    second.el('inp1').value = '152'; second.el('inp2').value = '88'; second.page.verifyAnswer();
    assert.match(text(second.el('diagram-container')), /≈ 152 mi/);
    second.page.endGame();
    assert.equal(text(second.el('diagram-container')), '');
});
check('diagram styles exist with readable label colors', () => {
    for (const sel of ['.dg-label', '.dg-unknown', '.dg-answer']) {
        const m = rule(sel).match(/fill\s*:\s*(#[0-9a-fA-F]{6})/);
        assert.ok(m, `${sel} needs a fill`);
        assert.ok(contrast(m[1], '#ffffff') >= 4.5, `${sel}: ${contrast(m[1], '#ffffff').toFixed(2)}:1`);
    }
    for (const sel of ['.dg-path', '.dg-component', '.dg-return', '.dg-axis', '.dg-angle']) {
        const m = rule(sel).match(/stroke\s*:\s*(#[0-9a-fA-F]{6})/);
        assert.ok(m, `${sel} needs a stroke`);
        assert.ok(contrast(m[1], '#ffffff') >= 3, `${sel}: ${contrast(m[1], '#ffffff').toFixed(2)}:1`);
    }
});

// --- SH-008: guided completion vs independent readiness evidence ---
check('checkpoint config: 12 questions (3 per skill), 10/12 overall and 2/3 per skill by default; teacher-adjustable and bounded', () => {
    assert.deepEqual(plain(E.checkpointConfig({})), { perSkill: 3, total: 12, totalTarget: 10, perSkillTarget: 2 });
    assert.deepEqual(plain(E.checkpointConfig({ cp_per: '2', cp_target: '7', cp_skill: '1' })), { perSkill: 2, total: 8, totalTarget: 7, perSkillTarget: 1 });
    assert.deepEqual(plain(E.checkpointConfig({ cp_per: '4' })), { perSkill: 4, total: 16, totalTarget: 14, perSkillTarget: 3 });
    for (const bad of [{ cp_per: '0' }, { cp_per: '9' }, { cp_per: 'x' }, { cp_target: '13' }, { cp_skill: '4' }, { cp_target: '-1' }]) {
        assert.deepEqual(plain(E.checkpointConfig(bad)), { perSkill: 3, total: 12, totalTarget: 10, perSkillTarget: 2 }, JSON.stringify(bad));
    }
});
check('checkpoint questions: every skill equally, mixed order, fresh distinct seeds, reproducible from the checkpoint seed', () => {
    const orders = new Set();
    for (let seed = 0; seed < 300; seed++) {
        const q = plain(E.buildCheckpoint(seed, 3));
        assert.equal(q.length, 12);
        for (const t of SKILLS) assert.equal(q.filter((x) => x.type === t).length, 3, `seed ${seed}: 3 ${t}`);
        assert.equal(new Set(q.map((x) => x.seed)).size, 12, 'distinct problem seeds');
        assert.deepEqual(q, plain(E.buildCheckpoint(seed, 3)));
        orders.add(q.map((x) => x.type[0]).join(''));
    }
    assert.ok(orders.size > 200, `orders vary (${orders.size} distinct)`);
});
const rec = (type, firstTry, extra = {}) => ({ type, code: `${type}-1`, firstTry, assisted: !firstTry, solved: true, attempts: firstTry ? 1 : 2, ...extra });
const cfg = () => E.checkpointConfig({}); // lazy, so a missing engine API fails one check, not the suite
check('summary: target needs 10/12 first-attempt AND 2/3 in every skill; assisted work is counted separately', () => {
    const all = SKILLS.flatMap((t) => [rec(t, true), rec(t, true), rec(t, true)]);
    let s = E.summarizeCheckpoint(all, cfg());
    assert.equal(s.firstTry, 12); assert.equal(s.met, true); assert.deepEqual(plain(s.skillsNeedingReview), []);
    // 10/12 overall but one skill at 1/3: not met.
    const uneven = [...all]; uneven[0] = rec('elevation', false); uneven[1] = rec('elevation', false);
    s = E.summarizeCheckpoint(uneven, cfg());
    assert.equal(s.firstTry, 10); assert.equal(s.met, false); assert.deepEqual(plain(s.skillsNeedingReview), ['elevation']);
    assert.equal(s.assisted, 2); assert.equal(s.perSkill.elevation.firstTry, 1);
    // 9/12 spread out (each skill >= 2/3): not met on the overall target.
    const spread = [...all]; spread[0] = rec('elevation', false); spread[3] = rec('bearing', false); spread[6] = rec('depression', false);
    s = E.summarizeCheckpoint(spread, cfg());
    assert.equal(s.firstTry, 9); assert.equal(s.met, false); assert.deepEqual(plain(s.skillsNeedingReview), []);
    assert.deepEqual(plain(s.skillsWithMisses), ['elevation', 'bearing', 'depression']);
    // An incomplete checkpoint never meets the target.
    assert.equal(E.summarizeCheckpoint(all.slice(0, 11), cfg()).met, false);
    // Unsolved questions count as misses and are reported.
    s = E.summarizeCheckpoint([...all.slice(1), rec('elevation', false, { solved: false })], cfg());
    assert.equal(s.solved, 11); assert.equal(s.firstTry, 11);
});
check('follow-up queue: one fresh problem per missed checkpoint question, never reusing a checkpoint problem', () => {
    const records = [rec('bearing', false, { seed: 5 }), rec('bearing', true, { seed: 6 }), rec('return', false, { seed: 7 }), rec('bearing', false, { seed: 8 })];
    const q = plain(E.followUpQueue(records, 99));
    assert.deepEqual(q.map((x) => x.type), ['bearing', 'return', 'bearing']);
    assert.ok(q.every((x) => ![5, 6, 7, 8].includes(x.seed)));
    assert.deepEqual(q, plain(E.followUpQueue(records, 99)));
    assert.deepEqual(plain(E.followUpQueue(records.filter((r) => r.firstTry), 1)), []);
});

// Page flow helpers.
function cpPage(search = '') {
    const elements = {};
    const el = (id) => (elements[id] ||= {
        id, value: '', style: {}, innerHTML: '', innerText: '', className: '', attrs: {},
        setAttribute(k, v) { this.attrs[k] = v; }, removeAttribute(k) { delete this.attrs[k]; }, focus() { elements.__focused = id; },
    });
    const context = { Math, document: { getElementById: el }, console, location: { search }, URLSearchParams };
    vm.createContext(context);
    vm.runInContext(script + ';this.page={startCheckpoint,nextQuestion,practiceMissed,initGame,continueFlight,endGame,verifyAnswer,showSolution,' +
        'get checkpoint(){return checkpoint},get guidedRecords(){return guidedRecords},get data(){return currentData},get attempt(){return attemptState}};', context);
    return { page: context.page, el, elements };
}
const answer = ({ page, el }, right) => {
    page.data.fields.forEach((f) => {
        el(f.id).value = right ? String(f.answer)
            : f.kind === 'bearing' ? `${f.ns} ${Math.min(89, f.angle + 7)} ${f.ew}` : String(f.answer + 7);
    });
    page.verifyAnswer();
};
check('checkpoint questions are independent: no formula hint, no side-name cues, mixed skills, and a numbered title', () => {
    const ctx = cpPage();
    ctx.page.startCheckpoint();
    assert.equal(ctx.page.checkpoint.queue.length, 12);
    assert.doesNotMatch(text(ctx.el('modal-text')), /math-hint|Hint:/);
    assert.doesNotMatch(text(ctx.el('diagram-container')), />[^<]*\((adjacent|opposite|hypotenuse)\)/);
    assert.match(text(ctx.el('modal-title')), /Checkpoint question 1 of 12/);
    assert.match(ctx.el('progress-text').innerText, /Independent checkpoint: question 1 of 12/);
    assert.equal(ctx.el('progress-bar-bg').attrs['aria-valuemax'], '12');
});
check('all twelve right on the first attempt meets the target and says what that means', () => {
    const ctx = cpPage();
    ctx.page.startCheckpoint();
    for (let i = 0; i < 12; i++) { answer(ctx, true); assert.match(text(ctx.el('btn-container')), i < 11 ? /Next Question/ : /See Results/); ctx.page.nextQuestion(); }
    const t = text(ctx.el('modal-text'));
    assert.match(text(ctx.el('modal-title')), /Checkpoint Results/);
    assert.match(t, /12 of 12/); assert.match(t, /Readiness target met/);
    assert.match(t, /practice target, not a prediction/i);
    assert.match(t, /first try, without hints/i);
    assert.doesNotMatch(t, /master/i);
    assert.doesNotMatch(text(ctx.el('btn-container')), /Practice Missed/);
});
check('misses: retries and hints are assisted, never first-attempt; target not met; skill flagged for review', () => {
    const ctx = cpPage();
    ctx.page.startCheckpoint();
    const firstType = ctx.page.checkpoint.queue[0].type;
    let missed = 0;
    for (let i = 0; i < 12; i++) {
        const type = ctx.page.data.type;
        if (type === firstType) {
            answer(ctx, false); missed++;
            assert.match(text(ctx.el('btn-container')), /Next Question/, 'can move on after a miss');
            if (missed === 1) { answer(ctx, true); } else if (missed === 2) { ctx.page.showSolution(); }
        } else answer(ctx, true);
        ctx.page.nextQuestion();
    }
    const recs = ctx.page.checkpoint.records;
    assert.equal(recs.length, 12);
    const mine = recs.filter((r) => r.type === firstType);
    assert.deepEqual(plain(mine.map((r) => [r.firstTry, r.assisted, r.solved])), [[false, true, true], [false, true, false], [false, true, false]]);
    const t = text(ctx.el('modal-text'));
    assert.match(t, /9 of 12/); assert.match(t, /not met/i);
    assert.match(t, /needs review/i);
    assert.match(t, /3 assisted|assisted: 3|3 questions? (were|was) assisted/i);
});
check('follow-up practice uses fresh problems and does not rewrite the checkpoint record', () => {
    const ctx = cpPage();
    ctx.page.startCheckpoint();
    for (let i = 0; i < 12; i++) { answer(ctx, i % 4 !== 0); ctx.page.nextQuestion(); }
    const before = JSON.stringify(ctx.page.checkpoint.records), firstTry = ctx.page.checkpoint.records.filter((r) => r.firstTry).length;
    assert.match(text(ctx.el('btn-container')), /Practice Missed Skills/);
    ctx.page.practiceMissed();
    const q = ctx.page.checkpoint.followQueue;
    assert.equal(q.length, 12 - firstTry);
    assert.match(text(ctx.el('modal-title')), new RegExp(`Follow-up question 1 of ${q.length}`));
    const used = new Set(ctx.page.checkpoint.queue.map((x) => x.seed));
    assert.ok(q.every((x) => !used.has(x.seed)), 'fresh problems');
    assert.match(text(ctx.el('modal-text')), /Hint:/, 'follow-ups are guided practice');
    for (let i = 0; i < q.length; i++) { answer(ctx, true); ctx.page.nextQuestion(); }
    assert.equal(JSON.stringify(ctx.page.checkpoint.records), before, 'checkpoint history unchanged');
    const t = text(ctx.el('modal-text'));
    assert.match(t, new RegExp(`${firstTry} of 12`));
    assert.match(t, /Follow-up practice/); assert.match(t, /do(es)? not change/i);
});
check('teacher settings in the URL change the checkpoint length and targets', () => {
    const ctx = cpPage('?cp_per=2&cp_target=7&cp_skill=1');
    ctx.page.startCheckpoint();
    assert.equal(ctx.page.checkpoint.queue.length, 8);
    for (let i = 0; i < 8; i++) { answer(ctx, true); ctx.page.nextQuestion(); }
    assert.match(text(ctx.el('modal-text')), /7 of 8/);
});
check('guided flight completion reports what was completed and points to the checkpoint, without claiming mastery', () => {
    const ctx = cpPage();
    ctx.page.initGame();
    for (let i = 0; i < 4; i++) { answer(ctx, i !== 1); if (i === 1) answer(ctx, true); ctx.page.continueFlight(); }
    const t = String(ctx.el('modal-text').innerHTML || ctx.el('modal-text').innerText);
    assert.match(text(ctx.el('modal-title')), /Flight Complete/i);
    assert.doesNotMatch(t, /master/i);
    assert.match(t, /3 of 4 stages on the first attempt/);
    assert.match(t, /not a readiness check/i);
    assert.match(text(ctx.el('btn-container')), /Independent Checkpoint/);
    assert.deepEqual(plain(ctx.page.guidedRecords.map((r) => r.firstTry)), [true, false, true, true]);
});
check('welcome screen offers both guided flight and the independent checkpoint', () => {
    assert.match(html, /onclick="initGame\(\)">Start Guided Flight</);
    assert.match(html, /onclick="startCheckpoint\(\)">Independent Checkpoint</);
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
