# Spelling Gee (Alt)

A distraction-free, bilingual-aware English spelling practice web application built for a seven-year-old Indonesian learner.

## Game Modes

Instead of complex packet trees, practice is organized into 3 simple, focused game modes:

1. **Kata Baru (*New Word*)**:
   - Picks 1 new un-encountered word from the 88-word bank.
   - Shows an unscored introduction card (illustration, English word, audio, Indonesian translation, context sentence).
   - Automatically generates a practice session combining the **new word** with the **2 most recently learned words** (the 3 latest words total).
   - Questions cover *Choose the Spelling*, *Complete the Tricky Part*, *Arrange Chunks*, and *Arrange Letters*.

2. **Susun Kata (*Arrange*)**:
   - Randomly generates an arrangement session from **all known/unlocked words**.
   - Focuses on *Arrange Chunks* (multi-letter tiles) and *Arrange Letters* (individual tiles) with adaptive distractor tiles (0, 1, or 2 extra tiles based on mastery level), plus occasional *Tricky Part* repairs.
   - Features British audio prompts and an optional **"Bantuan"** (Help) button for safe hints.

3. **Uji Ejaan (*Spell*)**:
   - Independent typing test challenge using **all known/unlocked words**.
   - Spoken British English audio prompt only (word clip at 1.0× and sentence at 0.8×).
   - Answered using the custom in-game A–Z keyboard (no autocomplete, predictive text, or length clues).
   - Correct unassisted answers on at least two separate practice days earn "Diingat" (*Remembered*) mastery status.

## Additional Features

- **Daftar Kata (88 Word Bank)**: Full word dictionary modal displaying all 88 school words (known vs. locked), with high-resolution vector illustrations, definitions, sentences, and audio replay.
- **3 Kata Terbaru Preview**: Quick overview directly on the home screen showing the latest 3 words with audio playback.
- **Offline PWA & Local Storage**: Full offline readiness with service worker precaching and IndexedDB (Dexie) storage.

## Getting Started

### Development
```bash
npm install
npm run dev
```

### Production Build
```bash
npm run build
npm run preview
```
