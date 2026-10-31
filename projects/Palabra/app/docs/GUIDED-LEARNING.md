# Guided entry and daily practice

October 31, 2026. This update implements the simpler student journey requested after the learning audit. The public destination remains https://andrewhvolk.github.io/palabra/.

## Student journey

1. **Start learning:** no required name, chapter, time, deck or practice-mode selection. Five existing authored questions suggest an initial level. Answers and feedback save after each question. The result is provisional, never a mastery award.
2. **Begin with a lesson:** a disclosed alternative for a complete beginner. A class limit can be chosen in the same optional disclosure; the automatic path is the default for new learners.
3. **Continue my learning:** the starting check leads directly into the recommended daily session. A short lesson appears inline, followed by the question. Students do not have to choose between a lesson window and a test. The first response after seeing the lesson is supported practice.
4. **Returning:** unfinished work takes precedence. The existing captured queue, settings, answer draft and feedback resume. Repeated Start clicks reuse the pending session. The Menu learner picker reaches other saved local study spaces directly.
5. **Daily focus:** recent difficulties and unresolved starting-check gaps come first, followed by the next lesson. Earlier objectives return for checks after a delay. Related exercises stay together, rather than sampling many new grammar objectives per session.
6. **A stopping point:** a completed daily session becomes “You’re done for today.” Tomorrow offers a fresh plan; another session today is optional and disclosed. Extra guided practice cannot inflate scheduled introductions or independent skill evidence.

The main Today view is a single compact card with the next activity, remaining work and one prominent Start/Continue action. The desktop sidebar and repeated routine/focus panels are removed. A quiet Explore other practice link remains below the card. Menu holds the library, progress, preferences, learner switching, extra practice and offline/about information. The full 20-question diagnostic remains in Progress. Correction practice and session-ending controls are disclosed rather than competing with Next. Mobile layouts preserve visible save status and navigation.

## Policy and compatibility

`src/guidance.mjs` is a pure recommendation/planning layer over the existing scheduling, grading and persistence engine. New sessions record `guided`, `focusObjectiveId` and `policyVersion: 1`; the short diagnostic also records `warmup`.

- New learners default to an automatic path through 9B, 15 minutes and a ceiling of three new vocabulary cards per day. New words favor the current lesson's chapter, with the shared introductory vocabulary pool retained.
- The word budget allows five/eight/ten activities at 10/15/20 minutes when sufficient reviews are due. Due words precede new introductions. An automatic learner can still review previously introduced later-chapter words after a lower starting-point recommendation.
- A focused daily session contains four main-pattern questions, up to two earlier-pattern checks, a reading/listening item and a sentence/writing/speaking application. Comprehension and application variants rotate by use. Plans are saved; their queues do not silently change mid-session.
- Three independent correct variants, at least 80% correct in the latest five independent responses and production where required allow the path to introduce the next lesson. This is an **initial progression heuristic**, not “secure,” fluent or retained mastery. Diagnostic answers, lessons, hints, retries and self-assessments cannot satisfy it.
- Only the latest completed diagnostic determines its provisional entry/gaps. A resolved gap retires after sufficient independent progress. Recent misses can bring earlier material back. Objectives with independent evidence at least three calendar days old, or those needing review, can be selected for earlier-pattern checks. This is a transparent policy, not a validated memory model.
- Existing v1 and v2 card IDs, schedules, filters, review counts and due timestamps remain exact. Saved preferences without `pathMode` retain their class limit; they are not silently switched to whole-course guidance. Existing incomplete sessions remain captured, including the old lesson/quick-check interface.
- Automatic mode can be selected later with one preference. Class-limited mode respects the saved class position; explicit custom word filters remain in effect. Existing new-word preferences are retained; three is the new-profile default.

## Verification

The pure test suite includes warm-up scoring/backup, automatic introduction and advancement through 9B, difficult/resolved objectives, review priority, custom/class scope, daily reservations, completion/tomorrow, undo/resume, existing preference migration, metadata validation and returning-user entry. The existing scheduling, grading, irregular-verb, migration and content tests remain.

Ten browser flows exercise generated Pages output: scheduled word/draft/cursor persistence; malformed import; teacher assignment and guest isolation; offline reload; consented update; 320px settings/navigation; one-click five-question entry and lesson handoff; an entire guided daily session with stopping point and next-lesson preview; switching between two separately saved learners; and keyboard/outside-click menu navigation with the daily action visible at 320px. Screenshots of the complete Today view are inspected at desktop and 320px widths. Local execution uses installed Chrome with `PALABRA_BROWSER_CHANNEL=chrome`; CI uses Playwright Chromium by default.

## Remaining boundaries

This update simplifies learning interactions; it does not add authentication. Local names are study-space labels, not logins. The agreed future direction remains optional Palabra accounts backed by SQL, with local-only use available. No Google login or paid API is required. SQL hosting/authentication and cross-device synchronization have not been provisioned or implemented.

The broader research roadmap remains partly open: the vocabulary engine still uses five boxes capped at 14 days; automatic same-session lapse relearning, calibrated active-time estimates, separate directional memory schedules, stronger delayed mastery criteria, more independent reading/audio stimuli, recorded speech and actual learner-outcome validation remain future work. Initial progression and workload defaults above are product choices to evaluate. Independent educator/edition review and real classroom Chromebook/audio/accessibility trials remain pending. See LEARNING-AUDIT.md and EDUCATOR-REVIEW.md.

## Quiet daily screen follow-up

The header contains the brand, a compact Saved indicator and Menu. Its accessible label and tooltip still identify browser-local storage. Saving failures, temporary-guest warnings and recovery controls remain prominent; they are not hidden in the menu. Activity/review totals and their explanation now live in Progress. Menu closes after navigation, Escape or an outside click, and Escape returns keyboard focus to its button. All learning policies, queues, IDs and backups are unchanged by this presentation update.
