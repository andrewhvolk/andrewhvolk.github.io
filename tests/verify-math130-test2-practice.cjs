#!/usr/bin/env node
// Checks the Test 2 skills module: every generator, many seeds, against the
// rules the real test follows. Run: node tests/verify-math130-test2-practice.cjs
'use strict';
const assert = require('assert');
const path = require('path');
const fs = require('fs');
const S = require(path.join(__dirname, '..', 'assets', 'js', 'math130-test2-skills.js'));

const TRIALS = 3000;
let checked = 0;

// The test's layout: 15 questions, 200 points, four pages covering every question once.
assert.strictEqual(S.TEST2.length, 15);
assert.strictEqual(S.TEST2.reduce((a, q) => a + q.points, 0), 200);
assert.deepStrictEqual(S.PAGES.flat(), Array.from({ length: 15 }, (_, i) => i + 1));

const close = (a, b, tol = 1e-9) => Math.abs(a - b) <= tol;
const ans = (q, i) => q.fields[i].answer;

for (let seed = 1; seed <= TRIALS; seed++) {
    const test = S.buildTest(seed);
    assert.deepStrictEqual(S.buildTest(seed).map(q => q.q), test.map(q => q.q), 'same seed, same paper');
    const ids = new Set();
    test.forEach(q => {
        assert.ok(q.q && q.solution && q.key && q.hint, `Q${q.n} text missing (seed ${seed})`);
        assert.ok(Array.isArray(q.fields) && q.fields.length, `Q${q.n} has no fields`);
        q.fields.forEach(f => {
            assert.ok(Number.isFinite(f.answer), `Q${q.n} ${f.id} answer not finite (seed ${seed})`);
            assert.ok(!ids.has(f.id), `duplicate field id ${f.id}`);
            ids.add(f.id);
        });
        if (q.svg) {
            assert.ok(!/NaN|undefined|Infinity/.test(q.svg), `Q${q.n} figure has a bad number (seed ${seed})`);
            assert.ok(q.svgAltText, `Q${q.n} figure has no alt text`);
        }
        assert.ok(!/NaN|undefined|Infinity/.test(q.q + q.solution + q.key), `Q${q.n} text has a bad number (seed ${seed}): ${q.q}`);
        checked++;
    });

    const [q1, q2, q3, q4, q5, q6, q7, q8, q9, q10, q11, q12, q13, q14, q15] = test;
    // 1-2: the stated n matches the period word, money answers are positive.
    const n = Number(q1.q.match(/\(\$n = (\d+)\$\)/)[1]);
    assert.ok({ 12: /monthly/, 4: /quarterly/, 2: /semiannually/ }[n].test(q1.q));
    assert.ok(ans(q1, 0) > 0 && ans(q2, 0) > 0);
    // 3: b^(p/q) = x is exact; the value is a fraction with a short decimal (halves or quarters).
    const [b3, x3, y3] = q3.fields.map(f => f.answer);
    assert.ok(Number.isInteger(x3) && close(Math.pow(b3, y3), x3, 1e-6), `Q3 not exact: ${q3.q}`);
    assert.ok(close(y3 * 4, Math.round(y3 * 4)) && !Number.isInteger(y3));
    // 4: b^v = x is exact, v a half-integer.
    const [b4, v4, x4] = q4.fields.map(f => f.answer);
    assert.ok(close(Math.pow(b4, v4), x4, 1e-6) && close(v4 % 1, 0.5));
    // 5: x = e^c to four places.
    const c5 = Number(q5.q.match(/\\ln x = ([\d.]+)/)[1]);
    assert.ok(close(ans(q5, 0), Number(Math.exp(c5).toFixed(4))));
    // 6: x = ln c / ln b, not a whole number, between 1.2 and 3.5; change of base printed.
    const [, b6, c6] = q6.q.match(/\$(\d)\^\{x\} = (\d+)\$/).map(Number);
    const x6 = Math.log(c6) / Math.log(b6);
    assert.ok(close(ans(q6, 0), Number(x6.toFixed(4))) && x6 > 1.15 && x6 < 3.55 && Math.abs(x6 - Math.round(x6)) >= 0.02);
    assert.ok(/Change of base/.test(q6.display));
    // 7: substituting x gives the angle(s); supplementary pairs add to 180.
    const x7 = ans(q7, 0);
    const exprs = [...q7.q.matchAll(/\$\((\d+)x ([+-]) (\d+)\)\^\\circ\$/g)].map(m => Number(m[1]) * x7 + (m[2] === '+' ? 1 : -1) * Number(m[3]));
    assert.strictEqual(exprs.length, 2, `Q7 expressions not found: ${q7.q}`);
    if (/same-side/.test(q7.q)) assert.ok(close(exprs[0] + exprs[1], 180) && close(ans(q7, 1), exprs[0]) && close(ans(q7, 2), exprs[1]));
    else assert.ok(close(exprs[0], exprs[1]) && close(ans(q7, 1), exprs[0]));
    assert.ok(exprs.every(a => a > 0 && a < 180));
    // 8: angle from the triangle sum; side from the proportion, a whole number.
    const given = [...q8.q.matchAll(/\\angle [ABC] = (\d+)\^\\circ/g)].map(m => Number(m[1]));
    assert.ok(close(ans(q8, 0), 180 - given[0] - given[1]) && ans(q8, 0) > 0);
    assert.ok(Number.isInteger(ans(q8, 1)), `Q8 side not whole: ${q8.key}`);
    // 9: area from the bases and height only; the slanted side is longer than the height.
    const m9 = q9.q.match(/parallel sides ([\d.]+) \w+ and ([\d.]+) \w+, slanted side (\d+) \w+ and height (\d+)/);
    const [b1, b2, s9, h9] = m9.slice(1).map(Number);
    assert.ok(close(ans(q9, 0), (b1 + b2) * h9 / 2) && s9 > h9 && b2 > b1);
    // 10: Heron area is a whole number.
    assert.ok(Number.isInteger(ans(q10, 0)) && ans(q10, 0) > 0, `Q10 area not whole: ${q10.key}`);
    // 11: DMS reconverts to the decimal within one second.
    const deg = Number(q11.q.match(/\$([\d.]+)\^\\circ\$/)[1]);
    const [d, mm, ss] = q11.fields.map(f => f.answer);
    assert.ok(mm >= 0 && mm < 60 && ss >= 0 && ss < 60 && Math.abs(d + mm / 60 + ss / 3600 - deg) <= 0.5 / 3600 + 1e-9);
    // 12: D + M/60 + S/3600.
    const [, D, M, Sx] = q12.q.match(/\$(\d+)\^\\circ\\,(\d+)'\\,(\d+)''\$/).map(Number);
    assert.ok(close(ans(q12, 0), Number((D + M / 60 + Sx / 3600).toFixed(4))));
    // 13: inscribed = central / 2, a whole number; s = r * theta.
    const [, r13, cen] = q13.q.match(/radius (\d+) \w+\. Central angle \$AOC\$ measures \$(\d+)\^\\circ\$/).map(Number);
    assert.ok(Number.isInteger(ans(q13, 0)) && close(ans(q13, 0), cen / 2) && close(ans(q13, 1), r13 * cen * Math.PI / 180));
    // 14-15.
    assert.ok(ans(q14, 0) > 0 && ans(q15, 0) > 0);
}

// The practice page loads the module and builds from it.
const page = fs.readFileSync(path.join(__dirname, '..', '130Test2Practice.html'), 'utf8');
assert.ok(page.includes('assets/js/math130-test2-skills.js'), 'practice page does not load the skills module');
const review = fs.readFileSync(path.join(__dirname, '..', '130Test2.html'), 'utf8');
assert.ok(review.includes('assets/js/math130-test2-skills.js'), 'review page does not load the skills module');
// The practice test is unlisted: shared by URL only, never linked or indexed.
assert.ok(!review.includes('130Test2Practice'), 'review page links the unlisted practice test');
assert.ok(page.includes('noindex'), 'practice page is missing noindex');

console.log(`OK: ${TRIALS} practice tests, ${checked} questions checked.`);
