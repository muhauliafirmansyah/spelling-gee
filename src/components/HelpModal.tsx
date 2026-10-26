import React from 'react';
import { X, Lightbulb } from 'lucide-react';
import { Word } from '../types';

interface Props {
  word: Word;
  onClose: () => void;
}

export const HelpModal: React.FC<Props> = ({ word, onClose }) => {
  // Check if translation gives away the word spelling (e.g. "sofa" -> "sofa" or "perahu kayak" -> "kayak")
  const isIdentical = word.indonesian_translation.toLowerCase().includes(word.word.toLowerCase());
  const safeTranslation = isIdentical ? null : word.indonesian_translation;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.45)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        zIndex: 100
      }}
      onClick={onClose}
    >
      <div
        className="animate-pop"
        style={{
          backgroundColor: '#ffffff',
          borderRadius: 'var(--border-radius-lg)',
          width: '100%',
          maxWidth: '400px',
          padding: '24px',
          boxShadow: 'var(--shadow-md)',
          textAlign: 'center',
          position: 'relative'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            color: 'var(--color-text-muted)',
            padding: '4px'
          }}
        >
          <X size={24} />
        </button>

        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            color: '#b45309',
            backgroundColor: '#fef3c7',
            padding: '6px 14px',
            borderRadius: 'var(--border-radius-pill)',
            fontWeight: 800,
            fontSize: '0.9rem',
            marginBottom: '16px'
          }}
        >
          <Lightbulb size={20} />
          <span>Bantuan Petunjuk</span>
        </div>

        {/* Word illustration */}
        {word.image_path && (
          <div
            style={{
              width: '140px',
              height: '140px',
              margin: '0 auto 16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <img
              src={word.image_path}
              alt={word.image_alt || 'Gambar petunjuk'}
              style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
            />
          </div>
        )}

        {/* Safe Indonesian translation */}
        {safeTranslation && (
          <div style={{ marginBottom: '16px' }}>
            <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', marginBottom: '4px' }}>
              Arti kata:
            </p>
            <p style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--color-text-main)' }}>
              {safeTranslation}
            </p>
          </div>
        )}

        <button
          type="button"
          onClick={onClose}
          style={{
            width: '100%',
            padding: '12px',
            backgroundColor: 'var(--color-primary)',
            color: '#ffffff',
            borderRadius: 'var(--border-radius-pill)',
            fontWeight: 800,
            fontSize: '1rem',
            boxShadow: '0 3px 0 var(--color-primary-dark)'
          }}
        >
          Mengerti, Lanjut
        </button>
      </div>
    </div>
  );
};

