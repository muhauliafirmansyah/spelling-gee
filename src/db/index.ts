import Dexie, { Table } from 'dexie';
import { WordProgress, LessonBookmark, CompletedLesson, AttemptLog } from '../types';

declare const __BUILD_ID__: string;
export const CURRENT_BUILD_ID = typeof __BUILD_ID__ !== 'undefined' ? __BUILD_ID__ : 'dev-1.0.0';

export interface MetaItem {
  key: string;
  value: string;
}

export class SpellingDatabase extends Dexie {
  meta!: Table<MetaItem, string>;
  wordProgress!: Table<WordProgress, string>;
  bookmarks!: Table<LessonBookmark, string>;
  completedLessons!: Table<CompletedLesson, string>;
  attempts!: Table<AttemptLog, number>;

  constructor() {
    super('spelling_gee_alt_db');

    this.version(1).stores({
      meta: 'key',
      wordProgress: 'word, seen, status, nextReviewAt',
      bookmarks: 'chapterId',
      completedLessons: 'lessonId, chapterId, completedAt',
      attempts: '++id, word, timestamp, correct'
    });
  }
}

export const db = new SpellingDatabase();

export async function initDatabase(): Promise<void> {
  try {
    const buildMeta = await db.meta.get('build_id');
    if (!buildMeta || buildMeta.value !== CURRENT_BUILD_ID) {
      console.log(`New build detected (${CURRENT_BUILD_ID}). Resetting learner state...`);
      await db.wordProgress.clear();
      await db.bookmarks.clear();
      await db.completedLessons.clear();
      await db.attempts.clear();
      await db.meta.put({ key: 'build_id', value: CURRENT_BUILD_ID });
    }
  } catch (err) {
    console.error('Failed to initialize or reset database:', err);
  }
}

export async function getWordProgress(word: string): Promise<WordProgress> {
  const existing = await db.wordProgress.get(word);
  if (existing) return existing;
  return {
    word,
    seen: false,
    introducedAt: 0,
    chunkDifficulty: 0,
    chunkConsecutiveSuccess: 0,
    letterDifficulty: 0,
    letterConsecutiveSuccess: 0,
    unassistedCorrectDates: [],
    status: 'new',
    lastPractisedAt: 0,
    nextReviewAt: 0
  };
}

export async function getAllWordProgress(): Promise<Record<string, WordProgress>> {
  const list = await db.wordProgress.toArray();
  const map: Record<string, WordProgress> = {};
  for (const item of list) {
    map[item.word] = item;
  }
  return map;
}

export async function saveWordProgress(progress: WordProgress): Promise<void> {
  await db.wordProgress.put(progress);
}

export async function getLessonBookmark(chapterId: string): Promise<LessonBookmark | undefined> {
  return await db.bookmarks.get(chapterId);
}

export async function saveLessonBookmark(bookmark: LessonBookmark): Promise<void> {
  await db.bookmarks.put(bookmark);
}

export async function clearLessonBookmark(chapterId: string): Promise<void> {
  await db.bookmarks.delete(chapterId);
}

export async function getCompletedLessons(): Promise<Record<string, CompletedLesson>> {
  const list = await db.completedLessons.toArray();
  const map: Record<string, CompletedLesson> = {};
  for (const l of list) {
    map[l.lessonId] = l;
  }
  return map;
}

export async function saveCompletedLesson(record: CompletedLesson): Promise<void> {
  await db.completedLessons.put(record);
}

export async function logAttempt(attempt: AttemptLog): Promise<void> {
  await db.attempts.add(attempt);
}

export async function setWordLearned(word: string, learned: boolean): Promise<WordProgress> {
  const wp = await getWordProgress(word);
  wp.seen = learned;
  if (learned) {
    wp.introducedAt = wp.introducedAt || Date.now();
    wp.lastPractisedAt = wp.lastPractisedAt || Date.now();
    if (wp.status === 'new') wp.status = 'practising';
  } else {
    wp.status = 'new';
    wp.unassistedCorrectDates = [];
    wp.chunkConsecutiveSuccess = 0;
    wp.letterConsecutiveSuccess = 0;
  }
  await db.wordProgress.put(wp);
  return wp;
}

export async function setMultipleWordsLearned(wordList: string[], learned: boolean): Promise<void> {
  for (const word of wordList) {
    await setWordLearned(word, learned);
  }
}

export async function resetAllData(): Promise<void> {
  await db.wordProgress.clear();
  await db.bookmarks.clear();
  await db.completedLessons.clear();
  await db.attempts.clear();
  await db.meta.put({ key: 'build_id', value: CURRENT_BUILD_ID });
}

