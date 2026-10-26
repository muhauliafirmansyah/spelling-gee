import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Word, ExercisePrompt, LessonRole } from '../types';
import { words } from '../data';
import {
  getWordProgress,
  saveWordProgress,
  getAllWordProgress,
  saveCompletedLesson,
  logAttempt
} from '../db';
import {
  generateNewWordPlan,
  generateArrangePlan,
  generateSpellPlan,
  createChooseSpellingPrompt,
  createTrickyPartPrompt,
  createArrangeChunksPrompt,
  createArrangeLettersPrompt,
  createWriteWholeWordPrompt
} from '../engine/lesson-planner';
import { playCorrectSound, playIncorrectSound, stopAudio } from '../audio/sound';
import { LessonHeader } from '../components/LessonHeader';
import { WordIntroductionCard } from '../components/WordIntroductionCard';
import { FeedbackBanner } from '../components/FeedbackBanner';
import { HelpModal } from '../components/HelpModal';
import { LessonComplete } from '../components/LessonComplete';
import { ChooseSpelling } from '../components/challenges/ChooseSpelling';
import { TrickyPart } from '../components/challenges/TrickyPart';
import { ArrangeChunks } from '../components/challenges/ArrangeChunks';
import { ArrangeLetters } from '../components/challenges/ArrangeLetters';
import { WriteWholeWord } from '../components/challenges/WriteWholeWord';

export const ExercisePage: React.FC = () => {
  const { mode = 'new-word' } = useParams<{ mode: string }>();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState<LessonRole>('introduce');
  const [introWords, setIntroWords] = useState<Word[]>([]);
  const [introIndex, setIntroIndex] = useState(0);

  // New word to unlock only upon finishing lesson
  const [newWordToUnlock, setNewWordToUnlock] = useState<Word | null>(null);

  const [prompts, setPrompts] = useState<ExercisePrompt[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [initialTotalCount, setInitialTotalCount] = useState(0);
  const [completedCount, setCompletedCount] = useState(0);

  // Question state
  const [usedHelp, setUsedHelp] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [submittedAnswer, setSubmittedAnswer] = useState('');

  // Results
  const [score, setScore] = useState(0);
  const [totalAttempts, setTotalAttempts] = useState(0);
  const [wordsPractised, setWordsPractised] = useState<Map<string, Word>>(new Map());
  const [wordsToReview, setWordsToReview] = useState<Map<string, Word>>(new Map());
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    initLesson();
  }, [mode]);

  const initLesson = async () => {
    setLoading(true);
    const wpMap = await getAllWordProgress();

    if (mode === 'new-word') {
      const plan = generateNewWordPlan(words, wpMap);
      
      // Keep newWord in memory, but DO NOT mark seen = true yet.
      // It is only unlocked in IndexedDB if the player finishes the lesson!
      setNewWordToUnlock(plan.introWords.length > 0 ? plan.newWord : null);

      setRole(plan.role);
      setIntroWords(plan.introWords);
      setIntroIndex(0);
      setPrompts(plan.prompts);
      setInitialTotalCount(plan.prompts.length);
    } else if (mode === 'arrange') {
      const plan = generateArrangePlan(words, wpMap);
      setNewWordToUnlock(null);
      setRole(plan.role);
      setIntroWords([]);
      setPrompts(plan.prompts);
      setInitialTotalCount(plan.prompts.length);
    } else {
      // spell
      const plan = generateSpellPlan(words, wpMap);
      setNewWordToUnlock(null);
      setRole(plan.role);
      setIntroWords([]);
      setPrompts(plan.prompts);
      setInitialTotalCount(plan.prompts.length);
    }

    setCurrentIndex(0);
    setCompletedCount(0);
    setScore(0);
    setTotalAttempts(0);
    setWordsPractised(new Map());
    setWordsToReview(new Map());
    setIsFinished(false);
    resetQuestionState();

    setLoading(false);
  };

  const resetQuestionState = () => {
    setUsedHelp(false);
    setShowHelpModal(false);
    setHasAnswered(false);
    setIsCorrect(false);
    setSubmittedAnswer('');
  };

  const currentPrompt = prompts[currentIndex];

  const handleNextIntroWord = () => {
    if (introIndex < introWords.length - 1) {
      setIntroIndex((prev) => prev + 1);
    } else {
      setIntroWords([]);
    }
  };

  const createRetryPrompt = (orig: ExercisePrompt): ExercisePrompt => {
    const w = orig.word;
    const isNew = orig.isNewWord ?? false;
    if (orig.taskType === 'write_whole_word') {
      return createWriteWholeWordPrompt(w, role, true, isNew);
    }
    if (orig.taskType === 'arrange_chunks') {
      return createArrangeChunksPrompt(w, role, Math.max(0, orig.extraTileCount - 2), true, isNew);
    }
    if (orig.taskType === 'arrange_letters') {
      return createArrangeLettersPrompt(w, role, orig.extraTileCount, true, isNew);
    }
    if (orig.taskType === 'tricky_part' && orig.trickyPart) {
      const choices = orig.choices
        ? [...orig.choices].sort(() => Math.random() - 0.5)
        : [orig.trickyPart.answer];
      return {
        ...orig,
        id: `tricky_retry_${orig.trickyPart.trick_id}_${Date.now()}_${Math.random()}`,
        isRetry: true,
        isNewWord: isNew,
        choices
      };
    }
    return createChooseSpellingPrompt(w, role, true, isNew);
  };

  const handleAnswer = async (answer: string) => {
    if (hasAnswered || !currentPrompt) return;

    setSubmittedAnswer(answer);
    setHasAnswered(true);

    const targetWord = currentPrompt.word;
    let correct = false;

    if (currentPrompt.taskType === 'tricky_part') {
      correct = answer === currentPrompt.trickyPart?.answer;
    } else {
      correct = answer.trim().toLowerCase() === targetWord.word.toLowerCase();
    }

    setIsCorrect(correct);

    if (correct) {
      playCorrectSound();
      setScore((s) => s + 1);
      setCompletedCount((c) => c + 1);
    } else {
      playIncorrectSound();
    }

    setTotalAttempts((t) => t + 1);

    setWordsPractised((prev) => new Map(prev).set(targetWord.word, targetWord));
    if (!correct) {
      setWordsToReview((prev) => new Map(prev).set(targetWord.word, targetWord));
    }

    // Update progress in DB (without prematurely unlocking the new word)
    await updateProgressRecord(targetWord, currentPrompt, correct, usedHelp, answer);

    // If player makes a mistake during any question, requeue it to the back!
    if (!correct) {
      const retryPrompt = createRetryPrompt(currentPrompt);
      setPrompts((prev) => [...prev, retryPrompt]);
    }
  };

  const updateProgressRecord = async (
    wordObj: Word,
    prompt: ExercisePrompt,
    correct: boolean,
    helpUsed: boolean,
    rawAnswer: string
  ) => {
    const wp = await getWordProgress(wordObj.word);

    // If this word is the brand new word being introduced in this lesson,
    // do NOT set wp.seen = true yet. It will only be unlocked upon lesson completion in finishLesson()!
    if (newWordToUnlock && wordObj.word.toLowerCase() === newWordToUnlock.word.toLowerCase()) {
      // Keep seen as false until finished
    } else {
      wp.seen = true;
    }

    wp.lastPractisedAt = Date.now();

    // Arranging progression (adaptive extra tiles)
    if (prompt.taskType === 'arrange_chunks' && !prompt.isRetry && !helpUsed) {
      if (correct) {
        wp.chunkConsecutiveSuccess += 1;
        if (wp.chunkConsecutiveSuccess >= 2 && wp.chunkDifficulty < 2) {
          wp.chunkDifficulty += 1;
          wp.chunkConsecutiveSuccess = 0;
        }
      } else {
        wp.chunkDifficulty = Math.max(0, wp.chunkDifficulty - 1);
        wp.chunkConsecutiveSuccess = 0;
      }
    } else if (prompt.taskType === 'arrange_letters' && !prompt.isRetry && !helpUsed) {
      if (correct) {
        wp.letterConsecutiveSuccess += 1;
        if (wp.letterConsecutiveSuccess >= 2 && wp.letterDifficulty < 2) {
          wp.letterDifficulty += 1;
          wp.letterConsecutiveSuccess = 0;
        }
      } else {
        wp.letterDifficulty = Math.max(0, wp.letterDifficulty - 1);
        wp.letterConsecutiveSuccess = 0;
      }
    }

    // Unassisted whole-word recall mastery
    if (prompt.taskType === 'write_whole_word' && !helpUsed && !prompt.isRetry && correct) {
      const todayStr = new Date().toISOString().slice(0, 10);
      if (!wp.unassistedCorrectDates.includes(todayStr)) {
        wp.unassistedCorrectDates.push(todayStr);
      }
      if (wp.unassistedCorrectDates.length >= 2) {
        wp.status = 'remembered';
      } else {
        wp.status = 'practising';
      }
      wp.nextReviewAt = Date.now() + 24 * 60 * 60 * 1000;
    } else if (!correct && prompt.taskType === 'write_whole_word') {
      if (wp.status === 'remembered') {
        wp.status = 'practising';
      }
    }

    await saveWordProgress(wp);

    await logAttempt({
      word: wordObj.word,
      taskType: prompt.taskType,
      lessonRole: role,
      isRetry: prompt.isRetry,
      usedHelp: helpUsed,
      correct,
      submittedAnswer: rawAnswer,
      expectedAnswer: prompt.taskType === 'tricky_part' ? prompt.trickyPart?.answer || '' : wordObj.word,
      timestamp: Date.now()
    });
  };

  const handleContinueAfterFeedback = () => {
    if (!hasAnswered) return;
    stopAudio();
    resetQuestionState();
    if (currentIndex < prompts.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      finishLesson();
    }
  };

  const finishLesson = async () => {
    setIsFinished(true);

    // Only now that the player has completed the entire new word lesson,
    // officially mark the new word as seen and unlocked!
    if (mode === 'new-word' && newWordToUnlock) {
      const wp = await getWordProgress(newWordToUnlock.word);
      wp.seen = true;
      wp.introducedAt = Date.now();
      wp.lastPractisedAt = Date.now();
      await saveWordProgress(wp);
    }

    const lessonId = `session-${mode}-${Date.now()}`;
    await saveCompletedLesson({
      lessonId,
      chapterId: mode,
      completedAt: Date.now(),
      score: initialTotalCount,
      total: totalAttempts || prompts.length
    });
  };

  if (loading) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', fontSize: '1.2rem', fontWeight: 700 }}>
        Menyiapkan latihan...
      </div>
    );
  }

  // 1. Unscored Word Introduction Card
  if (introWords.length > 0 && introIndex < introWords.length) {
    return (
      <div style={{ height: '100dvh', maxHeight: '100dvh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <LessonHeader
          currentIndex={introIndex + 1}
          totalCount={introWords.length}
          onExit={() => navigate('/')}
        />
        <main style={{ flex: 1, minHeight: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '12px 16px', overflowY: 'auto' }}>
          <WordIntroductionCard
            word={introWords[introIndex]}
            onContinue={handleNextIntroWord}
          />
        </main>
      </div>
    );
  }

  // 2. Lesson Complete Screen
  if (isFinished) {
    let nextLabel = 'Main Lagi';
    if (mode === 'new-word') nextLabel = 'Tambah Kata Baru Lagi';
    if (mode === 'arrange') nextLabel = 'Susun Kata Lagi';
    if (mode === 'spell') nextLabel = 'Uji Ejaan Lagi';

    return (
      <div style={{ height: '100dvh', maxHeight: '100dvh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <main style={{ flex: 1, minHeight: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '12px 16px', overflowY: 'auto' }}>
          <LessonComplete
            score={initialTotalCount}
            total={totalAttempts || initialTotalCount}
            wordsPractised={Array.from(wordsPractised.values())}
            wordsToReview={Array.from(wordsToReview.values())}
            hasNextLesson={true}
            nextLessonLabel={nextLabel}
            onNextLesson={() => initLesson()}
            onHome={() => navigate('/')}
            onRepeatLesson={() => initLesson()}
          />
        </main>
      </div>
    );
  }

  // 3. Question Prompts
  if (!currentPrompt) {
    return null;
  }

  return (
    <div
      style={{
        height: '100dvh',
        maxHeight: '100dvh',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'var(--color-bg-app)',
        overflow: 'hidden'
      }}
    >
      <LessonHeader
        currentIndex={completedCount}
        totalCount={initialTotalCount || prompts.length}
        onExit={() => navigate('/')}
        allowHelp={currentPrompt.allowHelp}
        onHelp={() => {
          setUsedHelp(true);
          setShowHelpModal(true);
        }}
      />

      <main
        key={currentPrompt.id || `prompt-${currentIndex}`}
        style={{
          flex: 1,
          minHeight: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '8px 16px',
          width: '100%',
          maxWidth: '680px',
          margin: '0 auto',
          overflowY: 'auto'
        }}
      >
        {currentPrompt.taskType === 'choose_spelling' && (
          <ChooseSpelling
            key={currentPrompt.id}
            word={currentPrompt.word}
            choices={currentPrompt.choices || []}
            lessonRole={role}
            isNewWord={currentPrompt.isNewWord}
            onClueRevealed={() => setUsedHelp(true)}
            onSelectAnswer={handleAnswer}
            disabled={hasAnswered}
            hasAnswered={hasAnswered}
            isCorrect={isCorrect}
            submittedAnswer={submittedAnswer}
          />
        )}

        {currentPrompt.taskType === 'tricky_part' && currentPrompt.trickyPart && (
          <TrickyPart
            key={currentPrompt.id}
            word={currentPrompt.word}
            trickyPart={currentPrompt.trickyPart}
            choices={currentPrompt.choices || []}
            lessonRole={role}
            isNewWord={currentPrompt.isNewWord}
            onClueRevealed={() => setUsedHelp(true)}
            onSelectAnswer={handleAnswer}
            disabled={hasAnswered}
            hasAnswered={hasAnswered}
            isCorrect={isCorrect}
            submittedAnswer={submittedAnswer}
          />
        )}

        {currentPrompt.taskType === 'arrange_chunks' && (
          <ArrangeChunks
            key={currentPrompt.id}
            word={currentPrompt.word}
            chunkTiles={currentPrompt.chunkTiles || []}
            lessonRole={role}
            isNewWord={currentPrompt.isNewWord}
            onClueRevealed={() => setUsedHelp(true)}
            onSubmitAnswer={handleAnswer}
            disabled={hasAnswered}
            hasAnswered={hasAnswered}
            isCorrect={isCorrect}
            submittedAnswer={submittedAnswer}
          />
        )}

        {currentPrompt.taskType === 'arrange_letters' && (
          <ArrangeLetters
            key={currentPrompt.id}
            word={currentPrompt.word}
            letterTiles={currentPrompt.letterTiles || []}
            lessonRole={role}
            isNewWord={currentPrompt.isNewWord}
            onClueRevealed={() => setUsedHelp(true)}
            onSubmitAnswer={handleAnswer}
            disabled={hasAnswered}
            hasAnswered={hasAnswered}
            isCorrect={isCorrect}
            submittedAnswer={submittedAnswer}
          />
        )}

        {currentPrompt.taskType === 'write_whole_word' && (
          <WriteWholeWord
            key={currentPrompt.id}
            word={currentPrompt.word}
            lessonRole={role}
            isNewWord={currentPrompt.isNewWord}
            onClueRevealed={() => setUsedHelp(true)}
            onSubmitAnswer={handleAnswer}
            onDontKnow={() => handleAnswer('')}
            disabled={hasAnswered}
            hasAnswered={hasAnswered}
            isCorrect={isCorrect}
            submittedAnswer={submittedAnswer}
          />
        )}
      </main>

      {/* Feedback Banner */}
      {hasAnswered && (
        <FeedbackBanner
          isCorrect={isCorrect}
          expectedWord={
            currentPrompt.taskType === 'tricky_part'
              ? currentPrompt.trickyPart?.answer || currentPrompt.word.word
              : currentPrompt.word.word
          }
          explanation={currentPrompt.trickyPart?.explanation}
          submittedAnswer={submittedAnswer}
          onContinue={handleContinueAfterFeedback}
        />
      )}

      {/* Help Modal */}
      {showHelpModal && (
        <HelpModal
          word={currentPrompt.word}
          onClose={() => setShowHelpModal(false)}
        />
      )}
    </div>
  );
};
