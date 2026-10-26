import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  Layers,
  Keyboard,
  BookOpen,
  RotateCcw,
  Volume2,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';
import { words } from '../data';
import { Word, WordProgress } from '../types';
import { getAllWordProgress, resetAllData } from '../db';
import { WordLibrary } from '../components/WordLibrary';
import { playWordAudio } from '../audio/sound';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();

  const [wordProgressMap, setWordProgressMap] = useState<Record<string, WordProgress>>({});
  const [showLibrary, setShowLibrary] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const wp = await getAllWordProgress();
    setWordProgressMap(wp);
  };

  const handleReset = async () => {
    if (window.confirm('Yakin ingin mengulang semua perkembangan latihan dari awal?')) {
      await resetAllData();
      await loadData();
    }
  };

  // Known words sorted by introducedAt descending
  const knownWords: Word[] = words
    .filter((w) => wordProgressMap[w.word]?.seen)
    .sort((a, b) => {
      const aTime = wordProgressMap[a.word]?.introducedAt || 0;
      const bTime = wordProgressMap[b.word]?.introducedAt || 0;
      return bTime - aTime;
    });

  const unseenWords = words.filter((w) => !wordProgressMap[w.word]?.seen);
  const rememberedCount = words.filter((w) => wordProgressMap[w.word]?.status === 'remembered').length;

  // 3 latest words
  const latestThreeWords = knownWords.slice(0, 3);

  const handleStartMode = (mode: 'new-word' | 'arrange' | 'spell') => {
    navigate(`/exercise/${mode}`);
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: 'var(--color-bg-app)',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      {/* Header */}
      <header
        style={{
          backgroundColor: '#ffffff',
          borderBottom: '1px solid var(--color-border)',
          padding: '10px 18px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'sticky',
          top: 0,
          zIndex: 40
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              backgroundColor: 'var(--color-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              fontWeight: 900,
              fontSize: '1.15rem',
              boxShadow: '0 2px 0 var(--color-primary-dark)'
            }}
          >
            SG
          </div>
          <div>
            <h1 style={{ fontSize: '1.1rem', fontWeight: 900, color: 'var(--color-text-main)', margin: 0 }}>
              Spelling Gee
            </h1>
            <p style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', margin: 0 }}>
              Latihan Ejaan Bahasa Inggris
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleReset}
          title="Reset semua latihan"
          style={{
            padding: '6px',
            borderRadius: '50%',
            backgroundColor: '#f1f5f9',
            color: 'var(--color-text-muted)'
          }}
        >
          <RotateCcw size={16} />
        </button>
      </header>

      {/* Main Container */}
      <main
        style={{
          flex: 1,
          maxWidth: '680px',
          width: '100%',
          margin: '0 auto',
          padding: '10px 16px 20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px'
        }}
      >
        {/* Word Library Card */}
        <div
          onClick={() => setShowLibrary(true)}
          style={{
            backgroundColor: '#ffffff',
            borderRadius: 'var(--border-radius-md)',
            border: '1.5px solid var(--color-border)',
            padding: '10px 16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: 'var(--shadow-sm)',
            cursor: 'pointer',
            transition: 'transform 0.1s ease'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                backgroundColor: '#eff6ff',
                color: 'var(--color-secondary-dark)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <BookOpen size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--color-text-main)', margin: 0 }}>
                Daftar Kata (Word Bank)
              </h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', margin: '1px 0 0' }}>
                {knownWords.length} dari {words.length} kata dipelajari • {rememberedCount} diingat
              </p>
            </div>
          </div>
          <span
            style={{
              padding: '4px 12px',
              backgroundColor: 'var(--color-bg-app)',
              borderRadius: 'var(--border-radius-pill)',
              fontSize: '0.8rem',
              fontWeight: 800,
              color: 'var(--color-secondary-dark)'
            }}
          >
            Lihat
          </span>
        </div>

        {/* 3 Main Action Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {/* 1. NEW WORD BUTTON */}
          <button
            type="button"
            onClick={() => handleStartMode('new-word')}
            style={{
              padding: '14px 18px',
              backgroundColor: '#58cc02',
              color: '#ffffff',
              borderRadius: 'var(--border-radius-md)',
              boxShadow: '0 4px 0 #46a302',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              textAlign: 'left',
              transition: 'transform 0.1s ease',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div
                style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '12px',
                  backgroundColor: 'rgba(255, 255, 255, 0.25)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Sparkles size={24} color="#ffffff" strokeWidth={2.5} />
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
                  <h2 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#ffffff', margin: 0 }}>
                    Kata Baru
                  </h2>
                  <span
                    style={{
                      fontSize: '0.72rem',
                      fontWeight: 800,
                      backgroundColor: 'rgba(255, 255, 255, 0.3)',
                      padding: '2px 8px',
                      borderRadius: 'var(--border-radius-pill)'
                    }}
                  >
                    {unseenWords.length > 0 ? `${unseenWords.length} kata tersisa` : 'Latihan Ulang'}
                  </span>
                </div>
                <p style={{ fontSize: '0.85rem', color: 'rgba(255, 255, 255, 0.95)', fontWeight: 600, margin: 0 }}>
                  Tambah 1 kata baru & mainkan 3 kata terbaru
                </p>
              </div>
            </div>
            <ArrowRight size={22} color="#ffffff" strokeWidth={2.8} />
          </button>

          {/* 2. ARRANGE BUTTON */}
          <button
            type="button"
            onClick={() => handleStartMode('arrange')}
            disabled={knownWords.length === 0}
            style={{
              padding: '14px 18px',
              backgroundColor: knownWords.length > 0 ? '#1cb0f6' : '#e2e8f0',
              color: knownWords.length > 0 ? '#ffffff' : '#94a3b8',
              borderRadius: 'var(--border-radius-md)',
              boxShadow: knownWords.length > 0 ? '0 4px 0 #1899d6' : 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              textAlign: 'left',
              transition: 'transform 0.1s ease',
              border: 'none',
              cursor: knownWords.length > 0 ? 'pointer' : 'not-allowed',
              opacity: knownWords.length > 0 ? 1 : 0.7
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div
                style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '12px',
                  backgroundColor: knownWords.length > 0 ? 'rgba(255, 255, 255, 0.25)' : '#cbd5e1',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Layers size={24} color={knownWords.length > 0 ? '#ffffff' : '#64748b'} strokeWidth={2.5} />
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
                  <h2 style={{ fontSize: '1.25rem', fontWeight: 900, margin: 0 }}>
                    Susun Kata (Arrange)
                  </h2>
                  <span
                    style={{
                      fontSize: '0.72rem',
                      fontWeight: 800,
                      backgroundColor: knownWords.length > 0 ? 'rgba(255, 255, 255, 0.3)' : '#cbd5e1',
                      padding: '2px 8px',
                      borderRadius: 'var(--border-radius-pill)',
                      color: knownWords.length > 0 ? '#ffffff' : '#475569'
                    }}
                  >
                    {knownWords.length} kata dikenal
                  </span>
                </div>
                <p style={{ fontSize: '0.85rem', fontWeight: 600, margin: 0 }}>
                  Latihan menyusun pecahan & huruf dari semua kata
                </p>
              </div>
            </div>
            <ArrowRight size={22} strokeWidth={2.8} />
          </button>

          {/* 3. SPELL BUTTON */}
          <button
            type="button"
            onClick={() => handleStartMode('spell')}
            disabled={knownWords.length === 0}
            style={{
              padding: '14px 18px',
              backgroundColor: knownWords.length > 0 ? '#8b5cf6' : '#e2e8f0',
              color: knownWords.length > 0 ? '#ffffff' : '#94a3b8',
              borderRadius: 'var(--border-radius-md)',
              boxShadow: knownWords.length > 0 ? '0 4px 0 #7c3aed' : 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              textAlign: 'left',
              transition: 'transform 0.1s ease',
              border: 'none',
              cursor: knownWords.length > 0 ? 'pointer' : 'not-allowed',
              opacity: knownWords.length > 0 ? 1 : 0.7
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div
                style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '12px',
                  backgroundColor: knownWords.length > 0 ? 'rgba(255, 255, 255, 0.25)' : '#cbd5e1',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Keyboard size={24} color={knownWords.length > 0 ? '#ffffff' : '#64748b'} strokeWidth={2.5} />
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
                  <h2 style={{ fontSize: '1.25rem', fontWeight: 900, margin: 0 }}>
                    Uji Ejaan (Spell)
                  </h2>
                  <span
                    style={{
                      fontSize: '0.72rem',
                      fontWeight: 800,
                      backgroundColor: knownWords.length > 0 ? 'rgba(255, 255, 255, 0.3)' : '#cbd5e1',
                      padding: '2px 8px',
                      borderRadius: 'var(--border-radius-pill)',
                      color: knownWords.length > 0 ? '#ffffff' : '#475569'
                    }}
                  >
                    Tantangan Mengetik
                  </span>
                </div>
                <p style={{ fontSize: '0.85rem', fontWeight: 600, margin: 0 }}>
                  Uji ingatan ejaan mandiri dari suara bahasa Inggris
                </p>
              </div>
            </div>
            <ArrowRight size={22} strokeWidth={2.8} />
          </button>
        </div>

        {/* 3 Latest Words Section */}
        {latestThreeWords.length > 0 && (
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: 'var(--border-radius-md)',
              border: '1.5px solid var(--color-border)',
              padding: '10px 14px',
              boxShadow: 'var(--shadow-sm)'
            }}
          >
            <h3
              style={{
                fontSize: '0.9rem',
                fontWeight: 900,
                color: 'var(--color-text-main)',
                marginBottom: '8px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <span>3 Kata Terbaru</span>
            </h3>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                gap: '8px'
              }}
            >
              {latestThreeWords.map((word) => {
                const wp = wordProgressMap[word.word];
                const isRemembered = wp?.status === 'remembered';

                return (
                  <div
                    key={word.word}
                    style={{
                      padding: '8px 10px',
                      backgroundColor: 'var(--color-bg-app)',
                      borderRadius: 'var(--border-radius-sm)',
                      border: '1px solid var(--color-border)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                  >
                    <div
                      style={{
                        width: '32px',
                        height: '32px',
                        flexShrink: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <img
                        src={word.image_path}
                        alt={word.word}
                        style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                      />
                    </div>

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <span
                          style={{
                            fontSize: '0.95rem',
                            fontWeight: 900,
                            color: 'var(--color-text-main)',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                          }}
                        >
                          {word.word}
                        </span>
                        {isRemembered && (
                          <CheckCircle2 size={13} color="#16a34a" strokeWidth={2.5} />
                        )}
                      </div>
                      <span
                        style={{
                          fontSize: '0.8rem',
                          color: 'var(--color-text-muted)',
                          display: 'block',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        {word.indonesian_translation}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        playWordAudio(word.word);
                      }}
                      aria-label={`Dengarkan ${word.word}`}
                      style={{
                        padding: '8px',
                        color: 'var(--color-primary-dark)',
                        backgroundColor: '#ffffff',
                        borderRadius: '50%',
                        border: '1px solid var(--color-border)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}
                    >
                      <Volume2 size={16} />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </main>

      {/* Word Library Modal */}
      {showLibrary && (
        <WordLibrary
          wordProgressMap={wordProgressMap}
          onClose={() => setShowLibrary(false)}
          onProgressChanged={loadData}
        />
      )}
    </div>
  );
};
