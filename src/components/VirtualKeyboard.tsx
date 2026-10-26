import React, { useEffect, useCallback } from 'react';
import { Delete, Check } from 'lucide-react';
import { playClickSound } from '../audio/sound';

interface Props {
  onKeyPress: (char: string) => void;
  onBackspace: () => void;
  onSubmit: () => void;
  onDontKnow?: () => void;
  disabled?: boolean;
}

const KEYBOARD_ROWS = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  ['Z', 'X', 'C', 'V', 'B', 'N', 'M']
];

export const VirtualKeyboard: React.FC<Props> = ({
  onKeyPress,
  onBackspace,
  onSubmit,
  onDontKnow,
  disabled = false
}) => {
  // Listen for physical keyboard input
  const handlePhysicalKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (disabled) return;
      if (e.key === 'Backspace') {
        e.preventDefault();
        playClickSound();
        onBackspace();
      } else if (e.key === 'Enter') {
        e.preventDefault();
        onSubmit();
      } else if (/^[a-zA-Z]$/.test(e.key)) {
        e.preventDefault();
        playClickSound();
        onKeyPress(e.key.toLowerCase());
      }
    },
    [disabled, onBackspace, onSubmit, onKeyPress]
  );

  useEffect(() => {
    window.addEventListener('keydown', handlePhysicalKeyDown);
    return () => window.removeEventListener('keydown', handlePhysicalKeyDown);
  }, [handlePhysicalKeyDown]);

  const handleKeyClick = (char: string) => {
    if (disabled) return;
    playClickSound();
    onKeyPress(char.toLowerCase());
  };

  const handleBackspaceClick = () => {
    if (disabled) return;
    playClickSound();
    onBackspace();
  };

  return (
    <div
      style={{
        width: '100%',
        maxWidth: '650px',
        margin: '0 auto',
        padding: '4px',
        display: 'flex',
        flexDirection: 'column',
        gap: '5px',
        userSelect: 'none'
      }}
    >
      {/* Top Rows */}
      {KEYBOARD_ROWS.map((row, rowIndex) => (
        <div
          key={rowIndex}
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '5px',
            touchAction: 'manipulation'
          }}
        >
          {rowIndex === 2 && (
            <button
              type="button"
              onClick={handleBackspaceClick}
              disabled={disabled}
              aria-label="Hapus huruf"
              style={{
                flex: '1.4',
                height: 'clamp(38px, 5.2vh, 46px)',
                maxWidth: '64px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#ffffff',
                color: 'var(--color-text-main)',
                border: '1px solid var(--color-border-dark)',
                borderRadius: '8px',
                boxShadow: '0 3px 0 var(--color-border-dark)',
                fontSize: '1rem',
                fontWeight: 700
              }}
            >
              <Delete size={20} />
            </button>
          )}

          {row.map((char) => (
            <button
              key={char}
              type="button"
              onClick={() => handleKeyClick(char)}
              disabled={disabled}
              style={{
                flex: '1',
                minWidth: '26px',
                maxWidth: '50px',
                height: 'clamp(38px, 5.2vh, 46px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#ffffff',
                color: 'var(--color-text-main)',
                border: '1px solid var(--color-border-dark)',
                borderRadius: '8px',
                boxShadow: '0 3px 0 var(--color-border-dark)',
                fontSize: '1.2rem',
                fontWeight: 800,
                transition: 'all 0.08s ease'
              }}
            >
              {char}
            </button>
          ))}

          {rowIndex === 2 && (
            <button
              type="button"
              onClick={onSubmit}
              disabled={disabled}
              aria-label="Kirim jawaban"
              style={{
                flex: '1.6',
                height: 'clamp(38px, 5.2vh, 46px)',
                maxWidth: '72px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'var(--color-primary)',
                color: '#ffffff',
                border: 'none',
                borderRadius: '8px',
                boxShadow: '0 3px 0 var(--color-primary-dark)',
                fontSize: '0.95rem',
                fontWeight: 800
              }}
            >
              <Check size={20} strokeWidth={3} />
            </button>
          )}
        </div>
      ))}

      {/* Don't know button */}
      {onDontKnow && (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '2px' }}>
          <button
            type="button"
            onClick={onDontKnow}
            disabled={disabled}
            style={{
              padding: '4px 12px',
              fontSize: '0.8rem',
              fontWeight: 700,
              color: 'var(--color-text-muted)',
              backgroundColor: 'transparent',
              borderRadius: '6px',
              textDecoration: 'underline'
            }}
          >
            Saya tidak tahu
          </button>
        </div>
      )}
    </div>
  );
};

