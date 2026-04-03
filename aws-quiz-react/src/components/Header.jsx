import React from 'react';
import { useQuizContext } from '../context/QuizContext';

export default function Header() {
  const { activeBank, setActiveBank, bankTitle, score, totalScore, streak, setQuizState } = useQuizContext();

  const handleTitleClick = () => {
    setQuizState('setup');
  };

  return (
    <header className="header-bar">
      <div 
        className="header-brand"
        onClick={handleTitleClick}
      >
        <div className="brand-badge">
          {activeBank.toUpperCase()}
        </div>
        <h1 className="brand-title">
          <span className="animated-gradient-text">{bankTitle}</span>
        </h1>
      </div>

      <div className="header-stats flex items-center">
        {quizState !== 'play' && quizState !== 'result' && (
          <button 
            className="text-xs font-semibold text-slate-300 hover:text-white bg-surface2 px-3 py-1.5 rounded mr-4"
            onClick={() => setQuizState(quizState === 'study' ? 'setup' : 'study')}
          >
            {quizState === 'study' ? 'Đóng Lý Thuyết ✕' : 'Tài liệu Ôn tập 📚'}
          </button>
        )}
        <div className="stat-item">
          <div className="stat-val text-accent3">{totalScore}</div>
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
