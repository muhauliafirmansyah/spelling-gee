import React, { useEffect } from 'react';
import { CheckCircle2, XCircle, ArrowRight, Volume2 } from 'lucide-react';
import { playWordAudio } from '../audio/sound';

interface Props {
  isCorrect: boolean;
  expectedWord: string;
  explanation?: string;
  submittedAnswer?: string;
  onContinue: () => void;
}

export const FeedbackBanner: React.FC<Props> = ({
  isCorrect,
  expectedWord,
  explanation,
  submittedAnswer,
  onContinue
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onContinue();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onContinue]);

  const handleReplay = (e: React.MouseEvent) => {
    e.stopPropagation();
    playWordAudio(expectedWord);
  };

  return (
    <div
      className="animate-slide-up"
      style={{
        width: '100%',
        flexShrink: 0,
        padding: '10px 18px',
        backgroundColor: isCorrect ? '#dcfce7' : '#fee2e2',
        borderTop: `2px solid ${isCorrect ? '#86efac' : '#fca5a5'}`,
        display: 'flex',
        flexDirection: 'column',
        gap: '6px',
        zIndex: 60,
        boxShadow: '0 -3px 12px rgba(0,0,0,0.06)'
      }}
    >
      <div
        style={{
          maxWidth: '650px',
          width: '100%',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
          flexWrap: 'wrap'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, minWidth: '220px' }}>
          {isCorrect ? (
            <CheckCircle2 size={30} color="#16a34a" strokeWidth={2.5} style={{ flexShrink: 0 }} />
          ) : (
            <XCircle size={30} color="#dc2626" strokeWidth={2.5} style={{ flexShrink: 0 }} />
          )}

          <div>
            <h3
              style={{
                fontSize: '1.1rem',
                fontWeight: 900,
                color: isCorrect ? '#15803d' : '#b91c1c',
                margin: 0
              }}
            >
              {isCorrect ? 'Hebat! Benar sekali!' : 'Kurang tepat'}
            </h3>

            {!isCorrect && (
              <div style={{ margin: '2px 0 0' }}>
                <p style={{ fontSize: '0.85rem', color: '#7f1d1d', margin: 0 }}>
                  Ejaan yang benar:{' '}
                  <strong style={{ fontSize: '1.05rem', color: '#991b1b', letterSpacing: '0.5px' }}>
                    {expectedWord}
                  </strong>
                </p>
                {submittedAnswer && (
                  <p style={{ fontSize: '0.8rem', color: '#991b1b', margin: '1px 0 0' }}>
                    Jawabanmu: <span style={{ textDecoration: 'line-through' }}>{submittedAnswer}</span>
                  </p>
                )}
              </div>
            )}

            {explanation && (
              <p
                style={{
                  fontSize: '0.82rem',
                  color: isCorrect ? '#166534' : '#991b1b',
                  margin: '2px 0 0',
                  fontWeight: 600
                }}
              >
                {explanation}
              </p>
            )}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            type="button"
            onClick={handleReplay}
            aria-label="Putar ulang suara"
            style={{
              padding: '8px',
              backgroundColor: '#ffffff',
              borderRadius: '50%',
              border: `2px solid ${isCorrect ? '#86efac' : '#fca5a5'}`,
              color: isCorrect ? '#16a34a' : '#dc2626',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: 'var(--shadow-sm)'
            }}
          >
            <Volume2 size={20} />
          </button>

          <button
            type="button"
            onClick={onContinue}
            style={{
              padding: '10px 22px',
              backgroundColor: isCorrect ? '#16a34a' : '#dc2626',
              color: '#ffffff',
              borderRadius: 'var(--border-radius-pill)',
              fontWeight: 800,
              fontSize: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: `0 3px 0 ${isCorrect ? '#15803d' : '#991b1b'}`
            }}
          >
            <span>Lanjut</span>
            <ArrowRight size={18} strokeWidth={2.5} />
          </button>
        </div>
      </div>
    </div>
  );
};
