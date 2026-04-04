import React, { useState } from 'react';
import { useQuizContext } from '../context/QuizContext';
import { useNavigate } from 'react-router-dom';

export default function ResultBoard() {
  const { score, currentList, wrongAnswers } = useQuizContext();
  const [showWrong, setShowWrong] = useState(false);
  const navigate = useNavigate();

  const total = currentList.length;
  const pct = total > 0 ? Math.round((score / total) * 100) : 0;
  
  let title = 'Cần cố gắng thêm!';
  if (pct >= 80) title = 'Xuất sắc! 🎉';
  else if (pct >= 65) title = 'Khá Tốt! 👍';

  return (
    <div className="result-board fade-in">
      <div className="result-circle-box">
        <div className="result-circle" style={{ '--pct': `${pct}%` }}>
          <div className="result-pct">{pct}%</div>
        </div>
      </div>
      
      <h2 className="r-title animated-gradient-text text-center text-3xl font-bold mt-4">{title}</h2>
      <p className="r-sub text-center text-muted mt-2">Bạn đã hoàn thành bài test {total} câu.</p>

      <div className="r-grid mt-8 glass-panel !p-6 rounded-2xl flex justify-around">
        <div className="text-center">
          <div className="text-3xl font-bold text-green">{score}</div>
          <div className="text-xs text-muted uppercase font-semibold mt-1">Đúng</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-red">{total - score}</div>
          <div className="text-xs text-muted uppercase font-semibold mt-1">Sai</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-accent2">{total}</div>
          <div className="text-xs text-muted uppercase font-semibold mt-1">Tổng</div>
        </div>
      </div>

      <div className="result-btns mt-8 flex justify-center gap-4 flex-wrap">
        <button className="btn-primary" onClick={() => navigate('/')}>
          Trang Chủ Setup
        </button>
        {wrongAnswers.length > 0 && (
          <button className="btn-secondary" onClick={() => setShowWrong(!showWrong)}>
            {showWrong ? 'Ẩn câu sai' : 'Xem câu sai'}
          </button>
        )}
      </div>

      {showWrong && (
        <div className="wrong-list mt-8 fade-in">
          <h3 className="section-title mb-4">Danh sách câu sai</h3>
          <div className="flex flex-col gap-4">
            {wrongAnswers.map((w, idx) => (
              <div key={idx} className="wrong-item glass-panel !p-4 !border-l-4 !border-l-red">
                <div className="font-semibold text-slate-200 mb-2">{w.q.question}</div>
                <div className="flex flex-col gap-2 mt-3">
                  <div className="text-sm">
                    <span className="font-bold text-red mr-2">Bạn chọn:</span>
                    <span className="text-slate-300">{w.chosen}</span>
                  </div>
                  <div className="text-sm">
                    <span className="font-bold text-green mr-2">Đáp án:</span>
                    <span className="text-slate-300">{w.correct}</span>
                  </div>
                  <div className="text-xs text-muted mt-2 bg-bg2 p-2 rounded">
                    {w.q.explanation}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
