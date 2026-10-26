# Technical stack and selected audio pipeline

Planning reference, revised 2026-10-20 for local offline speech generation. The web stack and voice are accepted: Kokoro-82M, Emma (bf_emma), female British English. The initial game is implemented; see [run and verification notes](README.md). A standalone voice audition page and sample audio are separate preparation artifacts.

## Recommended architecture

Build a static React + TypeScript web application using Vite, with PWA support and locally stored learning progress. Generate the known vocabulary audio during content preparation, review it, and deploy the recordings with the app.

The deployed application consists of HTML, CSS, JavaScript, validated content JSON, SVG illustrations and audio files. Hosting does not need to run a speech service, application server or database for the current single-child scope. A local generation script will load downloaded speech-model files during authoring. After initial setup, creating or regenerating the fixed recordings must work with the network disconnected.

## Stack

| Concern | Recommendation | Reason for this app |
| --- | --- | --- |
| UI | React + TypeScript | Reusable components for five exercise types and typed learning data. |
| Development and build | Vite | Produces static deployment assets. |
| Styling | Plain CSS with shared CSS variables (initial implementation) | A small consistent visual system, SVG assets and restrained transitions. |
| Lesson state | React useReducer and context | Explicit states for prompt, answer, feedback, retry and completion. |
| Learning engine | Pure TypeScript functions | Deterministic, testable word selection, distractor selection, progression and review scheduling. |
| Navigation | React Router with HashRouter | Path-like navigation without requiring server-side route rewrites. |
| Progress storage | IndexedDB through Dexie | Build-scoped local attempts, word progress and resumable sessions. |
| Offline and installation | vite-plugin-pwa | Manifest and service-worker support, with explicit caching of content and audio. |
| Playback | HTMLAudioElement and shared playback controller | Plays the same reviewed clips on supported browsers. |
| Content preparation | Node.js scripts plus a local Python speech tool | Node validates CSV and emits runtime JSON. Python runs local speech synthesis and saves audio masters. |
| Verification | Vitest and Playwright | Check learning rules and important browser interactions. |

Vite documents static deployment from its dist output, including common hosts and subdirectory base-path configuration. [Vite deployment guide](https://vite.dev/guide/static-deploy.html). HashRouter keeps navigation in the URL hash rather than sending that path to the server. [React Router](https://reactrouter.com/api/declarative-routers/HashRouter).

Dexie wraps the browser's IndexedDB database. [Dexie documentation](https://dexie.org/docs/Dexie/Dexie). The PWA plugin supplies manifest and service-worker integration; offline content still needs an intentional caching policy. [Vite PWA](https://vite-pwa-org.netlify.app/guide/).

Choose currently supported compatible dependency versions and commit a lockfile when implementation begins. Do not pin version numbers from this planning document.

## Content boundary

Keep school-words.csv and tricky-parts.csv as editable authoring sources. A build/preparation step should parse their JSON-array cells, validate word links and replacement chunks, and emit runtime JSON. The application should consume validated JSON rather than parse editable CSV on every page load.

Preserve the existing stable trick IDs and exact school-word spellings. Length-derived chapters, pack definitions and path nodes belong to course configuration. Learner attempts and review state remain separate from content. Avoid using array positions as persistent identities.

The SVG and audio paths need to work when the app is deployed under a subdirectory. Resolve content asset paths against the configured deployment base rather than assuming every installation lives at the domain root.

## Selected local offline TTS voice

The parent selected **Kokoro-82M with Emma (bf_emma), female British English**, after listening to the three-model audition and the Kokoro American-versus-British comparison. This is the final voice decision for the app. [Selected voice configuration](content/audio-voice.json) records the settings, runtime version and model/voice-file fingerprints.

| Setting | Selected value |
| --- | --- |
| Model | Kokoro-82M v1.0 |
| Runtime | kokoro-onnx 0.6.1 |
| Voice | bf_emma (Emma, female British English) |
| Locale | en-GB |
| Phonemizer language | en-gb |
| Synthesis speed | 1.0 |
| Generation device | CPU |

Use this voice for both isolated school words and full context sentences. Generate recordings locally during preparation, then deploy the reviewed audio with the static app. The full 176-clip school bank is generated and validated. Matching audition recordings were reused. Parent pronunciation review remains pending.

Kokoro has 82 million parameters and Apache-licensed weights. The ONNX runtime loads local model and voice files and supports CPU execution. [Official model card](https://huggingface.co/hexgrad/Kokoro-82M), [runtime](https://github.com/thewh1teagle/kokoro-onnx), [voice and language settings](https://huggingface.co/hexgrad/Kokoro-82M/blob/main/VOICES.md).

Review each generated clip for the intended word, pronunciation, stress, completeness and consistent loudness, including the short isolated words. Automated playback checks establish valid audio rather than pronunciation quality.

### Completed audition references

The [three-model comparison](tts-comparison/index.html) contains 60 clips from Kokoro, Pocket TTS and Chatterbox Nano. The [Kokoro accent comparison](tts-comparison/kokoro.html) compares American Heart and British Emma using 40 existing recordings. The same school prompts and volume adjustment were used. Browser playback, word/sentence switching, sequential playback, saved preferences, mobile layout and direct-file playback were checked. Emma also passed fresh generation with Python network connections blocked. See [audition notes](tts-comparison/README.md) for provenance and the retained comparison settings.

### Initial setup versus offline operation

Initial setup needs downloaded software, model weights, voice files and all text-to-phoneme resources. These can be fetched once while connected or transferred from another machine. The offline condition applies after those files are available locally.

Use explicit local paths and a pinned model/runtime revision. Emma has passed word-and-sentence generation with Python network connections blocked. Retain that offline verification when changing runtime resources. Keep the model loaded for a batch instead of restarting it for each of the 176 recordings. Record the exact asset hashes and voice configuration so later regeneration is reproducible.

The browser app receives the reviewed audio files. The local model and Python runtime stay in the authoring environment, so they add no download or inference requirement to the child's browser. Future content can be regenerated on the preparation computer and included in another static deployment.

Keep Kokoro's model and runtime license notices with the authoring assets. The selected model and voice file fingerprints are recorded in content/audio-voice.json.

## Generate audio once, play it many times

The initial English audio pack is one word clip and one context-sentence clip for each of the 88 school words: 176 recordings before optional variants or interface prompts. Generation reads the canonical word and sentence fields locally; playback uses the deployed files.

Recommended preparation flow:

1. Load the selected Kokoro Emma configuration from content/audio-voice.json (bf_emma, en-gb, speed 1.0). Reuse matching Emma clips when their exact source text and generation settings are current.
2. Generate isolated words and full sentences as separate local audio assets. The output must contain only the requested natural speech, without spelled-out letters, added definitions or lead-in phrases.
3. Review every recording for pronunciation, stress, completeness, silence, clipping and consistent loudness. Regenerate or replace recordings that need correction.
4. The initial release keeps PCM16 WAV playback assets and lossless masters during preparation. The complete offline app is approximately 14 MB; optional MP3 conversion remains a size optimisation. Normal speed is required; a separately reviewed slower version is optional.
5. Create an audio manifest containing the word, clip kind, source text, locale, local engine/model revision, voice, generation settings, content/version hash and relative file path. The current local preview exposes generated audio for parent review; its manifest explicitly marks pronunciation review as pending. A reviewed release should clear that review first.
6. Cache the audio with the rest of the practice pack for offline use.

Generated sentence audio must contain the complete natural sentence. Written context displayed during a challenge must still mask the answer. Never generate speech from a wrong spelling, distractor, or arbitrary spelling chunk as if it were the target word's pronunciation.

Avoid exaggerated syllable separation or adding sounds for written letters. If slow playback is offered, check that it preserves the intended pronunciation and pitch. A separate slower synthesis can be reviewed if playback-rate adjustment sounds unnatural.

The selected workflow requires no cloud TTS credentials or remote synthesis requests. Keep audio conversion tools local too. Normal app playback reads static audio assets.

## Offline and deployment behaviour

Deploy the generated dist directory to a static host or a web server such as an Nginx container. The application does not need to be hosted on the same provider used for generating its speech assets. PWA installation requires HTTPS or a qualifying local development context. [MDN installability](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Guides/Making_PWAs_installable).

After the practice pack has been downloaded and verified, exercises, illustrations, recordings and local progress should work offline. A first visit still needs access to the assets. Confirm offline readiness only after all required resources are present. Cache versioned content/audio deliberately, and, during development, activate updates automatically, reload and reset learner progress.

Start a lesson from a clear user action and keep replay available. Handle rejected audio playback gracefully; browsers apply autoplay policies to media. [MDN autoplay](https://developer.mozilla.org/en-US/docs/Web/Media/Guides/Autoplay).

Progress is local to the browser/device and scoped to a build ID. During development each new bundle clears all learner data; reloading the same build resumes. The parent space and backup/settings UI are removed. Vite injects a fresh build ID, IndexedDB stores it alongside the learner record, and a changed ID triggers an atomic reset. The PWA uses automatic reload with explicit skipWaiting and clientsClaim; updates are checked on focus and every 30 seconds while online.

## Responsive layout and orientation

Support portrait and landscape throughout the web app, including all five challenges and the custom keyboard. Use responsive CSS based on available viewport width and height rather than a forced orientation. Keep the PWA orientation unrestricted (omit the manifest orientation field or use any).

Reflow controls and answer tiles for narrow or short screens. Allow vertical scrolling when needed, keep touch targets comfortable, and prevent fixed or sticky controls from obscuring the prompt, answer or keyboard. Account for mobile browser chrome, dynamic viewport height and device safe-area insets. Avoid horizontal page overflow.

Keep lesson and answer state independent of layout. A viewport resize or orientation change must preserve the active word, typed letters, selected/arranged tiles, feedback and progress without a page reload or restarted attempt.

## Verification before release

Use Vitest for meaningful learning-rule checks: due-word selection, separation of supported and independent recall, retry limits, exact chunk reconstruction, and duplicate-tile handling. Use Playwright for complete lesson flows, custom-keyboard behaviour, audio controls, save/resume, update behaviour and offline operation. [Vitest](https://vitest.dev/guide/) and [Playwright](https://playwright.dev/docs/intro).

Check every challenge type in portrait and landscape, including the custom keyboard and feedback states. Representative browser viewports include 390 × 844 and 844 × 390 for phones, 768 × 1024 and 1024 × 768 for tablets, plus desktop windows. Test rotation midway through typing and arranging: the answer and lesson state must survive, controls must remain reachable, and no content may be hidden behind fixed UI. Confirm touch usability on the actual device in both orientations. The initial Chrome acceptance suite passes these viewport and rotation checks, including reload and offline resume. Actual-device touch and Safari checks remain for parent review.

Manually review the audio, pronunciation and touch interaction on the actual devices used by the child. Automated playback success does not establish correct pronunciation. Verify that clues and accessibility metadata do not reveal the target spelling prematurely.

## Next technical preparation

The voice decision, all 176 recordings, course configuration, React/Vite implementation and automated verification are complete. Parent listening/content review and an actual-device pilot remain before a reviewed release. See README.md for exact commands, current behavior and verification limits.

Related references: [App concept](app-concept.md), [Learning flow](learning-flow.md), [Learning sets](content/learning-sets.md), and [Asset notes](assets/README.md).

## Adaptive tasks and automatic extras

The pure TypeScript planner samples task types from weights based on word success, recent mistakes and node purpose; it does not follow a fixed task ladder. New words favour spelling/tricky choices; supported success increases arrangement/typing. Extra tiles progress 0→1→2 per word and arrangement mode after two non-retry correct answers at each level, stepping down after an error. No learner-facing difficulty settings remain.

### Independent level review · 2026-10-20

Use progress.seen as the shared source of truth for library unlocks and review eligibility. Partition eligible words by the selected chapter’s length range, prioritise its latest introduction pack and local due/older words, and cap review from other chapters at one planned question per lesson. The same selection budget drives lessonSize so cards show accurate question counts. No shorter-level knowledge is inferred.
