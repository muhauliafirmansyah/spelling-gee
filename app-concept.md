# Spelling practice app concept

Version: 2026-10-20. Product reference. The initial playable implementation now exists; see [implementation and verification notes](README.md). The full bank is available, with parent pronunciation/content review still pending.

## Purpose

Help a seven-year-old Indonesian child recognise and remember the standard spelling of the English words used by his school, then write those words independently when he hears them.

He already knows how to spell individual letters. The learning problem is choosing the letters and letter groups that represent an English word, especially when its sound suggests a different spelling to an Indonesian listener.

The experience should be simple and enjoyable enough for repeated short practice. Use the clarity and short exercise rhythm the parent likes in Duolingo and EnglishOne as visual references. Keep the content central: no bee story, characters, narrative world or unrelated mini-games.

## Agreed direction and proposed defaults

The agreed direction is a minimal interface, school vocabulary, Indonesian-aware spelling practice, varied clues, five challenge types, and whole-word entry through an in-game keyboard without autocomplete.

Session length, review intervals and readiness criteria below are proposed starting defaults. They can be adjusted after observing the child. They are product decisions for this app, not claims about a scientifically optimal schedule.

## Screen orientation and responsive layout

The web app must work fully in both portrait and landscape on phones and tablets, as well as in desktop browser windows. Both orientations are supported layouts; the child should not have to rotate the device to continue.

Adapt to the available width and height. Keep clues, answer areas, letter/chunk tiles, playback buttons, feedback and navigation readable and reachable. The custom in-game keyboard must remain usable in both orientations, with comfortable touch targets and no browser autocomplete. On short landscape screens, reflow content or allow vertical scrolling so fixed controls and the keyboard never cover the question or answer. Avoid horizontal page overflow and respect device safe areas.

Rotating or resizing during a challenge must preserve the current word, typed letters or arranged tiles, feedback and lesson progress. Layout changes must not reload the page or reset the attempt. Verify all five challenge types in both orientations.

## Content references

| File | Responsibility |
| --- | --- |
| [School words](content/school-words.csv) | The 88 unique target words, their context sentences, Indonesian translations, ordered arrangement chunks, separate Indonesian and general English whole-word distractor banks, and optional chunk/letter distractor banks. Repeated school words appear once. Extra words originally supplied without sentences have authored sentences. |
| [Learning sets](content/learning-sets.md) | The 22 revised spelling groups, research rationale and limits, complete word-to-set mapping, and tricky-part authoring rules. This replaces the earlier 14-set draft. |
| [Image gallery](assets/word-gallery.html) | Labelled parent review of all 88 SVG illustrations. Artwork contains no visible English labels. |
| [Image manifest](content/word-images.json) | Generated image paths, Indonesian alternative descriptions and image context flags. |
| [Tricky parts](content/tricky-parts.csv) | The 238 initial focused challenges covering all 88 words, with replacement templates, correct chunks, separate distractor banks, context flags and feedback. |

These counts describe the current content snapshot. The CSV files own the actual words and challenges. The set document owns set definitions and membership. This concept owns the experience and progression; avoid maintaining another competing word list here.

## Learning approach for an Indonesian speaker

Indonesian spelling is generally more consistent in its sound-to-letter relationships than English spelling. A child may therefore make a sensible attempt to write the sound he hears while missing the conventional English spelling.

Examples supplied in the discussion include raber for rubber, kuin for queen, renbow for rainbow and peren for parent. Each can involve several separate decisions. The app should identify and practise those decisions individually before asking for the whole word again.

| Heard-word attempt | Decisions to teach | Focused practice |
| --- | --- | --- |
| rubber → raber | u, doubled bb, and er if needed | r_bber → u; ru_er → bb; rubb_ → er |
| queen → kuin | qu for the opening sounds and ee for the vowel | _een → qu; qu_n → ee |
| rainbow → renbow | ai in rain, followed by ow in bow when needed | r_nbow → ai; rainb_ → ow |
| parent → peren | a in this word and the complete final nt | p_rent → a; pare_ → nt; par_nt → e if needed |

Use natural English recordings. Do not teach the incorrect spellings as pronunciation guides, add invented sounds for silent letters, or turn a word-specific observation into a universal English rule. Indonesian has schwa and final consonants; the explanation must not claim otherwise.

The two distractor categories describe plausible error mechanisms. They do not prove why this child made an error, and they are not exclusive to a nationality. Research sources and their age-related limits are recorded in the set document. The child's actual answers should guide later practice.

## Clues and answer tasks are separate

The clue identifies the intended English word. The task determines how the child answers. The same word can return with a different suitable clue and a different amount of spelling support.

| Clue | Presentation | Best use |
| --- | --- | --- |
| Listen | Play the English word with an easy replay button. Add a spoken sentence when needed. | Main route toward spelling-bee recall. |
| Picture | Show one clear image representing the intended meaning. Offer audio when helpful. | Concrete words such as chair, balloon, soup and quilt. |
| Indonesian meaning | Show a short Indonesian clue and ask for the English word. Offer English audio during supported practice. | Connecting meaning with spelling. |
| Context sentence | Read the sentence aloud, or display it with the target masked. | Clarifying meaning, grammatical form and ambiguous alternatives. |

Do not force every word into every clue type. Pictures are poor sole clues for words such as might, notice and management. Indonesian clues must match the meaning and grammatical role in the school sentence. For example, notice in the supplied sentence is a verb. A picture of a notice board would cue a different use.

Never show the correct English word in the clue during a scored attempt. The existing context sentences contain the target spelling, so mask every occurrence before displaying them. Audio may say the complete word or sentence naturally.

## The five challenge types

### 1. Choose the spelling

Present a clue and two or three complete spellings. The child selects the correct target word.

Use the whole-word distractors from school-words.csv. Alternatives may be sound-based attempts, English spelling confusions, omissions or letter-order errors. They do not all have to be exact homophones. Their purpose is to contrast plausible spellings of the intended spoken word.

Example: audio and meaning cue for rubber, followed by rubber / raber / ruber.

Show a few useful alternatives at a time. The full distractor bank supports variation across sessions rather than a crowded screen. Rotate positions and candidates so the child cannot pass by remembering where the answer appears.

### 2. Complete the tricky part

Present a clue and the correct word with one chunk hidden. The child chooses the replacement chunk.

Examples:

| Template | Correct chunk | Example displayed choices |
| --- | --- | --- |
| r_bber | u | u / a / o |
| ru_er | bb | b / bb / bh |
| _een | qu | qu / ku / kw |
| qu_n | ee | ee / i / e |
| r_nbow | ai | ai / e / ei |

One underscore represents a variable-length chunk, not one missing letter. Render one constant-looking blank so its width does not reveal the answer length. An empty-string option means no letters and needs a clear label.

Use the specific row in tricky-parts.csv. Compare the selected chunk with answer, reconstruct the full word and show explanation after answering. The explanation must not appear as a pre-answer hint that gives away the choice.

The bh option is retained from the requested rubber example as a structural contrast. It is not claimed to be a common learner error. Prefer meaningful distractors and allow two choices when a third adds little value.

### 3. Arrange chunks

Present a clue and shuffled chunk tiles. The child selects and orders chunks to build the complete word. This is its own challenge type, identified as arrange_chunks in progress records.

Use the ordered arrange_chunks array in school-words.csv as the required tile supply. For example, rubber uses ["ru","bb","er"], queen uses ["qu","ee","n"], and rainbow uses ["rain","bow"]. These examples show canonical order for authoring only; shuffle the tiles during an attempt and hide their original sequence.

Chunks are spelling blocks, not automatically syllables, phonemes or meaningful word parts. Keep useful letter groups together where practical. Chunk boundaries can differ from a missing region in a tricky-part challenge. In particular, break / fast must not teach the child to pronounce breakfast like those standalone words.

Optional extra chunks come from arrange_chunks_indonesian_distractors and arrange_chunks_english_distractors. For rubber, ra can compete with ru and b can compete with bb. These are candidate extra tiles, not prefilled answer slots or full-word choices.

| Variation | Tile supply | Purpose |
| --- | --- | --- |
| Basic | Required chunks only. | Practise ordering familiar spelling blocks. |
| One extra | Required chunks plus one curated extra chunk. | Select the useful chunks as well as their order. |
| Two extras | Required chunks plus two curated extra chunks. | Compare more than one plausible spelling decision. |

Extra tiles stay in the tray when unused. Keep every required chunk available. Offer undo, clear and explicit submit. A correct attempt is the assembled target spelling; it does not require consuming every tile or selecting a particular internal tile ID. If another sequence of supplied chunks also assembles the exact target, accept it.

A longer-word demonstration can temporarily show the correct chunks during teaching, then hide it before the scored attempt. Success is supported spelling practice because the word pieces are supplied.

### 4. Arrange letters

Present a clue and shuffled single-letter tiles. The child selects and orders letters to build the complete word. This is a separate challenge type, identified as arrange_letters in progress records.

Derive one required tile per character directly from word. Rubber therefore supplies r / u / b / b / e / r. Preserve every repeated letter as a separately usable tile. No stored letter-array column is needed.

Optional extra letters come from arrange_letters_indonesian_distractors and arrange_letters_english_distractors. Every candidate must be exactly one letter. For rubber, an extra a introduces the sound-based vowel contrast; an extra b introduces an additional copy that can tempt over-doubling.

Use the same basic, one-extra and two-extra variations as Arrange Chunks. A letter already present in the target may be an extra candidate: it adds one surplus copy, rather than replacing the required copy. Leave unused letters in the tray, and provide undo, clear and explicit submit.

Score the joined spelling rather than the identities of selected duplicate tiles. Two b tiles with the same letter are interchangeable. Do not require all tray letters to be used when extras are present, and do not check letter correctness as the child places each tile.

### Shared arrangement rules

Both tasks remain separate from independent whole-word writing. Track the task type and extra-tile count separately. Chunk ordering, letter ordering and added distractors are different forms of support or difficulty; do not assume a fixed global ranking for every word or learner.

A practical route is Arrange Chunks with no extras, then Arrange Letters with no extras. Add one extra tile to whichever task is already comfortable, and consider two later. The child can skip supported steps for familiar words. Adding extras is optional and is not a prerequisite for whole-word recall.

For each attempt:

1. Load the target, meaning and appropriate clue. Keep target spelling hidden outside the supplied tiles.
2. Create all required tile instances from arrange_chunks or from the characters in word.
3. Choose zero, one or two useful extra candidates from the matching task's banks. This is a session setting, extra_tile_count, not a fixed requirement stored for each word. An empty bank is valid. Use fewer extras if there are not enough useful distinct candidates.
4. Deduplicate candidate values across the two origin banks before choosing extras, then add each chosen value as a new tile instance. Never deduplicate the required tiles or remove an extra merely because its value already occurs in the required supply.
5. Shuffle the complete tray. With no extras, avoid presenting the complete target in correct order. With extras, avoid displaying the correct answer as one obvious ordered run. Keep tile positions and styling independent of whether a tile was added as an extra.
6. Let the child assemble an answer and submit it while leaving unused tiles behind. Compare the assembled text with the canonical spelling. Accept interchangeable tile identities and alternative chunk sequences that produce the same target. Apply the existing policy on valid spelling alternatives fairly and show the school form in feedback.

The starter banks are curated proposals based on plausible sound transfer, letter confusion and extra-letter mistakes, rather than measured error frequencies. Keep the existing distinction between Indonesian-motivated and general English candidates. An extra letter can be familiar or correct elsewhere in the word; it becomes unnecessary only in the quantity or sequence used for this target.

Do not derive chunk extras by blindly cutting up whole-word distractors. Review the current chunk boundaries and the full spellings that selected extras can produce. Confirm that the original target remains constructible with every variation and that accepted alternative spellings are not deliberately presented as wrong answers.

### 5. Write the whole word

Present a clue and an empty answer field. The child enters the complete word using the app's own keyboard.

Use a fixed, familiar A-Z keyboard layout with clear keys, backspace and a submit button. Show the typed letters, but do not provide autocomplete, spellcheck, predictive suggestions, a prefilled first letter, or an indication of the required word length during independent recall. Keep touch-keyboard entry inside the game so the device keyboard does not supply spelling help.

Judge the complete attempt when submitted. Do not signal correctness after each letter during recall. Replay remains available and does not count as a spelling hint. An optional I don't know action should lead to teaching and later review.

The content retains standard capitalisation, including December. For this spelling-focused mode, accept letter case differences and display the canonical form in feedback. Do not accept a different letter sequence merely because it sounds similar.

A later bee-practice mode uses this same task with spoken English prompts, suitable sentence context and mixed word order. Oral letter recitation, microphone scoring and handwriting recognition are outside the current scope.

## Distractor selection

For Choose the Spelling and Complete the Tricky Part, keep the Indonesian and general English banks separate. A wrong option may occur in both banks. Combine selected candidates, deduplicate them, include the correct answer exactly once, and shuffle the visible choices. Arrangement tasks use their own extra-tile banks and preserve required duplicate tiles, as defined above.

A reasonable starting selection is one Indonesian sound-based distractor and one general English distractor, when two distinct, useful candidates exist. If they overlap, select another useful candidate or show two choices. Adapt future selection to the child's actual errors without displaying the authoring categories to him.

Whole-word tasks use whole-word banks. Tricky-part tasks use curated wrong chunks. Do not automatically slice whole-word errors into chunks because a sound-based attempt can change several regions at once.

Check what each option produces. For example, r_bber with o makes robber, which is a real English word. Weather and wether can sound the same. A meaning cue or spoken context must establish the target; do not call another valid word universally misspelled.

The tricky-part context_required flag marks rows that need this additional clarification. Other tasks also need ambiguity checks when selecting candidates. False still requires a cue identifying the target word; it does not authorise a bare template with no clue.

Exclude accepted alternative spellings of the same target from wrong options. The current content rules specifically exclude sirup as a distractor for syrup and kaiak/kyak as distractors for kayak. The school list supplies the form being taught.

## Course path and word-length chapters

The visible course uses word-length chapters, with small packs of about 3–4 words inside each chapter. The agreed chapter bands are 4–5 letters (21 words), 6 (23), 7 (16), 8 (12), 9 (8), and 10–11 (8). These counts cover all 88 current school words.

Length determines chapter placement. The 22 spelling sets guide pack selection, focused practice and review across chapters. They remain useful teaching metadata rather than the child's main sequence of chapters. Earlier words return during later chapters.

The proposed Duolingo-inspired flow is a guided path of short lessons: learn a pack, build it with support, introduce another pack while reviewing the earlier one, mix practice, and check spelling from audio. Lessons can mix the five task types, while each word advances or receives support according to its answers. See [Learning flow](learning-flow.md) for the source references, sample path, bounded retry rules and review scheduling.

Challenge types have different support levels, but they do not define a fixed order. Sample easier tasks more often for new words and increase arrangement/typing after successful practice. Path completion is separate from independent delayed recall.

## Progression within a word

Progress is tracked separately for supported practice and independent recall. Challenge types provide different kinds of support; they are not five rigid global levels.

| Stage | Activity | Evidence obtained |
| --- | --- | --- |
| Meet the word | Show its meaning and correct spelling, play audio, and highlight one useful feature. | Exposure only. |
| Recognise | Choose the spelling from a small set of alternatives. | Recognition of the whole form. |
| Focus | Complete a specific tricky part, revisiting only the decisions that need help. | Recognition of a local spelling decision. |
| Build chunks | Arrange supplied chunks, optionally with extra chunks. | Chunk ordering and selection with spelling support. |
| Build letters | Arrange individual letters, optionally with extra letters. | Letter ordering and selection with spelling support. |
| Recall | Write the whole word from a clue without spelling support. | Independent spelling for that prompt. |
| Retain | Recall again in a later session, mixed with other words. | Recall after a delay. |

A familiar word can begin at recall. An unfamiliar word needs teaching first. A child who succeeds at typing does not need to complete every supported task for that word.

After a wrong whole-word answer, show the correct form and compare the relevant part. Offer one focused challenge, then revisit the word after a few intervening items. That immediate retry is useful practice but is not delayed mastery.

If an attempt changes several regions, use existing word-specific tricky rows to address them one at a time. Match known distractors where possible. For an unfamiliar or ambiguous error, record the attempt and use a conservative whole-word review rather than inventing a precise diagnosis.

## Curriculum across the school list

The 22 sets below are reusable content groups. They replace the earlier 14-set numbering. Set numbers are not compulsory lesson order, and one word can appear in several sets.

| Set | Main spelling focus | Examples from the school bank |
| --- | --- | --- |
| S01 | Short-vowel spelling choices | rubber, fluffy, camel, cash |
| S02 | ee, ea, ie and particular spellings of the vowel in queen | queen, street, speakers, niece |
| S03 | ai and a spellings of the vowel in rain | rainbow, mailbox, escape, bakery |
| S04 | oa, ow, o and o-e for the vowel in roast | roast, toaster, elbow, joke |
| S05 | igh and i-e for the vowel in might | might, flight, rice, divide |
| S06 | ou and ow for the vowel in mouse | mouse, couch, shower, flowers |
| S07 | oo, ou, ue and u for the vowel in soup | balloon, soup, blueberry, ruler |
| S08 | ea with the vowel in bed | feather, weather, breakfast |
| S09 | y used as a vowel, with medial and final tracks | gymnast, syrup, skinny, cherry |
| S10 | Word-specific vowels beside r | parent, chair, carpet, earthquake |
| S11 | qu for the opening sounds in queen | queen, quiz, quilt, earthquake |
| S12 | Other consonant spelling choices | carpet, December, badger, mailbox |
| S13 | sh, ch and tch, in separate tracks | cash, chair, teacher, switch |
| S14 | th, with voiced and voiceless tracks | feather, weather, toothpaste, throwing |
| S15 | ph for f, and separate f/v choices | telephone, vanilla, evening, sofa |
| S16 | Double consonants | rubber, skinny, balloon, cottage |
| S17 | Weak or hard-to-hear syllables | parent, doctor, camel, lantern |
| S18 | Consonant groups, omissions and added vowels | street, quilt, dentist, flight |
| S19 | Final e, retained base e and le endings | joke, bottle, office, management |
| S20 | Stable written endings | glasses, throwing, peaceful, vacation |
| S21 | Compound building | mailbox, toothpaste, postcard, grandfather |
| S22 | Particular chunks and combined decisions | ocean, kayak, restaurant, gorgeous |

See learning-sets.md for the complete membership and distinctions. For example, ow in elbow and flowers belongs to different sound tracks; ea in teacher and feather must be introduced separately. Final e has different roles in joke and office. Do not collapse these into one rule merely because the letters match.

### Targeted spelling practice within the length path

1. Use rubber, queen, parent and rainbow as targeted practice anchors when their words enter the length-based path or mixed review. These four examples do not define the chapter order. Teach their meaning and correct form, isolate the relevant decisions, then return to whole-word entry.
2. Add short tracks for sh/ch/tch, th, ph/v, weak syllables and consonant groups according to observed errors. Use suitable words such as cash, teacher, weather, telephone, doctor and quilt.
3. Expand the vowel tracks separately. Introduce ee before contrasting it with ea and ie. Introduce ai, oa and ow in their appropriate words, then compare already familiar patterns.
4. Add final-e and le decisions, stable endings and useful compounds. Revisit familiar words in these new roles instead of treating each set as a new vocabulary list.
5. Introduce distinctive chunks in ocean, kayak, restaurant, gorgeous and longer words after teaching their relevant components. Word length alone does not determine difficulty.
6. Mix the entire bank in independent spelling and delayed review, giving more practice to the words and patterns that still cause errors.

A set can span several sessions, and a session can mix sets. Do not lock access to a familiar word behind completion of an unrelated set. Keep these set identifiers mostly in the content authoring references; the child can simply see the next short practice session.

## Session and review loop

Use up to eight planned questions, shortened when the familiar pool is small, with at most two delayed retries and no more than ten questions total. Aim for a short session without a countdown, and stop or shorten it when attention drops. Introduce at most 2–3 unfamiliar words per session. These are proposed starting defaults.

An established-learner lesson can include two due-review items, four current-pack items and two independent whole-word checks. The node's purpose and the child's answers can change this mix. Provide feedback immediately, separate repeated attempts with other questions, and carry remaining mistakes into later review rather than extending the lesson indefinitely.

The next path lesson is selected for the learner. Review is built into ordinary lessons, including words from earlier chapters. Offer a separate Review entry for optional practice. Lesson completion advances the path; word mastery is tracked separately.

Review successfully recalled words on later practice days, gradually extending the spacing after success and shortening it after errors. Use New, Practising, Ready to review and Remembered as simple word states. As a starting criterion, Remembered requires successful whole-word spelling without written hints on at least two separate practice days. Include English-audio recall for spelling-bee readiness. Same-lesson corrections do not satisfy this criterion.

Track clue type and support used. Correct spelling from an Indonesian translation or image does not automatically establish recognition of the spoken English word. See [Learning flow](learning-flow.md) for the full proposed session-selection rules.

## Feedback and motivation

After submission, show whether the answer is correct, the correct whole word and one short explanation when useful. Highlight only the relevant difference. A wrong answer should lead to a manageable next step rather than a long explanation.

Offer replay and a clear Continue action. Do not require pronunciation performance to answer a spelling task. Parent-facing explanations may be more detailed; child-facing wording should be brief and can use simple Indonesian support.

Use a small session progress indicator and a brief completion message. Optional sound or a small success animation can acknowledge progress without interrupting practice. Avoid timers, lost lives, leaderboards, compulsory streaks, currency, reward shops and elaborate celebrations. The motivation comes from quick attempts, visible improvement and attainable sessions.

## Minimal interface

| Screen | Essential content |
| --- | --- |
| Home | Continue practice, mixed Review and the course path. |
| Exercise | One clue, replay where relevant, one task, answer controls and session progress. |
| Feedback | Correct form, a short explanation when needed, and Continue. This can occupy the exercise screen. |
| Session complete | A short result and the words that need another look, plus Done. |

Use large readable text, generous spacing, clear contrast, consistent button positions and touch targets suitable for a child. Keep the visual palette restrained and remove decorative competition for attention. Use simple Indonesian instructions such as Pilih ejaan yang benar and Lengkapi bagian yang kosong, while keeping target words and letter choices in English.

Make audio replay easy to find. Do not use colour alone to communicate feedback. Allow physical keyboard entry where appropriate without browser spelling suggestions. Accounts, social features and multiple-child management are unnecessary for the first version.

## Content and progress structure

Keep reusable word content separate from challenge content and from the child's learning history.

| Layer | What belongs there |
| --- | --- |
| Word content | School word, sentence, whole-word distractors, indonesian_translation, arrange_chunks, and separate chunk/letter extra-tile banks. Each word now references an SVG, its Indonesian alternative description and a context flag. Audio references remain to be prepared. |
| Challenge content | Existing tricky-part rows keyed by trick_id, linked to word, set_id and pattern_id. Whole-word choice, Arrange Chunks, Arrange Letters and typing tasks reuse the word content. |
| Learning history | Actual submitted answer, correctness, task and clue types, distinct task type (including arrange_chunks or arrange_letters) and extra_tile_count where applicable, support used, date, and the relevant word/trick/pattern keys. |
| Review state | Current practice state and next review information, derived from attempts rather than embedded in authoring CSVs. |

The existing tricky-part columns are trick_id, word, set_id, pattern_id, template, answer, indonesian_distractors, english_distractors, context_required and explanation. Distractor cells contain JSON arrays inside CSV fields. An empty array means no candidates in that category; an empty string inside an array is the intentional no-letters choice.

Do not duplicate context sentences or media assets on every tricky-part row. Do not store a redundant shuffled options column. Preserve stable IDs when adjusting distractors or explanations so recorded progress remains attached to the same decision.

### School-word fields for meaning and arrangement

The current word columns are word, context_sentence, indonesian_distractors, english_distractors, indonesian_translation, arrange_chunks, arrange_chunks_indonesian_distractors, arrange_chunks_english_distractors, arrange_letters_indonesian_distractors, arrange_letters_english_distractors, image_path, image_alt and image_requires_context. Existing spelling, translation and arrangement values are preserved.

- indonesian_translation is a short meaning or descriptive gloss matching the school sentence. It translates the target word, not the entire sentence. Rice is nasi in its food context, speakers means pengeras suara, and management refers to pihak pengelola. It is not a phonetic rendering of the English pronunciation.
- arrange_chunks is a JSON array of nonempty strings in correct order. It must contain at least two pieces, and joining them must reproduce the exact word, including the capital D in December. Parse the CSV first, then JSON-parse the array.
- Arrange Letters derives its required tiles directly from word, preserving repeated letters. No stored letter-array column is needed.
- arrange_chunks_indonesian_distractors and arrange_chunks_english_distractors are optional JSON arrays of extra chunk candidates. Values must be nonempty spelling strings.
- arrange_letters_indonesian_distractors and arrange_letters_english_distractors are optional JSON arrays of extra single-letter candidates. Values may also occur in the target because adding one creates a surplus copy.
- image_path is a project-root-relative path to an individual SVG, such as assets/words/queen.svg.
- image_alt is an Indonesian description of the illustration for accessible clues. It must not be replaced with the target English word during practice.
- image_requires_context is a lowercase boolean. When true, use the image with English audio, an Indonesian meaning or an appropriate context sentence. It is separate from the tricky-part row's context_required flag: either condition can require extra clarification.
- Empty arrays mean there are no extra candidates in that category. Blank cells and empty-string tiles are not used. These fields provide candidate pools; automatic per-word, per-task progression chooses how many to add. Do not change the required chunks or letters when selecting extras.

Some Indonesian translations share the English spelling, such as sofa, or include it in a loan phrase, such as perahu kayak. Keep the correct translation in the content, but do not use a clue that reveals the target spelling for a recall attempt. Use audio or a suitable picture instead. Translations can also admit more than one English answer: sofa may cue either sofa or couch. Add the intended English audio or another genuinely distinguishing cue before scoring one target; do not reject a valid synonym on an ambiguous translation-only prompt.

For less familiar vocabulary, a descriptive Indonesian gloss may be clearer than a single equivalent. The badger gloss describes a burrowing animal resembling a musang; the shellfish gloss includes examples of sea animals with shells. These two meanings were checked against [Cambridge's badger entry](https://dictionary.cambridge.org/dictionary/english-indonesian/badger) and [shellfish entry](https://dictionary.cambridge.org/dictionary/english-indonesian/shellfish). The complete translation column is authored practice content rather than a copied dictionary dataset.

## Word illustrations

The current set includes 88 original, editable SVG illustrations, one for every school word. Each uses a transparent 256 × 256 canvas, rounded flat geometry and a consistent bright palette. The artwork contains no visible English labels, linked images, raster embeds, scripts or external fonts.

Use the individual SVG files in exercises. The labelled [review gallery](assets/word-gallery.html) and [contact sheets](assets/previews/words-01.png) are for parents and content review, because their captions reveal the answers. All four contact sheets and the compact overview are in assets/previews.

The manifest classifies 51 images as potential picture clues and 37 as requiring an additional meaning or audio cue. These are content-authoring decisions, not results from a child recognition test. Even a concrete object can admit a synonym, so supply the English word in audio when a picture would otherwise allow several correct answers.

Abstract meanings and relationships need context: might uses a possible-rain scene, management uses a planning team, and niece uses a family scene. The images for sofa and couch intentionally share the same visual concept; audio selects the school target. Rubber depicts the material, matching its school sentence. Illustrations such as skinny and fluffy use cats in accordance with their practice contexts.

The word CSV is the content used by future exercises. The generator and image manifest own the illustration assets; regenerate the SVGs and gallery with tools/generate-word-images.mjs. If image metadata changes, update the corresponding word CSV fields as well. See [asset notes](assets/README.md).

## Technical architecture and selected voice

The first implementation is a React + TypeScript + Vite static web app, with IndexedDB progress storage and PWA caching for offline practice. The parent selected **Kokoro-82M, Emma (bf_emma), female British English** after comparing the local engines and Kokoro's American and British voices. Use en-GB for the locale, en-gb for phonemization, and normal synthesis speed (1.0). [Selected voice configuration](content/audio-voice.json) is the source of truth for future full-bank audio preparation.

Generate and review the full word/sentence recordings offline on the preparation computer using Emma consistently. Download the model and required resources once during setup. Deploy the reviewed recordings with the app; the browser plays the audio files. The complete school bank now has 176 generated and validated recordings, including reused matching Emma audition clips. Parent pronunciation review remains pending.

The [three-model comparison](tts-comparison/index.html) and [Kokoro accent comparison](tts-comparison/kokoro.html) remain available as decision references; see [audition notes](tts-comparison/README.md). See [Technical plan](technical-plan.md) for the accepted stack, selected voice, content build pipeline, deployment details and verification scope. The initial playable game is implemented; see [run guide](README.md).

## First-version scope and remaining preparation

The first version should support the 88-word school bank, all five challenge types, English audio, the custom keyboard, focused mixed review, without a parent space. Include Indonesian clues and pictures where the content has been reviewed and is genuinely suitable.

Before calling the initial preview a reviewed release, review the candidate distractors, authored Indonesian meanings and chunk boundaries, authored illustrations with the child, and the complete generated Kokoro Emma recordings. Some existing distractors are proposed plausible errors rather than measured frequent mistakes; refine them using the child's responses.

Check that every challenge has an unambiguous clue, that context never reveals the spelling before submission, and that wrong options never include an accepted spelling of the same target. For longer words, review the proposed chunk boundaries and explanations against the selected audio.

The concept is successful when the child increasingly writes the intended school words correctly from English audio across separate sessions, with less spelling support. Choice accuracy and completed sessions are useful practice signals; independent delayed spelling is the main outcome.

## Lesson variety revision · 2026-10-20

Keep the number of new words small while widening the familiar practice pool. Ordinary lessons include up to four distinct earlier words, even when their review date has not arrived, and use each current word at most twice. The first lesson has six questions; later lessons reach eight when enough familiar words are available. Older questions appear between current-word questions. Due words and recent errors take up to two review slots; other slots rotate less recently practised familiar words. Packs overlap along the path (Learn A, Learn B, Build A, Learn C, Build B, Spell A). Review mixes familiar words. Saved lessons resume within the same build; each new development build resets all progress. See learning-flow.md for the current rules.

## Adaptive challenges and development policy · 2026-10-20

Challenge types are weighted and sampled rather than arranged in a fixed sequence. Choose/Tricky are most common for new or struggling words; arrangements and typing become more common with success. Returning words normally get a different task within the same lesson.

Each word earns its arrangement difficulty separately for chunks and letters: two correct non-retry answers at level 0 earn one extra tile; two at level 1 earn two. Errors step down one level, and retries do not promote. There is no parent/manual difficulty setting. The parent space and backup UI are removed.

During development, every build has a new ID. A changed ID atomically clears all learner history, word progress, completion and active answers. PWA updates activate and reload automatically; same-build reloads and rotation still preserve answers. This explicitly supersedes earlier cross-update progress retention and parent settings in this concept.

## Lesson roles and chapter access · 2026-10-20

The current stage contract supersedes earlier generic task-weighting/session budgets: Introduce gives every pack word Choose, Tricky Part, Arrange Chunks and Arrange Letters once in varied order, with zero extras and no typing. Three words require 12 core questions; up to two older questions may be slipped in. Arrange reviews the selected/recent words and older vocabulary using harder non-writing tasks only, up to eight questions. Spell is English-audio typing only, including retries, mixing recent and earlier words up to eight targets. Every stage permits at most two delayed retries.

Each chapter has independent first-lesson entry, and the dev build unlocks all 93 lessons. Selecting a letter level does not imply familiarity with shorter words. All review requires an actual encounter, matching the unlocked word list. Prefer the current level, with at most one encountered word from another level per lesson. Arrange/Spell prioritise the latest introduced same-level pack alongside the selected pack. Navigation continues inside the selected letter level. See README.md for the current behavior table.

### Self-paced lesson completion · 2026-10-20

Lessons are not daily assignments. After every lesson, the player may return home or immediately continue to the next lesson. The completion screen must not suggest waiting until tomorrow. Spaced review and recall tracking never restrict access to the next lesson.

### Word library · 2026-10-20

The home screen has one Daftar kata card showing encountered words out of all 88 school words. It replaces the recognition, remembered, and review counters. Opening it shows introduced words first, then greyed-out non-interactive words not yet introduced; within each group, sort by number of letters, then English alphabetical order. Only actual introductions/attempts (progress.seen) unlock details and make a word eligible for review. Introduced-word details show the image, spelling, Indonesian meaning, full example sentence, and Emma audio (word at 1×, sentence at 0.8×). Browsing does not alter progress.

### Per-level lesson bookmarks and readability · 2026-10-20

Each letter level keeps its own most recent lesson and unfinished session (question order, introduction position, answer, tiles, feedback and retries). Switching levels never discards another level’s lesson. The selected tab is saved too. Home resumes the selected level’s unfinished lesson or recommends the next lesson after its last completion. Starting a different unfinished lesson in the same level asks before replacing it. Same-build reloads/offline preserve all bookmarks; the existing dev policy still clears them on a new build. Level tabs, lesson labels and listening controls use larger type and touch areas in portrait and landscape.

### Gradual clue removal · 2026-10-20

Kenali keeps introduction cards, images/meanings and masked written sentences. Susun starts with word/sentence audio plus its non-writing answer controls; Bantuan optionally reveals a safe image/translation, never the written sentence or an identical translation that gives away the answer. Eja sendiri uses only word/sentence audio and an empty keyboard answer, with no pictures, translation, sentence text, word-length hint or Bantuan. Audio replays do not count as assistance; sentence playback remains 0.8×. Corrections remain visible after submission. Bantuan use persists per question in history and saved lessons, resets on the next question, and cannot count as independent recall or promote arrangement difficulty. Review questions and retries follow their current lesson’s clue rules.
