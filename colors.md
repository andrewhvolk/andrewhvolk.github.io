# Color Inventory (Tokenized vs Literal)

_Generated: 2026-03-26 17:20 UTC_

## Summary
- Files scanned (`*.css`, `*.html`, `*.js`): **65**
- Unique literal colors: **332**
- Unique color tokens referenced (`var(--*)`): **160**
- Unique color token definitions (`--*: ...` with color-like values): **142**

## Literal colors by file

| File | Unique literal colors | Values |
|---|---:|---|
| `130Test1.html` | 12 | #000<br>#ccc<br>#ddd<br>#ff0000<br>#fff<br>blue<br>currentcolor<br>green<br>highlight<br>red<br>transparent<br>white |
| `130Test2.html` | 15 | canvas<br>green<br>highlight<br>red<br>rgba(0,29,23,0.07)<br>rgba(0,29,23,0.09)<br>rgba(0,29,23,0.1)<br>rgba(126,168,255,0.08)<br>rgba(225,227,224,0.46)<br>rgba(255,255,255,0.025)<br>rgba(26,86,219,0.02)<br>rgba(26,86,219,0.08)<br>rgba(58,102,92,0.12)<br>transparent<br>white |
| `130Test3.html` | 27 | #0f172a<br>#22c55e<br>#334155<br>#38bdf8<br>#94a3b8<br>#e2e8f0<br>#fbbf24<br>#ff4d4d<br>black<br>green<br>highlight<br>red<br>rgba(0,0,0,0.08)<br>rgba(0,0,0,0.1)<br>rgba(0,0,0,0.12)<br>rgba(0,0,0,0.18)<br>rgba(108,99,255,0.02)<br>rgba(108,99,255,0.08)<br>rgba(108,99,255,0.14)<br>rgba(108,99,255,0.45)<br>rgba(15,23,42,0.04)<br>rgba(255,255,255,0.02)<br>rgba(255,255,255,0.025)<br>rgba(255,255,255,0.03)<br>rgba(91,82,224,0.10)<br>transparent<br>white |
| `130Test4.html` | 5 | green<br>highlight<br>purple<br>red<br>white |
| `Taskflow.html` | 1 | transparent |
| `Unit3Practice.html` | 4 | #2980b9<br>#2c3e50<br>#bdc3c7<br>#d35400 |
| `chessboard.html` | 18 | #333<br>#3b82f6<br>#4b5563<br>#ccc<br>#d1d5db<br>#f3f4f6<br>#f97316<br>#fb923c<br>blue<br>gray<br>green<br>highlight<br>orange<br>rgba(0,0,0,0.3)<br>rgba(50,50,50,0.8)<br>rgba(59,130,246,0.5)<br>transparent<br>white |
| `courses/103LUOAssignmentGuide.html` | 28 | #2A6041<br>#2C2825<br>#2F4D70<br>#3D5A80<br>#5677A4<br>#7A7570<br>#7B6518<br>#9B5B2D<br>#ccc<br>#E2DFD8<br>#EAF0F6<br>#EDF5F0<br>#F4F8FF<br>#F9A825<br>#FAF9F6<br>#FDF5ED<br>#fff<br>#FFF8E1<br>#FFFFFF<br>canvas<br>red<br>rgba(0,0,0,0.04)<br>rgba(155,91,45,0.2)<br>rgba(255,255,255,0.03)<br>rgba(42,96,65,0.2)<br>rgba(61,90,128,0.35)<br>transparent<br>white |
| `courses/114-module1-summary.html` | 6 | #666<br>#d9e2ec<br>#fff<br>canvas<br>red<br>rgba(15,23,42,0.08) |
| `courses/basic-statistical-measures.html` | 30 | #1abc9c<br>#2980b9<br>#2b7338<br>#2c3e50<br>#2ecc71<br>#333<br>#3498db<br>#555<br>#7f8c8d<br>#9b59b6<br>#ddd<br>#e67e22<br>#e74c3c<br>#eaf2f8<br>#eaf7fd<br>#ecf0f1<br>#eee<br>#f0f7ff<br>#f2f2f2<br>#f39c12<br>#f5f5f5<br>#f5f7fa<br>#f8f9fa<br>#f9f9f9<br>#fff<br>rgba(0,0,0,0.05)<br>rgba(0,0,0,0.1)<br>rgba(231,76,60,0.1)<br>rgba(46,204,113,0.1)<br>rgba(52,152,219,0.2) |
| `courses/electrical-circuits-lab-data-sheet.html` | 2 | black<br>red |
| `courses/electrical-circuits-lab-manual.html` | 1 | black |
| `courses/engi220.html` | 2 | canvas<br>transparent |
| `courses/final-exam-review-guide.html` | 4 | #e5e7eb<br>#f3f4f6<br>blue<br>gray |
| `courses/knowledgegrowth.html` | 11 | blue<br>gray<br>green<br>lime<br>orange<br>pink<br>purple<br>red<br>teal<br>white<br>yellow |
| `courses/lab6-krules.html` | 2 | black<br>gray |
| `courses/math100.html` | 1 | canvas |
| `courses/math105.html` | 1 | canvas |
| `courses/math110.html` | 1 | canvas |
| `courses/math114-foundations.html` | 1 | canvas |
| `courses/math114.html` | 1 | canvas |
| `courses/math114Spring26Links.html` | 6 | canvas<br>rgba(15,23,42,.05)<br>rgba(255,255,255,.25)<br>rgba(255,255,255,.92)<br>rgba(30,58,138,.18)<br>white |
| `courses/math121.html` | 1 | canvas |
| `courses/phys103.html` | 1 | canvas |
| `courses/physics-labs.html` | 1 | canvas |
| `courses/physlab1.html` | 1 | canvas |
| `courses/physlab2.html` | 1 | canvas |
| `courses/test3-formulas.html` | 6 | #000<br>#003366<br>#333<br>#f2f2f2<br>#f3f3f3<br>#ffffff |
| `courses/test4-formulas.html` | 13 | #000<br>#ccc<br>#d1d5db<br>#e0e0e0<br>#e5e7eb<br>#f0f0f0<br>#f3f4f6<br>blue<br>gray<br>green<br>purple<br>teal<br>white |
| `employeepay.html` | 8 | blue<br>canvas<br>gray<br>red<br>rgb(255,99,132)<br>rgb(54,162,235)<br>rgba(255,99,132,0.5)<br>rgba(54,162,235,0.5) |
| `growth.html` | 10 | blue<br>gray<br>green<br>lime<br>orange<br>pink<br>purple<br>red<br>teal<br>yellow |
| `projects/NormalDistributionGame.html` | 25 | #000<br>#2980b9<br>#2c3e50<br>#2ecc71<br>#333<br>#3498db<br>#7f8c8d<br>#9b59b6<br>#d5f5e3<br>#ddd<br>#e67e22<br>#e74c3c<br>#e8f4f8<br>#e8f8f5<br>#f0f8ff<br>#f1c40f<br>#f2f2f2<br>#f39c12<br>#f5f5f5<br>#f9f9f9<br>#fffacd<br>canvas<br>highlight<br>rgba(0,0,0,0.8)<br>white |
| `projects/PHYS103LUO/KinematicsShortAnswer.html` | 37 | #229954<br>#263238<br>#27ae60<br>#2c3e50<br>#333<br>#34495e<br>#3498db<br>#4ECDC4<br>#4fc3f7<br>#64b5f6<br>#667eea<br>#764ba2<br>#7f8c8d<br>#81c784<br>#ba68c8<br>#ccc<br>#ddd<br>#e1f5fe<br>#e3f2fd<br>#e74c3c<br>#e8f5e9<br>#ecf0f1<br>#f06292<br>#f2f2f2<br>#f39c12<br>#f3e5f5<br>#f4f4f4<br>#f5f5f5<br>#f9f9f9<br>#fce4ec<br>#FF6B6B<br>#fff3cd<br>rgba(0,0,0,0.1)<br>rgba(0,0,0,0.3)<br>rgba(255,255,255,0.9)<br>white<br>yellow |
| `projects/PrayerAppV1/index.html` | 12 | #1f2937<br>#4b5563<br>#6b7280<br>blue<br>currentcolor<br>gray<br>green<br>purple<br>red<br>transparent<br>white<br>yellow |
| `projects/QuestionSpinner/questionspinner.html` | 27 | #1e90ff<br>#32cd32<br>#333<br>#4682b4<br>#555<br>#6aadda<br>#87cefa<br>#888<br>#9400d3<br>#a1c4fd<br>#c2e9fb<br>#ff4500<br>#ff69b4<br>#ff85c1<br>#ffd700<br>#ffe680<br>#fff<br>#ffffffdd<br>black<br>blue<br>gray<br>green<br>purple<br>red<br>rgba(0,0,0,0.1)<br>white<br>yellow |
| `projects/ResearchMentorship/MathJournals.html` | 5 | green<br>orange<br>red<br>transparent<br>white |
| `styles.css` | 178 | #001d17<br>#002720<br>#00342b<br>#059669<br>#0d1210<br>#0f4a3e<br>#111614<br>#111827<br>#16211d<br>#18201d<br>#1A56DB<br>#1f2724<br>#202825<br>#21483e<br>#252e2b<br>#27312e<br>#2b3531<br>#34d399<br>#3a665c<br>#3d4a44<br>#3e271f<br>#5e6b66<br>#7ea8ff<br>#8bb1a8<br>#bac4bf<br>#c0c8c4<br>#cbd5e1<br>#cc0000<br>#d0ad97<br>#d97706<br>#dc2626<br>#dce6e0<br>#e1e3e0<br>#e9f1ed<br>#ebeeea<br>#f2f4f1<br>#f2f5f2<br>#f59e0b<br>#f87171<br>#f8faf7<br>#ff0000<br>#fff<br>#ffffff<br>black<br>blue<br>canvas<br>canvastext<br>currentcolor<br>green<br>highlight<br>red<br>rgba(0,0,0,0.06)<br>rgba(0,0,0,0.10)<br>rgba(0,0,0,0.18)<br>rgba(0,29,23,0.04)<br>rgba(0,29,23,0.05)<br>rgba(0,29,23,0.06)<br>rgba(0,29,23,0.08)<br>rgba(0,29,23,0.96)<br>rgba(0,29,23,0.97)<br>rgba(0,52,43,0.92)<br>rgba(126,168,255,0.03)<br>rgba(126,168,255,0.1)<br>rgba(126,168,255,0.12)<br>rgba(126,168,255,0.16)<br>rgba(126,168,255,0.2)<br>rgba(126,168,255,0.25)<br>rgba(126,168,255,0.3)<br>rgba(13,80,213,0.02)<br>rgba(13,80,213,0.06)<br>rgba(13,80,213,0.08)<br>rgba(13,80,213,0.1)<br>rgba(13,80,213,0.12)<br>rgba(13,80,213,0.14)<br>rgba(13,80,213,0.16)<br>rgba(17,22,20,0)<br>rgba(17,22,20,0.66)<br>rgba(17,22,20,0.82)<br>rgba(17,22,20,0.9)<br>rgba(17,22,20,0.94)<br>rgba(17,22,20,0.98)<br>rgba(192,200,196,0.15)<br>rgba(192,200,196,0.18)<br>rgba(192,200,196,0.32)<br>rgba(217,119,6,0.08)<br>rgba(22,29,27,0.95)<br>rgba(220,230,224,0.15)<br>rgba(220,230,224,0.18)<br>rgba(220,230,224,0.24)<br>rgba(220,38,38,0.08)<br>rgba(220,38,38,0.18)<br>rgba(220,38,38,0.35)<br>rgba(232,235,231,0.98)<br>rgba(24,32,29,0.88)<br>rgba(24,32,29,0.9)<br>rgba(24,32,29,0.92)<br>rgba(24,32,29,0.96)<br>rgba(24,32,29,0.98)<br>rgba(242,244,241,0.72)<br>rgba(242,244,241,0.78)<br>rgba(242,244,241,0.8)<br>rgba(242,244,241,0.82)<br>rgba(242,244,241,0.88)<br>rgba(242,244,241,0.9)<br>rgba(242,244,241,0.94)<br>rgba(242,244,241,0.96)<br>rgba(245,158,11,0.1)<br>rgba(248,113,113,0.1)<br>rgba(248,113,113,0.2)<br>rgba(248,113,113,0.4)<br>rgba(255,255,255,0)<br>rgba(255,255,255,0.03)<br>rgba(255,255,255,0.04)<br>rgba(255,255,255,0.08)<br>rgba(255,255,255,0.1)<br>rgba(255,255,255,0.12)<br>rgba(255,255,255,0.14)<br>rgba(255,255,255,0.16)<br>rgba(255,255,255,0.18)<br>rgba(255,255,255,0.2)<br>rgba(255,255,255,0.22)<br>rgba(255,255,255,0.35)<br>rgba(255,255,255,0.45)<br>rgba(255,255,255,0.6)<br>rgba(255,255,255,0.66)<br>rgba(255,255,255,0.68)<br>rgba(255,255,255,0.7)<br>rgba(255,255,255,0.72)<br>rgba(255,255,255,0.78)<br>rgba(255,255,255,0.82)<br>rgba(255,255,255,0.85)<br>rgba(255,255,255,0.86)<br>rgba(255,255,255,0.88)<br>rgba(255,255,255,0.9)<br>rgba(255,255,255,0.92)<br>rgba(255,255,255,0.94)<br>rgba(255,255,255,0.96)<br>rgba(255,255,255,0.98)<br>rgba(26,86,219,0.08)<br>rgba(26,86,219,0.14)<br>rgba(26,86,219,0.2)<br>rgba(31,39,36,0.78)<br>rgba(31,39,36,0.85)<br>rgba(31,39,36,0.92)<br>rgba(31,39,36,0.96)<br>rgba(33,72,62,0.88)<br>rgba(33,72,62,0.9)<br>rgba(37,46,43,0.18)<br>rgba(37,46,43,0.3)<br>rgba(43,53,49,0.4)<br>rgba(43,53,49,0.82)<br>rgba(43,53,49,0.94)<br>rgba(49,60,56,0.88)<br>rgba(49,60,56,0.9)<br>rgba(5,150,105,0.05)<br>rgba(5,150,105,0.08)<br>rgba(5,150,105,0.2)<br>rgba(5,150,105,0.3)<br>rgba(5,150,105,0.4)<br>rgba(52,211,153,0.04)<br>rgba(52,211,153,0.1)<br>rgba(52,211,153,0.2)<br>rgba(52,211,153,0.25)<br>rgba(52,211,153,0.3)<br>rgba(52,211,153,0.4)<br>rgba(58,102,92,0.03)<br>rgba(58,102,92,0.035)<br>rgba(58,102,92,0.04)<br>rgba(58,102,92,0.06)<br>rgba(58,102,92,0.08)<br>rgba(58,102,92,0.1)<br>rgba(58,102,92,0.12)<br>rgba(58,102,92,0.16)<br>rgba(58,102,92,0.2)<br>rgba(94,107,102,0.18)<br>rgba(94,107,102,0.36)<br>transparent<br>white |

## Literal color index (value -> files)

| Literal color | Files |
|---|---|
| `#000` | `130Test1.html`<br>`courses/test3-formulas.html`<br>`courses/test4-formulas.html`<br>`projects/NormalDistributionGame.html` |
| `#001d17` | `styles.css` |
| `#002720` | `styles.css` |
| `#003366` | `courses/test3-formulas.html` |
| `#00342b` | `styles.css` |
| `#059669` | `styles.css` |
| `#0d1210` | `styles.css` |
| `#0f172a` | `130Test3.html` |
| `#0f4a3e` | `styles.css` |
| `#111614` | `styles.css` |
| `#111827` | `styles.css` |
| `#16211d` | `styles.css` |
| `#18201d` | `styles.css` |
| `#1A56DB` | `styles.css` |
| `#1abc9c` | `courses/basic-statistical-measures.html` |
| `#1e90ff` | `projects/QuestionSpinner/questionspinner.html` |
| `#1f2724` | `styles.css` |
| `#1f2937` | `projects/PrayerAppV1/index.html` |
| `#202825` | `styles.css` |
| `#21483e` | `styles.css` |
| `#229954` | `projects/PHYS103LUO/KinematicsShortAnswer.html` |
| `#22c55e` | `130Test3.html` |
| `#252e2b` | `styles.css` |
| `#263238` | `projects/PHYS103LUO/KinematicsShortAnswer.html` |
| `#27312e` | `styles.css` |
| `#27ae60` | `projects/PHYS103LUO/KinematicsShortAnswer.html` |
| `#2980b9` | `Unit3Practice.html`<br>`courses/basic-statistical-measures.html`<br>`projects/NormalDistributionGame.html` |
| `#2A6041` | `courses/103LUOAssignmentGuide.html` |
| `#2b3531` | `styles.css` |
| `#2b7338` | `courses/basic-statistical-measures.html` |
| `#2C2825` | `courses/103LUOAssignmentGuide.html` |
| `#2c3e50` | `Unit3Practice.html`<br>`courses/basic-statistical-measures.html`<br>`projects/NormalDistributionGame.html`<br>`projects/PHYS103LUO/KinematicsShortAnswer.html` |
| `#2ecc71` | `courses/basic-statistical-measures.html`<br>`projects/NormalDistributionGame.html` |
| `#2F4D70` | `courses/103LUOAssignmentGuide.html` |
| `#32cd32` | `projects/QuestionSpinner/questionspinner.html` |
| `#333` | `chessboard.html`<br>`courses/basic-statistical-measures.html`<br>`courses/test3-formulas.html`<br>`projects/NormalDistributionGame.html`<br>`projects/PHYS103LUO/KinematicsShortAnswer.html`<br>`projects/QuestionSpinner/questionspinner.html` |
| `#334155` | `130Test3.html` |
| `#34495e` | `projects/PHYS103LUO/KinematicsShortAnswer.html` |
| `#3498db` | `courses/basic-statistical-measures.html`<br>`projects/NormalDistributionGame.html`<br>`projects/PHYS103LUO/KinematicsShortAnswer.html` |
| `#34d399` | `styles.css` |
| `#38bdf8` | `130Test3.html` |
| `#3a665c` | `styles.css` |
| `#3b82f6` | `chessboard.html` |
| `#3d4a44` | `styles.css` |
| `#3D5A80` | `courses/103LUOAssignmentGuide.html` |
| `#3e271f` | `styles.css` |
| `#4682b4` | `projects/QuestionSpinner/questionspinner.html` |
| `#4b5563` | `chessboard.html`<br>`projects/PrayerAppV1/index.html` |
| `#4ECDC4` | `projects/PHYS103LUO/KinematicsShortAnswer.html` |
| `#4fc3f7` | `projects/PHYS103LUO/KinematicsShortAnswer.html` |
| `#555` | `courses/basic-statistical-measures.html`<br>`projects/QuestionSpinner/questionspinner.html` |
| `#5677A4` | `courses/103LUOAssignmentGuide.html` |
| `#5e6b66` | `styles.css` |
| `#64b5f6` | `projects/PHYS103LUO/KinematicsShortAnswer.html` |
| `#666` | `courses/114-module1-summary.html` |
| `#667eea` | `projects/PHYS103LUO/KinematicsShortAnswer.html` |
| `#6aadda` | `projects/QuestionSpinner/questionspinner.html` |
| `#6b7280` | `projects/PrayerAppV1/index.html` |
| `#764ba2` | `projects/PHYS103LUO/KinematicsShortAnswer.html` |
| `#7A7570` | `courses/103LUOAssignmentGuide.html` |
| `#7B6518` | `courses/103LUOAssignmentGuide.html` |
| `#7ea8ff` | `styles.css` |
| `#7f8c8d` | `courses/basic-statistical-measures.html`<br>`projects/NormalDistributionGame.html`<br>`projects/PHYS103LUO/KinematicsShortAnswer.html` |
| `#81c784` | `projects/PHYS103LUO/KinematicsShortAnswer.html` |
| `#87cefa` | `projects/QuestionSpinner/questionspinner.html` |
| `#888` | `projects/QuestionSpinner/questionspinner.html` |
| `#8bb1a8` | `styles.css` |
| `#9400d3` | `projects/QuestionSpinner/questionspinner.html` |
| `#94a3b8` | `130Test3.html` |
| `#9b59b6` | `courses/basic-statistical-measures.html`<br>`projects/NormalDistributionGame.html` |
| `#9B5B2D` | `courses/103LUOAssignmentGuide.html` |
| `#a1c4fd` | `projects/QuestionSpinner/questionspinner.html` |
| `#ba68c8` | `projects/PHYS103LUO/KinematicsShortAnswer.html` |
| `#bac4bf` | `styles.css` |
| `#bdc3c7` | `Unit3Practice.html` |
| `#c0c8c4` | `styles.css` |
| `#c2e9fb` | `projects/QuestionSpinner/questionspinner.html` |
| `#cbd5e1` | `styles.css` |
| `#cc0000` | `styles.css` |
| `#ccc` | `130Test1.html`<br>`chessboard.html`<br>`courses/103LUOAssignmentGuide.html`<br>`courses/test4-formulas.html`<br>`projects/PHYS103LUO/KinematicsShortAnswer.html` |
| `#d0ad97` | `styles.css` |
| `#d1d5db` | `chessboard.html`<br>`courses/test4-formulas.html` |
| `#d35400` | `Unit3Practice.html` |
| `#d5f5e3` | `projects/NormalDistributionGame.html` |
| `#d97706` | `styles.css` |
| `#d9e2ec` | `courses/114-module1-summary.html` |
| `#dc2626` | `styles.css` |
| `#dce6e0` | `styles.css` |
| `#ddd` | `130Test1.html`<br>`courses/basic-statistical-measures.html`<br>`projects/NormalDistributionGame.html`<br>`projects/PHYS103LUO/KinematicsShortAnswer.html` |
| `#e0e0e0` | `courses/test4-formulas.html` |
| `#e1e3e0` | `styles.css` |
| `#e1f5fe` | `projects/PHYS103LUO/KinematicsShortAnswer.html` |
| `#E2DFD8` | `courses/103LUOAssignmentGuide.html` |
| `#e2e8f0` | `130Test3.html` |
| `#e3f2fd` | `projects/PHYS103LUO/KinematicsShortAnswer.html` |
| `#e5e7eb` | `courses/final-exam-review-guide.html`<br>`courses/test4-formulas.html` |
| `#e67e22` | `courses/basic-statistical-measures.html`<br>`projects/NormalDistributionGame.html` |
| `#e74c3c` | `courses/basic-statistical-measures.html`<br>`projects/NormalDistributionGame.html`<br>`projects/PHYS103LUO/KinematicsShortAnswer.html` |
| `#e8f4f8` | `projects/NormalDistributionGame.html` |
| `#e8f5e9` | `projects/PHYS103LUO/KinematicsShortAnswer.html` |
| `#e8f8f5` | `projects/NormalDistributionGame.html` |
| `#e9f1ed` | `styles.css` |
| `#EAF0F6` | `courses/103LUOAssignmentGuide.html` |
| `#eaf2f8` | `courses/basic-statistical-measures.html` |
| `#eaf7fd` | `courses/basic-statistical-measures.html` |
| `#ebeeea` | `styles.css` |
| `#ecf0f1` | `courses/basic-statistical-measures.html`<br>`projects/PHYS103LUO/KinematicsShortAnswer.html` |
| `#EDF5F0` | `courses/103LUOAssignmentGuide.html` |
| `#eee` | `courses/basic-statistical-measures.html` |
| `#f06292` | `projects/PHYS103LUO/KinematicsShortAnswer.html` |
| `#f0f0f0` | `courses/test4-formulas.html` |
| `#f0f7ff` | `courses/basic-statistical-measures.html` |
| `#f0f8ff` | `projects/NormalDistributionGame.html` |
| `#f1c40f` | `projects/NormalDistributionGame.html` |
| `#f2f2f2` | `courses/basic-statistical-measures.html`<br>`courses/test3-formulas.html`<br>`projects/NormalDistributionGame.html`<br>`projects/PHYS103LUO/KinematicsShortAnswer.html` |
| `#f2f4f1` | `styles.css` |
| `#f2f5f2` | `styles.css` |
| `#f39c12` | `courses/basic-statistical-measures.html`<br>`projects/NormalDistributionGame.html`<br>`projects/PHYS103LUO/KinematicsShortAnswer.html` |
| `#f3e5f5` | `projects/PHYS103LUO/KinematicsShortAnswer.html` |
| `#f3f3f3` | `courses/test3-formulas.html` |
| `#f3f4f6` | `chessboard.html`<br>`courses/final-exam-review-guide.html`<br>`courses/test4-formulas.html` |
| `#f4f4f4` | `projects/PHYS103LUO/KinematicsShortAnswer.html` |
| `#F4F8FF` | `courses/103LUOAssignmentGuide.html` |
| `#f59e0b` | `styles.css` |
| `#f5f5f5` | `courses/basic-statistical-measures.html`<br>`projects/NormalDistributionGame.html`<br>`projects/PHYS103LUO/KinematicsShortAnswer.html` |
| `#f5f7fa` | `courses/basic-statistical-measures.html` |
| `#f87171` | `styles.css` |
| `#f8f9fa` | `courses/basic-statistical-measures.html` |
| `#f8faf7` | `styles.css` |
| `#f97316` | `chessboard.html` |
| `#F9A825` | `courses/103LUOAssignmentGuide.html` |
| `#f9f9f9` | `courses/basic-statistical-measures.html`<br>`projects/NormalDistributionGame.html`<br>`projects/PHYS103LUO/KinematicsShortAnswer.html` |
| `#FAF9F6` | `courses/103LUOAssignmentGuide.html` |
| `#fb923c` | `chessboard.html` |
| `#fbbf24` | `130Test3.html` |
| `#fce4ec` | `projects/PHYS103LUO/KinematicsShortAnswer.html` |
| `#FDF5ED` | `courses/103LUOAssignmentGuide.html` |
| `#ff0000` | `130Test1.html`<br>`styles.css` |
| `#ff4500` | `projects/QuestionSpinner/questionspinner.html` |
| `#ff4d4d` | `130Test3.html` |
| `#ff69b4` | `projects/QuestionSpinner/questionspinner.html` |
| `#FF6B6B` | `projects/PHYS103LUO/KinematicsShortAnswer.html` |
| `#ff85c1` | `projects/QuestionSpinner/questionspinner.html` |
| `#ffd700` | `projects/QuestionSpinner/questionspinner.html` |
| `#ffe680` | `projects/QuestionSpinner/questionspinner.html` |
| `#fff` | `130Test1.html`<br>`courses/103LUOAssignmentGuide.html`<br>`courses/114-module1-summary.html`<br>`courses/basic-statistical-measures.html`<br>`projects/QuestionSpinner/questionspinner.html`<br>`styles.css` |
| `#fff3cd` | `projects/PHYS103LUO/KinematicsShortAnswer.html` |
| `#FFF8E1` | `courses/103LUOAssignmentGuide.html` |
| `#fffacd` | `projects/NormalDistributionGame.html` |
| `#ffffff` | `courses/test3-formulas.html`<br>`styles.css` |
| `#FFFFFF` | `courses/103LUOAssignmentGuide.html` |
| `#ffffffdd` | `projects/QuestionSpinner/questionspinner.html` |
| `black` | `130Test3.html`<br>`courses/electrical-circuits-lab-data-sheet.html`<br>`courses/electrical-circuits-lab-manual.html`<br>`courses/lab6-krules.html`<br>`projects/QuestionSpinner/questionspinner.html`<br>`styles.css` |
| `blue` | `130Test1.html`<br>`chessboard.html`<br>`courses/final-exam-review-guide.html`<br>`courses/knowledgegrowth.html`<br>`courses/test4-formulas.html`<br>`employeepay.html`<br>`growth.html`<br>`projects/PrayerAppV1/index.html`<br>`projects/QuestionSpinner/questionspinner.html`<br>`styles.css` |
| `canvas` | `130Test2.html`<br>`courses/103LUOAssignmentGuide.html`<br>`courses/114-module1-summary.html`<br>`courses/engi220.html`<br>`courses/math100.html`<br>`courses/math105.html`<br>`courses/math110.html`<br>`courses/math114-foundations.html`<br>`courses/math114.html`<br>`courses/math114Spring26Links.html`<br>`courses/math121.html`<br>`courses/phys103.html`<br>`courses/physics-labs.html`<br>`courses/physlab1.html`<br>`courses/physlab2.html`<br>`employeepay.html`<br>`projects/NormalDistributionGame.html`<br>`styles.css` |
| `canvastext` | `styles.css` |
| `currentcolor` | `130Test1.html`<br>`projects/PrayerAppV1/index.html`<br>`styles.css` |
| `gray` | `chessboard.html`<br>`courses/final-exam-review-guide.html`<br>`courses/knowledgegrowth.html`<br>`courses/lab6-krules.html`<br>`courses/test4-formulas.html`<br>`employeepay.html`<br>`growth.html`<br>`projects/PrayerAppV1/index.html`<br>`projects/QuestionSpinner/questionspinner.html` |
| `green` | `130Test1.html`<br>`130Test2.html`<br>`130Test3.html`<br>`130Test4.html`<br>`chessboard.html`<br>`courses/knowledgegrowth.html`<br>`courses/test4-formulas.html`<br>`growth.html`<br>`projects/PrayerAppV1/index.html`<br>`projects/QuestionSpinner/questionspinner.html`<br>`projects/ResearchMentorship/MathJournals.html`<br>`styles.css` |
| `highlight` | `130Test1.html`<br>`130Test2.html`<br>`130Test3.html`<br>`130Test4.html`<br>`chessboard.html`<br>`projects/NormalDistributionGame.html`<br>`styles.css` |
| `lime` | `courses/knowledgegrowth.html`<br>`growth.html` |
| `orange` | `chessboard.html`<br>`courses/knowledgegrowth.html`<br>`growth.html`<br>`projects/ResearchMentorship/MathJournals.html` |
| `pink` | `courses/knowledgegrowth.html`<br>`growth.html` |
| `purple` | `130Test4.html`<br>`courses/knowledgegrowth.html`<br>`courses/test4-formulas.html`<br>`growth.html`<br>`projects/PrayerAppV1/index.html`<br>`projects/QuestionSpinner/questionspinner.html` |
| `red` | `130Test1.html`<br>`130Test2.html`<br>`130Test3.html`<br>`130Test4.html`<br>`courses/103LUOAssignmentGuide.html`<br>`courses/114-module1-summary.html`<br>`courses/electrical-circuits-lab-data-sheet.html`<br>`courses/knowledgegrowth.html`<br>`employeepay.html`<br>`growth.html`<br>`projects/PrayerAppV1/index.html`<br>`projects/QuestionSpinner/questionspinner.html`<br>`projects/ResearchMentorship/MathJournals.html`<br>`styles.css` |
| `rgb(255,99,132)` | `employeepay.html` |
| `rgb(54,162,235)` | `employeepay.html` |
| `rgba(0,0,0,0.04)` | `courses/103LUOAssignmentGuide.html` |
| `rgba(0,0,0,0.05)` | `courses/basic-statistical-measures.html` |
| `rgba(0,0,0,0.06)` | `styles.css` |
| `rgba(0,0,0,0.08)` | `130Test3.html` |
| `rgba(0,0,0,0.1)` | `130Test3.html`<br>`courses/basic-statistical-measures.html`<br>`projects/PHYS103LUO/KinematicsShortAnswer.html`<br>`projects/QuestionSpinner/questionspinner.html` |
| `rgba(0,0,0,0.10)` | `styles.css` |
| `rgba(0,0,0,0.12)` | `130Test3.html` |
| `rgba(0,0,0,0.18)` | `130Test3.html`<br>`styles.css` |
| `rgba(0,0,0,0.3)` | `chessboard.html`<br>`projects/PHYS103LUO/KinematicsShortAnswer.html` |
| `rgba(0,0,0,0.8)` | `projects/NormalDistributionGame.html` |
| `rgba(0,29,23,0.04)` | `styles.css` |
| `rgba(0,29,23,0.05)` | `styles.css` |
| `rgba(0,29,23,0.06)` | `styles.css` |
| `rgba(0,29,23,0.07)` | `130Test2.html` |
| `rgba(0,29,23,0.08)` | `styles.css` |
| `rgba(0,29,23,0.09)` | `130Test2.html` |
| `rgba(0,29,23,0.1)` | `130Test2.html` |
| `rgba(0,29,23,0.96)` | `styles.css` |
| `rgba(0,29,23,0.97)` | `styles.css` |
| `rgba(0,52,43,0.92)` | `styles.css` |
| `rgba(108,99,255,0.02)` | `130Test3.html` |
| `rgba(108,99,255,0.08)` | `130Test3.html` |
| `rgba(108,99,255,0.14)` | `130Test3.html` |
| `rgba(108,99,255,0.45)` | `130Test3.html` |
| `rgba(126,168,255,0.03)` | `styles.css` |
| `rgba(126,168,255,0.08)` | `130Test2.html` |
| `rgba(126,168,255,0.1)` | `styles.css` |
| `rgba(126,168,255,0.12)` | `styles.css` |
| `rgba(126,168,255,0.16)` | `styles.css` |
| `rgba(126,168,255,0.2)` | `styles.css` |
| `rgba(126,168,255,0.25)` | `styles.css` |
| `rgba(126,168,255,0.3)` | `styles.css` |
| `rgba(13,80,213,0.02)` | `styles.css` |
| `rgba(13,80,213,0.06)` | `styles.css` |
| `rgba(13,80,213,0.08)` | `styles.css` |
| `rgba(13,80,213,0.1)` | `styles.css` |
| `rgba(13,80,213,0.12)` | `styles.css` |
| `rgba(13,80,213,0.14)` | `styles.css` |
| `rgba(13,80,213,0.16)` | `styles.css` |
| `rgba(15,23,42,.05)` | `courses/math114Spring26Links.html` |
| `rgba(15,23,42,0.04)` | `130Test3.html` |
| `rgba(15,23,42,0.08)` | `courses/114-module1-summary.html` |
| `rgba(155,91,45,0.2)` | `courses/103LUOAssignmentGuide.html` |
| `rgba(17,22,20,0)` | `styles.css` |
| `rgba(17,22,20,0.66)` | `styles.css` |
| `rgba(17,22,20,0.82)` | `styles.css` |
| `rgba(17,22,20,0.9)` | `styles.css` |
| `rgba(17,22,20,0.94)` | `styles.css` |
| `rgba(17,22,20,0.98)` | `styles.css` |
| `rgba(192,200,196,0.15)` | `styles.css` |
| `rgba(192,200,196,0.18)` | `styles.css` |
| `rgba(192,200,196,0.32)` | `styles.css` |
| `rgba(217,119,6,0.08)` | `styles.css` |
| `rgba(22,29,27,0.95)` | `styles.css` |
| `rgba(220,230,224,0.15)` | `styles.css` |
| `rgba(220,230,224,0.18)` | `styles.css` |
| `rgba(220,230,224,0.24)` | `styles.css` |
| `rgba(220,38,38,0.08)` | `styles.css` |
| `rgba(220,38,38,0.18)` | `styles.css` |
| `rgba(220,38,38,0.35)` | `styles.css` |
| `rgba(225,227,224,0.46)` | `130Test2.html` |
| `rgba(231,76,60,0.1)` | `courses/basic-statistical-measures.html` |
| `rgba(232,235,231,0.98)` | `styles.css` |
| `rgba(24,32,29,0.88)` | `styles.css` |
| `rgba(24,32,29,0.9)` | `styles.css` |
| `rgba(24,32,29,0.92)` | `styles.css` |
| `rgba(24,32,29,0.96)` | `styles.css` |
| `rgba(24,32,29,0.98)` | `styles.css` |
| `rgba(242,244,241,0.72)` | `styles.css` |
| `rgba(242,244,241,0.78)` | `styles.css` |
| `rgba(242,244,241,0.8)` | `styles.css` |
| `rgba(242,244,241,0.82)` | `styles.css` |
| `rgba(242,244,241,0.88)` | `styles.css` |
| `rgba(242,244,241,0.9)` | `styles.css` |
| `rgba(242,244,241,0.94)` | `styles.css` |
| `rgba(242,244,241,0.96)` | `styles.css` |
| `rgba(245,158,11,0.1)` | `styles.css` |
| `rgba(248,113,113,0.1)` | `styles.css` |
| `rgba(248,113,113,0.2)` | `styles.css` |
| `rgba(248,113,113,0.4)` | `styles.css` |
| `rgba(255,255,255,.25)` | `courses/math114Spring26Links.html` |
| `rgba(255,255,255,.92)` | `courses/math114Spring26Links.html` |
| `rgba(255,255,255,0)` | `styles.css` |
| `rgba(255,255,255,0.02)` | `130Test3.html` |
| `rgba(255,255,255,0.025)` | `130Test2.html`<br>`130Test3.html` |
| `rgba(255,255,255,0.03)` | `130Test3.html`<br>`courses/103LUOAssignmentGuide.html`<br>`styles.css` |
| `rgba(255,255,255,0.04)` | `styles.css` |
| `rgba(255,255,255,0.08)` | `styles.css` |
| `rgba(255,255,255,0.1)` | `styles.css` |
| `rgba(255,255,255,0.12)` | `styles.css` |
| `rgba(255,255,255,0.14)` | `styles.css` |
| `rgba(255,255,255,0.16)` | `styles.css` |
| `rgba(255,255,255,0.18)` | `styles.css` |
| `rgba(255,255,255,0.2)` | `styles.css` |
| `rgba(255,255,255,0.22)` | `styles.css` |
| `rgba(255,255,255,0.35)` | `styles.css` |
| `rgba(255,255,255,0.45)` | `styles.css` |
| `rgba(255,255,255,0.6)` | `styles.css` |
| `rgba(255,255,255,0.66)` | `styles.css` |
| `rgba(255,255,255,0.68)` | `styles.css` |
| `rgba(255,255,255,0.7)` | `styles.css` |
| `rgba(255,255,255,0.72)` | `styles.css` |
| `rgba(255,255,255,0.78)` | `styles.css` |
| `rgba(255,255,255,0.82)` | `styles.css` |
| `rgba(255,255,255,0.85)` | `styles.css` |
| `rgba(255,255,255,0.86)` | `styles.css` |
| `rgba(255,255,255,0.88)` | `styles.css` |
| `rgba(255,255,255,0.9)` | `projects/PHYS103LUO/KinematicsShortAnswer.html`<br>`styles.css` |
| `rgba(255,255,255,0.92)` | `styles.css` |
| `rgba(255,255,255,0.94)` | `styles.css` |
| `rgba(255,255,255,0.96)` | `styles.css` |
| `rgba(255,255,255,0.98)` | `styles.css` |
| `rgba(255,99,132,0.5)` | `employeepay.html` |
| `rgba(26,86,219,0.02)` | `130Test2.html` |
| `rgba(26,86,219,0.08)` | `130Test2.html`<br>`styles.css` |
| `rgba(26,86,219,0.14)` | `styles.css` |
| `rgba(26,86,219,0.2)` | `styles.css` |
| `rgba(30,58,138,.18)` | `courses/math114Spring26Links.html` |
| `rgba(31,39,36,0.78)` | `styles.css` |
| `rgba(31,39,36,0.85)` | `styles.css` |
| `rgba(31,39,36,0.92)` | `styles.css` |
| `rgba(31,39,36,0.96)` | `styles.css` |
| `rgba(33,72,62,0.88)` | `styles.css` |
| `rgba(33,72,62,0.9)` | `styles.css` |
| `rgba(37,46,43,0.18)` | `styles.css` |
| `rgba(37,46,43,0.3)` | `styles.css` |
| `rgba(42,96,65,0.2)` | `courses/103LUOAssignmentGuide.html` |
| `rgba(43,53,49,0.4)` | `styles.css` |
| `rgba(43,53,49,0.82)` | `styles.css` |
| `rgba(43,53,49,0.94)` | `styles.css` |
| `rgba(46,204,113,0.1)` | `courses/basic-statistical-measures.html` |
| `rgba(49,60,56,0.88)` | `styles.css` |
| `rgba(49,60,56,0.9)` | `styles.css` |
| `rgba(5,150,105,0.05)` | `styles.css` |
| `rgba(5,150,105,0.08)` | `styles.css` |
| `rgba(5,150,105,0.2)` | `styles.css` |
| `rgba(5,150,105,0.3)` | `styles.css` |
| `rgba(5,150,105,0.4)` | `styles.css` |
| `rgba(50,50,50,0.8)` | `chessboard.html` |
| `rgba(52,152,219,0.2)` | `courses/basic-statistical-measures.html` |
| `rgba(52,211,153,0.04)` | `styles.css` |
| `rgba(52,211,153,0.1)` | `styles.css` |
| `rgba(52,211,153,0.2)` | `styles.css` |
| `rgba(52,211,153,0.25)` | `styles.css` |
| `rgba(52,211,153,0.3)` | `styles.css` |
| `rgba(52,211,153,0.4)` | `styles.css` |
| `rgba(54,162,235,0.5)` | `employeepay.html` |
| `rgba(58,102,92,0.03)` | `styles.css` |
| `rgba(58,102,92,0.035)` | `styles.css` |
| `rgba(58,102,92,0.04)` | `styles.css` |
| `rgba(58,102,92,0.06)` | `styles.css` |
| `rgba(58,102,92,0.08)` | `styles.css` |
| `rgba(58,102,92,0.1)` | `styles.css` |
| `rgba(58,102,92,0.12)` | `130Test2.html`<br>`styles.css` |
| `rgba(58,102,92,0.16)` | `styles.css` |
| `rgba(58,102,92,0.2)` | `styles.css` |
| `rgba(59,130,246,0.5)` | `chessboard.html` |
| `rgba(61,90,128,0.35)` | `courses/103LUOAssignmentGuide.html` |
| `rgba(91,82,224,0.10)` | `130Test3.html` |
| `rgba(94,107,102,0.18)` | `styles.css` |
| `rgba(94,107,102,0.36)` | `styles.css` |
| `teal` | `courses/knowledgegrowth.html`<br>`courses/test4-formulas.html`<br>`growth.html` |
| `transparent` | `130Test1.html`<br>`130Test2.html`<br>`130Test3.html`<br>`Taskflow.html`<br>`chessboard.html`<br>`courses/103LUOAssignmentGuide.html`<br>`courses/engi220.html`<br>`projects/PrayerAppV1/index.html`<br>`projects/ResearchMentorship/MathJournals.html`<br>`styles.css` |
| `white` | `130Test1.html`<br>`130Test2.html`<br>`130Test3.html`<br>`130Test4.html`<br>`chessboard.html`<br>`courses/103LUOAssignmentGuide.html`<br>`courses/knowledgegrowth.html`<br>`courses/math114Spring26Links.html`<br>`courses/test4-formulas.html`<br>`projects/NormalDistributionGame.html`<br>`projects/PHYS103LUO/KinematicsShortAnswer.html`<br>`projects/PrayerAppV1/index.html`<br>`projects/QuestionSpinner/questionspinner.html`<br>`projects/ResearchMentorship/MathJournals.html`<br>`styles.css` |
| `yellow` | `courses/knowledgegrowth.html`<br>`growth.html`<br>`projects/PHYS103LUO/KinematicsShortAnswer.html`<br>`projects/PrayerAppV1/index.html`<br>`projects/QuestionSpinner/questionspinner.html` |

## Tokenized color usage index (`var(--token)` -> files)

| Token | Files |
|---|---|
| `--accent` | `130Test1.html`<br>`130Test2.html`<br>`130Test3.html`<br>`130Test4.html`<br>`courses/103LUOAssignmentGuide.html`<br>`styles.css` |
| `--accent-action` | `styles.css` |
| `--accent-chip` | `130Test1.html` |
| `--accent-color` | `styles.css` |
| `--accent-glow` | `130Test1.html`<br>`130Test2.html`<br>`130Test3.html`<br>`styles.css` |
| `--accent-hover` | `130Test1.html`<br>`130Test2.html`<br>`130Test3.html` |
| `--accent-light` | `courses/103LUOAssignmentGuide.html` |
| `--accent-soft` | `130Test2.html`<br>`130Test4.html` |
| `--amber` | `130Test1.html`<br>`130Test2.html`<br>`130Test3.html`<br>`130Test4.html`<br>`styles.css` |
| `--amber-bg` | `130Test1.html`<br>`130Test4.html` |
| `--background-color` | `styles.css` |
| `--bg` | `130Test1.html`<br>`130Test2.html`<br>`130Test3.html`<br>`courses/103LUOAssignmentGuide.html`<br>`styles.css` |
| `--blue` | `130Test1.html`<br>`styles.css` |
| `--blue-bg` | `130Test1.html` |
| `--body-font` | `courses/103LUOAssignmentGuide.html` |
| `--border` | `130Test1.html`<br>`130Test2.html`<br>`130Test3.html`<br>`130Test4.html`<br>`courses/103LUOAssignmentGuide.html`<br>`styles.css` |
| `--border-color` | `courses/114-module1-summary.html` |
| `--border-radius` | `styles.css` |
| `--card-background` | `courses/math114Spring26Links.html` |
| `--check-bg` | `130Test1.html` |
| `--check-border` | `130Test1.html` |
| `--container-space` | `styles.css` |
| `--context-surface-end` | `styles.css` |
| `--context-surface-start` | `styles.css` |
| `--display-lg` | `styles.css` |
| `--display-md` | `styles.css` |
| `--emerald-deep` | `styles.css` |
| `--emerald-mist` | `styles.css` |
| `--emerald-surface` | `styles.css` |
| `--featured-card-accent` | `styles.css` |
| `--featured-card-text` | `styles.css` |
| `--font-body` | `styles.css` |
| `--font-display` | `styles.css` |
| `--font-meta` | `styles.css` |
| `--ghost-outline` | `130Test2.html`<br>`Taskflow.html`<br>`Unit3Practice.html`<br>`employeepay.html`<br>`styles.css` |
| `--glass-surface` | `styles.css` |
| `--got-border` | `130Test1.html` |
| `--gradient-card-surface` | `130Test2.html`<br>`styles.css` |
| `--gradient-card-surface-hover` | `styles.css` |
| `--gradient-editorial-panel` | `130Test2.html`<br>`styles.css` |
| `--gradient-editorial-tier` | `styles.css` |
| `--gradient-footer-surface` | `styles.css` |
| `--gradient-library-glow` | `styles.css` |
| `--gradient-publication-surface` | `styles.css` |
| `--gradient-publication-surface-hover` | `styles.css` |
| `--green` | `130Test1.html`<br>`130Test2.html`<br>`130Test3.html`<br>`130Test4.html`<br>`styles.css` |
| `--green-bg` | `130Test1.html`<br>`130Test2.html`<br>`130Test3.html`<br>`130Test4.html`<br>`styles.css` |
| `--green-border` | `130Test1.html` |
| `--green-step` | `130Test1.html` |
| `--heading-font` | `courses/103LUOAssignmentGuide.html` |
| `--ink-earth` | `styles.css` |
| `--ink-inverse` | `styles.css` |
| `--ink-soft` | `styles.css` |
| `--ink-strong` | `styles.css` |
| `--kit` | `courses/103LUOAssignmentGuide.html` |
| `--kit-bg` | `courses/103LUOAssignmentGuide.html` |
| `--light-text` | `styles.css` |
| `--line-height-body` | `courses/math114Spring26Links.html`<br>`styles.css` |
| `--meta-sm` | `courses/math114Spring26Links.html`<br>`styles.css` |
| `--meta-tracking` | `styles.css` |
| `--meta-weight` | `courses/math114Spring26Links.html`<br>`styles.css` |
| `--miss-border` | `130Test1.html` |
| `--muted-text-color` | `courses/math114Spring26Links.html`<br>`styles.css` |
| `--nav-mobile-menu-surface` | `styles.css` |
| `--nav-mobile-panel-end` | `styles.css` |
| `--nav-mobile-panel-start` | `styles.css` |
| `--nav-surface-end` | `styles.css` |
| `--nav-surface-start` | `styles.css` |
| `--on-primary` | `courses/math114Spring26Links.html`<br>`styles.css` |
| `--on-surface` | `styles.css` |
| `--on-surface-variant` | `Unit3Practice.html`<br>`styles.css` |
| `--outline-variant` | `courses/math114Spring26Links.html`<br>`styles.css` |
| `--parchment-base` | `styles.css` |
| `--parchment-deep` | `styles.css` |
| `--parchment-elevated` | `styles.css` |
| `--parchment-muted` | `styles.css` |
| `--parchment-warm` | `styles.css` |
| `--primary` | `styles.css` |
| `--primary-color` | `styles.css` |
| `--primary-container` | `courses/math114Spring26Links.html`<br>`styles.css` |
| `--purple` | `130Test4.html` |
| `--purple-bg` | `130Test4.html` |
| `--radius` | `130Test1.html`<br>`130Test3.html`<br>`styles.css` |
| `--radius-lg` | `styles.css` |
| `--radius-md` | `Taskflow.html`<br>`Unit3Practice.html`<br>`styles.css` |
| `--radius-pill` | `styles.css` |
| `--reading-block-space` | `styles.css` |
| `--reading-measure` | `styles.css` |
| `--red` | `130Test1.html`<br>`130Test2.html`<br>`130Test3.html`<br>`130Test4.html`<br>`styles.css` |
| `--red-bg` | `130Test1.html`<br>`130Test2.html`<br>`130Test3.html`<br>`130Test4.html`<br>`styles.css` |
| `--red-border` | `130Test1.html` |
| `--review-accent` | `styles.css` |
| `--review-accent-glow` | `styles.css` |
| `--review-accent-hover` | `styles.css` |
| `--review-accent-soft` | `styles.css` |
| `--review-bg` | `styles.css` |
| `--review-body-muted` | `styles.css` |
| `--review-border` | `styles.css` |
| `--review-check-bg` | `styles.css` |
| `--review-check-border` | `styles.css` |
| `--review-error` | `styles.css` |
| `--review-error-bg` | `styles.css` |
| `--review-got-border` | `styles.css` |
| `--review-green-border` | `styles.css` |
| `--review-green-step` | `styles.css` |
| `--review-grid` | `styles.css` |
| `--review-h1-from` | `styles.css` |
| `--review-h1-to` | `styles.css` |
| `--review-info` | `styles.css` |
| `--review-info-bg` | `styles.css` |
| `--review-miss-border` | `styles.css` |
| `--review-muted` | `styles.css` |
| `--review-radius` | `styles.css` |
| `--review-red-border` | `styles.css` |
| `--review-semantic-body` | `styles.css` |
| `--review-shadow` | `styles.css` |
| `--review-shell-width` | `styles.css` |
| `--review-success` | `styles.css` |
| `--review-success-bg` | `styles.css` |
| `--review-surface` | `styles.css` |
| `--review-surface-2` | `styles.css` |
| `--review-text` | `styles.css` |
| `--review-warning` | `styles.css` |
| `--review-warning-bg` | `styles.css` |
| `--secondary` | `Taskflow.html`<br>`Unit3Practice.html`<br>`courses/math114Spring26Links.html`<br>`styles.css` |
| `--secondary-color` | `courses/math114Spring26Links.html`<br>`styles.css` |
| `--section-space` | `styles.css` |
| `--semantic-body` | `styles.css` |
| `--shadow` | `130Test1.html`<br>`130Test3.html` |
| `--spacing-10` | `styles.css` |
| `--spacing-12` | `styles.css` |
| `--spacing-16` | `styles.css` |
| `--spacing-2` | `styles.css` |
| `--spacing-20` | `styles.css` |
| `--spacing-3` | `styles.css` |
| `--spacing-4` | `styles.css` |
| `--spacing-5` | `Unit3Practice.html`<br>`styles.css` |
| `--spacing-6` | `styles.css` |
| `--spacing-8` | `styles.css` |
| `--success` | `130Test2.html` |
| `--surface` | `130Test1.html`<br>`130Test2.html`<br>`130Test3.html`<br>`courses/103LUOAssignmentGuide.html`<br>`courses/math114Spring26Links.html`<br>`employeepay.html`<br>`styles.css` |
| `--surface-container` | `courses/math114Spring26Links.html` |
| `--surface-container-high` | `styles.css` |
| `--surface-container-highest` | `Unit3Practice.html`<br>`styles.css` |
| `--surface-container-low` | `courses/math114Spring26Links.html`<br>`styles.css` |
| `--surface-container-lowest` | `Taskflow.html`<br>`Unit3Practice.html`<br>`courses/math114Spring26Links.html`<br>`styles.css` |
| `--surface-dim` | `styles.css` |
| `--surface-tint` | `styles.css` |
| `--surface2` | `130Test1.html`<br>`130Test2.html`<br>`130Test3.html`<br>`130Test4.html`<br>`styles.css` |
| `--tertiary` | `courses/math114Spring26Links.html`<br>`styles.css` |
| `--text` | `130Test1.html`<br>`130Test2.html`<br>`130Test3.html`<br>`130Test4.html`<br>`courses/103LUOAssignmentGuide.html`<br>`styles.css` |
| `--text-body-muted` | `130Test2.html`<br>`130Test3.html`<br>`styles.css` |
| `--text-color` | `styles.css` |
| `--text-muted` | `130Test1.html`<br>`130Test2.html`<br>`130Test3.html`<br>`130Test4.html`<br>`courses/103LUOAssignmentGuide.html`<br>`styles.css` |
| `--transition` | `styles.css` |
| `--type-body-family` | `130Test1.html`<br>`130Test2.html`<br>`130Test3.html`<br>`130Test4.html`<br>`courses/114-module1-summary.html`<br>`styles.css` |
| `--type-display-family` | `130Test1.html`<br>`130Test2.html`<br>`130Test3.html`<br>`courses/114-module1-summary.html`<br>`styles.css` |
| `--type-meta-family` | `130Test1.html`<br>`130Test2.html`<br>`130Test3.html`<br>`chessboard.html`<br>`courses/basic-statistical-measures.html`<br>`courses/final-exam-review-guide.html`<br>`courses/math114Spring26Links.html`<br>`styles.css` |
| `--user` | `courses/103LUOAssignmentGuide.html` |
| `--user-bg` | `courses/103LUOAssignmentGuide.html` |

## Token definitions with color-like values

| Token | Definitions (file: value) |
|---|---|
| `--accent` | `styles.css`: `var(--review-accent)` <br> `courses/103LUOAssignmentGuide.html`: `#3D5A80` |
| `--accent-action` | `styles.css`: `#1A56DB` |
| `--accent-color` | `styles.css`: `var(--secondary)` <br> `styles.css`: `Highlight` |
| `--accent-glow` | `styles.css`: `var(--review-accent-glow)` |
| `--accent-hover` | `styles.css`: `var(--review-accent-hover)` |
| `--accent-light` | `courses/103LUOAssignmentGuide.html`: `#EAF0F6` |
| `--accent-soft` | `styles.css`: `var(--review-accent-soft)` |
| `--amber` | `styles.css`: `var(--review-warning)` |
| `--amber-bg` | `styles.css`: `var(--review-warning-bg)` |
| `--ambient-outline` | `styles.css`: `rgba(192, 200, 196, 0.32)` <br> `styles.css`: `rgba(94, 107, 102, 0.36)` |
| `--background-color` | `styles.css`: `var(--surface)` <br> `styles.css`: `Canvas` |
| `--bg` | `styles.css`: `var(--review-bg)` <br> `courses/103LUOAssignmentGuide.html`: `#FAF9F6` |
| `--blue` | `styles.css`: `var(--review-info)` |
| `--blue-bg` | `styles.css`: `var(--review-info-bg)` |
| `--border` | `styles.css`: `var(--review-border)` <br> `courses/103LUOAssignmentGuide.html`: `#E2DFD8` |
| `--border-radius` | `styles.css`: `var(--radius-md)` |
| `--card-background` | `styles.css`: `var(--surface-container-lowest)` <br> `styles.css`: `Canvas` |
| `--check-bg` | `styles.css`: `var(--review-check-bg)` |
| `--check-border` | `styles.css`: `var(--review-check-border)` |
| `--context-surface-end` | `styles.css`: `rgba(242, 244, 241, 0.88)` <br> `styles.css`: `rgba(17, 22, 20, 0.9)` |
| `--context-surface-start` | `styles.css`: `rgba(255, 255, 255, 0.68)` <br> `styles.css`: `rgba(31, 39, 36, 0.78)` |
| `--elevation-veil` | `styles.css`: `rgba(255, 255, 255, 0.66)` <br> `styles.css`: `rgba(17, 22, 20, 0.66)` |
| `--elevation-veil-strong` | `styles.css`: `rgba(255, 255, 255, 0.82)` <br> `styles.css`: `rgba(17, 22, 20, 0.82)` |
| `--emerald-container` | `styles.css`: `#0f4a3e` |
| `--emerald-deep` | `styles.css`: `#001d17` |
| `--emerald-mist` | `styles.css`: `#dce6e0` |
| `--emerald-shadow` | `styles.css`: `rgba(58, 102, 92, 0.1)` |
| `--emerald-surface` | `styles.css`: `#00342b` |
| `--featured-card-accent` | `styles.css`: `color-mix(in srgb, var(--secondary) 78%, white 22%)` <br> `styles.css`: `color-mix(in srgb, var(--secondary) 82%, var(--primary-container))` |
| `--featured-card-base` | `styles.css`: `#002720` <br> `styles.css`: `#16211d` |
| `--featured-card-surface` | `styles.css`: `linear-gradient(180deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0)), linear-gradient(135deg, rgba(0, 29, 23, 0.96), rgba(0, 52, 43, 0.92))` <br> `styles.css`: `linear-gradient(180deg, rgba(255, 255, 255, 0.04), rgba(255, 255, 255, 0)), linear-gradient(135deg, rgba(22, 29, 27, 0.95), rgba(33, 72, 62, 0.88))` |
| `--featured-card-text` | `styles.css`: `var(--on-primary)` <br> `styles.css`: `var(--on-surface)` |
| `--font-meta` | `styles.css`: `var(--font-body)` |
| `--ghost-outline` | `styles.css`: `rgba(192, 200, 196, 0.15)` <br> `styles.css`: `rgba(94, 107, 102, 0.18)` |
| `--glass-surface` | `styles.css`: `rgba(255, 255, 255, 0.85)` <br> `styles.css`: `rgba(31, 39, 36, 0.85)` |
| `--got-border` | `styles.css`: `var(--review-got-border)` |
| `--gradient-card-surface` | `styles.css`: `linear-gradient(
    180deg,
    rgba(255, 255, 255, 0.94),
    rgba(242, 244, 241, 0.88)
  )` <br> `styles.css`: `linear-gradient(
    180deg,
    rgba(43, 53, 49, 0.82),
    rgba(24, 32, 29, 0.9)
  )` |
| `--gradient-card-surface-hover` | `styles.css`: `linear-gradient(
    180deg,
    rgba(255, 255, 255, 0.98),
    rgba(242, 244, 241, 0.9)
  )` <br> `styles.css`: `linear-gradient(
    180deg,
    rgba(49, 60, 56, 0.9),
    rgba(24, 32, 29, 0.96)
  )` |
| `--gradient-editorial-hover-panel` | `styles.css`: `linear-gradient(
    180deg,
    rgba(255, 255, 255, 0.9),
    rgba(242, 244, 241, 0.94)
  )` <br> `styles.css`: `linear-gradient(
    180deg,
    rgba(49, 60, 56, 0.88),
    rgba(24, 32, 29, 0.96)
  )` |
| `--gradient-editorial-hover-tier` | `styles.css`: `linear-gradient(
    180deg,
    rgba(220, 230, 224, 0.24),
    rgba(255, 255, 255, 0)
  )` <br> `styles.css`: `linear-gradient(
    180deg,
    rgba(43, 53, 49, 0.4),
    rgba(17, 22, 20, 0)
  )` |
| `--gradient-editorial-panel` | `styles.css`: `linear-gradient(
    180deg,
    rgba(255, 255, 255, 0.82),
    rgba(242, 244, 241, 0.9)
  )` <br> `styles.css`: `linear-gradient(
    180deg,
    rgba(43, 53, 49, 0.82),
    rgba(24, 32, 29, 0.9)
  )` |
| `--gradient-editorial-tier` | `styles.css`: `linear-gradient(
    180deg,
    rgba(220, 230, 224, 0.15),
    rgba(255, 255, 255, 0)
  )` <br> `styles.css`: `linear-gradient(
    180deg,
    rgba(37, 46, 43, 0.3),
    rgba(17, 22, 20, 0)
  )` |
| `--gradient-footer-surface` | `styles.css`: `linear-gradient(180deg, rgba(255, 255, 255, 0), rgba(220, 230, 224, 0.18) 14%, rgba(232, 235, 231, 0.98)),
    linear-gradient(180deg, rgba(242, 244, 241, 0.96), rgba(232, 235, 231, 0.98))` <br> `styles.css`: `linear-gradient(180deg, transparent, rgba(37, 46, 43, 0.18) 14%, rgba(24, 32, 29, 0.98)),
    linear-gradient(180deg, rgba(24, 32, 29, 0.96), rgba(17, 22, 20, 0.98))` |
| `--gradient-library-glow` | `styles.css`: `radial-gradient(
      circle at top left,
      rgba(58, 102, 92, 0.2),
      transparent 48%
    ),
    linear-gradient(135deg, rgba(0, 29, 23, 0.97), rgba(0, 52, 43, 0.92))` <br> `styles.css`: `radial-gradient(
      circle at top left,
      rgba(126, 168, 255, 0.12),
      transparent 48%
    ),
    linear-gradient(135deg, rgba(17, 22, 20, 0.94), rgba(33, 72, 62, 0.9))` |
| `--gradient-publication-surface` | `styles.css`: `linear-gradient(
    90deg,
    rgba(58, 102, 92, 0.12),
    rgba(58, 102, 92, 0.03) 24%,
    transparent 70%
  ),
  linear-gradient(180deg, rgba(255, 255, 255, 0.82), rgba(242, 244, 241, 0.72))` <br> `styles.css`: `linear-gradient(
    90deg,
    rgba(126, 168, 255, 0.12),
    rgba(58, 102, 92, 0.1) 24%,
    transparent 70%
  ),
  linear-gradient(180deg, rgba(43, 53, 49, 0.82), rgba(24, 32, 29, 0.9))` |
| `--gradient-publication-surface-hover` | `styles.css`: `linear-gradient(
    90deg,
    rgba(26, 86, 219, 0.14),
    rgba(58, 102, 92, 0.06) 28%,
    transparent 74%
  ),
  linear-gradient(180deg, rgba(255, 255, 255, 0.9), rgba(242, 244, 241, 0.82))` <br> `styles.css`: `linear-gradient(
    90deg,
    rgba(126, 168, 255, 0.2),
    rgba(58, 102, 92, 0.12) 28%,
    transparent 74%
  ),
  linear-gradient(180deg, rgba(49, 60, 56, 0.88), rgba(24, 32, 29, 0.96))` |
| `--gradient-surface-soft` | `styles.css`: `linear-gradient(
    180deg,
    rgba(255, 255, 255, 0.78),
    rgba(242, 244, 241, 0.8)
  )` <br> `styles.css`: `linear-gradient(
    180deg,
    rgba(43, 53, 49, 0.94),
    rgba(24, 32, 29, 0.92)
  )` |
| `--green` | `styles.css`: `var(--review-success)` |
| `--green-bg` | `styles.css`: `var(--review-success-bg)` |
| `--green-border` | `styles.css`: `var(--review-green-border)` |
| `--green-step` | `styles.css`: `var(--review-green-step)` |
| `--grid-line` | `styles.css`: `var(--review-grid)` |
| `--h1-from` | `styles.css`: `var(--review-h1-from)` |
| `--h1-to` | `styles.css`: `var(--review-h1-to)` |
| `--ink-earth` | `styles.css`: `#3e271f` |
| `--ink-inverse` | `styles.css`: `#ffffff` |
| `--ink-soft` | `styles.css`: `#3d4a44` |
| `--ink-strong` | `styles.css`: `#001d17` |
| `--kit` | `courses/103LUOAssignmentGuide.html`: `#2A6041` |
| `--kit-bg` | `courses/103LUOAssignmentGuide.html`: `#EDF5F0` |
| `--light-text` | `styles.css`: `var(--on-primary)` <br> `styles.css`: `var(--on-surface)` <br> `styles.css`: `Canvas` |
| `--miss-border` | `styles.css`: `var(--review-miss-border)` |
| `--muted-text-color` | `styles.css`: `var(--on-surface-variant)` |
| `--nav-mobile-menu-surface` | `styles.css`: `rgba(255, 255, 255, 0.96)` <br> `styles.css`: `rgba(24, 32, 29, 0.98)` |
| `--nav-mobile-panel-end` | `styles.css`: `rgba(242, 244, 241, 0.9)` <br> `styles.css`: `rgba(24, 32, 29, 0.92)` |
| `--nav-mobile-panel-start` | `styles.css`: `rgba(255, 255, 255, 0.94)` <br> `styles.css`: `rgba(31, 39, 36, 0.96)` |
| `--nav-pill-surface` | `styles.css`: `rgba(255, 255, 255, 0.72)` <br> `styles.css`: `rgba(31, 39, 36, 0.78)` |
| `--nav-surface-end` | `styles.css`: `rgba(242, 244, 241, 0.78)` <br> `styles.css`: `rgba(24, 32, 29, 0.88)` |
| `--nav-surface-start` | `styles.css`: `rgba(255, 255, 255, 0.88)` <br> `styles.css`: `rgba(31, 39, 36, 0.92)` |
| `--on-primary` | `styles.css`: `var(--ink-inverse)` |
| `--on-secondary` | `styles.css`: `var(--ink-inverse)` |
| `--on-surface` | `styles.css`: `var(--ink-strong)` <br> `styles.css`: `#f2f5f2` |
| `--on-surface-variant` | `styles.css`: `var(--ink-soft)` <br> `styles.css`: `#bac4bf` |
| `--outline-variant` | `styles.css`: `#c0c8c4` <br> `styles.css`: `#5e6b66` |
| `--parchment-base` | `styles.css`: `#f8faf7` |
| `--parchment-deep` | `styles.css`: `#e1e3e0` |
| `--parchment-elevated` | `styles.css`: `#ffffff` |
| `--parchment-muted` | `styles.css`: `#ebeeea` |
| `--parchment-warm` | `styles.css`: `#f2f4f1` |
| `--primary` | `styles.css`: `var(--emerald-deep)` <br> `styles.css`: `#e9f1ed` |
| `--primary-color` | `styles.css`: `var(--primary-container)` <br> `styles.css`: `CanvasText` |
| `--primary-container` | `styles.css`: `var(--emerald-surface)` <br> `styles.css`: `#21483e` |
| `--priority` | `styles.css`: `:before {
  background: linear-gradient(90deg, var(--secondary), transparent 70%)` |
| `--radius` | `styles.css`: `var(--review-radius)` |
| `--red` | `styles.css`: `var(--review-error)` |
| `--red-bg` | `styles.css`: `var(--review-error-bg)` |
| `--red-border` | `styles.css`: `var(--review-red-border)` |
| `--review-accent` | `styles.css`: `var(--secondary, #7ea8ff)` <br> `styles.css`: `var(--secondary, #1A56DB)` |
| `--review-accent-glow` | `styles.css`: `rgba(126, 168, 255, 0.25)` <br> `styles.css`: `rgba(26, 86, 219, 0.14)` |
| `--review-accent-hover` | `styles.css`: `rgba(126, 168, 255, 0.3)` <br> `styles.css`: `rgba(26, 86, 219, 0.2)` |
| `--review-accent-soft` | `styles.css`: `rgba(126, 168, 255, 0.12)` <br> `styles.css`: `rgba(26, 86, 219, 0.08)` |
| `--review-bg` | `styles.css`: `var(--surface-dim, #111614)` <br> `styles.css`: `var(--surface, #f8faf7)` |
| `--review-body-muted` | `styles.css`: `var(--on-surface-variant, #bac4bf)` <br> `styles.css`: `color-mix(in srgb, var(--on-surface-variant) 86%, var(--primary) 14%)` |
| `--review-border` | `styles.css`: `var(--surface-container-highest, #2b3531)` <br> `styles.css`: `rgba(192, 200, 196, 0.18)` |
| `--review-check-bg` | `styles.css`: `rgba(52, 211, 153, 0.04)` <br> `styles.css`: `rgba(5, 150, 105, 0.05)` |
| `--review-check-border` | `styles.css`: `rgba(52, 211, 153, 0.3)` <br> `styles.css`: `rgba(5, 150, 105, 0.3)` |
| `--review-error` | `styles.css`: `#f87171` <br> `styles.css`: `#dc2626` |
| `--review-error-bg` | `styles.css`: `rgba(248, 113, 113, 0.1)` <br> `styles.css`: `rgba(220, 38, 38, 0.08)` |
| `--review-got-border` | `styles.css`: `rgba(52, 211, 153, 0.4)` <br> `styles.css`: `rgba(5, 150, 105, 0.4)` |
| `--review-green-border` | `styles.css`: `rgba(52, 211, 153, 0.2)` <br> `styles.css`: `rgba(5, 150, 105, 0.2)` |
| `--review-green-step` | `styles.css`: `rgba(52, 211, 153, 0.25)` <br> `styles.css`: `rgba(5, 150, 105, 0.2)` |
| `--review-grid` | `styles.css`: `rgba(126, 168, 255, 0.03)` <br> `styles.css`: `rgba(58, 102, 92, 0.035)` |
| `--review-h1-from` | `styles.css`: `var(--on-surface, #f2f5f2)` <br> `styles.css`: `var(--primary, #001d17)` |
| `--review-h1-to` | `styles.css`: `var(--secondary, #7ea8ff)` <br> `styles.css`: `var(--primary-container, #00342b)` |
| `--review-info` | `styles.css`: `var(--secondary, #7ea8ff)` <br> `styles.css`: `var(--secondary, #1A56DB)` |
| `--review-info-bg` | `styles.css`: `rgba(126, 168, 255, 0.1)` <br> `styles.css`: `rgba(26, 86, 219, 0.08)` |
| `--review-miss-border` | `styles.css`: `rgba(248, 113, 113, 0.4)` <br> `styles.css`: `rgba(220, 38, 38, 0.35)` |
| `--review-muted` | `styles.css`: `var(--on-surface-variant, #bac4bf)` <br> `styles.css`: `var(--on-surface-variant, #3d4a44)` |
| `--review-red-border` | `styles.css`: `rgba(248, 113, 113, 0.2)` <br> `styles.css`: `rgba(220, 38, 38, 0.18)` |
| `--review-semantic-body` | `styles.css`: `var(--on-surface, #f2f5f2)` <br> `styles.css`: `var(--on-surface, #001d17)` |
| `--review-shadow` | `styles.css`: `0 12px 36px rgba(0, 0, 0, 0.18)` <br> `styles.css`: `0 8px 32px rgba(0, 29, 23, 0.06)` |
| `--review-success` | `styles.css`: `#34d399` <br> `styles.css`: `#059669` |
| `--review-success-bg` | `styles.css`: `rgba(52, 211, 153, 0.1)` <br> `styles.css`: `rgba(5, 150, 105, 0.08)` |
| `--review-surface` | `styles.css`: `var(--surface-container-low, #18201d)` <br> `styles.css`: `var(--surface-container-lowest, #ffffff)` |
| `--review-surface-2` | `styles.css`: `var(--surface-container-lowest, #1f2724)` <br> `styles.css`: `var(--surface-container-low, #f2f4f1)` |
| `--review-text` | `styles.css`: `var(--on-surface, #f2f5f2)` <br> `styles.css`: `var(--on-surface, #001d17)` |
| `--review-warning` | `styles.css`: `#f59e0b` <br> `styles.css`: `#d97706` |
| `--review-warning-bg` | `styles.css`: `rgba(245, 158, 11, 0.1)` <br> `styles.css`: `rgba(217, 119, 6, 0.08)` |
| `--secondary` | `styles.css`: `var(--accent-action)` <br> `styles.css`: `hover,
.tool-button--secondary:focus-visible,
.btn-secondary:hover,
.btn-secondary:focus-visible,
.solution-toggle:hover,
.solution-toggle:focus-visible,
.practice-action-btn:hover,
.practice-action-btn:focus-visible,
.review-topic-btn:hover,
.review-topic-btn:focus-visible,
.print-btn:hover,
.print-btn:focus-visible,
.reset-btn:hover,
.reset-btn:focus-visible {
  border-color: color-mix(in srgb, var(--secondary) 48%, var(--ghost-outline))` <br> `styles.css`: `focus-visible,
.tool-panel :is(button, a, input, select, textarea):focus-visible,
.tool-page-shell :is(button, a, input, select, textarea):focus-visible {
  outline: 3px solid color-mix(in srgb, var(--secondary) 36%, transparent)` <br> `styles.css`: `#7ea8ff` |
| `--secondary-color` | `styles.css`: `var(--primary)` <br> `styles.css`: `Canvas` |
| `--semantic-body` | `styles.css`: `var(--review-semantic-body, var(--review-text))` |
| `--shadow` | `styles.css`: `var(--review-shadow)` |
| `--surface` | `styles.css`: `var(--parchment-base)` <br> `styles.css`: `#111614` <br> `styles.css`: `var(--review-surface)` <br> `courses/103LUOAssignmentGuide.html`: `#FFFFFF` |
| `--surface-bright` | `styles.css`: `color-mix(in srgb, var(--parchment-elevated) 72%, var(--parchment-base))` <br> `styles.css`: `#27312e` |
| `--surface-container` | `styles.css`: `var(--parchment-muted)` <br> `styles.css`: `#202825` |
| `--surface-container-high` | `styles.css`: `color-mix(in srgb, var(--parchment-warm) 55%, var(--emerald-mist))` <br> `styles.css`: `#252e2b` |
| `--surface-container-highest` | `styles.css`: `var(--parchment-deep)` <br> `styles.css`: `#2b3531` |
| `--surface-container-low` | `styles.css`: `var(--parchment-warm)` <br> `styles.css`: `#18201d` |
| `--surface-container-lowest` | `styles.css`: `var(--parchment-elevated)` <br> `styles.css`: `#1f2724` |
| `--surface-dim` | `styles.css`: `color-mix(in srgb, var(--parchment-warm) 76%, var(--parchment-deep))` <br> `styles.css`: `#0d1210` |
| `--surface-tint` | `styles.css`: `#3a665c` <br> `styles.css`: `#8bb1a8` |
| `--surface2` | `styles.css`: `var(--review-surface-2)` |
| `--tertiary` | `styles.css`: `var(--ink-earth)` <br> `styles.css`: `#d0ad97` |
| `--text` | `styles.css`: `var(--review-text)` <br> `courses/103LUOAssignmentGuide.html`: `#2C2825` |
| `--text-body-muted` | `styles.css`: `var(--review-body-muted, var(--review-muted))` |
| `--text-color` | `styles.css`: `var(--on-surface)` <br> `styles.css`: `CanvasText` |
| `--text-muted` | `styles.css`: `var(--review-muted)` <br> `courses/103LUOAssignmentGuide.html`: `#7A7570` |
| `--type-body-family` | `styles.css`: `var(--font-body)` |
| `--type-display-family` | `styles.css`: `var(--font-display)` |
| `--type-meta-family` | `styles.css`: `var(--font-meta)` |
| `--user` | `courses/103LUOAssignmentGuide.html`: `#9B5B2D` |
| `--user-bg` | `courses/103LUOAssignmentGuide.html`: `#FDF5ED` |
