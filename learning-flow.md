# Learning flow

Product reference, 2026-10-20. The initial game and explicit review scheduler are implemented. See [implementation notes](README.md).

Length-based chapters are the agreed direction. The lesson structure and numerical defaults below are proposed adaptations for this child, rather than a reproduction of Duolingo's internal algorithm.

## What we borrow from Duolingo

Duolingo describes a guided course with short lessons, easier recognition exercises before more demanding production, and personalised practice based on material due for review and mistakes. This supports a path that gradually removes spelling support while bringing earlier material back. [Official course guide](https://blog.duolingo.com/duolingo-101-how-to-learn-a-language-on-duolingo/).

Its explanation of spaced repetition also describes returning to mistakes at the end of a lesson and selecting later review using spacing and accuracy. [Official spaced-repetition explanation](https://blog.duolingo.com/spaced-repetition-for-learning/).

Our implementation will use simple explicit rules and the child's own attempts. It does not need a large machine-learning model. Keep the experience minimal: a clear next lesson, varied exercises, brief feedback and visible completion progress.

## Course organisation

| Layer | Role |
| --- | --- |
| Chapter | Visible word-length band. |
| Word pack | About 3–4 words within the chapter, selected with spelling-pattern relationships in mind. This is a teaching group, not necessarily all new in one session. |
| Lesson | A short path node mixing appropriate tasks for current words and earlier review. |
| Exercise | One clue and one of the five challenge types. |
| Word progress | Independent evidence of recognition, supported practice and delayed spelling recall. |

The current 88 words divide as follows:

| Chapter | Letters | Words |
| --- | --- | --- |
| 1 | 4–5 | 21 |
| 2 | 6 | 23 |
| 3 | 7 | 16 |
| 4 | 8 | 12 |
| 5 | 9 | 8 |
| 6 | 10–11 | 8 |

Use word length for the visible path. Use the 22 learning sets as cross-cutting teaching and review metadata, not as a competing chapter sequence. A short word can still need substantial spelling practice. Keep earlier short words in review after longer chapters open.

The authored [course definition](content/course.json) now supplies 31 packs of up to three words, each with Learn, Build and Spell nodes (93 nodes total). Final short remainders can contain one or two words. The first pack is cash, chair, queen. Course order is explicit rather than inferred from CSV row order or set numbers.

## A repeating path pattern

The path should revisit word packs as support decreases, while introducing later packs. A possible cycle is:

| Path node | Main purpose | Likely exercises |
| --- | --- | --- |
| Learn pack A | Introduce meaning, audio and correct spelling. | Choose the Spelling and a focused Tricky Part. |
| Build pack A | Assemble the words and repair specific decisions. | Arrange Chunks, selected Tricky Parts and some Arrange Letters. |
| Learn pack B, revisit A | Introduce a little new content while retrieving earlier words. | Supported tasks for B, Arrange Letters or typing for ready words in A. |
| Mixed practice | Select tasks from actual mistakes and review needs. | Any appropriate task, with optional extra tiles only where useful. |
| Spelling check | Check recall of introduced words from English audio. | Whole-word typing, with suitable spoken context. |

This cycle is an authoring template, not a requirement that every child complete identical exercises. Continue with later packs while A and B return in scheduled review. A path node has a main purpose but can contain several task types. The five challenge types are not five isolated course-wide blocks.

## Progression for each word

Choose the Spelling, Tricky Part, Arrange Chunks, Arrange Letters and Type remain separate task types, with a weighted selection rather than a compulsory order. Introduce covers all four non-writing tasks per pack word. Arrange uses harder non-writing review, and Spell is typing-only. A word returning within the same session normally gets a different task. Recent errors can receive a matching focused repair.

Do not treat the sequence as an absolute difficulty ranking. A difficult distractor can make a choice question harder than a simple arrangement. Extra-tile count, clue type and the particular word also change the task.

Maintain separate evidence for:

- Whole-word recognition.
- Specific tricky-part decisions, keyed by trick_id and pattern_id.
- Arrange Chunks, including extra_tile_count.
- Arrange Letters, including extra_tile_count.
- Unassisted whole-word spelling, including whether the clue was English audio.
- Delayed recall on a later practice day.

A correct choice or arrangement does not establish typing mastery. Replaying natural target audio is allowed during a spelling attempt. Revealing written letters or the whole spelling changes the attempt into supported practice.

## Inside one lesson

Use up to eight planned questions and allow at most two delayed retries, for a maximum of ten. When only the first three words are available, use six questions rather than padding the lesson with repetitions. Ordinary lessons use any one word at most twice before retries. This is a proposed limit intended to keep sessions manageable. Showing a new word's meaning and spelling is an unscored teaching step.

A typical established-learner lesson has four questions on the current pack and four distinct earlier words. With a smaller familiar pool, mix every available earlier word once and use up to two questions per current word; shorten the session when there is insufficient variety. Introduce at most three unfamiliar words per session.

Earlier words do not need to be due before they can appear. Reserve up to two review slots for due words or recent errors, and fill the rest with familiar words that appeared less often in the last sixteen attempts, then least recently practised. Interleave these questions through the lesson. Never pull an unseen future word into a review slot. Use focused repair after errors, advance supported words toward typing, and ask previously recalled words to type.

The path also interleaves packs: Learn A → Learn B → Build A → Learn C → Build B → Spell A, continuing the same rolling pattern and completing the remaining Build/Spell nodes at the end of a chapter. Existing stable lesson IDs and completion history remain valid. The child sees this chronological order on the path. Review offers a mixed session of previously introduced words. There is no parent screen or manual word/difficulty picker.

During an exercise, present one clue and task, accept an answer, then give brief feedback. Keep the correct spelling out of the pre-answer clue. Respect both image_requires_context and a tricky-part row's context_required flag. Abstract pictures and ambiguous translations need a target-identifying audio or meaning cue.

After a mistake:

1. Show the correct spelling and highlight the relevant difference.
2. Record the first attempt and its support level.
3. Use a matching existing tricky-part challenge when the error can be identified reliably.
4. Let other questions intervene before asking for the word again, often in an end-of-lesson retry.
5. If another retry would exceed the lesson limit or immediately repeat the final queued word, carry the word into the next review. Do not create an endless correction loop.

A corrected retry shows practice progress. It must not erase the original error or count as independent recall on a later day. A retry after revealing spelling is not evidence of durable mastery.

End with a short completion result and an obvious Continue or Done action. Lesson completion and word mastery are separate states. Move the visible path forward while allowing the next node to provide more support if the recent work was difficult. Review remains available from Home once words have been introduced.

## Review over time

Use time since practice, recent correctness and support used to select due words. A starting schedule can review a successfully recalled word on the next practice day, a few days later and about a week later, extending intervals after successful recall and shortening them after errors. These intervals are tunable product defaults.

Include due words inside ordinary lessons. Prefer words actually encountered in the current letter level; include at most one encountered word from another level per lesson. The word list determines eligibility, regardless of word length. Do not infer vocabulary from selecting a level.

Use at least two successful whole-word spelling attempts on separate practice days as the initial Remembered criterion. Include English-audio recall for spelling-bee readiness. Keep occasional review after a word is Remembered. An immediate same-lesson correction is insufficient.

Avoid promoting or demoting words based on typing speed: unfamiliarity with touch controls can affect response time. No countdown is needed.

## Lesson selection rules

The session planner uses this order:

1. Identify the current length chapter and active word pack.
2. Select familiar review words, prioritising up to two due/error items and rotating other earlier words even before their due date.
3. Add current-pack practice and a limited amount of new material according to the node's purpose.
4. Select each word's task using its observed support needs, rather than only the path position.
5. Select suitable clues and a small, deduplicated candidate set. Preserve required duplicate tiles in arrangement tasks.
6. Interleave current and earlier words, avoid back-to-back repeats and use at most two planned questions per word.
7. Reserve no more than two retry positions, then save attempts and update future review state.

Existing CSV content provides the words, translations, images, distractors, chunks and tricky-part definitions. Chapter membership is derived from word length. Pack order and path nodes belong in the separate course definition; learning history belongs in local progress storage. Do not add the child's progress to the content CSVs.

## Relationship to the app concept

[App concept](app-concept.md) remains the overall product reference. [Learning sets](content/learning-sets.md) owns the spelling-pattern definitions and full word mapping. This document owns the proposed path and lesson-selection behaviour. The whole-word typing interaction remains as already defined in the concept.

## Automatic arrangement difficulty

Track chunk and letter arrangement independently for each word. Begin with 0 extras; two correct non-retry attempts at the current level earn the next level, up to 2 extras. A wrong answer steps down one level and clears the success count. Retries cannot promote difficulty. Keep all required tiles and use fewer extras only when the authored bank cannot supply enough candidates.

## Development resets

History and review evidence persist within a build. Every newly loaded development build clears learner history, word progress, completion and the active lesson. Updates activate/reload automatically. Same-build reload and rotation preserve answers. There is no parent settings or backup UI.

## Current lesson roles and level entry · 2026-10-20

These rules supersede earlier generic eight-question sampling. Introduce uses every non-writing task for each pack word (12 core questions for three words), plus up to two older questions. Arrange has up to eight non-writing questions, favouring chunks/letters with focused repair. Spell has only typing questions, including retries, using each target once before corrections and mixing older words up to eight questions. Each lesson can add at most two delayed retries. Build/Spell have no new-word introduction screens, including direct dev jumps.

The first lesson in each letter-length chapter is independently accessible; dev mode unlocks all lessons. Review requires an actual encounter (progress.seen), matching the word list. Words from the current level take priority, with at most one planned review question from another level per lesson. Both shorter and longer encountered words qualify; no unseen word is assumed known. Arrange/Spell prioritise the most recently completed introduction pack in the current level before filling remaining review places. See README.md for budgets and src/config.ts for the dev override.

### Gradual clue removal · 2026-10-20

Kenali keeps introduction cards, images/meanings and masked written sentences. Susun starts with word/sentence audio plus its non-writing answer controls; Bantuan optionally reveals a safe image/translation, never the written sentence or an identical translation that gives away the answer. Eja sendiri uses only word/sentence audio and an empty keyboard answer, with no pictures, translation, sentence text, word-length hint or Bantuan. Audio replays do not count as assistance; sentence playback remains 0.8×. Corrections remain visible after submission. Bantuan use persists per question in history and saved lessons, resets on the next question, and cannot count as independent recall or promote arrangement difficulty. Review questions and retries follow their current lesson’s clue rules.
