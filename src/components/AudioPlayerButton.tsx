import React, { useState, useEffect } from 'react';
import { Volume2, MessageSquare, Loader2 } from 'lucide-react';
import { playWordAudio, playSentenceAudio, playClickSound, stopAudio } from '../audio/sound';

interface Props {
  word: string;
  sentence?: string;
  showSentenceButton?: boolean;
  size?: 'normal' | 'large';
  autoPlayWord?: boolean;
}

export const AudioPlayerButton: React.FC<Props> = ({
  word,
  sentence,
  showSentenceButton = true,
  size = 'normal'
}) => {
  const [isPlayingWord, setIsPlayingWord] = useState(false);
  const [isPlayingSentence, setIsPlayingSentence] = useState(false);

  useEffect(() => {
    setIsPlayingWord(false);
    setIsPlayingSentence(false);
    return () => {
      stopAudio();
    };
  }, [word]);

  const handlePlayWord = async (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (isPlayingWord || isPlayingSentence) return;
    playClickSound();
    setIsPlayingWord(true);
    try {
      await playWordAudio(word);
    } finally {
      setIsPlayingWord(false);
    }
  };

  const handlePlaySentence = async (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (isPlayingWord || isPlayingSentence) return;
    playClickSound();
    setIsPlayingSentence(true);
    try {
      await playSentenceAudio(word, sentence);
    } finally {
      setIsPlayingSentence(false);
    }
  };

  const isLarge = size === 'large';

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', margin: '2px 0' }}>
      <button
        type="button"
        onClick={handlePlayWord}
        disabled={isPlayingWord || isPlayingSentence}
        aria-label="Dengarkan kata"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: isLarge ? '12px 20px' : '8px 16px',
          backgroundColor: isPlayingWord ? 'var(--color-primary-dark)' : 'var(--color-primary)',
          color: '#ffffff',
          borderRadius: 'var(--border-radius-pill)',
          fontWeight: 700,
          fontSize: isLarge ? '1.05rem' : '0.92rem',
          boxShadow: isPlayingWord ? 'none' : '0 3px 0 var(--color-primary-dark)',
          transform: isPlayingWord ? 'translateY(2px)' : 'none',
          transition: 'all 0.15s ease'
        }}
      >
        {isPlayingWord ? (
          <Loader2 size={isLarge ? 22 : 18} className="animate-spin" />
        ) : (
          <Volume2 size={isLarge ? 22 : 18} />
        )}
        <span>Dengarkan Kata</span>
      </button>

      {showSentenceButton && (
        <button
          type="button"
          onClick={handlePlaySentence}
          disabled={isPlayingWord || isPlayingSentence}
          aria-label="Dengarkan contoh kalimat"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: isLarge ? '12px 18px' : '8px 14px',
            backgroundColor: '#ffffff',
            color: 'var(--color-secondary-dark)',
            border: '2px solid var(--color-border)',
            borderRadius: 'var(--border-radius-pill)',
            fontWeight: 700,
            fontSize: isLarge ? '0.95rem' : '0.85rem',
            boxShadow: '0 3px 0 var(--color-border)',
            transition: 'all 0.15s ease'
          }}
        >
          {isPlayingSentence ? (
            <Loader2 size={isLarge ? 20 : 16} className="animate-spin" />
          ) : (
            <MessageSquare size={isLarge ? 20 : 16} />
          )}
          <span>Kalimat</span>
        </button>
      )}
    </div>
  );
};

