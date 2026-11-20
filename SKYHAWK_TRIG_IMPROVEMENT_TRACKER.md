# Skyhawk Trig Improvement Tracker

This is the shared implementation plan and work record for [SkyhawkTrig.html](SkyhawkTrig.html), the MATH 130 Section 7.1 flight activity. All programmers working on this activity must follow the workflow below.

Created: 2026-11-20. Initial audit baseline: commit `510c6917de1a5ac6c8d7c87b34321ed90ace8d7c`.

The baseline records observations, not a guarantee about the current code. The initial audit found useful guided practice, a rounding defect, clipped controls, limited feedback and bearing variety, and incomplete accessibility. The planned improvements below have not been implemented merely because they appear in this document.

## Required workflow for every programmer

1. **Evaluate the current status before changing code.** Read this entire document, including the latest entries at the bottom. Check the current branch, commit, working changes, relevant source, and available tests. Reproduce relevant bugs and inspect the current browser behavior. Do not assume that an old finding is still open or that a previous implementation is complete.
2. **Record your starting assessment.** Append an entry at the bottom identifying yourself, the date, branch/commit, task IDs, what you inspected, and which findings you confirmed, could not reproduce, or found already fixed. If you cannot run a check, record the limitation.
3. **Claim work visibly.** Update the task index with your name or programmer/agent identifier and its status. Check for another owner before editing the same files. Record dependencies and coordinate overlapping work instead of silently replacing another programmer's changes.
4. **Keep findings current as you work. Every programmer must append any newly discovered bug, regression, improvement opportunity, or material design decision to the very bottom of this document, below the latest log entry.** Do not rely on a chat message, code comment, or commit message as the only record.
5. **Use stable task IDs.** Reference an existing ID when the finding is already recorded. Give a genuinely new finding the next unused `SH-NNN` ID, add it to the task index, and put its detailed evidence in the bottom log. Never reuse or renumber an ID.
6. **Verify before closing.** Check the task's success criteria against the actual resulting behavior. Record test commands and results, manual checks, environments, reproduction inputs/seeds, and the implementation commit or PR. Describe partial completion honestly.
7. **Leave a handoff at the end of each work session.** Append what changed, what passed or failed, any new findings, remaining work, and the next recommended action. If you found no new issues, explicitly say so. Update the task index to match.

**The activity log is append-only.** Do not delete, rewrite, reorder, or backdate previous entries. Correct earlier information with a new dated entry that references it. The task index and plan may be updated as work evolves, but explain material scope or acceptance-criteria changes in a new bottom entry. New work-log entries must remain the last content in this file.

## Status and priority conventions

| Status | Meaning |
| --- | --- |
| Open | Planned or reported; a programmer must reassess the current state before starting. |
| In progress | An identified owner is actively implementing the task. |
| Blocked | Record the specific dependency and the action needed to proceed. |
| Verification | Implementation exists, but acceptance checks or evidence remain incomplete. |
| Done | Acceptance criteria passed and evidence plus the implementation reference are recorded below. |

P1 means a correctness or access defect to address in the first release. P2 means an instructional, accessibility, coverage, or maintainability improvement. Do not treat priority as proof that a finding still reproduces.

## Task index

Update ownership, status, and the latest evidence reference here. Keep historical details in the bottom log.

| ID | Priority | Task | Phase | Status | Owner | Latest evidence |
| --- | --- | --- | --- | --- | --- | --- |
| SH-001 | P1 | Correct rounding and answer grading at numerical boundaries | 1 | Verification | Claude (Opus 5.5) | 2026-11-20 handoff below; `tests/verify-skyhawk-trig.cjs` |
| SH-002 | P1 | Make controls reachable on small screens and in landscape | 2 | Verification | Claude (Opus 5.5) | 2026-11-20 SH-002/SH-003 entry below |
| SH-003 | P1 | Prevent navigation from covering flight progress | 2 | Verification | Claude (Opus 5.5) | 2026-11-20 SH-002/SH-003 entry below |
| SH-004 | P2 | Validate entries and provide feedback on each answer part without clearing work | 3 | Verification | Claude (Opus 5.5) | 2026-11-20 SH-004 entry below; `tests/verify-skyhawk-trig.cjs` |
| SH-005 | P2 | Complete keyboard, label, announcement, contrast, and motion support | 2 | Verification | Claude (Opus 5.5) | 2026-11-20 SH-005 entry below; `tests/verify-skyhawk-trig.cjs` |
| SH-006 | P2 | Add mathematically accurate instructional diagrams | 4 | Open | Unassigned | Initial audit below |
| SH-007 | P2 | Vary bearing/return directions and accept equivalent bearings | 4 | Verification | Claude (Opus 5.5) | 2026-11-20 SH-007 entry below; `tests/verify-skyhawk-trig.cjs` |
| SH-008 | P2 | Separate guided completion from independent readiness evidence | 5 | Open | Unassigned | Initial audit below |
| SH-009 | P2 | Save, resume, and reset local progress reliably | 5 | Open | Unassigned | Initial audit below |
| SH-010 | P2 | Isolate reproducible calculation/generation logic and add regression coverage | 1 | Verification | Claude (Opus 5.5) | 2026-11-20 SH-010 entry below; `tests/verify-skyhawk-trig.cjs` |
| SH-011 | P1 | Fix the same floating-point rounding defect in the shared aviation engine (`math130-test3-skills.js`) | 1 | Verification | Claude (Opus 5.5) | 2026-11-20 SH-011 entry below; `tests/verify-math130-test3.cjs` |
| SH-012 | P2 | Keep worked-solution precision consistent with final rounding | 1 | Verification | Codex | 2026-11-20 PR #328 display-precision handoff below |
| SH-013 | P2 | Show one-decimal flight times consistently (prompts can say "for 1 hours") | 4 | Verification | Claude (Opus 5.5) | 2026-11-20 SH-013 entry below; `tests/verify-skyhawk-trig.cjs` |

## Product scope and constraints

- Keep the current case-sensitive `SkyhawkTrig.html` URL and LYH flight theme.
- Keep the four Section 7.1 skills: climb time, bearing components, descent altitude loss, and direct return distance/bearing.
- Link to the course page for dates and official assessment coverage. Avoid embedding a quiz-number assumption in the activity.
- Preserve clear units and instructions about the requested rounding precision.
- Keep the activity usable without an account or external service. Retain the existing ability to practice without external library downloads; document and test the supported offline delivery method if code is split into assets.
- Changes to shared MATH 130 code must preserve the other practice pages and their existing behavior. Re-run the relevant shared regression checks.
- Make flight-path speed and altitude gained explicit. Do not silently mix miles/mph with nautical miles/knots.

## Phase 1: Dependable mathematics and grading

Tasks: SH-001 and SH-010. Complete this before adding new question variants.

Separate scenario generation, calculation, final rounding, and answer grading from DOM updates. Make a problem reproducible from its seed and parameters. Keep original values, full-precision calculations, rounded expected answers, units, solution steps, and diagram data consistent.

Evaluate reuse of the aviation logic in [math130-test3-skills.js](assets/js/math130-test3-skills.js). A shared engine should support separate parameter profiles for Skyhawk and general aviation questions. Verify the shared implementation independently before adopting it; reuse alone does not establish correctness.

| Skill | Mathematical contract |
| --- | --- |
| Climb time | Vertical speed = flight-path speed × sin(climb angle); time = altitude gained / vertical speed; convert hours to minutes. |
| Bearing components | Distance = speed × time. Measure the bearing from the named N/S axis: that component uses cosine and the perpendicular component uses sine. |
| Descent loss | Convert minutes to hours, calculate flight-path distance, and multiply by sin(depression angle). Report a positive altitude loss. |
| Direct return | Calculate the two legs, use the Pythagorean theorem, reverse the displacement directions, and calculate the return bearing from its named axis. |

Success criteria:

- [ ] The regression case `125 mph`, `1.4 hours`, `S 30° W` produces `152 miles south` and **`88 miles west`**. The west component is exactly `87.5`, so `87` is rejected.
- [ ] Rounding tests cover exact halfway values and values immediately above and below each rounding boundary. Fix machine-precision effects while retaining the requested answer precision.
- [ ] Intermediate display rounding does not change the final calculation. Displayed approximations use appropriate notation and readable precision.
- [ ] Equivalent numeric entries such as `88` and `88.0` receive the same result. An unrounded answer is not accepted when the prompt requires a rounded answer.
- [ ] At least 10,000 reproducible generated cases per skill pass independent checks of mathematical identities, answer domains, units, and precision. Include exact known-answer cases so tests can detect a shared floating-point mistake.
- [ ] A reported seed/parameter set reproduces the same prompt, expected answers, solution, and diagram.
- [ ] Shared-engine changes pass the existing MATH 130 generator and grading checks, including the offline fallback when applicable.

## Phase 2: Responsive and accessible activity shell

Tasks: SH-002, SH-003, and SH-005.

Replace the fixed-height, non-scrolling layout with an arrangement that keeps navigation, progress, question, diagram, inputs, feedback, and controls in a predictable reading order. Permit vertical scrolling when content exceeds the available space. Keep the flight scene visible without placing essential controls beneath it.

Success criteria:

- [ ] Welcome, question, feedback, and completion screens are usable at `320×568`, `390×844`, `844×390`, and `1366×768`.
- [ ] Start, Submit, Retry, Continue, and Restart controls remain reachable with enlarged text and the mobile keyboard open.
- [ ] Check browser zoom at 200% and reflow at an equivalent 320 CSS-pixel width. No essential text or controls are lost.
- [ ] Navigation does not obscure the flight progress text, progress bar, question, or feedback.
- [ ] Each input has a programmatically associated label and identifies the required units.
- [ ] The activity can be completed using the keyboard. Enter submits the active answer once, and focus moves predictably after each screen change.
- [ ] Screen readers receive useful question and feedback announcements. Use appropriate dialog semantics only if the interface still behaves as a modal dialog.
- [ ] Correct/incorrect states include text and do not rely on color alone. Normal-size text has at least 4.5:1 contrast, including green buttons.
- [ ] Reduced-motion preferences are respected without removing instructional information.
- [ ] Record the browsers, devices/viewports, zoom settings, and assistive technology actually checked. Do not claim checks that were not performed.

References: [W3C contrast guidance](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html) and [W3C reflow guidance](https://www.w3.org/WAI/WCAG22/Understanding/reflow.html).

## Phase 3: A useful correction loop

Task: SH-004.

Use this learning sequence: **attempt → feedback on each part → targeted hint → retry → optional worked solution → fresh parallel problem**. Preserve the student's original entries so they can compare their work with feedback.

Success criteria:

- [ ] Blank, invalid, or nonfinite entries receive an inline validation message without revealing the solution or consuming an attempt.
- [ ] If one component is correct, keep it intact and identify the part that needs attention.
- [ ] The first incorrect attempt provides useful feedback without automatically revealing the complete worked answer.
- [ ] Hints address likely errors such as sine/cosine swaps, minutes versus hours, return direction, and premature rounding.
- [ ] Worked solutions remain available through an explicit action and are followed by an opportunity to try a fresh problem of that skill.
- [ ] Viewing a hint or solution marks the problem as assisted, even if the next answer is correct.
- [ ] Retries and repeated submissions do not inflate first-attempt accuracy or completed-problem counts.

## Phase 4: Instructional visuals and varied bearings

Tasks: SH-006 and SH-007.

Use a visible flight panel together with diagrams that explain the model. Decorative animation should support the problem rather than conceal the mathematics or disagree with its geometry.

| Stage | Required visual information |
| --- | --- |
| Climb | Horizontal reference, climb angle, flight-path hypotenuse, and altitude gained. |
| Bearing | Compass axes, bearing measured from N/S, and perpendicular displacement components. |
| Descent | Depression angle measured from the upper horizontal, flight path, and vertical altitude loss. |
| Return | Both outbound legs, final position, starting point, and the direct return path. |

Success criteria:

- [ ] Diagram geometry agrees with the scenario. Use equal coordinate scales for plan-view distances and verify angle placement numerically.
- [ ] Show given values and unknown markers before an answer; do not label the unknown with its answer until feedback reveals it.
- [ ] Accessible descriptions convey the same known information available visually without disclosing additional answers.
- [ ] Guided practice can identify relevant sides and axes; independent practice removes answer-giving cues.
- [ ] The question bank covers NE, NW, SE, and SW bearings and return routes requiring different return quadrants.
- [ ] Independent return questions require students to choose the bearing directions instead of supplying `S __° E` every time.
- [ ] Equivalent quadrant bearings and compass headings are accepted when allowed by the prompt, with consistent requested precision.
- [ ] Named component distances are clearly positive magnitudes; any signed-coordinate convention is explained explicitly.

## Phase 5: Honest readiness reporting and local progress

Tasks: SH-008 and SH-009.

Provide **Guided flight** for supported practice and an **Independent checkpoint** for mixed questions. Keep assistance and retries visible in the results.

Proposed initial practice target: 12 checkpoint questions, three per skill; at least **10/12 correct on the first attempt** and **2/3 correct in every skill**. Make this teacher-adjustable. It is a practice readiness criterion, not a validated prediction of a quiz grade.

Success criteria:

- [ ] The independent checkpoint includes all four skills and uses fresh, varied problems.
- [ ] Report first-attempt correctness, assisted completion, and skills needing review separately. State how assistance affects the checkpoint result.
- [ ] Completion says the flight was completed. A separate status indicates whether the readiness target was met; do not infer mastery from four correct responses.
- [ ] Missed skills receive fresh follow-up questions. Later success does not rewrite the original attempt history.
- [ ] Refreshing restores the current question, mode, seed, inputs, assistance state, attempts, and progress without duplicating credit.
- [ ] Students can resume, reset progress, or start a new flight. Store no student identity or gradebook data.
- [ ] Version stored state and handle incompatible or malformed saved data safely.
- [ ] Blocked or unavailable browser storage does not prevent practice. Clearly distinguish session-only progress from saved progress.

## Release and handoff checklist

Recommended sequence: release the mathematics/access fixes first, then improved feedback, then diagrams, wider coverage, and readiness reporting.

- [ ] Relevant acceptance criteria pass and have evidence in the log.
- [ ] Mathematical boundary cases and seeded checks pass.
- [ ] Complete browser flows cover correct, incorrect, partially correct, blank, and assisted responses.
- [ ] Keyboard, small-screen, landscape, zoom/reflow, and reduced-motion checks pass for the changed experience.
- [ ] Shared MATH 130 pages still work when shared code changes.
- [ ] Check local links, browser console errors, and the supported offline experience.
- [ ] Test save/resume/reset and unavailable storage when progress features are introduced.
- [ ] Record commit/PR references and distinguish local verification from deployment verification.
- [ ] Verify the live activity after publication before recording a deployment as verified.
- [ ] Conduct a small classroom pilot when feasible and append observed wording, usability, and feedback problems. Record any checks that remain pending.

## Entry template

Copy the following structure and **append the completed entry at the very bottom**, after the latest activity entry. Use one entry for a related set of observations; make unrelated new bugs separate tasks.

```markdown
### YYYY-MM-DD HH:MM timezone — Programmer name or identifier — SH-NNN

- Entry type: Starting assessment / New bug / Improvement / Decision / Progress / Verification / Handoff
- Branch and starting commit:
- Current status assessment: What was inspected, reproduced, already fixed, or not verified?
- Finding or change:
- Expected behavior:
- Actual behavior and student impact:
- Reproduction: Inputs/seed, steps, browser/device, viewport/zoom, and relevant state.
- Files or components involved:
- Tests and evidence: Commands, outcomes, screenshots/log links, and checks not performed.
- Implementation commit or PR: Use pending when no implementation exists yet.
- Task status and owner:
- New task IDs or related existing IDs:
- Remaining work and next action:
```

## Activity log — append new entries below the latest entry

### 2026-11-20 — Codex — Initial audit and tracker creation

- Entry type: Starting assessment and planning baseline.
- Baseline commit: `510c6917de1a5ac6c8d7c87b34321ed90ace8d7c`.
- Current status assessment: The live activity matched the repository at the audit baseline. The five-phase plan is pending implementation; all indexed tasks begin Open and Unassigned. Creating this tracker does not close any task.
- SH-001: In 12,000 seeded generated problems, 12 bearing west-component rounding discrepancies were observed. Example: 125 mph for 1.4 hours on S 30° W gives 175 total miles, about 152 south, and exactly 87.5 west. The correct rounded west answer is 88; the activity expected 87 and rejected 88.
- SH-002: At 320×568, the Start Engine button was below the viewport, and wheel scrolling did not reveal it. The return-stage Submit control was also outside the viewport. At 844×390, several controls were clipped. The page sets both document and body overflow to hidden.
- SH-003: The course navigation covered the flight progress text in the desktop browser check.
- SH-004: Submitting an empty answer immediately revealed the worked solution. A response with one correct component and one wrong component cleared both inputs and gave generic review text.
- SH-005: Inputs had no associated labels or accessible-label attributes. No live feedback regions were present. Enter did not submit. White text on the green `#4CAF50` button had approximately 2.78:1 contrast.
- SH-006: The activity had decorative flight motion but no mathematical triangle or compass diagrams. The central panel concealed much of the flight scene.
- SH-007: Component questions always used SW, and return questions always used a north/west outbound route with S/E directions already supplied in the answer label.
- SH-008: Four correct stage responses triggered a message claiming the four skills were mastered; independent first-attempt performance was not recorded.
- SH-009: Refreshing returned to the welcome screen rather than resuming progress.
- SH-010: Generation and grading were embedded in the page and used unseeded randomness. Reproducible mathematical checks and shared-engine evaluation are planned.
- Verification already performed: Source review; live/local comparison; seeded calculation checks; desktop 1366×768, portrait 390×844 and 320×568, and landscape 844×390 browser flows; correct, blank, partly incorrect, and completion paths. These checks are an audit baseline, not a full accessibility certification.
- Files changed in this documentation task: This tracker and its README discovery link. The activity behavior was not changed.
- Next action: The next programmer must inspect the current code and bottom log, reproduce the relevant findings, append a starting assessment, and claim a task before implementation.

### 2026-11-20 — Codex — Integration status review and documentation handoff

- Entry type: Verification and handoff; task index SH-001 through SH-010.
- Starting branch and commit: `codex/skyhawk-programmer-tracker`, documentation commit `056c5bb`.
- Current status assessment: Checked the working tree and fetched remote main at `c713e741571758f1b7ee9bbbe26e7ef966c7273f`. Changes since the audit baseline were confined to Math 114 materials. Neither `SkyhawkTrig.html` nor the existing README was changed by those commits; no overlapping Skyhawk implementation was found. Integrated the newer main without replacing those materials.
- Finding or change: Added the shared tracker and a README link requiring programmers to reassess current behavior, maintain ownership/status, and append findings and handoffs at the bottom. No new activity bugs or improvement opportunities were identified during this documentation review.
- Files involved: `SKYHAWK_TRIG_IMPROVEMENT_TRACKER.md` and `README.md`.
- Verification: Confirmed the referenced local activity and shared-engine paths exist and checked the documentation diff for whitespace errors. No new behavioral test run was required for these documentation-only changes; the earlier audit is still the recorded behavioral baseline.
- Task status and owner: SH-001 through SH-010 remain Open and Unassigned. The documentation is available for the next programmer; the activity implementation is unchanged.
- Remaining work and next action: Start Phase 1 and the responsive/accessibility work in Phase 2 after reassessing the current code and appending a starting assessment. Record any newly discovered findings at the very bottom of this file.

### 2026-11-20 — Claude (Opus 5.5) — SH-001 starting assessment

- Entry type: Starting assessment and claim.
- Branch and starting commit: `claude/skyhawk-trigger-prioritization-d6b3d4`, `3fe746b`; clean working tree.
- Current status assessment: Read this whole tracker and the generation/grading script in `SkyhawkTrig.html`. Chose SH-001 as the most impactful open item. It is a P1 correctness defect that rejects correct student answers and is the first task in Phase 1. No other owner was recorded.
- Finding: Confirmed SH-001 still reproduces. With fixed inputs `125 mph`, `1.4 h`, `S 30° W`, the page computes the west component as `87.49999999999999` and expects `87`. An exhaustive sweep of the bearing parameter space (speed 105–125, time 1.0–2.5, angle 25–65; 27,552 components) found 33 mis-rounded expected answers. The worked solutions also printed raw floats such as `87.49999999999999`.
- Task status and owner: SH-001 In progress, Claude (Opus 5.5).

### 2026-11-20 — Claude (Opus 5.5) — SH-001 handoff; new SH-011

- Entry type: Progress, verification, and handoff.
- Finding or change: Added a `roundTo(value, places)` helper in `SkyhawkTrig.html`. It snaps to 12 significant digits before rounding half up, which removes binary floating-point error without changing the requested precision. All five expected answers use it (climb minutes, both bearing components, descent tenths, return distance and angle). Worked solutions now show intermediate values as `≈` with 3 decimals instead of raw floats; the final answer still comes from the full-precision value. Grading is unchanged: it compares the parsed number exactly, so `88` and `88.0` match and an unrounded `87.5` is rejected.
- Tests and evidence: Added `node tests/verify-skyhawk-trig.cjs`. It loads the page script in a VM and passes 16/16 checks. Before the fix, 6 of these checks failed. It covers:
  - exact known-answer cases, including the `125/1.4/30°` case and exact `.5`, `.25`, and `.75` component values, plus 3-4-5 and 45° return cases;
  - 10,000 seeded generated cases per skill (mulberry32 seeds), each checked against an independent correctly-rounded value, its precision, and that the solution shows no unreadable float precision;
  - grading of `88`/`88.0` (accepted), `87` and `87.5` (rejected), and `0.7`/`0.70` vs `0.654` for descent.

  The exhaustive bearing sweep now shows 0/27,552 mis-rounded components. `python scripts/check_html_structure.py` and `python scripts/check_links.py` pass.
- Not performed: No browser or visual check of the changed solution text. No deployment check.
- SH-001 criteria still open:
  - The page itself still uses unseeded `Math.random`, so a reported seed cannot reproduce a page session. The test injects a seeded RNG instead. This belongs to SH-010.
  - The shared-engine criterion does not apply here, because no shared code was changed.
- Implementation commit or PR: pending (uncommitted on this branch).
- Task status and owner: SH-001 Verification, Claude (Opus 5.5). Close it after commit/PR and the seed criterion under SH-010.
- New finding SH-011 (P1): `assets/js/math130-test3-skills.js` `aviation_bearing_displacement` uses bare `Math.round` and has the same defect. An exhaustive sweep (16,188 components) found 9 wrong expected answers with `tolerance:0`, e.g. `190 knots, 1.5 h, 30°`: the component is `142.49999999999997`, so the engine expects `142` instead of the correct `143` (also 210 and 230 knots at 1.5 h, 30°). `aviation_climb_time` showed 0 discrepancies in its range. A fix must re-run `tests/verify-math130-test3.cjs` and sync the offline fallback (`scripts/sync-math130-test3-fallback.cjs`).
- Remaining work and next action: Commit this change, then fix SH-011 using the same rounding approach, then start SH-010 (seeded, isolated generation) or SH-002/SH-003 (layout).

### 2026-11-20 — Claude (Opus 5.5) — SH-011 fix and handoff

- Entry type: Starting assessment, progress, verification, and handoff.
- Branch and starting commit: `claude/skyhawk-trigger-prioritization-d6b3d4`, `3fe746b`, with the uncommitted SH-001 changes from the previous entry.
- Current status assessment:
  - Reproduced SH-011 as recorded: 9 of 16,188 `aviation_bearing_displacement` components are mis-rounded, e.g. 190/210/230 knots for 1.5 h at 30°.
  - All six existing MATH 130 suites passed before the change. However, `tests/verify-math130-test3.cjs` checked the bearing and climb answers with the same bare `Math.round`, so it shared the floating-point mistake and could not detect the defect.
  - Tolerance-graded fields (`aviation_descent_loss`, `aviation_return_to_origin`) store the unrounded value and compare within `tol + 1e-10`, so they are not affected.
- Finding or change:
  - `assets/js/math130-test3-skills.js` gained a `roundTo` helper using the same 12-significant-digit snap as the SH-001 fix. It is used for the climb-time answer and both bearing components (expected answers and solution text) and is exported for testing.
  - The independent check in `tests/verify-math130-test3.cjs` now uses a different half-up method (`roundUnit`). New known-answer cases cover 190/210/230 kn, 1.5 h, S 30° W (expects 143/158/173), confirm that grading rejects `want − 1` and the unrounded `.5` entry, and check `roundTo` directly.
  - Regenerated the offline fallback in `130Test3.html` with `node scripts/sync-math130-test3-fallback.cjs`.
- Tests and evidence: All of these pass:
  - `tests/verify-math130-test3.cjs` (shared file and offline fallback)
  - `tests/verify-math130-practice-fixes.cjs`
  - `tests/verify-math130-quiz11-rehearsal.cjs`
  - `tests/verify-math130-section53.cjs`
  - `tests/verify-math130-test2-practice.cjs`
  - `tests/verify-math130-test2.cjs`
  - `tests/verify-skyhawk-trig.cjs` (16/16)
  - `scripts/check_html_structure.py` and `scripts/check_links.py`

  An exhaustive scripted-RNG sweep of all bearing parameters shows the old engine wrong on 9/16,188 components and the new engine on 0/16,188. No browser check was performed.
- Deployment note: `130Test3.html` loads the shared file as `math130-test3-skills.js?v=20261118-quiz11`, and `tests/verify-math130-quiz11-rehearsal.cjs` asserts that exact string. The version was not bumped, so a returning browser may keep a cached copy of the old shared file until its cache expires. If this needs to reach students immediately, bump the query string and that assertion together.
- Implementation commit or PR: pending (uncommitted on this branch).
- Task status and owner: SH-011 Verification, Claude (Opus 5.5). Close after commit/PR and a post-deployment check.
- New task IDs or related existing IDs: Related to SH-001 and SH-010. No other new issues found.
- Remaining work and next action: Commit SH-001 and SH-011, then start SH-010 (seeded, isolated Skyhawk generation; consider adopting the shared engine with a Skyhawk parameter profile) or SH-002/SH-003 (layout).


### 2026-11-20 — Claude (Opus 5.5) — SH-011 cache version bump

- Entry type: Progress; corrects the deployment note in the previous SH-011 entry.
- Change: Bumped the shared-file query string in `130Test3.html` from `?v=20261118-quiz11` to `?v=20261120-sh011` so returning browsers fetch the corrected engine. Updated the matching assertion in `tests/verify-math130-quiz11-rehearsal.cjs`. `130-section-5-3-practice.html` loads the shared file without a version query and was left unchanged.
- Tests and evidence: Re-ran all MATH 130 suites and `tests/verify-skyhawk-trig.cjs` before committing; results are in the commit.
- Task status and owner: SH-001 and SH-011 remain Verification, Claude (Opus 5.5), pending deployment checks (SH-001 also pending its SH-010 seed criterion).

### 2026-11-20 — Codex — SH-012 starting assessment

- Entry type: Starting assessment, new bug, and claim following review of PR #328.
- Branch and starting commit: `claude/skyhawk-trigger-prioritization-d6b3d4`, `5bd931d`; clean checkout before this follow-up.
- Current status assessment: Read the tracker, inspected the PR changes, and ran all seven regression suites successfully during review. The user authorized updating this PR directly. SH-001 and SH-011 retain their existing owner and Verification status; this follow-up claims the new display defect only.
- Reproduction: Generate the bearing stage with 105 mph, 2.4 hours, S 25 degrees W. The west component is 106.49980195865626 and correctly grades as 106, but the new three-decimal display says `106.500 -> 106`, suggesting that an exact half rounds down. Reproduced using the page script in a Node VM. No browser or deployment check performed.
- Expected behavior: Show enough digits that the displayed approximation rounds to the same final answer as the full-precision calculation; keep routine values concise and exact-half answers correct.
- Files involved: `SkyhawkTrig.html`, `tests/verify-skyhawk-trig.cjs`, and this tracker.
- Task status and owner: SH-012 In progress, Codex. Add regression coverage, fix display precision, rerun the suites, and update PR #328.

### 2026-11-20 — Codex — SH-012 display-precision handoff

- Entry type: Progress, verification, and handoff.
- Change: Added `formatForRounding`, which starts with three decimals and adds digits only when the displayed value would round to a different final answer. Applied it to the climb-time, bearing-component, and descent-loss approximations introduced in PR #328. Full-precision calculations and grading are unchanged. The reported example now shows `106.4998 -> 106`; the exact-half regression still shows `87.500 -> 88`.
- Tests and evidence: Added the explicit 105 mph / 2.4 h / S 25 degrees W regression and checks that the displayed approximations round to their stated answers in all 10,000 seeded cases per skill. Before the fix, the new checks failed for the fixed regression, generated bearing cases, and generated descent cases (including 86 mph / 5 degrees / 6 minutes, displayed as `0.750 -> 0.7`). After the fix, `node tests/verify-skyhawk-trig.cjs` passes 17/17 checks, and all seven `tests/verify-*.cjs` suites pass, including shared MATH 130 and offline fallback flows. `git diff --check` passes.
- Limitations: Browser/visual and deployment checks were not performed. Python-based site validators could not run because the installed `python` and `py` launchers are unavailable in this environment.
- Implementation reference: Follow-up to PR #328 on `claude/skyhawk-trigger-prioritization-d6b3d4`.
- Task status and owner: SH-012 Verification, Codex, pending browser and deployment confirmation. SH-001 and SH-011 retain their existing Verification status. No additional issues found beyond this display defect.
- Remaining work and next action: Review the correction in PR #328 and verify worked-solution text in the browser and after deployment before marking SH-012 Done.

### 2026-11-20 — Claude (Opus 5.5) — SH-010 seeded engine; SH-001 seed criterion

- Entry type: Starting assessment, decision, progress, verification, and handoff.
- Branch and starting commit: `claude/skyhawk-sh010-seeded-engine`, stacked on `5bd931d` (PR #328, SH-001/SH-011, not yet merged).
- Current status assessment: Confirmed SH-010 as recorded. Generation, grading, and DOM updates were interleaved in `generateDataForStage`/`renderStage`/`verifyAnswer`; problems used unseeded `Math.random` and string-rounded `toFixed(1)` picks, so no reported problem could be replayed. No other owner was recorded.
- Decision (shared engine): Evaluated reusing `assets/js/math130-test3-skills.js`. Not adopted now. Its aviation profile uses knots for bearings, different ranges, 1-decimal tolerance grading for descent/return, and a random return quadrant, so adopting it would change the Skyhawk questions rather than just their plumbing. Loading it would also require the external-file-plus-synced-fallback arrangement that `130Test3.html` uses. Instead, the Skyhawk engine follows the same conventions (mulberry32, `roundTo`, `generate(rng)` → parameters) so it can be merged later. Revisit with SH-007, when bearing variety is added.
- Change (`SkyhawkTrig.html`):
  - A DOM-free `SkyhawkEngine` sits between `// <skyhawk-engine>` markers, inline so the page still works as a single offline file. API: `SKILLS`, `generate(type, seed)`, `build(type, params, seed?)`, `parseCode`, `newSeed`, `grade`, `roundTo`, `mulberry32`.
  - Each problem holds its type, seed, code, parameters, prompt, hint, fields (label with units, rounded answer), and solution HTML. Decimal parameters are drawn as integer tenths instead of `toFixed` strings.
  - Problem codes such as `bearing-q9kw6c` (skill plus base-36 seed) appear under each question and on the review screen. `SkyhawkTrig.html?problem=<code>` opens that exact problem at its stage; malformed codes fall back to the welcome screen.
  - The page now only renders and grades through the engine. Inputs got `<label for>` associations as a side effect (partial SH-005; other SH-005 items untouched). Student-facing wording and grading behavior are otherwise unchanged; SH-004 (blank/partial feedback) remains open.
- Tests and evidence: Rewrote `tests/verify-skyhawk-trig.cjs` (21/21 pass; the engine checks failed before implementation). It covers:
  - loading the engine with no DOM;
  - deep-equal reproduction per (skill, seed), and rebuilding from (skill, parameters);
  - code round-trips, case-insensitivity, and rejection of malformed codes;
  - prompt variety;
  - 10,000 seeded cases per skill checked for parameter ranges and steps, units in labels, independent correct rounding, and readable precision;
  - the earlier exact known-answer and grading cases;
  - page wiring: `?problem=` replay, grading through the engine, and welcome fallback.

  All seven `tests/verify-*.cjs` suites pass, as do `check_html_structure.py`, `check_links.py`, and `check_css_links.py`. Browser check at `http://localhost:8137` (built-in Chromium pane, about 800×600):
  - a correct elevation answer showed "Calculation Correct!"; a blank bearing answer opened Math Review with the code shown;
  - `?problem=BEARING-q9kw6c` opened Stage 2 with a problem JSON-identical to the engine's;
  - labels resolved to their inputs, and there were no console errors.

  Not checked: other browsers or viewports, or deployment.
- SH-001 note: Its remaining criterion ("a reported seed/parameter set reproduces the same prompt, expected answers, solution, and diagram") is now met for prompt, answers, and solution; no diagram exists yet (SH-006). SH-001 stays in Verification only for deployment checks.
- Implementation commit or PR: pending (this branch).
- Task status and owner: SH-010 Verification, Claude (Opus 5.5). Close after merge and a post-deployment `?problem=` check.
- New findings: None beyond the shared-engine decision above.
- Remaining work and next action: Merge PR #328, then this branch. Next recommended task: SH-002/SH-003 (layout, the remaining P1 bugs), then SH-004.


### 2026-11-20 — Claude (Opus 5.5) — SH-010 merged with SH-012

- Entry type: Progress (merge resolution).
- Change: Merged the updated base branch, Codex's SH-012 commit `17fb1e7`, into `claude/skyhawk-sh010-seeded-engine` (PR #329). SH-010 had moved the solution text into `SkyhawkEngine`, so `formatForRounding` now lives in the engine. It is applied to the same values (climb minutes, both bearing components, descent loss) and exported for testing. Codex's regression checks were ported to the engine API: 105 mph / 2.4 h / S 25° W shows `106.4998 → 106`, the exact half shows `87.500 → 88`, 86 mph / 5° / 6 min shows `0.749… → 0.7`, and every displayed approximation in the 10,000 seeded cases per skill must round to its stated answer.
- Tests and evidence: `tests/verify-skyhawk-trig.cjs` passes 22/22. All seven `tests/verify-*.cjs` suites, `check_html_structure.py`, `check_links.py`, and `git diff --check` pass. No browser check was performed for this merge.
- Task status and owner: Unchanged. SH-010 Verification, Claude (Opus 5.5); SH-012 Verification, Codex.

### 2026-11-20 — Codex — PR #329 reconciliation starting assessment

- Entry type: Starting assessment and integration review; SH-010 and SH-012.
- Starting branch and commit: `codex/reconcile-pr329` from PR #329 head `9f245f9`, using the clean primary checkout. The separate Claude worktree is untouched.
- Current status assessment: The user authorized merging PR #328 and updating PR #329 against main. Merged #328 as `92bcffc` and retargeted #329 to main. The developer's latest commit `9f245f9` had already resolved the earlier overlapping changes by moving `formatForRounding` into `SkyhawkEngine` and porting the display regression checks. Reviewed those resolutions and confirmed both append-only tracker histories remain present.
- Integration plan: Merge `origin/main` into the reconciliation branch without rewriting the developer's history. Verify the exact-half and near-half display cases, seed replay, grading, all seven regression suites, and the final diff before updating the existing PR branch.
- Ownership/status: Existing SH-010 and SH-012 owners and Verification states remain unchanged. Codex owns this integration review. Browser and deployment checks remain pending; no new browser verification is claimed.

### 2026-11-20 — Codex — PR #329 reconciliation verification and handoff

- Entry type: Verification and handoff; SH-010 and SH-012.
- Integration: PR #328 is merged at `92bcffc`. Retargeted PR #329 to `main` and merged that main commit into the PR #329 history. The merge completed cleanly because `9f245f9` already contained the developer's conflict resolution. No activity or test changes were needed beyond that resolution; both prior tracker histories are preserved.
- Review result: The seeded engine retains `formatForRounding` for climb minutes, both bearing components, and descent loss. The fixed `106.4998 -> 106`, exact-half `87.500 -> 88`, and descent boundary cases remain covered. Reviewed seed/code parsing, deterministic generation, grading, page replay, and label wiring; no additional actionable defects found within this reconciliation scope.
- Tests and evidence: All seven `tests/verify-*.cjs` suites pass against the combined result. Skyhawk passes 22/22 checks, including 10,000 cases per skill, display-to-answer consistency, seed and parameter reproduction, code round-trips, grading, and page replay. Shared MATH 130 and embedded offline fallback checks pass. `git diff --check` and the staged diff check pass; there are no unresolved merge entries.
- Limitations: Browser and deployment verification remain pending for this combined result. Python-based site validators were not rerun because the installed Python launchers are unavailable in this environment.
- Implementation reference: Reconciliation merge on PR #329 (`claude/skyhawk-sh010-seeded-engine`), prepared from `9f245f9` and main `92bcffc`.
- Task status and owner: SH-010 and SH-012 remain Verification with their existing owners; SH-001 and SH-011 likewise retain their Verification status. No tracker task is closed by this integration check.
- Remaining work and next action: Review the updated PR #329, then perform browser and deployment checks before recording those tasks as Done. The separate layout worktree was not modified.

### 2026-11-20 — Claude (Opus 5.5) — SH-002, SH-003 responsive layout

- Entry type: Starting assessment, progress, verification, and handoff.
- Branch and starting commit: `claude/skyhawk-sh002-layout`, stacked on `9f245f9` (PR #329, SH-010, including the SH-012 merge), which is stacked on PR #328. Neither is merged yet.
- Current status assessment: Reproduced both findings in the built-in Chromium pane with a scripted audit. For each control, the audit checks that it can be scrolled into view by the user, sits fully inside the viewport, and is not covered (`elementFromPoint`). It also checks whether the progress text and bar are covered and whether the page scrolls horizontally.
  - SH-002: Start Engine was unreachable at 320×568 and 844×390, and the return-stage problem-code link was unreachable on the review screen at 844×390. Both `html` and `body` were `overflow: hidden` with a fixed `100vh` height, so users could not scroll.
  - SH-003: At 1366×768 the course navigation (z-index 50) fully covered the progress text and bar on every stage screen. `#progress-container` was `position: absolute; top: 0`.
- Finding or change (`SkyhawkTrig.html` CSS only; no script or text changes):
  - `body` is now a `min-height: 100vh/100dvh` flex column with no overflow clipping or `100vw` width, so the page scrolls when content exceeds the window.
  - `#progress-container` is in normal flow directly below the course navigation, with centered, wrapping text.
  - `#game-area` grows with its content and clips the decorative scene horizontally (`overflow: hidden`).
  - `#modal-overlay` is in normal flow, with padding that includes the bottom safe area, so the panel grows instead of being clipped.
  - `#modal` uses `width: 100%`, `max-width: 550px`, `box-sizing: border-box`, and `clamp(16px, 5vw, 30px)` padding.
  - `.input-group` wraps, so long labels sit above their inputs on narrow screens.
  - The shared `.m130-topbar` style was not changed.
- Tests and evidence:
  - `tests/verify-skyhawk-trig.cjs` has three static CSS guards. They check that `html`/`body` have no `overflow: hidden`, fixed `100vh`, or `100vw`; that the progress bar and panel are not absolutely or fixed positioned; and that the scene area clips horizontally. All three failed before the change. The file now passes 24/24, all seven `tests/verify-*.cjs` suites pass, and `check_html_structure.py` and `check_links.py` pass.
  - After the change, the scripted audit found 0 problems on the welcome, elevation question, return question, return review, success, and completion screens at:
    - `320×568`, `390×844`, `844×390`, and `1366×768`;
    - `683×384`, which approximates 1366×768 at 200% zoom;
    - `320×568` with the root font size at 200%, simulating enlarged text.

    Screenshots at 320×568 and 844×390 show the progress bar below the navigation and the panel scrolling. There were no console errors.
- Not performed: real phones, an on-screen keyboard, actual browser zoom (approximated by viewport size), browsers other than the built-in Chromium pane, and deployment checks. The keyboard criterion is likely satisfied because the page can now scroll, but it is unverified.
- Observation (no new task): On small screens the dark overlay and panel cover most of the flight scene, so the plane is mostly hidden. This is already within SH-006's scope ("the central panel concealed much of the flight scene").
- Implementation commit or PR: pending (this branch).
- Task status and owner: SH-002 and SH-003 Verification, Claude (Opus 5.5). Close after a real-device or mobile-keyboard check and deployment.
- Remaining work and next action: Commit and open a stacked PR. Next recommended task: SH-004 (blank and partly correct answers), then the rest of SH-005.

### 2026-11-20 — Claude (Opus 5.5) — SH-004 correction loop; new SH-013

- Entry type: Starting assessment, progress, verification, and handoff.
- Branch and starting commit: `claude/skyhawk-sh004-feedback`, stacked on `840866e` (PR #330, SH-002/SH-003), which is stacked on PR #329. Neither is merged yet.
- Current status assessment: Read the latest entries. Nobody had claimed SH-004, and Codex's PR #329 reconciliation entries do not touch it. Reproduced both audit findings in a Node VM against the current page with `bearing` 125 mph / 1.4 h / S 30° W:
  - Submitting blank entries switched to "Math Review", showed the full solution, and removed the inputs.
  - Submitting `152`/`90` (South correct) did the same, with only the generic "see where you made a mistake" text.
- Change (`SkyhawkTrig.html`), following the plan's sequence: attempt → feedback on each part → targeted hint → retry → optional worked solution → fresh problem.
  - Engine:
    - Each field now carries its exact value, precision, unit, a list of recognizable mistakes (the value an error produces plus a hint naming that error), and a general retry hint.
    - `validate()` rejects blank, non-numeric (e.g. `12,5`, `5 miles`), and nonfinite entries.
    - `diagnose()` grades each part. Hints are chosen in this order: a recognized mistake, then a rounding hint (unrounded value, or within one unit; halves round up), then the retry hint.
    - Recognized mistakes include sine/cosine swaps and total distance used as a component (bearing); hours instead of minutes, cosine, airspeed instead of vertical speed, and distance instead of time (climb); minutes used as hours and distance instead of altitude lost (descent); and added legs, the complementary angle, and radian mode (return).
    - `grade()` now delegates to `diagnose()`. No hint contains an answer value.
  - Page:
    - Invalid entries get an inline message next to the field (`aria-invalid` and `aria-describedby` set; focus moves to the field). No attempt is counted, and the solution stays hidden.
    - A graded wrong attempt keeps every entry. Each part is marked in text ("✓ Correct. Keep this value." or "✗ Needs attention." plus its hint), and color only supplements the text. A status line reports, for example, "Attempt 1: 1 of 2 parts correct". Focus moves to the first wrong part, and the buttons become Check Again and Show Worked Solution.
    - The worked solution appears only on request. It lists the student's last answers for comparison and offers only "Try a Fresh Problem" (a new seed for the same skill).
    - Each problem has an attempt record (`count`, `assisted`, `solutionViewed`, `solved`, `firstTry`). Showing a targeted hint or the solution marks the problem assisted. Submissions after solving or viewing the solution are ignored. The success screen states "Correct on your first attempt." or "Correct on attempt N, after using hints."
    - The welcome text now describes this flow.
  - Not built: there are no aggregate counters yet (SH-008), so "retries do not inflate counts" is enforced through the per-problem record and tests only.
- Tests and evidence:
  - `tests/verify-skyhawk-trig.cjs` passes 39/39. The 14 new checks failed before implementation. They cover validation, per-part diagnosis, each recognized mistake, and agreement between `diagnose` and `grade`. They also confirm, over 3,000 seeds per skill with wrong entries, that no hint reveals an answer. Page-flow checks cover blank entries, partly correct attempts, assisted retries, first-attempt success, ignored repeat submissions, and the explicit solution followed by a fresh problem. The older page grading test now uses the richer DOM stub.
  - All seven `tests/verify-*.cjs` suites pass, as do `check_html_structure.py`, `check_links.py`, and `git diff --check`.
  - Browser check in the built-in Chromium pane on `?problem=bearing-9ix`, with clicks and typing:
    - a blank Submit showed "Enter a number for South.", focused South, and counted no attempt;
    - `126`/`130` kept both entries, marked South correct and West as needing attention, and focused West;
    - correcting West to `122` and choosing Check Again gave "Correct on attempt 2, after using hints.";
    - the worked solution listed the student's entries and offered a fresh problem.

    There were no console errors. The layout audit at 320×568 found no unreachable controls and no horizontal scroll in the feedback and worked-solution states.
  - Not performed: screen-reader testing, real devices, and deployment.
- New finding SH-013 (P2, wording): Flight times are drawn as tenths but displayed as plain numbers. Whole-hour values therefore read "for 1 hours" (about 6% of bearing prompts: 231 of 4,000 seeds) and appear as "1 hrs" in solutions. This predates SH-010; the old `parseFloat(toFixed(1))` behaved the same way. Fix by formatting times with one decimal (or singular/plural wording) in prompts and solutions.
- Related: The green "Show Worked Solution" button reuses `.secondary` (white on `#4CAF50`, about 2.78:1), which is still SH-005. Enter-to-submit is also still SH-005.
- Implementation commit or PR: pending (this branch).
- Task status and owner: SH-004 Verification, Claude (Opus 5.5). Close after a screen-reader check and deployment. SH-013 Open, Unassigned.
- Remaining work and next action: Commit and open a stacked PR. Next recommended task: SH-005 (Enter key, live announcements, button contrast, reduced motion). Then SH-013 is a quick wording fix.

### 2026-11-20 — Claude (Opus 5.5) — SH-005 keyboard, announcements, contrast, motion

- Entry type: Starting assessment, progress, verification, and handoff.
- Branch and starting commit: `claude/skyhawk-sh005-a11y`, stacked on `9d808cf` (PR #331, SH-004), which is stacked on #330 and #329. None are merged yet.
- Current status assessment: Nobody had claimed SH-005. Labels and units were already associated by SH-010, and correct/incorrect text without relying on color by SH-004. Confirmed the remaining gaps:
  - Enter did nothing.
  - There was no status live region, and focus stayed on the clicked button, which was then replaced.
  - Measured contrast against white: green `.secondary` buttons 2.78:1 (4.12:1 on hover) and the input border `#90CAF9` 1.75:1 (below the 3:1 non-text minimum). Every other text pair passed: blue button 5.75, progress text 5.20 at the lightest gradient stop, hint 5.74, error 4.98, problem code 7.00.
  - No `prefers-reduced-motion` handling, so the plane's 2 s transition always animated.
  - The plane emoji and the `☑` glyphs were exposed to screen readers.
  - There was no `main` landmark; Lighthouse accessibility scored 98 before this was fixed.
- Change (`SkyhawkTrig.html`):
  - Keyboard: Enter in an answer field checks the answer once (`submitOnEnter`; held-down repeats and other keys are ignored, and solved or solution-viewed problems ignore it as well). An amber 3px `:focus-visible` outline appears on buttons, links, inputs, and the heading.
  - Focus order:
    - a new question focuses its first input, which `aria-describedby` links to the question text and the field's feedback;
    - feedback focuses the first part that needs attention;
    - the success, worked-solution, and completion screens focus their heading (`tabindex="-1"`).
  - Announcements: `#error-msg` is a single `role="status"` region, so validation and attempt results are announced. The per-field `aria-live` was removed; field feedback is read with its input. The question panel is a `role="region"` labelled by its heading. The activity area is now `<main>`. The progress bar has `role="progressbar"` with `aria-valuenow`/`aria-valuetext` (for example "Stage 2 of 4: 1 completed"). The plane and `☑` glyphs are `aria-hidden`.
  - Contrast: `.secondary` is now `#2E7D32` (5.13:1), with hover `#1B5E20` (7.87:1). The input border is now `#1976D2` (about 4.6:1). The invalid border `#B71C1C` is 6.57:1.
  - Motion: `prefers-reduced-motion: reduce` turns off transitions on the plane, the progress fill, and buttons. The final plane position and the progress values still convey the same information.
  - `endGame()` now sets the stage counter to complete itself, rather than relying on the caller.
  - Not changed: the completion text still says the skills were "mastered", which remains SH-008. The course top bar is shared and was not changed.
- Tests and evidence:
  - `tests/verify-skyhawk-trig.cjs` passes 49/49. Nine of the ten new checks failed before the change. The tenth (status text) already passed via SH-004. The checks cover:
    - computed contrast for every button state and both input-border states;
    - the reduced-motion block and the focus-visible outline;
    - static markup: status region, focusable heading, `main` landmark, hidden decorations, and the progress bar;
    - `aria-describedby` wiring with no stray `aria-live`;
    - Enter (once, repeat, other keys, after solving);
    - focus on each screen change, status announcements, and progress-bar values.
  - All seven `tests/verify-*.cjs` suites pass, as do `check_html_structure.py`, `check_links.py`, and `git diff --check`.
  - Keyboard-only browser run (built-in Chromium pane), using only Tab, Enter, Ctrl+A, and typing:
    - Start Engine led to stage 1 with focus on the input;
    - a wrong answer submitted with Enter kept focus on the input with the status shown;
    - a corrected answer submitted with Enter focused "Calculation Correct!", then Tab Tab Enter on Continue Flight;
    - stages 2–4 continued the same way until "Landing Successful!" was focused and the progress bar read "Flight complete: all 4 stages done".

    There were no console errors. The accessibility tree shows the navigation, progress bar, region with heading, status, and buttons.
  - Lighthouse snapshot audits (chrome-devtools MCP, headless Chrome) scored 100 for accessibility on the welcome screen (mobile), the bearing feedback state (mobile), and the worked-solution state (desktop). The only remaining failure in any category is SEO `meta-description`, which is outside SH-005.
  - The layout audit at 320×568 and 844×390 still finds 0 issues after the `<main>` change.
- Not performed:
  - No real screen reader was used (NVDA, JAWS, VoiceOver, or TalkBack); the announcement behavior is inferred from roles and the accessibility tree.
  - The reduced-motion preference was not emulated in a browser; it is verified only by the CSS guard.
  - Real 200% browser zoom and real devices were not tested.
- New findings: None beyond the SEO observation above (no meta description). It was not filed as a task because it is not part of this activity's plan.
- Implementation commit or PR: pending (this branch).
- Task status and owner: SH-005 Verification, Claude (Opus 5.5). Close after a real screen-reader pass (for example NVDA with Chrome) and deployment.
- Remaining work and next action: Commit and open a stacked PR. Next recommended task: SH-013, a quick wording fix. Then SH-007 (bearing variety), which reopens the shared-engine decision, and SH-006 (diagrams).

### 2026-11-20 — Claude (Opus 5.5) — SH-013 one-decimal times and altitudes

- Entry type: Starting assessment, progress, verification, and handoff.
- Branch and starting commit: `claude/skyhawk-sh013-decimal-times`, stacked on PR #332 (SH-005).
- Current status assessment: Nobody had claimed SH-013. Reproduced it with the new test, and found it is broader than recorded. Every value drawn in tenths prints without its tenth when it is a whole number:
  - bearing: "for 1 hours" and "1 hrs";
  - return: "North for 1 hours" and "120 * 1 = 120.0 mi";
  - climb: "an altitude of 1 miles" and "d = 1 / sin(…)".
- Change (`SkyhawkTrig.html` engine text only): Format `alt`, `time`, `timeN`, and `timeW` with `toFixed(1)` in prompts and worked solutions, so they read "1.0 hours", "1.0 hrs", and "1.0 miles". Parameters, answers, grading, and problem codes are unchanged, so existing problem codes replay the same problems with corrected wording.
- Tests and evidence:
  - `tests/verify-skyhawk-trig.cjs` passes 51/51. The two new checks failed before the change (first failure: `elevation-1`, "altitude without a tenth").
    - The first scans 4,000 seeds each for climb, bearing, and return, and asserts that no time or altitude prints without a tenth. The sample must include at least 100 whole-number values.
    - The second is an explicit regression for 116 mph / 1.0 h, return 1.0 h / 0.5 h, and climb altitude 1.0.
  - All seven `tests/verify-*.cjs` suites pass, as do `check_html_structure.py` and `git diff --check`.
  - No browser check: the page renders these engine strings directly, as the existing `?problem=` replay test confirms.
- Implementation commit or PR: pending (this branch).
- Task status and owner: SH-013 Verification, Claude (Opus 5.5). Close after merge and deployment.
- New findings: None.
- Remaining work and next action: Commit and open a stacked PR. Next recommended task: SH-007 (bearing quadrants and equivalent bearings), which reopens the shared-engine decision, or SH-006 (diagrams).

### 2026-11-20 — Claude (Opus 5.5) — SH-007 varied quadrants and equivalent bearings

- Entry type: Starting assessment, decision, progress, verification, and handoff.
- Branch and starting commit: `claude/skyhawk-sh007-bearings`, stacked on PR #333 (SH-013), which is stacked on PRs #332, #331, #330, and #329. None are merged yet.
- Current status assessment: Nobody had claimed SH-007. Confirmed the audit finding on the current engine:
  - every bearing problem was `S θ° W`;
  - every return problem flew North then West, and its answer field was labelled `Bearing Angle S __° E`, so the student supplied only the angle;
  - a compass heading or an equivalent quadrant form could not be entered.
- Decision (shared engine, revisited from the SH-010 entry): Still not adopted. The page remains a single offline file. Its return answers are graded to the nearest degree, not to 0.1° with tolerance as in `math130-test3-skills.js`. However, the bearing input grammar now matches the shared engine's `bearingClose` parser: `N 35° E`, `N35E`, angles measured from the east–west axis such as `E 55° N` (angle at most 90), and compass headings from 0 to 360, compared as headings. A future merge can therefore share one parser.
- Change (`SkyhawkTrig.html`):
  - Directions (`ns`, `ew`) are now drawn for bearing and return problems after the existing numeric picks. Existing problem codes keep their speeds, times, and angles, and gain a direction. When omitted, `build()` defaults to the previous S…W (bearing) and North-then-West (return) cases.
  - Bearing stage: the prompt, field labels, hints, and worked solution use the drawn quadrant, for example "N 30° E … How many miles North and East" with fields "North (miles)" and "East (miles)". The stage hint asks for positive distances, and a negated component gets the hint "Enter a positive distance: the field already names the direction." No signed-coordinate convention is used anywhere.
  - Return stage:
    - The legs fly toward any quadrant. The prompt asks for "the bearing to fly home" as a quadrant bearing or a compass heading.
    - The stage hint says to reverse both outbound directions without naming them, and the field is a text box labelled "Return bearing (degrees)".
    - Correct answers are the rounded quadrant bearing or any equivalent form: compact, angle from the east–west axis, or compass heading. A heading equal to the rounded exact heading is also accepted, which keeps half-degree cases consistent.
    - Targeted hints cover:
      - the outbound bearing, or only one direction reversed (including a heading equal to that bearing): reverse both directions;
      - the complementary angle: measure from the North–South axis, with tan θ = {east–west leg} ÷ {north–south leg};
      - radian mode;
      - an unrounded angle;
      - an answer within 1°.
    - Malformed entries (`N 95 W`, `400`, `-20`, `NE 37`, free text) get an inline message and cost no attempt.
    - The worked solution names the return directions and gives the equivalent compass heading.
  - Page: bearing fields render as `type="text"` (no autocomplete, capitalized), with a matching text-input style (9em, 4.6:1 border). The worked-solution summary now HTML-escapes typed entries, because bearing entries are free text.
- Tests and evidence:
  - `tests/verify-skyhawk-trig.cjs` passes 59/59. The seven new SH-007 checks failed before the change, except the code-stability check, which is designed to pass both before and after. Three existing return checks failed until they were updated for string answers. The new checks cover:
    - all four quadrants for both stages (400 seeds);
    - unchanged numbers for existing problem codes;
    - direction-named, positive components;
    - accepted equivalent forms;
    - each targeted hint;
    - malformed-entry messages;
    - text entry through the page.
  - An exhaustive check covers all 7,744 return parameter sets (16 speeds × 11 × 11 leg times × 4 quadrants). It compares each answer against an independently computed reversed quadrant bearing, confirms the compact, east–west-axis, and heading forms are accepted, and confirms the outbound bearing is rejected.
  - The "no hint reveals an answer" check now also asserts that hints do not reveal the return directions or angle.
  - All seven `tests/verify-*.cjs` suites pass, as do `check_html_structure.py`, `check_links.py`, and `git diff --check`.
  - Browser check (built-in Chromium pane, typing) on `?problem=return-5` (outbound South then East):
    - `171` / `S 28 E` kept the correct distance and gave the reverse-both-directions hint, with focus on the bearing;
    - replacing the bearing with `332` and pressing Enter gave "Correct on attempt 2, after using hints";
    - a markup-like entry was rejected as an invalid bearing;
    - the worked solution listed the entries (escaped) and ended "S 37° E (equivalently, a compass heading of 143°)";
    - there were no console errors.
  - The 320×568 layout audit found 0 issues in the return question and feedback states; the bearing box is 164px wide. Lighthouse (mobile snapshot, feedback state) scored 100 for accessibility; the only failure is the SEO meta description already noted.
- Not performed: real devices, a screen reader, and deployment. There is no separate guided/independent mode yet (SH-008). The direction-free return entry applies to every return problem.
- New findings: None.
- Implementation commit or PR: pending (this branch).
- Task status and owner: SH-007 Verification, Claude (Opus 5.5). Close after merge and deployment.
- Remaining work and next action: Commit and open a stacked PR. Next recommended task: SH-006 (diagrams; quadrant data now exists for the bearing and return sketches), then SH-008 and SH-009.

