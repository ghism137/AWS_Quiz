import React, { useState, useEffect, useRef } from 'react';
import { useQuizContext } from '../context/QuizContext';
import { CheckCircle2, XCircle, Timer } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function QuizPlayground() {
  const { 
    currentList, currentIdx, examTimeLimit,
    submitAnswer, nextQuestion, finishQuiz 
  } = useQuizContext();
  const navigate = useNavigate();
  
  const [timeLeft, setTimeLeft] = useState(examTimeLimit);

  const [answered, setAnswered] = useState(false);
  
  // The old logic used selectAnswer(chosen), and multiple answers could be there?
  // Let's support multi-answer if q.answer is array of > 1.
  const q = currentList[currentIdx];
  const isMulti = q.answer.length > 1;
  const [selections, setSelections] = useState([]);

  // 1. Timer element
  useEffect(() => {
    if (examTimeLimit <= 0) return;
    const timerInterval = setInterval(() => {
      setTimeLeft(prev => prev > 0 ? prev - 1 : 0);
    }, 1000);
    return () => clearInterval(timerInterval);
  }, [examTimeLimit]);
  
  // 2. Timer completion side-effects
  useEffect(() => {
    if (examTimeLimit > 0 && timeLeft === 0) {
      finishQuiz();
      navigate('/result');
    }
  }, [timeLeft, examTimeLimit, finishQuiz, navigate]);
  
  useEffect(() => {
    setAnswered(false);
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
    
    // Kiểm tra số lượng và tính chuẩn xác của các opt
    const isCorrect = selections.length === q.answer.length && 
                      selections.every(s => q.answer.includes(s));
                      
    submitAnswer(selections, q.answer, isCorrect, q);
  };

  const handleNext = () => {
    const isFinished = nextQuestion();
    if (isFinished) {
      navigate('/result');
    }
  };

  const pct = Math.round((currentIdx / currentList.length) * 100);
  
  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="quiz-playground fade-in">
      <div className="flex justify-between items-end mb-4">
        <div className="w-full mr-4">
          <div className="q-progress-bar w-full">
            <div className="q-progress-fill" style={{ width: `${pct}%` }}></div>
          </div>
          <div className="text-right text-muted text-sm font-mono mt-1">
            {currentIdx + 1} / {currentList.length}
          </div>
        </div>
        {examTimeLimit > 0 && (
          <div className="flex items-center gap-2 bg-surface2 px-3 py-2 rounded-lg border border-white/5 mb-6 shadow-md min-w-[100px] justify-center">
            <Timer className={`w-5 h-5 ${timeLeft < 60 ? 'text-red animate-pulse' : 'text-accent'}`} />
            <span className={`font-mono text-lg font-bold ${timeLeft < 60 ? 'text-red animate-pulse' : 'text-white'}`}>
              {formatTime(timeLeft)}
            </span>
          </div>
        )}
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
          <button className="btn-primary" onClick={handleNext}>
            {currentIdx + 1 < currentList.length ? (
              <>Tiếp theo <span>→</span></>
            ) : (
              <>Hoàn thành <span>🏆</span></>
            )}
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
