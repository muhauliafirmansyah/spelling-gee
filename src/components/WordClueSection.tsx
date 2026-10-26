import React, { useState, useEffect } from 'react';
import { Word } from '../types';
import { AudioPlayerButton } from './AudioPlayerButton';
import { Lightbulb, EyeOff } from 'lucide-react';
import { playClickSound } from '../audio/sound';

interface Props {
  word: Word;
  isNewWord?: boolean;
  onClueRevealed?: () => void;
}

export const WordClueSection: React.FC<Props> = ({
  word,
  isNewWord = false,
  onClueRevealed
}) => {
  const [clueRevealed, setClueRevealed] = useState(isNewWord);

  useEffect(() => {
    setClueRevealed(Boolean(isNewWord));
  }, [word.word, isNewWord]);

  const handleRevealClue = () => {
    playClickSound();
    setClueRevealed(true);
    onClueRevealed?.();
  };

  const handleHideClue = () => {
    playClickSound();
    setClueRevealed(false);
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '4px',
        width: '100%',
        maxWidth: '500px',
        margin: '0 auto'
      }}
    >
      {/* Revealed Clue: Image and Indonesian meaning */}
      {clueRevealed && (
        <div
          className="animate-pop"
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '2px',
            marginBottom: '2px'
          }}
        >
          {word.image_path && (
            <div
              style={{
                width: '74px',
                height: '74px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                filter: 'drop-shadow(0 2px 5px rgba(0,0,0,0.06))'
              }}
            >
              <img
                src={word.image_path}
                alt={word.image_alt || word.word}
                style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
              />
            </div>
          )}
          {word.indonesian_translation && (
            <p
              style={{
                fontSize: '1.05rem',
                fontWeight: 800,
                color: 'var(--color-text-muted)',
                textAlign: 'center',
                margin: 0
              }}
            >
              {word.indonesian_translation}
            </p>
          )}
        </div>
      )}

      {/* Audio buttons + Clue toggle button row */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          flexWrap: 'wrap'
        }}
      >
        <AudioPlayerButton
          word={word.word}
          sentence={word.context_sentence}
          showSentenceButton={true}
          size="normal"
        />

        {/* If known word and clue is hidden: show "Get a clue" button */}
        {!isNewWord && !clueRevealed && (
          <button
            type="button"
            onClick={handleRevealClue}
            aria-label="Lihat petunjuk gambar dan arti"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 14px',
              backgroundColor: '#fef3c7',
              color: '#b45309',
              border: '2px solid #fde68a',
              borderRadius: 'var(--border-radius-pill)',
              fontWeight: 800,
              fontSize: '0.88rem',
              boxShadow: '0 3px 0 #fde68a',
              transition: 'all 0.1s ease',
              cursor: 'pointer'
            }}
          >
            <Lightbulb size={17} />
            <span>Petunjuk</span>
          </button>
        )}

        {/* If known word and clue was revealed: allow hiding */}
        {!isNewWord && clueRevealed && (
          <button
            type="button"
            onClick={handleHideClue}
            aria-label="Sembunyikan petunjuk"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              padding: '4px 10px',
              backgroundColor: 'transparent',
              color: 'var(--color-text-muted)',
              borderRadius: 'var(--border-radius-pill)',
              fontWeight: 700,
              fontSize: '0.78rem',
              cursor: 'pointer',
              border: '1px solid var(--color-border)'
            }}
          >
            <EyeOff size={13} />
            <span>Tutup Petunjuk</span>
          </button>
        )}
      </div>
    </div>
  );
};

