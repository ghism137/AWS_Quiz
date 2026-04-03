import React, { useState, useEffect } from 'react';
import { useQuizContext } from '../context/QuizContext';
import { CheckCircle2, XCircle } from 'lucide-react';

export default function QuizPlayground() {
  const { 
    currentList, currentIdx, 
    submitAnswer, nextQuestion 
  } = useQuizContext();

  const [answered, setAnswered] = useState(false);
  const [selectedOpt, setSelectedOpt] = useState(null); // single string or array if we support multiple choice better, but logic in useQuizEngine is string based in old. Wait!
  
  // The old logic used selectAnswer(chosen), and multiple answers could be there?
  // Let's support multi-answer if q.answer is array of > 1.
  const q = currentList[currentIdx];
  const isMulti = q.answer.length > 1;
  const [selections, setSelections] = useState([]);

  useEffect(() => {
    setAnswered(false);
    setSelectedOpt(null);
    setSelections([]);
  }, [currentIdx]);

  if (!q) return null;

  const toggleSelection = (key) => {
    if (answered) return;
    if (isMulti) {
      setSelections(prev => prev.includes(key) ? prev.filter(x => x !== key) : [...prev, key]);
    } else {
      setSelections([key]);
    }
  };

  const handleConfirm = () => {
    if (answered || selections.length === 0) return;
    setAnswered(true);
    let correct = true;
    if (selections.length !== q.answer.length) correct = false;
    else {
      selections.forEach(s => {
        if (!q.answer.includes(s)) correct = false;
      });
    }
    submitAnswer(selections, q.answer, correct, q);
  };

  const pct = Math.round((currentIdx / currentList.length) * 100);

  return (
    <div className="quiz-playground fade-in">
      <div className="q-progress-bar">
        <div className="q-progress-fill" style={{ width: `${pct}%` }}></div>
      </div>
      <div className="text-right text-muted text-sm font-mono mt-1 mb-4">
        {currentIdx + 1} / {currentList.length}
      </div>

      <div className="q-card glass-panel">
        <div className="q-meta">
          <span className="q-badge-topic">{q.topic}</span>
          <span className={`q-badge-level lv-${q.level}`}>{q.level}</span>
          {isMulti && <span className="q-badge-multi">Chọn {q.answer.length} đáp án</span>}
        </div>
        
        <h2 className="q-text">{q.question}</h2>

        <div className="q-options">
          {Object.entries(q.options).map(([k, v]) => {
            const isSelected = selections.includes(k);
            let stateClass = '';
            
            if (answered) {
              const isCorrectOpt = q.answer.includes(k);
              if (isCorrectOpt) stateClass = 'opt-correct';
              else if (isSelected && !isCorrectOpt) stateClass = 'opt-wrong';
              else stateClass = 'opt-disabled';
            } else if (isSelected) {
              stateClass = 'opt-selected';
            }

            return (
              <div 
                key={k} 
                className={`q-opt ${stateClass}`}
                onClick={() => toggleSelection(k)}
              >
                <div className="opt-letter">{k}</div>
                <div className="opt-text">{v}</div>
                {answered && stateClass === 'opt-correct' && <CheckCircle2 className="text-green ml-auto" />}
                {answered && stateClass === 'opt-wrong' && <XCircle className="text-red ml-auto" />}
              </div>
            );
          })}
        </div>
        
        {answered && (
          <div className="q-explanation mt-6 p-4 bg-surface2 rounded-lg border-l-4 border-accent fade-in">
            <h4 className="text-sm font-bold text-accent2 mb-2">Giải thích:</h4>
            <p className="text-sm text-slate-300">{q.explanation || 'Không có giải thích chi tiết.'}</p>
          </div>
        )}
      </div>

      <div className="nav-row">
        {answered ? (
          <button className="btn-primary" onClick={nextQuestion}>
            Tiếp theo <span>→</span>
          </button>
        ) : (
          <button className="btn-primary" onClick={handleConfirm} disabled={selections.length === 0}>
            Xác nhận
          </button>
        )}
      </div>
    </div>
  );
}
