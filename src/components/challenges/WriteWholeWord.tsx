import React, { useState, useEffect } from 'react';
import { Word, LessonRole } from '../../types';
import { WordClueSection } from '../WordClueSection';
import { VirtualKeyboard } from '../VirtualKeyboard';

interface Props {
  word: Word;
  lessonRole: LessonRole;
  isNewWord?: boolean;
  onClueRevealed?: () => void;
  onSubmitAnswer: (input: string) => void;
  onDontKnow: () => void;
  disabled?: boolean;
  hasAnswered?: boolean;
  isCorrect?: boolean;
  submittedAnswer?: string;
}

export const WriteWholeWord: React.FC<Props> = ({
  word,
  isNewWord = false,
  onClueRevealed,
  onSubmitAnswer,
  onDontKnow,
  disabled = false,
  hasAnswered = false,
  isCorrect = false
}) => {
  const [typedLetters, setTypedLetters] = useState<string>('');

  useEffect(() => {
    setTypedLetters('');
  }, [word.word]);

  const handleKeyPress = (char: string) => {
    if (disabled || hasAnswered) return;
    setTypedLetters((prev) => prev + char);
  };

  const handleBackspace = () => {
    if (disabled || hasAnswered) return;
    setTypedLetters((prev) => prev.slice(0, -1));
  };

  const handleSubmit = () => {
    if (disabled || hasAnswered || typedLetters.trim() === '') return;
    onSubmitAnswer(typedLetters.trim());
  };

  return (
    <div
      className="animate-pop"
      style={{
        width: '100%',
        maxWidth: '560px',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '8px'
      }}
    >
      <h2
        style={{
          fontSize: '1.15rem',
          fontWeight: 800,
          color: 'var(--color-text-main)',
          textAlign: 'center',
          margin: '0 0 2px'
        }}
      >
        Eja dan tulis kata yang kamu dengar
      </h2>

      {/* Pure Spoken Clue by default for known words; player can click Petunjuk for image/translation */}
      <WordClueSection
        word={word}
        isNewWord={isNewWord}
        onClueRevealed={onClueRevealed}
      />

      {/* Answer Field (no length clue) with feedback coloring */}
      <div
        style={{
          width: '100%',
          minHeight: '48px',
          padding: '6px 16px',
          backgroundColor: hasAnswered ? (isCorrect ? '#f0fdf4' : '#fef2f2') : '#ffffff',
          borderRadius: 'var(--border-radius-md)',
          border: hasAnswered
            ? isCorrect
              ? '2px solid #16a34a'
              : '2px solid #dc2626'
            : '2px solid var(--color-border-dark)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1.75rem',
          fontWeight: 800,
          color: hasAnswered ? (isCorrect ? '#15803d' : '#b91c1c') : 'var(--color-text-main)',
          letterSpacing: '2px',
          boxShadow: hasAnswered
            ? isCorrect
              ? '0 3px 0 #16a34a'
              : '0 3px 0 #dc2626'
            : 'inset 0 2px 4px rgba(0,0,0,0.05)',
          margin: '2px 0',
          transition: 'all 0.15s ease'
        }}
      >
        {typedLetters ? (
          <span>{typedLetters}</span>
        ) : (
          <span style={{ color: 'var(--color-text-muted)', fontSize: '1rem', fontWeight: 600 }}>
            {hasAnswered ? '(tidak dijawab)' : 'Ketik ejaan lengkap...'}
          </span>
        )}
      </div>

      {/* In-Game Custom Keyboard */}
      <VirtualKeyboard
        onKeyPress={handleKeyPress}
        onBackspace={handleBackspace}
        onSubmit={handleSubmit}
        onDontKnow={onDontKnow}
        disabled={disabled || hasAnswered}
      />
    </div>
  );
};
