#!/usr/bin/env node
'use strict';
// Regenerate only the built-in skills copy; all implementation lives in assets/js.
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const library = fs.readFileSync(path.join(root, 'assets/js/math130-test3-skills.js'), 'utf8').replaceAll('\r\n', '\n');
const file = path.join(root, '130Test3.html');
const html = fs.readFileSync(file, 'utf8').replaceAll('\r\n', '\n');
const start = html.indexOf('    // Keep the built-in copy');
const end = html.indexOf('    let currentQuiz', start);
if (start < 0 || end < 0) throw Error('Cannot locate the built-in skills copy.');
const body = library.slice(library.indexOf("    'use strict';"), library.indexOf('    if (typeof module'));
fs.writeFileSync(file, html.slice(0, start) + '    // Keep the built-in copy synchronized with the shared file for offline use.\n    const test3Skills = window.Math130Test3Skills || (() => {\n' + body + '    return api;\n    })();\n    const generators = test3Skills.generators;\n\n' + html.slice(end));
