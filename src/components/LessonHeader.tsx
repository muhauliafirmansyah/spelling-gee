import React from 'react';
import { X, HelpCircle } from 'lucide-react';

interface Props {
  currentIndex: number;
  totalCount: number;
  onExit: () => void;
  allowHelp?: boolean;
  onHelp?: () => void;
}

export const LessonHeader: React.FC<Props> = ({
  currentIndex,
  totalCount,
  onExit,
  allowHelp = false,
  onHelp
}) => {
  const percent = totalCount > 0 ? Math.min(100, Math.round((currentIndex / totalCount) * 100)) : 0;

  return (
    <header
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '12px 16px',
        backgroundColor: 'var(--color-bg-surface)',
        borderBottom: '1px solid var(--color-border)',
        position: 'sticky',
        top: 0,
        zIndex: 50
      }}
    >
      <button
        type="button"
        onClick={onExit}
        aria-label="Keluar latihan"
        style={{
          padding: '6px',
          color: 'var(--color-text-muted)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '50%'
        }}
      >
        <X size={26} strokeWidth={2.5} />
      </button>

      {/* Progress track */}
      <div
        style={{
          flex: 1,
          height: '14px',
          backgroundColor: 'var(--color-border)',
          borderRadius: 'var(--border-radius-pill)',
          overflow: 'hidden',
          position: 'relative'
        }}
      >
        <div
          style={{
            height: '100%',
            width: `${percent}%`,
            backgroundColor: 'var(--color-primary)',
            borderRadius: 'var(--border-radius-pill)',
            transition: 'width 0.35s cubic-bezier(0.16, 1, 0.3, 1)'
          }}
        />
      </div>

      {allowHelp && onHelp && (
        <button
          type="button"
          onClick={onHelp}
          aria-label="Lihat bantuan"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '6px 12px',
            backgroundColor: '#fef3c7',
            color: '#b45309',
            border: '1px solid #fde68a',
            borderRadius: 'var(--border-radius-pill)',
            fontWeight: 800,
            fontSize: '0.85rem'
          }}
        >
          <HelpCircle size={18} />
          <span>Bantuan</span>
        </button>
      )}
    </header>
  );
};

