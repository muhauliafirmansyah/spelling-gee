import React from 'react';
import { Trophy, ArrowRight, Home, RotateCcw } from 'lucide-react';
import { Word } from '../types';

interface Props {
  score: number;
  total: number;
  wordsPractised: Word[];
  wordsToReview: Word[];
  hasNextLesson: boolean;
  nextLessonLabel?: string;
  onNextLesson: () => void;
  onHome: () => void;
  onRepeatLesson: () => void;
}

export const LessonComplete: React.FC<Props> = ({
  score,
  total,
  wordsPractised,
  wordsToReview,
  hasNextLesson,
  nextLessonLabel = 'Pelajaran Berikutnya',
  onNextLesson,
  onHome,
  onRepeatLesson
}) => {
  const percent = total > 0 ? Math.round((score / total) * 100) : 100;

  return (
    <div
      className="animate-pop"
      style={{
        width: '100%',
        maxWidth: '480px',
        margin: '0 auto',
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center'
      }}
    >
      <div
        style={{
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          backgroundColor: '#fef3c7',
          color: '#d97706',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '10px',
          boxShadow: '0 3px 8px rgba(217, 119, 6, 0.15)'
        }}
      >
        <Trophy size={34} strokeWidth={2.2} />
      </div>

      <h1
        style={{
          fontSize: '1.6rem',
          fontWeight: 900,
          color: 'var(--color-text-main)',
          marginBottom: '4px'
        }}
      >
        Pelajaran Selesai!
      </h1>

      <p style={{ fontSize: '0.95rem', color: 'var(--color-text-muted)', marginBottom: '12px' }}>
        Latihan selesai dengan hasil <strong>{score} dari {total}</strong> benar ({percent}%).
      </p>

      {/* Words practised */}
      <div
        style={{
          width: '100%',
          backgroundColor: '#ffffff',
          borderRadius: 'var(--border-radius-md)',
          border: '1.5px solid var(--color-border)',
          padding: '10px 14px',
          marginBottom: '14px',
          textAlign: 'left'
        }}
      >
        <h4 style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--color-text-muted)', marginBottom: '6px' }}>
          Kata yang dipelajari:
        </h4>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
          {wordsPractised.map((w) => {
            const needsReview = wordsToReview.some((r) => r.word.toLowerCase() === w.word.toLowerCase());
            return (
              <span
                key={w.word}
                style={{
                  padding: '4px 10px',
                  borderRadius: 'var(--border-radius-pill)',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  backgroundColor: needsReview ? '#fee2e2' : '#dcfce7',
                  color: needsReview ? '#b91c1c' : '#15803d',
                  border: `1px solid ${needsReview ? '#fca5a5' : '#86efac'}`
                }}
              >
                {w.word}
              </span>
            );
          })}
        </div>
      </div>

      {/* Actions */}
      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {hasNextLesson && (
          <button
            type="button"
            onClick={onNextLesson}
            style={{
              width: '100%',
              padding: '12px 18px',
              backgroundColor: 'var(--color-primary)',
              color: '#ffffff',
              borderRadius: 'var(--border-radius-pill)',
              fontWeight: 800,
              fontSize: '1.05rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              boxShadow: '0 3px 0 var(--color-primary-dark)',
              cursor: 'pointer'
            }}
          >
            <span>{nextLessonLabel}</span>
            <ArrowRight size={20} strokeWidth={2.5} />
          </button>
        )}

        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            type="button"
            onClick={onRepeatLesson}
            style={{
              flex: 1,
              padding: '10px',
              backgroundColor: '#ffffff',
              color: 'var(--color-text-main)',
              border: '1.5px solid var(--color-border)',
              borderRadius: 'var(--border-radius-pill)',
              fontWeight: 700,
              fontSize: '0.9rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              boxShadow: '0 2px 0 var(--color-border)',
              cursor: 'pointer'
            }}
          >
            <RotateCcw size={16} />
            <span>Ulangi</span>
          </button>

          <button
            type="button"
            onClick={onHome}
            style={{
              flex: 1,
              padding: '10px',
              backgroundColor: '#ffffff',
              color: 'var(--color-text-main)',
              border: '1.5px solid var(--color-border)',
              borderRadius: 'var(--border-radius-pill)',
              fontWeight: 700,
              fontSize: '0.9rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              boxShadow: '0 2px 0 var(--color-border)',
              cursor: 'pointer'
            }}
          >
            <Home size={16} />
            <span>Menu Utama</span>
          </button>
        </div>
      </div>
    </div>
  );
};
