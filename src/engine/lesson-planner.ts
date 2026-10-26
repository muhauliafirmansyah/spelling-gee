import { Word, TrickyPart, ChallengeType, LessonRole, ExercisePrompt, WordProgress } from '../types';
import { words, course, getWord, getTrickyPartsForWord } from '../data';

function shuffle<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

// Ensure array is not in the exact required sequence
function shuffleTiles<T extends { text: string }>(tiles: T[], requiredText: string): T[] {
  let attempts = 0;
  let shuffled = shuffle(tiles);
  while (attempts < 10 && shuffled.map(t => t.text).join('') === requiredText && tiles.length > 1) {
    shuffled = shuffle(tiles);
    attempts++;
  }
  return shuffled;
}

export function createChooseSpellingPrompt(
  word: Word,
  role: LessonRole,
  isRetry: boolean = false,
  isNewWord: boolean = false
): ExercisePrompt {
  const indoDist = word.indonesian_distractors || [];
  const engDist = word.english_distractors || [];

  const candidates = new Set<string>();
  if (indoDist.length > 0) {
    candidates.add(indoDist[Math.floor(Math.random() * indoDist.length)]);
  }
  if (engDist.length > 0) {
    for (const d of engDist) {
      if (!candidates.has(d) && d.toLowerCase() !== word.word.toLowerCase()) {
        candidates.add(d);
        break;
      }
    }
  }

  // Filter out any accidentally identical to the word
  const wrongOptions = Array.from(candidates).filter(
    c => c.toLowerCase() !== word.word.toLowerCase()
  );

  const choices = shuffle([word.word, ...wrongOptions.slice(0, 2)]);

  return {
    id: `choose_${word.word}_${Date.now()}_${Math.random()}`,
    word,
    taskType: 'choose_spelling',
    lessonRole: role,
    isRetry,
    isNewWord,
    choices,
    extraTileCount: 0,
    allowHelp: role === 'arrange'
  };
}

export function createTrickyPartPrompt(
  word: Word,
  role: LessonRole,
  isRetry: boolean = false,
  isNewWord: boolean = false
): ExercisePrompt {
  const parts = getTrickyPartsForWord(word.word);
  if (parts.length === 0) {
    // If no tricky parts, fallback to choose spelling
    return createChooseSpellingPrompt(word, role, isRetry, isNewWord);
  }

  const trickyPart = parts[Math.floor(Math.random() * parts.length)];
  const indoDist = trickyPart.indonesian_distractors || [];
  const engDist = trickyPart.english_distractors || [];

  const candidateDistractors: string[] = [];
  if (indoDist.length > 0) {
    candidateDistractors.push(indoDist[Math.floor(Math.random() * indoDist.length)]);
  }
  if (engDist.length > 0) {
    for (const d of engDist) {
      if (!candidateDistractors.includes(d) && d !== trickyPart.answer) {
        candidateDistractors.push(d);
        break;
      }
    }
  }

  const filteredDistractors = candidateDistractors.filter(d => d !== trickyPart.answer);
  const choices = shuffle([trickyPart.answer, ...filteredDistractors.slice(0, 2)]);

  return {
    id: `tricky_${trickyPart.trick_id}_${Date.now()}_${Math.random()}`,
    word,
    taskType: 'tricky_part',
    lessonRole: role,
    isRetry,
    isNewWord,
    trickyPart,
    choices,
    extraTileCount: 0,
    allowHelp: role === 'arrange'
  };
}

function getChunkDistractorsForWord(word: Word, targetCount: number): string[] {
  const requiredSet = new Set((word.arrange_chunks || [word.word]).map(c => c.toLowerCase()));
  const indoDist = word.arrange_chunks_indonesian_distractors || [];
  const engDist = word.arrange_chunks_english_distractors || [];

  // Filter out any distractors that duplicate a required chunk
  const validDistractors = Array.from(new Set([...indoDist, ...engDist])).filter(
    d => !requiredSet.has(d.toLowerCase())
  );

  const pool = shuffle([...validDistractors]);

  // If word has fewer than targetCount, supplement from other words' chunks
  if (pool.length < targetCount) {
    const allWordChunks = words.flatMap(w => w.arrange_chunks || []);
    const fallbackCandidates = shuffle(allWordChunks).filter(
      c => !requiredSet.has(c.toLowerCase()) && !pool.map(p => p.toLowerCase()).includes(c.toLowerCase())
    );
    for (const fb of fallbackCandidates) {
      if (pool.length >= targetCount) break;
      pool.push(fb);
    }
  }

  return pool.slice(0, targetCount);
}

export function createArrangeChunksPrompt(
  word: Word,
  role: LessonRole,
  difficulty: number = 0,
  isRetry: boolean = false,
  isNewWord: boolean = false
): ExercisePrompt {
  const requiredChunks = word.arrange_chunks || [word.word];
  const requiredTiles = requiredChunks.map((chunk, index) => ({
    id: `req_${index}_${chunk}`,
    text: chunk
  }));

  // Always add distractors, minimum 2 of them!
  const targetDistractorCount = Math.max(2, Math.min(4, 2 + Math.max(0, difficulty)));
  const selectedDistractors = getChunkDistractorsForWord(word, targetDistractorCount);

  const extraTiles: { id: string; text: string }[] = selectedDistractors.map((dist, index) => ({
    id: `ext_${index}_${dist}`,
    text: dist
  }));

  const allTiles = shuffleTiles([...requiredTiles, ...extraTiles], word.word);

  return {
    id: `chunks_${word.word}_${Date.now()}_${Math.random()}`,
    word,
    taskType: 'arrange_chunks',
    lessonRole: role,
    isRetry,
    isNewWord,
    chunkTiles: allTiles,
    extraTileCount: extraTiles.length,
    allowHelp: role === 'arrange'
  };
}

export function createArrangeLettersPrompt(
  word: Word,
  role: LessonRole,
  difficulty: number = 0,
  isRetry: boolean = false,
  isNewWord: boolean = false
): ExercisePrompt {
  const letters = word.word.split('');
  const requiredTiles = letters.map((char, index) => ({
    id: `req_${index}_${char}`,
    text: char
  }));

  const extraTiles: { id: string; text: string }[] = [];
  const extraCount = role === 'introduce' ? 0 : Math.min(2, Math.max(0, difficulty));

  if (extraCount > 0) {
    const indoDist = word.arrange_letters_indonesian_distractors || [];
    const engDist = word.arrange_letters_english_distractors || [];
    const combined = Array.from(new Set([...indoDist, ...engDist]));
    const shuffledExtras = shuffle(combined);

    for (let i = 0; i < extraCount && i < shuffledExtras.length; i++) {
      extraTiles.push({
        id: `ext_${i}_${shuffledExtras[i]}`,
        text: shuffledExtras[i]
      });
    }
  }

  const allTiles = shuffleTiles([...requiredTiles, ...extraTiles], word.word);

  return {
    id: `letters_${word.word}_${Date.now()}_${Math.random()}`,
    word,
    taskType: 'arrange_letters',
    lessonRole: role,
    isRetry,
    isNewWord,
    letterTiles: allTiles,
    extraTileCount: extraTiles.length,
    allowHelp: role === 'arrange'
  };
}

export function createWriteWholeWordPrompt(
  word: Word,
  role: LessonRole,
  isRetry: boolean = false,
  isNewWord: boolean = false
): ExercisePrompt {
  return {
    id: `write_${word.word}_${Date.now()}_${Math.random()}`,
    word,
    taskType: 'write_whole_word',
    lessonRole: role,
    isRetry,
    isNewWord,
    extraTileCount: 0,
    allowHelp: false // Never allow Bantuan in Eja Sendiri
  };
}

// 1. NEW WORD MODE:
// Adds 1 new random word, then plays games with the 3 latest words!
export function generateNewWordPlan(
  allWords: Word[],
  wordProgressMap: Record<string, WordProgress>
): {
  newWord: Word;
  latestWords: Word[];
  introWords: Word[];
  prompts: ExercisePrompt[];
  role: LessonRole;
} {
  const unseenWords = allWords.filter(w => !wordProgressMap[w.word]?.seen);

  // Known words sorted by introducedAt descending
  const knownWords = allWords
    .filter(w => wordProgressMap[w.word]?.seen)
    .sort((a, b) => {
      const aTime = wordProgressMap[a.word]?.introducedAt || 0;
      const bTime = wordProgressMap[b.word]?.introducedAt || 0;
      return bTime - aTime;
    });

  let newWord: Word;
  let isAlreadySeen = false;

  if (unseenWords.length > 0) {
    newWord = unseenWords[Math.floor(Math.random() * unseenWords.length)];
  } else {
    // All words already seen: pick the least recently practised
    newWord = knownWords[knownWords.length - 1] || allWords[0];
    isAlreadySeen = true;
  }

  const otherRecent = knownWords.filter(
    w => w.word.toLowerCase() !== newWord.word.toLowerCase()
  );
  const latestWords = [newWord, ...otherRecent.slice(0, 2)];

  const introWords: Word[] = isAlreadySeen ? [] : [newWord];

  const isNewWordExercise = !isAlreadySeen;

  // Exercises for the new word:
  const newWordPrompts: ExercisePrompt[] = [
    createChooseSpellingPrompt(newWord, 'introduce', false, isNewWordExercise),
    createTrickyPartPrompt(newWord, 'introduce', false, isNewWordExercise),
    createArrangeChunksPrompt(newWord, 'introduce', 0, false, isNewWordExercise),
    createArrangeLettersPrompt(newWord, 'introduce', 0, false, isNewWordExercise)
  ];

  // Exercises for the other latest words:
  const otherPrompts: ExercisePrompt[] = [];
  for (const w of latestWords.slice(1)) {
    const wp = wordProgressMap[w.word];
    const chunkDiff = wp?.chunkDifficulty || 0;
    const letterDiff = wp?.letterDifficulty || 0;

    if (Math.random() < 0.5) {
      otherPrompts.push(createArrangeChunksPrompt(w, 'introduce', chunkDiff, false, false));
    } else {
      otherPrompts.push(createArrangeLettersPrompt(w, 'introduce', letterDiff, false, false));
    }

    if (Math.random() < 0.5) {
      otherPrompts.push(createTrickyPartPrompt(w, 'introduce', false, false));
    } else {
      otherPrompts.push(createChooseSpellingPrompt(w, 'introduce', false, false));
    }
  }

  const allPrompts = interleaveByWord([...newWordPrompts, ...otherPrompts]);

  return {
    newWord,
    latestWords,
    introWords,
    prompts: allPrompts,
    role: 'introduce'
  };
}

// 2. ARRANGE MODE:
// Randomly play arrangement games with all known words!
export function generateArrangePlan(
  allWords: Word[],
  wordProgressMap: Record<string, WordProgress>
): {
  prompts: ExercisePrompt[];
  role: LessonRole;
} {
  const knownWords = allWords.filter(w => wordProgressMap[w.word]?.seen);
  const pool = knownWords.length > 0 ? knownWords : allWords.slice(0, 3);

  // Pick up to 8 random questions from all known words
  const selectedWords = shuffle(pool).slice(0, 8);
  const prompts: ExercisePrompt[] = [];

  for (const w of selectedWords) {
    const wp = wordProgressMap[w.word];
    const chunkDiff = wp?.chunkDifficulty || 0;
    const letterDiff = wp?.letterDifficulty || 0;

    const r = Math.random();
    if (r < 0.45) {
      prompts.push(createArrangeChunksPrompt(w, 'arrange', chunkDiff, false, false));
    } else if (r < 0.85) {
      prompts.push(createArrangeLettersPrompt(w, 'arrange', letterDiff, false, false));
    } else {
      prompts.push(createTrickyPartPrompt(w, 'arrange', false, false));
    }
  }

  return {
    prompts: interleaveByWord(prompts),
    role: 'arrange'
  };
}

export function generateReviewPlan(
  wordProgressMap: Record<string, WordProgress>
): ExercisePrompt[] {
  return generateArrangePlan(words, wordProgressMap).prompts;
}

// 3. SPELL MODE:
// Typing test challenge using known words!
export function generateSpellPlan(
  allWords: Word[],
  wordProgressMap: Record<string, WordProgress>
): {
  prompts: ExercisePrompt[];
  role: LessonRole;
} {
  const knownWords = allWords.filter(w => wordProgressMap[w.word]?.seen);
  const pool = knownWords.length > 0 ? knownWords : allWords.slice(0, 3);

  // Pick up to 8 random words for typing test
  const selectedWords = shuffle(pool).slice(0, 8);
  const prompts = selectedWords.map(w => createWriteWholeWordPrompt(w, 'spell', false, false));

  return {
    prompts: shuffle(prompts),
    role: 'spell'
  };
}

function interleaveByWord(list: ExercisePrompt[]): ExercisePrompt[] {
  const groups: Record<string, ExercisePrompt[]> = {};
  for (const item of list) {
    const key = item.word.word.toLowerCase();
    if (!groups[key]) groups[key] = [];
    groups[key].push(item);
  }

  const result: ExercisePrompt[] = [];
  const keys = Object.keys(groups);
  let hasMore = true;
  let round = 0;

  while (hasMore) {
    hasMore = false;
    for (const key of keys) {
      if (groups[key].length > 0) {
        result.push(groups[key].shift()!);
        if (groups[key].length > 0) hasMore = true;
      }
    }
    round++;
  }

  return result;
}
