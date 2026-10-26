import React, { useEffect, useState } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { ExercisePage } from './pages/ExercisePage';
import { initDatabase } from './db';

export const App: React.FC = () => {
  const [dbReady, setDbReady] = useState(false);

  useEffect(() => {
    initDatabase().then(() => setDbReady(true));
  }, []);

  if (!dbReady) {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
          fontSize: '1.2rem',
          fontWeight: 800,
          color: 'var(--color-primary)'
        }}
      >
        Memuat Spelling Gee...
      </div>
    );
  }

  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/exercise/:mode" element={<ExercisePage />} />
        <Route path="/exercise/:chapterId/:packId/:lessonKind" element={<ExercisePage />} />
        <Route path="/review" element={<Navigate to="/exercise/arrange" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </HashRouter>
  );
};
