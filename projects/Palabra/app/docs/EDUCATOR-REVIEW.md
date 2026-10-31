# Independent Spanish educator review

Status: **pending external review**. Automated checks and author review are complete; neither is an independent teacher audit. No educator has approved this release in this session.

The generated [review index](review/index.json) identifies the exact content revision, every chapter and its activity count. Each chapter JSON contains its lesson explanations, examples, prerequisites, passages, transcripts, accepted answers, corrective feedback, production classification, visual/text scene information, rubrics and source references. [Verb references](review/verbs.json) list all 50 references, including irregular forms and tense/person labels. The [blank record template](review/review-records.example.json) is a form for actual findings, not a completed review.

Run `npm run review:packet` to regenerate source snapshots. Keep educator findings in a separate file with the content revision, reviewer and date; regeneration must never overwrite a person's findings. After corrections, regenerate the packet and re-review changed items. The app must retain its author-review wording until a real independent review has been recorded and approved by the operator.

## Review priorities

1. **Answer fairness:** test reasonable alternatives, punctuation/accents, omitted subject pronouns, regional vocabulary and English comprehension wording. Constrained sentence cues intentionally narrow wording; check whether those limits are clear to learners. `ñ` is a distinct letter, not an accent slip.
2. **Verbs in context:** review person/tense targets, stem changes, irregular yo forms, jugar, saber/conocer, ser/estar, affirmative tú exceptions, -car/-gar spelling changes, irregular preterites and optional vosotros. Check that sentence meaning supports the requested tense and form.
3. **Feedback and teaching:** verify rules and examples, especially agreement, plurals, articles, gustar-type constructions, contractions, personal a and object pronouns. Strategy hints must not display the exercise answer before the first attempt.
4. **Progression:** check introductory grouping, the catch-up diagnostic, prerequisites and the chapter map against the intended classroom sequence. The independent vocabulary dataset is not an edition-verified textbook transcription. Record differences instead of certifying exact alignment.
5. **Reading/listening:** check original texts, factual questions, distractors, glossaries and difficulty. Reading/listening objectives are receptive evidence; they do not certify grammar production. Listen to all 21 transcripts in representative classroom browser voices. Reviewed recordings have not been supplied.
6. **Application:** review the 21 complete-sentence tasks and three scene choices, then the writing/speaking prompts and rubrics. Open responses are self-assessed; there is no automatic writing or pronunciation score.

## Record a usable finding

Include the exercise/lesson ID, exact prompt, accepted answer or explanation in question, the learner response that should be accepted/rejected, proposed correction and any regional/classroom note. Label uncertain decisions for follow-up. A review can be partial: list the exact IDs examined and leave all others pending.

The release currently has 90 objectives (48 language-pattern objectives and 42 receptive objectives), 780 activities, 21 readings, 21 listening stimuli, 21 writing prompts and 21 speaking prompts. All 940 vocabulary IDs remain unchanged. Structural coverage and a passing answer-key round trip do not establish teaching quality or independent Spanish review.

## Device/accessibility follow-up

Automated Chromium flows cover 320px reflow, offline reload and consented updates. Live browser checks cover the public app, guest isolation and transfer messaging. Actual managed Chromebook sign-in/sync, audible Spanish TTS quality, a screen-reader session and classroom network behavior remain device/external verification tasks. Do not call this a WCAG certification or a completed classroom hardware trial.
