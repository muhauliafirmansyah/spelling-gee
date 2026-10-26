import React, { useState, useEffect } from 'react';
import {
  X,
  CheckCircle2,
  Search,
  RotateCcw,
  Volume2,
  Check,
  Plus,
  Sparkles,
  Lock,
  Unlock
} from 'lucide-react';
import { Word, WordProgress } from '../types';
import { words } from '../data';
import { AudioPlayerButton } from './AudioPlayerButton';
import { playWordAudio, playClickSound } from '../audio/sound';
import { setWordLearned, setMultipleWordsLearned, resetAllData } from '../db';

interface Props {
  wordProgressMap: Record<string, WordProgress>;
  onClose: () => void;
  onProgressChanged?: () => Promise<void>;
}

type FilterTab = 'all' | 'seen' | 'unseen';

export const WordLibrary: React.FC<Props> = ({
  wordProgressMap: initialProgressMap,
  onClose,
  onProgressChanged
}) => {
  const [progressMap, setProgressMap] = useState<Record<string, WordProgress>>(initialProgressMap);
  const [selectedWord, setSelectedWord] = useState<Word | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<FilterTab>('all');
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    setProgressMap(initialProgressMap);
  }, [initialProgressMap]);

  // Partition words
  const seenWords: Word[] = [];
  const unseenWords: Word[] = [];

  for (const w of words) {
    if (progressMap[w.word]?.seen) {
      seenWords.push(w);
    } else {
      unseenWords.push(w);
    }
  }

  // Toggle single word learned status
  const handleToggleLearned = async (wordStr: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (isProcessing) return;
    playClickSound();
    setIsProcessing(true);

    try {
      const isCurrentlyLearned = Boolean(progressMap[wordStr]?.seen);
      const updatedWp = await setWordLearned(wordStr, !isCurrentlyLearned);

      setProgressMap((prev) => ({
        ...prev,
        [wordStr]: updatedWp
      }));

      await onProgressChanged?.();
    } finally {
      setIsProcessing(false);
    }
  };

  // Bulk: Mark all words as learned
  const handleMarkAllLearned = async () => {
    if (isProcessing) return;
    if (!window.confirm('Tandai semua 88 kata sebagai SUDAH dipelajari?')) return;

    playClickSound();
    setIsProcessing(true);
    try {
      await setMultipleWordsLearned(
        words.map((w) => w.word),
        true
      );
      // Update local state
      const updated: Record<string, WordProgress> = {};
      for (const w of words) {
        updated[w.word] = {
          word: w.word,
          seen: true,
          introducedAt: Date.now(),
          chunkDifficulty: 0,
          chunkConsecutiveSuccess: 0,
          letterDifficulty: 0,
          letterConsecutiveSuccess: 0,
          unassistedCorrectDates: [],
          status: 'practising',
          lastPractisedAt: Date.now(),
          nextReviewAt: 0
        };
      }
      setProgressMap(updated);
      await onProgressChanged?.();
    } finally {
      setIsProcessing(false);
    }
  };

  // Bulk: Reset all progress
  const handleResetAllProgress = async () => {
    if (isProcessing) return;
    if (
      !window.confirm(
        'Yakin ingin MERESET semua progres kata dari awal? Semua kata yang sudah dibuka akan kembali terkunci.'
      )
    )
      return;

    playClickSound();
    setIsProcessing(true);
    try {
      await resetAllData();
      setProgressMap({});
      await onProgressChanged?.();
    } finally {
      setIsProcessing(false);
    }
  };

  // Filter words
  const filterFn = (w: Word) => {
    // Tab filter
    const isSeen = Boolean(progressMap[w.word]?.seen);
    if (activeTab === 'seen' && !isSeen) return false;
    if (activeTab === 'unseen' && isSeen) return false;

    // Search filter
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    return (
      w.word.toLowerCase().includes(term) ||
      w.indonesian_translation.toLowerCase().includes(term)
    );
  };

  const displayedWords = words.filter(filterFn);

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '12px',
        zIndex: 90
      }}
      onClick={onClose}
    >
      <div
        className="animate-pop"
        style={{
          backgroundColor: 'var(--color-bg-app)',
          borderRadius: 'var(--border-radius-lg)',
          width: '100%',
          maxWidth: '720px',
          maxHeight: '92dvh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: 'var(--shadow-md)',
          overflow: 'hidden'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            padding: '14px 18px',
            backgroundColor: '#ffffff',
            borderBottom: '1px solid var(--color-border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
            flexShrink: 0
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--color-text-main)', margin: 0 }}>
                Daftar Kata (Word Bank)
              </h2>
              <span
                style={{
                  fontSize: '0.78rem',
                  fontWeight: 800,
                  backgroundColor: '#dcfce7',
                  color: '#15803d',
                  padding: '2px 8px',
                  borderRadius: 'var(--border-radius-pill)'
                }}
              >
                {seenWords.length} / {words.length} terbuka
              </span>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', margin: '2px 0 0' }}>
              Atur kata yang telah dipelajari atau reset perkembangan
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              type="button"
              onClick={handleResetAllProgress}
              disabled={isProcessing}
              title="Reset semua progres"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                padding: '6px 12px',
                backgroundColor: '#fee2e2',
                color: '#b91c1c',
                border: '1px solid #fca5a5',
                borderRadius: 'var(--border-radius-pill)',
                fontWeight: 700,
                fontSize: '0.8rem',
                cursor: 'pointer'
              }}
            >
              <RotateCcw size={14} />
              <span>Reset</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              aria-label="Tutup daftar kata"
              style={{ padding: '6px', color: 'var(--color-text-muted)', cursor: 'pointer' }}
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Search & Action Bar */}
        <div
          style={{
            padding: '10px 18px',
            backgroundColor: '#ffffff',
            borderBottom: '1px solid var(--color-border)',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            flexShrink: 0
          }}
        >
          {/* Search Input */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '8px 14px',
              backgroundColor: 'var(--color-bg-app)',
              borderRadius: 'var(--border-radius-pill)',
              border: '1px solid var(--color-border)'
            }}
          >
            <Search size={16} color="var(--color-text-muted)" />
            <input
              type="text"
              placeholder="Cari kata atau arti bahasa Indonesia..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                border: 'none',
                background: 'none',
                outline: 'none',
                fontSize: '0.9rem',
                fontFamily: 'inherit',
                width: '100%',
                color: 'var(--color-text-main)'
              }}
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                style={{ padding: '2px', color: 'var(--color-text-muted)' }}
              >
                <X size={15} />
              </button>
            )}
          </div>

          {/* Filter Tabs & Quick Actions */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '8px',
              flexWrap: 'wrap'
            }}
          >
            <div style={{ display: 'flex', gap: '6px' }}>
              <button
                type="button"
                onClick={() => setActiveTab('all')}
                style={{
                  padding: '5px 12px',
                  borderRadius: 'var(--border-radius-pill)',
                  fontSize: '0.82rem',
                  fontWeight: 800,
                  backgroundColor: activeTab === 'all' ? 'var(--color-primary)' : 'var(--color-bg-app)',
                  color: activeTab === 'all' ? '#ffffff' : 'var(--color-text-main)',
                  border: '1px solid var(--color-border)',
                  cursor: 'pointer'
                }}
              >
                Semua ({words.length})
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('seen')}
                style={{
                  padding: '5px 12px',
                  borderRadius: 'var(--border-radius-pill)',
                  fontSize: '0.82rem',
                  fontWeight: 800,
                  backgroundColor: activeTab === 'seen' ? 'var(--color-primary)' : 'var(--color-bg-app)',
                  color: activeTab === 'seen' ? '#ffffff' : 'var(--color-text-main)',
                  border: '1px solid var(--color-border)',
                  cursor: 'pointer'
                }}
              >
                Dipelajari ({seenWords.length})
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('unseen')}
                style={{
                  padding: '5px 12px',
                  borderRadius: 'var(--border-radius-pill)',
                  fontSize: '0.82rem',
                  fontWeight: 800,
                  backgroundColor: activeTab === 'unseen' ? 'var(--color-primary)' : 'var(--color-bg-app)',
                  color: activeTab === 'unseen' ? '#ffffff' : 'var(--color-text-main)',
                  border: '1px solid var(--color-border)',
                  cursor: 'pointer'
                }}
              >
                Belum ({unseenWords.length})
              </button>
            </div>

            {/* Quick Bulk Unlock */}
            <button
              type="button"
              onClick={handleMarkAllLearned}
              disabled={isProcessing || seenWords.length === words.length}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                padding: '5px 12px',
                borderRadius: 'var(--border-radius-pill)',
                fontSize: '0.8rem',
                fontWeight: 700,
                backgroundColor: '#eff6ff',
                color: 'var(--color-secondary-dark)',
                border: '1px solid #bfdbfe',
                cursor: seenWords.length === words.length ? 'default' : 'pointer',
                opacity: seenWords.length === words.length ? 0.6 : 1
              }}
            >
              <Check size={14} strokeWidth={2.5} />
              <span>Buka Semua Kata</span>
            </button>
          </div>
        </div>

        {/* Word Grid Content */}
        <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: '14px 18px' }}>
          {displayedWords.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--color-text-muted)' }}>
              Tidak ada kata yang sesuai dengan pencarian atau filter.
            </div>
          ) : (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
                gap: '10px'
              }}
            >
              {displayedWords.map((w) => {
                const wp = progressMap[w.word];
                const isSeen = Boolean(wp?.seen);
                const isRemembered = wp?.status === 'remembered';

                return (
                  <div
                    key={w.word}
                    onClick={() => setSelectedWord(w)}
                    style={{
                      padding: '10px',
                      backgroundColor: '#ffffff',
                      border: `1.5px solid ${isSeen ? '#86efac' : 'var(--color-border)'}`,
                      borderRadius: 'var(--border-radius-md)',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '6px',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.03)',
                      textAlign: 'center',
                      cursor: 'pointer',
                      position: 'relative',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    {/* SVG Image */}
                    <div
                      style={{
                        width: '42px',
                        height: '42px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <img
                        src={w.image_path}
                        alt={w.image_alt || w.word}
                        style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                      />
                    </div>

                    {/* Word & Meaning */}
                    <div style={{ width: '100%', minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                        <span
                          style={{
                            fontSize: '1rem',
                            fontWeight: 900,
                            color: 'var(--color-text-main)',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                          }}
                        >
                          {w.word}
                        </span>
                        {isRemembered && (
                          <CheckCircle2 size={13} color="#16a34a" strokeWidth={2.5} />
                        )}
                      </div>
                      <span
                        style={{
                          fontSize: '0.75rem',
                          color: 'var(--color-text-muted)',
                          display: 'block',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        {w.indonesian_translation}
                      </span>
                    </div>

                    {/* Toggle Button */}
                    <button
                      type="button"
                      onClick={(e) => handleToggleLearned(w.word, e)}
                      disabled={isProcessing}
                      style={{
                        width: '100%',
                        padding: '5px 8px',
                        borderRadius: 'var(--border-radius-pill)',
                        fontSize: '0.75rem',
                        fontWeight: 800,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '4px',
                        border: isSeen ? '1px solid #86efac' : '1px solid var(--color-border)',
                        backgroundColor: isSeen ? '#dcfce7' : '#f8fafc',
                        color: isSeen ? '#15803d' : 'var(--color-text-muted)',
                        cursor: 'pointer',
                        transition: 'all 0.12s ease'
                      }}
                    >
                      {isSeen ? (
                        <>
                          <Check size={13} strokeWidth={3} />
                          <span>Dipelajari</span>
                        </>
                      ) : (
                        <>
                          <Plus size={13} strokeWidth={2.5} />
                          <span>Buka Kata</span>
                        </>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Selected Word Detail Drawer */}
      {selectedWord && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
            zIndex: 110
          }}
          onClick={() => setSelectedWord(null)}
        >
          <div
            className="animate-pop"
            style={{
              backgroundColor: '#ffffff',
              borderRadius: 'var(--border-radius-lg)',
              width: '100%',
              maxWidth: '420px',
              padding: '20px',
              textAlign: 'center',
              position: 'relative'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setSelectedWord(null)}
              style={{ position: 'absolute', top: '14px', right: '14px', color: 'var(--color-text-muted)', cursor: 'pointer' }}
            >
              <X size={22} />
            </button>

            <div style={{ width: '100px', height: '100px', margin: '0 auto 8px' }}>
              <img
                src={selectedWord.image_path}
                alt={selectedWord.image_alt || selectedWord.word}
                style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
              />
            </div>

            <h3 style={{ fontSize: '1.6rem', fontWeight: 900, color: 'var(--color-text-main)', margin: '0 0 2px' }}>
              {selectedWord.word}
            </h3>

            <p style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--color-text-muted)', margin: '0 0 12px' }}>
              {selectedWord.indonesian_translation}
            </p>

            <AudioPlayerButton
              word={selectedWord.word}
              sentence={selectedWord.context_sentence}
              showSentenceButton={true}
              size="normal"
            />

            {selectedWord.context_sentence && (
              <p
                style={{
                  fontSize: '0.9rem',
                  fontStyle: 'italic',
                  color: 'var(--color-text-main)',
                  backgroundColor: 'var(--color-bg-app)',
                  padding: '8px 12px',
                  borderRadius: 'var(--border-radius-sm)',
                  margin: '12px 0'
                }}
              >
                "{selectedWord.context_sentence}"
              </p>
            )}

            {/* Prominent Toggle Button */}
            <button
              type="button"
              onClick={() => handleToggleLearned(selectedWord.word)}
              disabled={isProcessing}
              style={{
                width: '100%',
                padding: '12px 18px',
                marginTop: '6px',
                borderRadius: 'var(--border-radius-pill)',
                fontSize: '0.95rem',
                fontWeight: 800,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                border: progressMap[selectedWord.word]?.seen
                  ? '2px solid #86efac'
                  : '2px solid var(--color-primary)',
                backgroundColor: progressMap[selectedWord.word]?.seen ? '#dcfce7' : 'var(--color-primary)',
                color: progressMap[selectedWord.word]?.seen ? '#15803d' : '#ffffff',
                boxShadow: progressMap[selectedWord.word]?.seen ? 'none' : '0 3px 0 var(--color-primary-dark)',
                cursor: 'pointer'
              }}
            >
              {progressMap[selectedWord.word]?.seen ? (
                <>
                  <CheckCircle2 size={18} />
                  <span>Sudah Dipelajari (Klik untuk Kunci)</span>
                </>
              ) : (
                <>
                  <Unlock size={18} />
                  <span>Buka & Tandai Sudah Dipelajari</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
