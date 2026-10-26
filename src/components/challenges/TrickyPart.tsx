import React from 'react';
import { Word, TrickyPart as TrickyPartType, LessonRole } from '../../types';
import { WordClueSection } from '../WordClueSection';
import { playClickSound } from '../../audio/sound';
import { Check, X } from 'lucide-react';

interface Props {
  word: Word;
  trickyPart: TrickyPartType;
  choices: string[];
  lessonRole: LessonRole;
  isNewWord?: boolean;
  onClueRevealed?: () => void;
  onSelectAnswer: (chunk: string) => void;
  disabled?: boolean;
  hasAnswered?: boolean;
  isCorrect?: boolean;
  submittedAnswer?: string;
}

export const TrickyPart: React.FC<Props> = ({
  word,
  trickyPart,
  choices,
  isNewWord = false,
  onClueRevealed,
  onSelectAnswer,
  disabled = false,
  hasAnswered = false,
  isCorrect = false,
  submittedAnswer = ''
}) => {
  // Split template by underscore to display with a highlighted slot
  const parts = trickyPart.template.split('_');

  const handleClick = (choice: string) => {
    if (disabled || hasAnswered) return;
    playClickSound();
    onSelectAnswer(choice);
  };

  return (
    <div
      className="animate-pop"
      style={{
        width: '100%',
        maxWidth: '480px',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '10px'
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
        Lengkapi bagian yang kosong
      </h2>

      {/* Clue Section */}
      <WordClueSection
        word={word}
        isNewWord={isNewWord}
        onClueRevealed={onClueRevealed}
      />

      {/* Display Template with constant-width slot */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '4px',
          padding: '10px 22px',
          backgroundColor: '#ffffff',
          borderRadius: 'var(--border-radius-md)',
          border: '2px solid var(--color-border)',
          boxShadow: '0 3px 0 var(--color-border-dark)',
          fontSize: '1.8rem',
          fontWeight: 900,
          color: 'var(--color-text-main)',
          letterSpacing: '2px',
          margin: '4px 0'
        }}
      >
        {parts.map((p, idx) => (
          <React.Fragment key={idx}>
            <span>{p}</span>
            {idx < parts.length - 1 && (
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minWidth: '48px',
                  height: '36px',
                  margin: '0 4px',
                  padding: '0 6px',
                  backgroundColor: hasAnswered ? (isCorrect ? '#dcfce7' : '#fee2e2') : '#f1f5f9',
                  borderBottom: `4px solid ${
                    hasAnswered
                      ? isCorrect
                        ? '#16a34a'
                        : '#dc2626'
                      : 'var(--color-secondary)'
                  }`,
                  borderRadius: '6px',
                  verticalAlign: 'middle',
                  color: hasAnswered ? (isCorrect ? '#15803d' : '#b91c1c') : 'inherit',
                  fontSize: '1.6rem',
                  fontWeight: 900
                }}
              >
                {hasAnswered ? (
                  isCorrect ? (
                    trickyPart.answer
                  ) : (
                    <span>
                      <span style={{ textDecoration: 'line-through', marginRight: '4px' }}>
                        {submittedAnswer || '?'}
                      </span>
                      <span style={{ color: '#15803d' }}>{trickyPart.answer}</span>
                    </span>
                  )
                ) : (
                  ''
                )}
              </span>
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Choice Buttons with full answer highlights */}
      <div
        style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          gap: '10px',
          flexWrap: 'wrap',
          marginTop: '4px'
        }}
      >
        {choices.map((choice) => {
          const displayLabel = choice === '' ? '(tanpa huruf)' : choice;
          const isSelected = hasAnswered && choice === submittedAnswer;
          const isCorrectChoice = hasAnswered && choice === trickyPart.answer;

          let btnBg = '#ffffff';
          let btnBorder = '2px solid var(--color-border)';
          let btnColor = 'var(--color-text-main)';
          let btnShadow = '0 3px 0 var(--color-border-dark)';

          if (hasAnswered) {
            if (isCorrectChoice) {
              // Correct answer: highlight GREEN
              btnBg = '#dcfce7';
              btnBorder = '2px solid #16a34a';
              btnColor = '#15803d';
              btnShadow = '0 3px 0 #15803d';
            } else if (isSelected && !isCorrect) {
              // User's wrong answer: highlight RED
              btnBg = '#fee2e2';
              btnBorder = '2px solid #dc2626';
              btnColor = '#b91c1c';
              btnShadow = '0 3px 0 #b91c1c';
            } else {
              // Dim other choices
              btnBg = '#f8fafc';
              btnBorder = '2px solid #e2e8f0';
              btnColor = '#94a3b8';
              btnShadow = 'none';
            }
          }

          return (
            <button
              key={choice}
              type="button"
              onClick={() => handleClick(choice)}
              disabled={disabled || hasAnswered}
              style={{
                flex: '1',
                minWidth: '80px',
                maxWidth: '140px',
                padding: '10px 16px',
                backgroundColor: btnBg,
                border: btnBorder,
                borderRadius: 'var(--border-radius-md)',
                fontSize: '1.25rem',
                fontWeight: 800,
                color: btnColor,
                letterSpacing: '1px',
                textAlign: 'center',
                boxShadow: btnShadow,
                transition: 'all 0.15s ease',
                touchAction: 'manipulation',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px'
              }}
            >
              <span>{displayLabel}</span>
              {hasAnswered && isCorrectChoice && <Check size={18} strokeWidth={3} color="#16a34a" />}
              {hasAnswered && isSelected && !isCorrect && <X size={18} strokeWidth={3} color="#dc2626" />}
            </button>
          );
        })}
      </div>
    </div>
  );
};
