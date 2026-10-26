import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Word, WordProgress, ExercisePrompt } from '../types';
import { getAllWordProgress, getWordProgress, saveWordProgress, logAttempt } from '../db';
import { generateReviewPlan } from '../engine/lesson-planner';
import { playCorrectSound, playIncorrectSound } from '../audio/sound';
import { LessonHeader } from '../components/LessonHeader';
import { FeedbackBanner } from '../components/FeedbackBanner';
import { LessonComplete } from '../components/LessonComplete';
import { ChooseSpelling } from '../components/challenges/ChooseSpelling';
import { TrickyPart } from '../components/challenges/TrickyPart';
import { ArrangeChunks } from '../components/challenges/ArrangeChunks';
import { ArrangeLetters } from '../components/challenges/ArrangeLetters';
import { WriteWholeWord } from '../components/challenges/WriteWholeWord';

export const ReviewPage: React.FC = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [prompts, setPrompts] = useState<ExercisePrompt[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const [hasAnswered, setHasAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [submittedAnswer, setSubmittedAnswer] = useState('');

  const [score, setScore] = useState(0);
  const [wordsPractised, setWordsPractised] = useState<Map<string, Word>>(new Map());
  const [wordsToReview, setWordsToReview] = useState<Map<string, Word>>(new Map());
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    initReview();
  }, []);

  const initReview = async () => {
    setLoading(true);
    const wpMap = await getAllWordProgress();
    const generated = generateReviewPlan(wpMap);

    setPrompts(generated);
    setCurrentIndex(0);
    setScore(0);
    setWordsPractised(new Map());
    setWordsToReview(new Map());
    setIsFinished(false);
    resetQuestion();
    setLoading(false);
  };

  const resetQuestion = () => {
    setHasAnswered(false);
    setIsCorrect(false);
    setSubmittedAnswer('');
  };

  const currentPrompt = prompts[currentIndex];

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
    } else {
      playIncorrectSound();
    }

    setWordsPractised((prev) => new Map(prev).set(targetWord.word, targetWord));
    if (!correct) {
      setWordsToReview((prev) => new Map(prev).set(targetWord.word, targetWord));
    }

    // Save progress updates
    const wp = await getWordProgress(targetWord.word);
    wp.lastPractisedAt = Date.now();
    await saveWordProgress(wp);

    await logAttempt({
      word: targetWord.word,
      taskType: currentPrompt.taskType,
      lessonRole: 'arrange',
      isRetry: false,
      usedHelp: false,
      correct,
      submittedAnswer: answer,
      expectedAnswer: targetWord.word,
      timestamp: Date.now()
    });
  };

  const handleContinue = () => {
    resetQuestion();
    if (currentIndex < prompts.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setIsFinished(true);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', fontSize: '1.2rem', fontWeight: 700 }}>
        Menyiapkan sesi latihan bebas...
      </div>
    );
  }

  if (isFinished) {
    return (
      <div style={{ height: '100dvh', maxHeight: '100dvh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <main style={{ flex: 1, minHeight: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '12px 16px', overflowY: 'auto' }}>
          <LessonComplete
            score={score}
            total={prompts.length}
            wordsPractised={Array.from(wordsPractised.values())}
            wordsToReview={Array.from(wordsToReview.values())}
            hasNextLesson={false}
            onNextLesson={() => {}}
            onHome={() => navigate('/')}
            onRepeatLesson={() => initReview()}
          />
        </main>
      </div>
    );
  }

  if (!currentPrompt) return null;

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
        currentIndex={currentIndex + 1}
        totalCount={prompts.length}
        onExit={() => navigate('/')}
      />

      <main
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
            word={currentPrompt.word}
            choices={currentPrompt.choices || []}
            lessonRole={currentPrompt.lessonRole}
            isNewWord={currentPrompt.isNewWord}
            onSelectAnswer={handleAnswer}
            disabled={hasAnswered}
            hasAnswered={hasAnswered}
            isCorrect={isCorrect}
            submittedAnswer={submittedAnswer}
          />
        )}

        {currentPrompt.taskType === 'tricky_part' && currentPrompt.trickyPart && (
          <TrickyPart
            word={currentPrompt.word}
            trickyPart={currentPrompt.trickyPart}
            choices={currentPrompt.choices || []}
            lessonRole={currentPrompt.lessonRole}
            isNewWord={currentPrompt.isNewWord}
            onSelectAnswer={handleAnswer}
            disabled={hasAnswered}
            hasAnswered={hasAnswered}
            isCorrect={isCorrect}
            submittedAnswer={submittedAnswer}
          />
        )}

        {currentPrompt.taskType === 'arrange_chunks' && (
          <ArrangeChunks
            word={currentPrompt.word}
            chunkTiles={currentPrompt.chunkTiles || []}
            lessonRole={currentPrompt.lessonRole}
            isNewWord={currentPrompt.isNewWord}
            onSubmitAnswer={handleAnswer}
            disabled={hasAnswered}
            hasAnswered={hasAnswered}
            isCorrect={isCorrect}
            submittedAnswer={submittedAnswer}
          />
        )}

        {currentPrompt.taskType === 'arrange_letters' && (
          <ArrangeLetters
            word={currentPrompt.word}
            letterTiles={currentPrompt.letterTiles || []}
            lessonRole={currentPrompt.lessonRole}
            isNewWord={currentPrompt.isNewWord}
            onSubmitAnswer={handleAnswer}
            disabled={hasAnswered}
            hasAnswered={hasAnswered}
            isCorrect={isCorrect}
            submittedAnswer={submittedAnswer}
          />
        )}

        {currentPrompt.taskType === 'write_whole_word' && (
          <WriteWholeWord
            word={currentPrompt.word}
            lessonRole={currentPrompt.lessonRole}
            isNewWord={currentPrompt.isNewWord}
            onSubmitAnswer={handleAnswer}
            onDontKnow={() => handleAnswer('')}
            disabled={hasAnswered}
            hasAnswered={hasAnswered}
            isCorrect={isCorrect}
            submittedAnswer={submittedAnswer}
          />
        )}
      </main>

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
          onContinue={handleContinue}
        />
      )}
    </div>
  );
};
