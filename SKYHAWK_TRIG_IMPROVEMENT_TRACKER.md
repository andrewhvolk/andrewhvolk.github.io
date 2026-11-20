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
| SH-001 | P1 | Correct rounding and answer grading at numerical boundaries | 1 | Open | Unassigned | Initial audit below |
| SH-002 | P1 | Make controls reachable on small screens and in landscape | 2 | Open | Unassigned | Initial audit below |
| SH-003 | P1 | Prevent navigation from covering flight progress | 2 | Open | Unassigned | Initial audit below |
| SH-004 | P2 | Validate entries and provide feedback on each answer part without clearing work | 3 | Open | Unassigned | Initial audit below |
| SH-005 | P2 | Complete keyboard, label, announcement, contrast, and motion support | 2 | Open | Unassigned | Initial audit below |
| SH-006 | P2 | Add mathematically accurate instructional diagrams | 4 | Open | Unassigned | Initial audit below |
| SH-007 | P2 | Vary bearing/return directions and accept equivalent bearings | 4 | Open | Unassigned | Initial audit below |
| SH-008 | P2 | Separate guided completion from independent readiness evidence | 5 | Open | Unassigned | Initial audit below |
| SH-009 | P2 | Save, resume, and reset local progress reliably | 5 | Open | Unassigned | Initial audit below |
| SH-010 | P2 | Isolate reproducible calculation/generation logic and add regression coverage | 1 | Open | Unassigned | Initial audit below |

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
