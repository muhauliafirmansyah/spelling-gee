import contentData from './content.json';
import { Word, TrickyPart, CourseData } from '../types';

export const words: Word[] = contentData.words as Word[];
export const trickyParts: TrickyPart[] = contentData.trickyParts as TrickyPart[];
export const course: CourseData = contentData.course as CourseData;
export const audioManifest: any = contentData.audioManifest;

export const wordMap = new Map<string, Word>(words.map(w => [w.word.toLowerCase(), w]));

export const trickyPartMap = new Map<string, TrickyPart[]>();
for (const tp of trickyParts) {
  const key = tp.word.toLowerCase();
  const list = trickyPartMap.get(key) || [];
  list.push(tp);
  trickyPartMap.set(key, list);
}

export function getWord(word: string): Word | undefined {
  return wordMap.get(word.toLowerCase());
}

export function getTrickyPartsForWord(word: string): TrickyPart[] {
  return trickyPartMap.get(word.toLowerCase()) || [];
}

