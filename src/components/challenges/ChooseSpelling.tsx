import React from 'react';
import { Word, LessonRole } from '../../types';
import { WordClueSection } from '../WordClueSection';
import { playClickSound } from '../../audio/sound';
import { Check, X } from 'lucide-react';

interface Props {
  word: Word;
  choices: string[];
  lessonRole: LessonRole;
  isNewWord?: boolean;
  onClueRevealed?: () => void;
  onSelectAnswer: (answer: string) => void;
  disabled?: boolean;
  hasAnswered?: boolean;
  isCorrect?: boolean;
  submittedAnswer?: string;
}

export const ChooseSpelling: React.FC<Props> = ({
  word,
  choices,
  isNewWord = false,
  onClueRevealed,
  onSelectAnswer,
  disabled = false,
  hasAnswered = false,
  isCorrect = false,
  submittedAnswer = ''
}) => {
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
        Pilih ejaan yang benar
      </h2>

      {/* Clue Section */}
      <WordClueSection
        word={word}
        isNewWord={isNewWord}
        onClueRevealed={onClueRevealed}
      />

      {/* Options grid with full answer highlights */}
      <div
        style={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          marginTop: '6px'
        }}
      >
        {choices.map((choice) => {
          const isSelected = hasAnswered && choice.trim().toLowerCase() === submittedAnswer?.trim().toLowerCase();
          const isCorrectChoice = hasAnswered && choice.trim().toLowerCase() === word.word.trim().toLowerCase();

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
                width: '100%',
                padding: '12px 20px',
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
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              <span>{choice}</span>
              {hasAnswered && isCorrectChoice && <Check size={20} strokeWidth={3} color="#16a34a" />}
              {hasAnswered && isSelected && !isCorrect && <X size={20} strokeWidth={3} color="#dc2626" />}
            </button>
          );
        })}
      </div>
    </div>
  );
};
