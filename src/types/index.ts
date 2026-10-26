export interface Word {
  word: string;
  context_sentence: string;
  indonesian_distractors: string[];
  english_distractors: string[];
  indonesian_translation: string;
  arrange_chunks: string[];
  arrange_chunks_indonesian_distractors: string[];
  arrange_chunks_english_distractors: string[];
  arrange_letters_indonesian_distractors: string[];
  arrange_letters_english_distractors: string[];
  image_path: string;
  image_alt: string;
  image_requires_context: boolean;
}

export interface TrickyPart {
  trick_id: string;
  word: string;
  set_id: string;
  pattern_id: string;
  template: string;
  answer: string;
  indonesian_distractors: string[];
  english_distractors: string[];
  context_required: boolean;
  explanation: string;
}

export interface CoursePack {
  id: string;
  words: string[];
  lessons: string[];
}

export interface CourseChapter {
  id: string;
  title: string;
  min: number;
  max: number;
  packs: CoursePack[];
}

export interface CourseData {
  version: number;
  chapters: CourseChapter[];
}

export type ChallengeType =
  | 'choose_spelling'
  | 'tricky_part'
  | 'arrange_chunks'
  | 'arrange_letters'
  | 'write_whole_word';

export type LessonRole = 'introduce' | 'arrange' | 'spell';

export type GameMode = 'new-word' | 'arrange' | 'spell';

export interface ExercisePrompt {
  id: string;
  word: Word;
  taskType: ChallengeType;
  lessonRole: LessonRole;
  isRetry: boolean;
  isNewWord?: boolean;
  trickyPart?: TrickyPart;
  choices?: string[];
  chunkTiles?: { id: string; text: string }[];
  letterTiles?: { id: string; text: string }[];
  extraTileCount: number;
  allowHelp: boolean;
  showIntroduction?: boolean;
}

export interface WordProgress {
  word: string;
  seen: boolean;
  introducedAt: number;
  chunkDifficulty: number; // 0, 1, 2
  chunkConsecutiveSuccess: number;
  letterDifficulty: number; // 0, 1, 2
  letterConsecutiveSuccess: number;
  unassistedCorrectDates: string[]; // YYYY-MM-DD
  status: 'new' | 'practising' | 'ready_to_review' | 'remembered';
  lastPractisedAt: number;
  nextReviewAt: number;
}

export interface LessonBookmark {
  chapterId: string;
  lessonId: string;
  completed: boolean;
  lastActive: number;
  unfinishedState?: any;
}

export interface CompletedLesson {
  lessonId: string;
  chapterId: string;
  completedAt: number;
  score: number;
  total: number;
}

export interface AttemptLog {
  id?: number;
  word: string;
  taskType: ChallengeType;
  lessonRole: LessonRole;
  isRetry: boolean;
  usedHelp: boolean;
  correct: boolean;
  submittedAnswer: string;
  expectedAnswer: string;
  timestamp: number;
}

