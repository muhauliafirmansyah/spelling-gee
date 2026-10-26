import React, { useState, useEffect, useMemo } from 'react';
import { Word, LessonRole } from '../../types';
import { WordClueSection } from '../WordClueSection';
import { RotateCcw, Check, Undo2 } from 'lucide-react';
import { playClickSound } from '../../audio/sound';

interface Tile {
  id: string;
  text: string;
}

interface Props {
  word: Word;
  chunkTiles: Tile[];
  lessonRole: LessonRole;
  isNewWord?: boolean;
  onClueRevealed?: () => void;
  onSubmitAnswer: (assembled: string) => void;
  disabled?: boolean;
  hasAnswered?: boolean;
  isCorrect?: boolean;
  submittedAnswer?: string;
}

export const ArrangeChunks: React.FC<Props> = ({
  word,
  chunkTiles,
  isNewWord = false,
  onClueRevealed,
  onSubmitAnswer,
  disabled = false,
  hasAnswered = false,
  isCorrect = false
}) => {
  const [assembled, setAssembled] = useState<Tile[]>([]);

  useEffect(() => {
    setAssembled([]);
  }, [word.word, chunkTiles]);

  const chosenIds = useMemo(() => new Set(assembled.map((t) => t.id)), [assembled]);

  const handleTileClickInTray = (tile: Tile) => {
    if (disabled || hasAnswered) return;
    playClickSound();
    if (chosenIds.has(tile.id)) {
      setAssembled((prev) => prev.filter((t) => t.id !== tile.id));
    } else {
      setAssembled((prev) => [...prev, tile]);
    }
  };

  const handleTileClickInAssembled = (tile: Tile) => {
    if (disabled || hasAnswered) return;
    playClickSound();
    setAssembled((prev) => prev.filter((t) => t.id !== tile.id));
  };

  const handleUndo = () => {
    if (disabled || hasAnswered || assembled.length === 0) return;
    playClickSound();
    setAssembled((prev) => prev.slice(0, prev.length - 1));
  };

  const handleClear = () => {
    if (disabled || hasAnswered || assembled.length === 0) return;
    playClickSound();
    setAssembled([]);
  };

  const handleSubmit = () => {
    if (disabled || hasAnswered || assembled.length === 0) return;
    playClickSound();
    const joined = assembled.map((t) => t.text).join('');
    onSubmitAnswer(joined);
  };

  return (
    <div
      className="animate-pop"
      style={{
        width: '100%',
        maxWidth: '520px',
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
        Susun bagian kata
      </h2>

      {/* Clue Section */}
      <WordClueSection
        word={word}
        isNewWord={isNewWord}
        onClueRevealed={onClueRevealed}
      />

      {/* Assembled area with feedback coloring */}
      <div
        style={{
          width: '100%',
          minHeight: '52px',
          padding: '6px 12px',
          backgroundColor: hasAnswered ? (isCorrect ? '#f0fdf4' : '#fef2f2') : '#ffffff',
          borderRadius: 'var(--border-radius-md)',
          border: hasAnswered
            ? isCorrect
              ? '2px solid #16a34a'
              : '2px solid #dc2626'
            : '2px dashed var(--color-border-dark)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '6px',
          flexWrap: 'wrap',
          transition: 'all 0.15s ease'
        }}
      >
        {assembled.length === 0 ? (
          <span style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', fontWeight: 600 }}>
            Ketuk pecahan kata di bawah
          </span>
        ) : (
          assembled.map((tile) => (
            <button
              key={tile.id}
              type="button"
              onClick={() => handleTileClickInAssembled(tile)}
              disabled={disabled || hasAnswered}
              style={{
                padding: '8px 14px',
                backgroundColor: hasAnswered
                  ? isCorrect
                    ? '#bbf7d0'
                    : '#fecaca'
                  : 'var(--color-primary-light)',
                border: hasAnswered
                  ? isCorrect
                    ? '2px solid #16a34a'
                    : '2px solid #dc2626'
                  : '2px solid var(--color-primary)',
                borderRadius: '8px',
                fontSize: '1.25rem',
                fontWeight: 800,
                color: hasAnswered
                  ? isCorrect
                    ? '#15803d'
                    : '#b91c1c'
                  : 'var(--color-text-main)',
                boxShadow: hasAnswered
                  ? isCorrect
                    ? '0 2px 0 #15803d'
                    : '0 2px 0 #b91c1c'
                  : '0 2px 0 var(--color-primary)',
                transition: 'all 0.15s ease'
              }}
            >
              {tile.text}
            </button>
          ))
        )}
      </div>

      {/* Controls: Undo & Clear */}
      <div style={{ display: 'flex', gap: '8px' }}>
        <button
          type="button"
          onClick={handleUndo}
          disabled={disabled || hasAnswered || assembled.length === 0}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            padding: '4px 10px',
            backgroundColor: '#ffffff',
            border: '1px solid var(--color-border-dark)',
            borderRadius: 'var(--border-radius-pill)',
            fontSize: '0.8rem',
            fontWeight: 700,
            color: assembled.length > 0 && !hasAnswered ? 'var(--color-text-main)' : 'var(--color-text-muted)',
            opacity: assembled.length > 0 && !hasAnswered ? 1 : 0.5
          }}
        >
          <Undo2 size={14} />
          <span>Kembalikan</span>
        </button>

        <button
          type="button"
          onClick={handleClear}
          disabled={disabled || hasAnswered || assembled.length === 0}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            padding: '4px 10px',
            backgroundColor: '#ffffff',
            border: '1px solid var(--color-border-dark)',
            borderRadius: 'var(--border-radius-pill)',
            fontSize: '0.8rem',
            fontWeight: 700,
            color: assembled.length > 0 && !hasAnswered ? 'var(--color-text-main)' : 'var(--color-text-muted)',
            opacity: assembled.length > 0 && !hasAnswered ? 1 : 0.5
          }}
        >
          <RotateCcw size={14} />
          <span>Ulangi</span>
        </button>
      </div>

      {/* Tray of Available Chunks */}
      <div
        style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          gap: '8px',
          flexWrap: 'wrap',
          minHeight: '48px',
          padding: '4px'
        }}
      >
        {chunkTiles.map((tile) => {
          const isChosen = chosenIds.has(tile.id);
          return (
            <button
              key={tile.id}
              type="button"
              onClick={() => handleTileClickInTray(tile)}
              disabled={disabled || hasAnswered}
              aria-pressed={isChosen}
              style={{
                padding: '8px 16px',
                backgroundColor: isChosen ? '#e2e8f0' : '#ffffff',
                border: isChosen ? '2px solid #cbd5e1' : '2px solid var(--color-border)',
                borderRadius: '8px',
                fontSize: '1.25rem',
                fontWeight: 800,
                color: isChosen ? '#94a3b8' : 'var(--color-text-main)',
                boxShadow: isChosen ? 'none' : '0 3px 0 var(--color-border-dark)',
                transform: isChosen ? 'translateY(2px)' : 'none',
                transition: 'all 0.1s ease',
                touchAction: 'manipulation',
                cursor: disabled || hasAnswered ? 'default' : 'pointer'
              }}
            >
              {tile.text}
            </button>
          );
        })}
      </div>

      {/* Submit Button */}
      <button
        type="button"
        onClick={handleSubmit}
        disabled={disabled || hasAnswered || assembled.length === 0}
        style={{
          marginTop: '6px',
          width: '100%',
          maxWidth: '260px',
          padding: '10px 20px',
          backgroundColor: assembled.length > 0 && !hasAnswered ? 'var(--color-primary)' : 'var(--color-border)',
          color: assembled.length > 0 && !hasAnswered ? '#ffffff' : 'var(--color-text-muted)',
          borderRadius: 'var(--border-radius-pill)',
          fontSize: '1rem',
          fontWeight: 800,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '6px',
          boxShadow: assembled.length > 0 && !hasAnswered ? '0 3px 0 var(--color-primary-dark)' : 'none',
          cursor: assembled.length > 0 && !hasAnswered ? 'pointer' : 'not-allowed'
        }}
      >
        <Check size={18} strokeWidth={3} />
        <span>Kirim Jawaban</span>
      </button>
    </div>
  );
};
