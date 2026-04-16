import React, { useEffect, useState } from 'react';
import { useQuizContext } from '../context/QuizContext';
import { Link, useLocation } from 'react-router-dom';
import { handleBackup } from '../utils/fileBackup';

export default function Header() {
  const { activeBank, bankTitle, score, totalScore, streak, allWrongQs } = useQuizContext();
  const location = useLocation();
  const [theme, setTheme] = useState('dark');

  const inPlayOrResult = location.pathname === '/play' || location.pathname === '/result';
  const isStudy = location.pathname === '/study';

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const onBackupClick = () => {
    handleBackup(activeBank);
  };

  return (
    <header className="header-bar">
      <Link to="/" className="header-brand" style={{ textDecoration: 'none' }}>
        <div className="brand-badge">
          {activeBank.toUpperCase()}
        </div>
        <h1 className="brand-title">
          <span className="animated-gradient-text">{bankTitle}</span>
        </h1>
      </Link>

      <div className="header-stats flex items-center">
        {!inPlayOrResult && (
          <Link 
            to={isStudy ? "/" : "/study"}
            className="text-xs font-semibold text-slate-300 hover:text-white bg-surface2 px-3 py-1.5 rounded mr-2"
            style={{ textDecoration: 'none' }}
          >
            {isStudy ? 'Đóng Lý Thuyết ✕' : 'Tài liệu Ôn tập 📚'}
          </Link>
        )}
        <button onClick={onBackupClick} className="text-xs text-slate-300 hover:text-white px-2 py-1.5 mr-2" title="Sao lưu dữ liệu">💾</button>
        <button onClick={toggleTheme} className="text-xs text-slate-300 hover:text-white px-2 py-1.5 mr-4" title="Đổi giao diện">
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>

        <div className="stat-item">
          <div className="stat-val text-accent3">{totalScore || 0}</div>
          <div className="stat-lbl">T.Điểm</div>
        </div>
        <div className="stat-item">
          <div className="stat-val text-teal">{score}</div>
          <div className="stat-lbl">Hiện tại</div>
        </div>
        <div className="stat-item">
          <div className="stat-val text-orange">🔥{streak}</div>
          <div className="stat-lbl">Streak</div>
        </div>
      </div>
    </header>
  );
}
