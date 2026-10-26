import React from 'react';
import { Word } from '../types';
import { AudioPlayerButton } from './AudioPlayerButton';
import { Sparkles, ArrowRight } from 'lucide-react';

interface Props {
  word: Word;
  onContinue: () => void;
}

export const WordIntroductionCard: React.FC<Props> = ({ word, onContinue }) => {
  return (
    <div
      className="animate-pop"
      style={{
        width: '100%',
        maxWidth: '480px',
        margin: '0 auto',
        padding: '16px 16px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        gap: '4px'
      }}
    >
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          color: 'var(--color-primary-dark)',
          backgroundColor: 'var(--color-primary-light)',
          padding: '4px 14px',
          borderRadius: 'var(--border-radius-pill)',
          fontWeight: 800,
          fontSize: '0.85rem',
          marginBottom: '6px'
        }}
      >
        <Sparkles size={16} />
        <span>Kata Baru</span>
      </div>

      {/* SVG Image */}
      {word.image_path && (
        <div
          style={{
            width: 'clamp(80px, 14vh, 115px)',
            height: 'clamp(80px, 14vh, 115px)',
            marginBottom: '6px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            filter: 'drop-shadow(0 3px 8px rgba(0,0,0,0.06))'
          }}
        >
          <img
            src={word.image_path}
            alt={word.image_alt || word.word}
            style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
          />
        </div>
      )}

      {/* English word */}
      <h1
        style={{
          fontSize: '1.9rem',
          fontWeight: 900,
          color: 'var(--color-text-main)',
          letterSpacing: '1px',
          margin: '0 0 2px'
        }}
      >
        {word.word}
      </h1>

      {/* Indonesian meaning */}
      <p
        style={{
          fontSize: '1.15rem',
          fontWeight: 700,
          color: 'var(--color-text-muted)',
          margin: '0 0 8px'
        }}
      >
        {word.indonesian_translation}
      </p>

      {/* Audio controls */}
      <AudioPlayerButton
        word={word.word}
        sentence={word.context_sentence}
        showSentenceButton={true}
        size="normal"
      />

      {/* Example sentence */}
      {word.context_sentence && (
        <div
          style={{
            backgroundColor: '#ffffff',
            border: '1.5px solid var(--color-border)',
            borderRadius: 'var(--border-radius-md)',
            padding: '8px 14px',
            margin: '8px 0',
            width: '100%',
            fontSize: '0.95rem',
            lineHeight: 1.4,
            color: 'var(--color-text-main)'
          }}
        >
          <p style={{ fontStyle: 'italic', margin: 0 }}>
            "{word.context_sentence}"
          </p>
        </div>
      )}

      {/* Continue button */}
      <button
        type="button"
        onClick={onContinue}
        style={{
          marginTop: '6px',
          width: '100%',
          maxWidth: '300px',
          padding: '12px 20px',
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
        <span>Mulai Latihan</span>
        <ArrowRight size={20} strokeWidth={2.5} />
      </button>
    </div>
  );
};
