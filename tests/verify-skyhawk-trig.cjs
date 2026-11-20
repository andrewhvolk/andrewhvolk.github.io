#!/usr/bin/env node
'use strict';
// node tests/verify-skyhawk-trig.cjs
// Regression checks for SkyhawkTrig.html rounding and grading (tracker SH-001).
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.resolve(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'SkyhawkTrig.html'), 'utf8');
const script = html.slice(html.lastIndexOf('<script>') + 8, html.lastIndexOf('</script>'));

function mulberry32(a) {
    return function () {
        a |= 0; a = (a + 0x6D2B79F5) | 0;
        let t = Math.imul(a ^ (a >>> 15), 1 | a);
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}

function load(seed) {
    const elements = {};
    const document = { getElementById: (id) => (elements[id] ||= { id, value: '', style: {}, innerHTML: '', innerText: '' }) };
    const context = { Math: Object.assign(Object.create(Math), { random: mulberry32(seed) }), document, console };
    vm.createContext(context);
    vm.runInContext(script + ';this.api={generateDataForStage,verifyAnswer,stageDefinitions,get data(){return currentData},set data(v){currentData=v}};', context);
    return { api: context.api, elements };
}

const stage = (api, type) => api.stageDefinitions.find((d) => d.type === type);
const results = [];
function check(name, fn) {
    try { fn(); results.push(['PASS', name]); } catch (e) { results.push(['FAIL', name, e.message]); }
}

// Fixed-parameter generation: feed the generator a Math.random that yields the given picks.
function generateWith(type, picks) {
    const src = script.replace(/const randomInt = [^\n]+\n/, 'const randomInt = () => __picks.shift();\n')
        .replace(/const randomFloat = [^\n]+\n/, 'const randomFloat = () => String(__picks.shift());\n');
    const context = { Math, document: { getElementById: () => ({ style: {} }) }, __picks: [...picks] };
    vm.createContext(context);
    vm.runInContext(src + ';this.api={generateDataForStage,stageDefinitions,get data(){return currentData}};', context);
    context.api.generateDataForStage(stage(context.api, type));
    return context.api.data;
}

// Exact known-answer cases (cannot be fooled by a shared floating-point mistake).
// bearing picks: speed, time, angle
check('bearing 125 mph, 1.4 h, S 30 W -> 152 S, 88 W (87.5 exactly)', () => {
    const d = generateWith('bearing', [125, 1.4, 30]);
    assert.equal(d.ans1, 152); assert.equal(d.ans2, 88);
});
check('bearing 105 mph, 1.0 h, S 60 W -> 52.5 S rounds to 53', () => {
    const d = generateWith('bearing', [105, 1.0, 60]);
    assert.equal(d.ans1, 53); assert.equal(d.ans2, 91);
});
check('worked solution preserves the side of a rounding boundary', () => {
    const d = generateWith('bearing', [105, 2.4, 25]);
    assert.equal(d.ans2, 106);
    assert.match(d.solutionText, /106\.4998 &rarr; <b>106 miles/);
    assert.doesNotMatch(d.solutionText, /106\.500 &rarr;/);
    const half = generateWith('bearing', [125, 1.4, 30]);
    assert.match(half.solutionText, /87\.500 &rarr; <b>88 miles/);
});
check('bearing 107 mph, 1.5 h, S 30 W -> 80.25 W rounds to 80', () => {
    const d = generateWith('bearing', [107, 1.5, 30]);
    assert.equal(d.ans2, 80);
});
check('bearing 109 mph, 2.5 h, S 30 W -> 136.25 W rounds to 136', () => {
    assert.equal(generateWith('bearing', [109, 2.5, 30]).ans2, 136);
});
check('bearing 111 mph, 1.5 h, S 30 W -> 83.25 -> 83; 115 mph 1.3 h -> 74.75 -> 75', () => {
    assert.equal(generateWith('bearing', [111, 1.5, 30]).ans2, 83);
    assert.equal(generateWith('bearing', [115, 1.3, 30]).ans2, 75);
});
// return picks: speed, timeN, timeW. 3-4-5 triangles give exact distances.
check('return 120 mph, 0.8 h N, 0.6 h W -> 120 miles exactly, S 37 E', () => {
    const d = generateWith('return', [120, 0.8, 0.6]);
    assert.equal(d.ans1, 120); assert.equal(d.ans2, 37);
});
check('return 105 mph, 1.0 h N, 1.0 h W -> S 45 E exactly', () => {
    const d = generateWith('return', [105, 1.0, 1.0]);
    assert.equal(d.ans2, 45); assert.equal(d.ans1, 148);
});
// depression picks: speed, angle, minutes. 90 mph for 5 min = 7.5 miles flown.
check('depression 90 mph, 5 deg, 5 min -> 0.654 -> 0.7', () => {
    assert.equal(generateWith('depression', [90, 5, 5]).ans, 0.7);
});
// elevation picks: angle, speed, alt.
check('elevation 6 deg, 80 mph, 1.0 mi -> 7.17 min -> 7', () => {
    assert.equal(generateWith('elevation', [6, 80, 1.0]).ans, 7);
});

// Generated cases: each answer must be the correctly rounded true value.
// Values within 1e-6 of a halfway point are validated by the exact cases above.
const TRIALS = 10000;
const rad = (d) => d * Math.PI / 180;
function assertRounded(value, ans, unit, label) {
    assert.ok(Number.isFinite(ans), `${label}: nonfinite answer`);
    const scaled = value / unit, frac = scaled - Math.floor(scaled);
    assert.ok(Math.abs(ans - value) <= unit / 2 + 1e-9, `${label}: ${ans} is not within half a unit of ${value}`);
    if (Math.abs(frac - 0.5) > 1e-6) assert.ok(Math.abs(ans - Math.round(scaled) * unit) < 1e-9, `${label}: expected ${Math.round(scaled) * unit}, got ${ans}`);
    else assert.ok(Math.abs(ans - Math.ceil(scaled - 1e-6) * unit) < 1e-9, `${label}: half should round up, got ${ans} for ${value}`);
    const decimals = unit < 1 ? 1 : 0;
    assert.equal(ans, Number(ans.toFixed(decimals)), `${label}: precision`);
}
for (const type of ['elevation', 'bearing', 'depression', 'return']) {
    check(`${TRIALS} seeded ${type} cases are correctly rounded`, () => {
        const { api } = load(7130 + type.length);
        const def = stage(api, type);
        for (let i = 0; i < TRIALS; i++) {
            api.generateDataForStage(def);
            const d = api.data, label = `${type} #${i} ${JSON.stringify(d, (k, v) => (k === 'solutionText' ? undefined : v))}`;
            if (type === 'elevation') {
                assertRounded(d.alt / (d.speed * Math.sin(rad(d.angle))) * 60, d.ans, 1, label);
            } else if (type === 'bearing') {
                const dist = d.speed * d.time;
                assertRounded(dist * Math.cos(rad(d.angle)), d.ans1, 1, label);
                assertRounded(dist * Math.sin(rad(d.angle)), d.ans2, 1, label);
            } else if (type === 'depression') {
                assertRounded(d.speed * d.timeMins / 60 * Math.sin(rad(d.angle)), d.ans, 0.1, label);
                assert.ok(d.ans > 0, `${label}: altitude loss must be positive`);
            } else {
                const n = d.speed * d.timeN, w = d.speed * d.timeW;
                assertRounded(Math.hypot(n, w), d.ans1, 1, label);
                assertRounded(Math.atan2(w, n) * 180 / Math.PI, d.ans2, 1, label);
            }
            assert.ok(!/\d\.\d{6,}/.test(d.solutionText), `${label}: solution shows unreadable precision`);
            // Check the values students actually see, independently of the formatter.
            const steps = [...d.solutionText.matchAll(/&approx; ([\d.]+) &rarr; <b>([\d.]+)/g)];
            if (type !== 'return') assert.equal(steps.length, type === 'bearing' ? 2 : 1, label);
            for (const [, shown, answer] of steps) {
                const scale = type === 'depression' ? 10 : 1;
                assert.equal(Math.floor(Number(shown) * scale + 0.5) / scale, Number(answer), `${label}: displayed ${shown} must round to ${answer}`);
            }
        }
    });
}

// Grading: equivalent numeric entries match; unrounded entries are rejected.
function grade(type, picks, v1, v2) {
    const { api, elements } = load(1);
    api.data = generateWith(type, picks);
    api.data.type = type;
    elements.inp1 = { value: v1, style: {} };
    elements.inp2 = { value: v2, style: {} };
    api.verifyAnswer();
    return /Correct/.test((elements['modal-title'] || {}).innerHTML || '');
}
check('grading accepts 152/88 and 152/88.0 for the regression case', () => {
    assert.equal(grade('bearing', [125, 1.4, 30], '152', '88'), true);
    assert.equal(grade('bearing', [125, 1.4, 30], '152.0', '88.0'), true);
});
check('grading rejects 87 and unrounded 87.5 for the regression case', () => {
    assert.equal(grade('bearing', [125, 1.4, 30], '152', '87'), false);
    assert.equal(grade('bearing', [125, 1.4, 30], '151.55', '87.5'), false);
});
check('grading accepts 0.7 and 0.70 for depression; rejects unrounded 0.654', () => {
    assert.equal(grade('depression', [90, 5, 5], '0.7'), true);
    assert.equal(grade('depression', [90, 5, 5], '0.70'), true);
    assert.equal(grade('depression', [90, 5, 5], '0.654'), false);
});

let failed = 0;
for (const [status, name, msg] of results) {
    console.log(`${status}  ${name}${msg ? `\n      ${msg.split('\n')[0]}` : ''}`);
    if (status === 'FAIL') failed++;
}
console.log(`\n${results.length - failed}/${results.length} checks passed`);
process.exit(failed ? 1 : 0);
