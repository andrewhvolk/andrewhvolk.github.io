#!/usr/bin/env node
'use strict';

// Dependency-free structural and generator checks for 130Test2.html.
// Run from any directory with: node tests/verify-math130-test2.cjs
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.resolve(__dirname, '..');
const html = fs.readFileSync(path.join(root, '130Test2.html'), 'utf8');

function requireMatch(pattern, label) {
    const match = html.match(pattern);
    assert.ok(match, `Could not find ${label} in 130Test2.html.`);
    return match[0];
}

const generatorSource = requireMatch(/const generatorDefinitions = \[[\s\S]*?\n    \];/, 'generator definitions');
const metadataSource = requireMatch(/const PRACTICE_SECTIONS = \[[\s\S]*?const generators = generatorDefinitions\.map\(gen => \{[\s\S]*?\n    \}\);/, 'generator metadata');
const quizConfigSource = requireMatch(/const QUIZ_CONFIG = \{[\s\S]*?\n    \};/, 'quiz blueprints');
const checklistSource = requireMatch(/const DEFAULT_CHECKLIST = \[[\s\S]*?\n    \];/, 'topic checklist');

const svgOutlinedText = ({ x, y, text }) => `<text x="${x}" y="${y}">${text}</text>`;
const nudgeLabelFromSegments = point => point;
const computeReferenceAngle = theta => {
    const tau = 2 * Math.PI;
    const thetaNorm = ((theta % tau) + tau) % tau;
    const folded = thetaNorm > Math.PI ? tau - thetaNorm : thetaNorm;
    return { thetaNorm, ref: folded > Math.PI / 2 ? Math.PI - folded : folded };
};
const formatReferencePiText = () => null;

const generatorDefinitions = new Function(
    'svgOutlinedText', 'nudgeLabelFromSegments', 'computeReferenceAngle', 'formatReferencePiText',
    `${generatorSource}\nconst generators = generatorDefinitions; return generatorDefinitions;`
)(svgOutlinedText, nudgeLabelFromSegments, computeReferenceAngle, formatReferencePiText);

const metadata = new Function(
    'generatorDefinitions',
    `${metadataSource}\nreturn { sections: PRACTICE_SECTIONS, sectionMap: SECTION_KEY_BY_LABEL, skills: GENERATOR_SKILLS, generators };`
)(generatorDefinitions);
const quizConfig = new Function(`${quizConfigSource}\nreturn QUIZ_CONFIG;`)();
const checklist = new Function(`${checklistSource}\nreturn DEFAULT_CHECKLIST;`)();
const groupsSource = requireMatch(/function getPracticeGroups\(focus = practiceFocus\) \{[\s\S]*?\n    \}/, 'practice focus routing');
const practiceGroups = new Function('generators', 'QUIZ_CONFIG', 'practiceFocus', 'PRACTICE_SECTIONS', `${groupsSource}\nreturn { focused: getPracticeGroups(), all: getPracticeGroups('all') };`)(metadata.generators, quizConfig, 'quiz8', metadata.sections);

assert.equal(new Set(generatorDefinitions.map(gen => gen.id)).size, generatorDefinitions.length, 'Generator IDs must be unique.');
assert.equal(metadata.generators.length, generatorDefinitions.length, 'Every generator must receive routing metadata.');
for (const gen of metadata.generators) {
    assert.ok(metadata.sections.some(section => section.key === gen.sectionKey), `${gen.id} has an unknown section key.`);
    assert.ok(gen.skillTags.length, `${gen.id} has no skill tags.`);
}

const generatorById = new Map(metadata.generators.map(gen => [gen.id, gen]));
for (const item of checklist) {
    if (item.practiceId) assert.ok(generatorById.has(item.practiceId), `${item.id} routes to missing generator ${item.practiceId}.`);
}

function validateQuestion(gen, question) {
    assert.ok(question && typeof question.q === 'string' && question.q.trim(), `${gen.id} did not generate a prompt.`);
    if (question.fields) {
        assert.ok(question.fields.length, `${gen.id} generated an empty field list.`);
        const ids = question.fields.map(field => field.id);
        assert.equal(new Set(ids).size, ids.length, `${gen.id} generated duplicate input IDs.`);
        for (const field of question.fields) {
            assert.ok(field.id, `${gen.id} generated a field without an ID.`);
            assert.ok(Number.isFinite(field.answer), `${gen.id} generated a non-finite field answer.`);
            if (field.integer) assert.ok(Number.isInteger(field.answer), `${gen.id} generated a non-integer answer for an integer field.`);
            if (field.min != null) assert.ok(field.answer >= field.min, `${gen.id} generated an answer below its minimum.`);
            if (field.max != null) assert.ok(field.answer <= field.max, `${gen.id} generated an answer above its maximum.`);
        }
    } else {
        assert.equal(typeof question.a, 'number', `${gen.id} must return a numeric answer or field list.`);
        assert.ok(Number.isFinite(question.a), `${gen.id} generated a non-finite answer.`);
    }
    if (question.svg) {
        assert.ok(question.svgAltText?.trim(), `${gen.id} generated an SVG without accessible text.`);
        assert.equal((question.svg.match(/<svg\b/g) || []).length, (question.svg.match(/<\/svg>/g) || []).length, `${gen.id} generated unbalanced SVG roots.`);
        const roots = question.svg.match(/<svg\b[\s\S]*?<\/svg>/g) || [];
        for (const svg of roots) validateSvgBounds(gen.id, svg);
    }
}

function validateSvgBounds(generatorId, svg) {
    const viewBox = svg.match(/viewBox="([^"]+)"/);
    assert.ok(viewBox, `${generatorId} generated an SVG without a viewBox.`);
    const [minX, minY, width, height] = viewBox[1].trim().split(/\s+/).map(Number);
    assert.ok([minX, minY, width, height].every(Number.isFinite) && width > 0 && height > 0, `${generatorId} generated an invalid viewBox.`);
    const inside = (x, y, label) => {
        assert.ok(x >= minX - 0.5 && x <= minX + width + 0.5 && y >= minY - 0.5 && y <= minY + height + 0.5, `${generatorId} has an out-of-bounds ${label} point (${x}, ${y}).`);
    };
    const attributes = element => Object.fromEntries([...element.matchAll(/([\w-]+)="([^"]+)"/g)].map(match => [match[1], match[2]]));
    for (const line of svg.match(/<line\b[^>]*>/g) || []) {
        const attr = attributes(line);
        if (['x1', 'y1', 'x2', 'y2'].every(key => Number.isFinite(Number(attr[key])))) {
            inside(Number(attr.x1), Number(attr.y1), 'line');
            inside(Number(attr.x2), Number(attr.y2), 'line');
        }
    }
    for (const circle of svg.match(/<circle\b[^>]*>/g) || []) {
        const attr = attributes(circle);
        if (['cx', 'cy', 'r'].every(key => Number.isFinite(Number(attr[key])))) {
            inside(Number(attr.cx) - Number(attr.r), Number(attr.cy), 'circle');
            inside(Number(attr.cx) + Number(attr.r), Number(attr.cy), 'circle');
            inside(Number(attr.cx), Number(attr.cy) - Number(attr.r), 'circle');
            inside(Number(attr.cx), Number(attr.cy) + Number(attr.r), 'circle');
        }
    }
    for (const polygon of svg.match(/<polygon\b[^>]*>/g) || []) {
        const points = attributes(polygon).points;
        if (!points) continue;
        const numbers = points.match(/[+-]?(?:\d+\.?\d*|\.\d+)(?:[eE][+-]?\d+)?/g)?.map(Number) || [];
        for (let index = 0; index + 1 < numbers.length; index += 2) inside(numbers[index], numbers[index + 1], 'polygon');
    }
    for (const text of svg.match(/<text\b[^>]*>/g) || []) {
        const attr = attributes(text);
        if (Number.isFinite(Number(attr.x)) && Number.isFinite(Number(attr.y))) inside(Number(attr.x), Number(attr.y), 'text anchor');
    }
}

for (const gen of generatorDefinitions) {
    for (let sample = 0; sample < 100; sample++) validateQuestion(gen, gen.generate());
}

function verifyBlueprint(quizNum, expectedCount, expectedPoints) {
    const config = quizConfig[quizNum];
    assert.ok(config?.blueprint, `Quiz ${quizNum} needs an explicit blueprint.`);
    assert.equal(config.blueprint.length, expectedCount, `Quiz ${quizNum} has the wrong prompt count.`);
    const totalPoints = config.blueprint.reduce((sum, entry) => sum + (typeof entry === 'string' ? 1 : (entry.points ?? 1)), 0);
    assert.equal(totalPoints, expectedPoints, `Quiz ${quizNum} has the wrong point total.`);
    for (const entry of config.blueprint) {
        const id = typeof entry === 'string' ? entry : entry.id;
        const gen = generatorById.get(id);
        assert.ok(gen, `Quiz ${quizNum} references missing generator ${id}.`);
        validateQuestion(gen, gen.generate(typeof entry === 'string' ? undefined : entry.variant));
    }
    return config.blueprint.map(entry => typeof entry === 'string' ? entry : entry.id);
}

assert.deepEqual(verifyBlueprint(7, 8, 100), [
    'quiz7_similar_multi', 'quiz7_parallel_multi', 'basic_areas', 'basic_areas',
    'right_triangle_area', 'herons', 'dms', 'dms_to_dec'
]);
assert.deepEqual(verifyBlueprint(8, 8, 105), [
    'quiz8_arc_multi', 'quiz8_central_multi', 'quiz8_inscribed_multi', 'rad_deg',
    'quiz8_sector_multi', 'dms', 'dms_to_dec', 'quiz8_speed_multi'
]);
assert.deepEqual(practiceGroups.focused.flatMap(group => group.generators.map(gen => gen.id)), quizConfig[8].blueprint.map(entry => entry.id), 'The default individual drills must cover all eight Quiz 8 prompts in order.');
assert.equal(practiceGroups.all.flatMap(group => group.generators).length, generatorDefinitions.length, 'The broader Test 2 practice must remain available.');
assert.equal(checklist.find(item => item.id === 'geo_18b').practiceId, 'quiz8_central_multi');
assert.equal(checklist.find(item => item.id === 'geo_18c').practiceId, 'quiz8_inscribed_multi');
assert.equal(quizConfig[7].blueprint.find(entry => entry.id === 'dms_to_dec').variant, 'integer-seconds', 'Quiz 7 must retain its integer-second format.');

function near(actual, expected, label) {
    assert.ok(Math.abs(actual - expected) < 1e-8, `${label}: expected ${expected}, received ${actual}.`);
}
function generate(id, variant) {
    const gen = generatorById.get(id);
    return gen.generate(variant);
}
for (let sample = 0; sample < 40; sample++) {
    const similar = generate('quiz7_similar_multi');
    const angleP = Number(similar.q.match(/angle P = (\d+)/)?.[1]);
    const angleR = Number(similar.q.match(/angle R = (\d+)/)?.[1]);
    const mn = Number(similar.q.match(/MN = ([\d.]+)/)?.[1]);
    const qr = Number(similar.q.match(/QR = ([\d.]+)/)?.[1]);
    const rs = Number(similar.q.match(/RS = ([\d.]+)/)?.[1]);
    const mp = Number(similar.q.match(/MP = ([\d.]+)/)?.[1]);
    near(similar.fields[0].answer, 180 - angleP - angleR, 'Quiz 7 similar-triangle angle Q');
    near(similar.fields[1].answer, angleR, 'Quiz 7 similar-triangle angle N');
    near(similar.fields[2].answer, Number((rs * mn / qr).toFixed(1)), 'Quiz 7 similar-triangle side NP');
    near(similar.fields[3].answer, Number((mp * qr / mn).toFixed(1)), 'Quiz 7 similar-triangle side QS');

    const parallel = generate('quiz7_parallel_multi');
    const angle4 = Number(parallel.q.match(/angle 4 = (\d+)/)?.[1]);
    const angle6 = Number(parallel.q.match(/angle 6 = (\d+)/)?.[1]);
    assert.deepEqual(parallel.fields.map(field => field.answer), [180 - angle6, angle6, 180 - angle4 - angle6, angle4]);

    const rightTriangle = generate('right_triangle_area');
    const base = Number(rightTriangle.svg.match(/base = ([\d.]+)/)?.[1]);
    const hypotenuse = Number(rightTriangle.svg.match(/hypotenuse = ([\d.]+)/)?.[1]);
    near(rightTriangle.a, 0.5 * base * Math.sqrt(hypotenuse ** 2 - base ** 2), 'Quiz 7 right-triangle area');

    const heron = generate('herons');
    const sides = heron.q.match(/side lengths ([\d.]+), ([\d.]+), and ([\d.]+)/)?.slice(1).map(Number);
    assert.ok(sides, 'Heron generator should disclose all three side lengths.');
    const [a, b, c] = sides;
    const semiperimeter = (a + b + c) / 2;
    near(heron.a, Math.sqrt(semiperimeter * (semiperimeter - a) * (semiperimeter - b) * (semiperimeter - c)), 'Heron area');

    const arc = generate('quiz8_arc_multi');
    const arcGiven = arc.q.match(/when \$r=([\d.]+)\$ and \$\\theta=([\d.]+)\$ radians/);
    const inverseArcGiven = arc.q.match(/arc length \$s=([\d.]+)\$ and \$\\theta=(\d+)\^\\circ/);
    near(arc.fields[0].answer, Number(arcGiven[1]) * Number(arcGiven[2]), 'Quiz 8 forward arc length');
    near(arc.fields[1].answer, Number(inverseArcGiven[1]) / (Number(inverseArcGiven[2]) * Math.PI / 180), 'Quiz 8 inverse arc radius');

    const central = generate('quiz8_central_multi');
    const centralMeasure = Number(central.q.match(/ACD=(\d+)\^\\circ/)?.[1]);
    near(central.fields[0].answer, centralMeasure / 2, 'Quiz 8 inscribed angle');
    near(central.fields[1].answer, centralMeasure, 'Quiz 8 intercepted arc');

    const inscribed = generate('quiz8_inscribed_multi');
    const arcAB = Number(inscribed.q.match(/AB}=(\d+)\^\\circ/)?.[1]);
    const angleABC = Number(inscribed.q.match(/ABC=(\d+)\^\\circ/)?.[1]);
    const arcBC = 360 - arcAB - 2 * angleABC;
    assert.ok(arcBC < 180, 'Quiz 8 two-letter arc BC must always be a minor arc.');
    near(inscribed.fields[0].answer, arcBC / 2, 'Quiz 8 inscribed angle from arc BC');
    near(inscribed.fields[1].answer, arcBC, 'Quiz 8 arc addition');
    const highlightedArcs = [...inscribed.svg.matchAll(/<path d="M([\d.-]+),([\d.-]+) A78,78 0 0,(\d) ([\d.-]+),([\d.-]+)"/g)];
    assert.equal(highlightedArcs.length, 2, 'The inscribed triangle should highlight its two minor arcs.');
    highlightedArcs.forEach(arc => assert.equal(arc[3], '0', 'Increasing mathematical angles require counterclockwise SVG arcs.'));

    const sector = generate('quiz8_sector_multi');
    const sectorGiven = sector.q.match(/when \$r=([\d.]+)\$ and \$\\theta=([\d.]+)\$ radians/);
    const inverseSectorGiven = sector.q.match(/A=([\d.]+)\$ and \$r=([\d.]+)/);
    near(sector.fields[0].answer, 0.5 * Number(sectorGiven[1]) ** 2 * Number(sectorGiven[2]), 'Quiz 8 sector area');
    const inverseRadians = 2 * Number(inverseSectorGiven[1]) / Number(inverseSectorGiven[2]) ** 2;
    near(sector.fields[1].answer, inverseRadians, 'Quiz 8 inverse sector angle in radians');
    near(sector.fields[2].answer, inverseRadians * 180 / Math.PI, 'Quiz 8 inverse sector angle in degrees');

    const speed = generate('quiz8_speed_multi');
    const speedGiven = speed.q.match(/diameter (\d+) ft rotates at (\d+) rpm/);
    near(speed.fields[0].answer, Number(speedGiven[2]) * 6, 'Quiz 8 angular speed');
    near(speed.fields[1].answer, Math.PI * Number(speedGiven[1]) * Number(speedGiven[2]) / 60, 'Quiz 8 linear speed');
}

const originalRandom = Math.random;
try {
    for (const degrees of [12.016666, 12.999999, 169.999999]) {
        Math.random = () => (degrees - 10) / 160;
        const question = generate('dms');
        const totalSeconds = Math.round(degrees * 3600);
        assert.deepEqual(question.fields.map(field => field.answer), [Math.floor(totalSeconds / 3600), Math.floor(totalSeconds / 60) % 60, totalSeconds % 60], 'DMS rounding must carry seconds and minutes correctly.');
    }
    Math.random = () => 0.91;
    const majorSector = generate('quiz8_sector_multi');
    assert.ok(majorSector.fields[1].answer > Math.PI, 'Inverse-sector practice must include major sectors.');
    assert.ok(Math.abs(Number(majorSector.fields[1].answer.toFixed(2)) * 180 / Math.PI - majorSector.fields[2].answer) > 0.005, 'This regression case must expose premature rounding before conversion.');
    assert.match(majorSector.solution, /unrounded/);
} finally {
    Math.random = originalRandom;
}

for (let sample = 0; sample < 200; sample++) {
    const radians = generate('rad_deg');
    const degrees = Number(radians.q.match(/Convert \$([\d.]+)\^\\circ/)?.[1]);
    assert.ok(Number.isFinite(degrees), 'The default radians drill must start with degrees.');
    assert.match(radians.q, /3 decimal places/);
    near(radians.a, degrees * Math.PI / 180, 'Default degree-to-radian drill');
    assert.equal(radians.tol, 0.0005);

    const decimal = generate('dms_to_dec');
    const dms = decimal.q.match(/\$(\d+)\^\\circ\\, (\d+)'\\, ([\d.]+)''/);
    assert.ok(dms, 'DMS prompt must disclose degrees, minutes, and fractional seconds.');
    near(decimal.a, Number(dms[1]) + Number(dms[2]) / 60 + Number(dms[3]) / 3600, 'Default DMS-to-decimal drill');
    assert.equal(decimal.tol, 0.00005);

    const speed = generate('speed');
    assert.equal(speed.fields.length, 2, 'The general speed drill must cover both Quiz 8 answers.');
    assert.match(speed.q, /degrees per second/);
    assert.match(speed.q, /feet per second/);
    assert.doesNotMatch(speed.q, /inches per minute|radians per minute/);
    assert.match(speed.solution, /r=.*\/2=/, 'Worked speed solutions must show diameter-to-radius conversion.');

    const angles = generate('inscribed_angle');
    assert.equal(angles.fields.length, 2);
    assert.ok(['quiz8_central_multi', 'quiz8_inscribed_multi'].includes(angles.inputType), 'The general angle drill must use one of the two planned quiz models.');
}
for (const variant of ['arc-length', 'inverse-arc-length', 'sector-area', 'inverse-sector-area']) {
    for (let sample = 0; sample < 100; sample++) {
        const question = generate('circles', variant);
        validateQuestion(generatorById.get('circles'), question);
        assert.match(question.q, /two decimal places/);
        if (variant === 'inverse-sector-area') {
            const values = question.q.match(/A=([\d.]+).*r=([\d.]+)/);
            const theta = 2 * Number(values[1]) / Number(values[2]) ** 2;
            near(question.fields[0].answer, theta, 'Visual inverse-sector radians');
            near(question.fields[1].answer, theta * 180 / Math.PI, 'Visual inverse-sector degrees');
        } else {
            const radius = Number(question.q.match(/r=([\d.]+)/)?.[1]);
            const theta = Number(question.q.match(/theta=([\d.]+)/)?.[1]);
            const expected = variant === 'inverse-arc-length'
                ? Number(question.q.match(/s=([\d.]+)/)[1]) / (theta * Math.PI / 180)
                : variant === 'arc-length' ? radius * theta : 0.5 * radius * radius * theta;
            near(question.a, expected, `Visual ${variant}`);
        }
    }
}
assert.match(generate('rad_deg', 'decimal-radians-to-degrees').q, /radians to degrees/);

const examStart = html.indexOf('function startMockExam() {');
const examEnd = html.indexOf('if (selected.some(selection => !selection))', examStart);
assert.ok(examStart >= 0 && examEnd > examStart, 'Could not find the cumulative Test 2 selection.');
const cumulativeSelection = html.slice(examStart, examEnd);
assert.equal((cumulativeSelection.match(/makeExamSelection\(/g) || []).length, 20, 'The cumulative exam must select 20 prompts.');
assert.equal((cumulativeSelection.match(/'Section 4\.2'/g) || []).length, 3, 'The cumulative exam must include 3 Section 4.2 prompts.');
assert.equal((cumulativeSelection.match(/'Section 4\.3'/g) || []).length, 3, 'The cumulative exam must include 3 Section 4.3 prompts.');
assert.equal((cumulativeSelection.match(/'Geometry'/g) || []).length, 14, 'The cumulative exam must include 14 geometry prompts.');

// Exercise the real field grader with a small DOM stub to guard partial credit,
// DMS bounds, and the first-try hint behavior without loading the whole page.
const strictNumberSource = html.slice(html.indexOf('function parseStrictNumber(rawValue)'), html.indexOf('function showInvalidNumberFeedback'));
const invalidFeedbackSource = html.slice(html.indexOf('function showInvalidNumberFeedback(message'), html.indexOf('function checkAnswer()'));
const graderStart = html.indexOf('function checkAnswer()');
const graderEnd = html.indexOf('// --- MOCK EXAM MODE ---', graderStart);
assert.ok(strictNumberSource && invalidFeedbackSource && graderStart >= 0 && graderEnd > graderStart, 'Could not find the field grader.');
const graderSource = html.slice(graderStart, graderEnd).trim();

function runGrader(question, values, isExam) {
    const inputs = new Map(Object.entries(values).map(([id, value]) => [id, {
        value: String(value), disabled: false,
        classList: { names: new Set(), remove(...names) { names.forEach(name => this.names.delete(name)); }, add(name) { this.names.add(name); } }
    }]));
    const elements = new Map();
    const document = {
        getElementById(id) {
            if (inputs.has(id)) return inputs.get(id);
            if (!elements.has(id)) elements.set(id, { style: {}, focus() {}, className: '', innerHTML: '', textContent: '' });
            return elements.get(id);
        },
        querySelectorAll() { return [...inputs.values()]; }
    };
    const selection = { generator: { section: 'Test' }, examSection: 'Quiz 7', points: question.points ?? 1 };
    const sandbox = {
        document, Date, Math, currentQuestion: question, currentQuiz: { label: 'test' }, currentRetries: 0,
        examState: { isActive: isExam, currentIndex: 0, currentSelection: selection, questions: [selection], results: {}, score: 0, total: 1, totalPoints: selection.points },
        state: { history: [] }, saveState() {}, refreshIcons() {}, renderMath() {}
    };
    vm.createContext(sandbox);
    vm.runInContext(`${strictNumberSource}\n${invalidFeedbackSource}\n${graderSource}\ncheckAnswer();`, sandbox);
    return { score: sandbox.examState.score, results: sandbox.examState.results, retries: sandbox.currentRetries, feedback: elements.get('feedback-display')?.innerHTML || '' };
}

const partial = runGrader({
    inputType: 'multi', points: 10,
    fields: [{ id: 'a', answer: 4, tolerance: 0.01 }, { id: 'b', answer: 8, tolerance: 0.01 }],
    solution: 'worked solution', hint: 'review the ratio'
}, { a: 4, b: 0 }, true);
assert.equal(partial.score, 5, 'A correct half of a two-part response should earn half credit.');
assert.match(partial.feedback, /Partially correct/);

const firstTry = runGrader({
    inputType: 'multi',
    fields: [{ id: 'a', answer: 4 }, { id: 'b', answer: 8 }],
    solution: 'worked solution', hint: 'review the ratio'
}, { a: 4, b: 0 }, false);
assert.match(firstTry.feedback, /Hint:/);
assert.doesNotMatch(firstTry.feedback, /worked solution/);
assert.match(firstTry.feedback, /1 of 2 parts/);

const invalidDms = runGrader({
    inputType: 'dms', points: 10,
    fields: [
        { id: 'd', answer: 12, integer: true, min: 0, max: 359 },
        { id: 'm', answer: 20, integer: true, min: 0, max: 59 },
        { id: 's', answer: 30, integer: true, min: 0, max: 59 }
    ],
    solution: 'DMS solution', hint: 'DMS hint'
}, { d: 12, m: 60, s: 30 }, true);
assert.match(invalidDms.feedback, /degrees must be a whole number from 0 to 359; minutes and seconds must be whole numbers from 0 to 59/);
assert.ok(invalidDms.results['Quiz 7'].earned < 10, 'Out-of-range DMS minutes must not receive credit.');

const sectorCredit = generate('quiz8_sector_multi');
sectorCredit.points = 20;
const onlyArea = Object.fromEntries(sectorCredit.fields.map((field, index) => [field.id, index === 0 ? Number(field.answer.toFixed(2)) : -1]));
assert.equal(runGrader(sectorCredit, onlyArea, true).score, 10, 'The forward sector problem should earn half of the question credit.');
const onlyDegrees = Object.fromEntries(sectorCredit.fields.map((field, index) => [field.id, index === 2 ? Number(field.answer.toFixed(2)) : -1]));
assert.equal(runGrader(sectorCredit, onlyDegrees, true).score, 5, 'The two inverse-sector outputs share the other half of the question credit.');

for (let sample = 0; sample < 100; sample++) {
    let earned = 0;
    for (const entry of quizConfig[8].blueprint) {
        const question = generate(entry.id, entry.variant);
        question.points = entry.points;
        const values = question.fields
            ? Object.fromEntries(question.fields.map(field => [field.id, field.integer ? field.answer : Number(field.answer.toFixed(entry.id === 'dms' ? 0 : 2))]))
            : { 'answer-input': Number(question.a.toFixed(entry.id === 'rad_deg' ? 3 : 4)) };
        const result = runGrader(question, values, true);
        assert.equal(result.score, entry.points, `${entry.id}: correctly rounded answers must receive full credit.`);
        earned += result.score;
    }
    assert.equal(earned, 105, 'A fully correct Quiz 8 checkpoint must earn 105/105.');
}

process.stdout.write(`Math 130 Test 2 checks passed: ${generatorDefinitions.length} generators × 100 samples; Quiz 8 default drills and 4 visual variants; 100 fully graded Quiz 8 checkpoints; Quiz 7/8 blueprints; cumulative split; DMS carries, major sectors, diagram arcs, weighted partial credit, and practice hints.\n`);
