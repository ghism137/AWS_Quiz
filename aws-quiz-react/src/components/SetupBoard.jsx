import React, { useState, useEffect } from 'react';
import { useQuizContext } from '../context/QuizContext';
import { BookOpen, Target, Shuffle, XOctagon, Timer } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ToggleSwitch from './ToggleSwitch';
import { QUIZ_MODES } from '../utils/constants';

export default function SetupBoard() {
  const { 
    activeBank, setActiveBank, 
    generateQuiz, extractTopicsList, extractLevelsList,
    allWrongQs
  } = useQuizContext();

  const [mode, setMode] = useState(QUIZ_MODES.RANDOM);
  const [selectedTopics, setSelectedTopics] = useState([]);
  const [selectedLevels, setSelectedLevels] = useState([]);
  const [isExamMode, setIsExamMode] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    setSelectedTopics([]);
    setSelectedLevels([]);
    setErrorMsg('');
  }, [activeBank]);

  const toggleTopic = (t) => {
    setSelectedTopics(prev => prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t]);
  };

  const toggleLevel = (l) => {
    setSelectedLevels(prev => prev.includes(l) ? prev.filter(x => x !== l) : [...prev, l]);
  };

  const handleStart = () => {
    const result = generateQuiz(mode, selectedTopics, selectedLevels, isExamMode);
    if (!result.success) {
      setErrorMsg(result.error);
    } else {
      setErrorMsg('');
      navigate('/play');
    }
  };

  return (
    <div className="setup-board fade-in">
      <div className="section-block">
        <h3 className="section-title">Chọn Bộ Câu Hỏi</h3>
        <select 
          className="custom-select"
          value={activeBank} 
          onChange={(e) => setActiveBank(e.target.value)}
        >
          <option value="dtdm">Điện toán Đám mây (Tiếng Việt)</option>
          <option value="aws">AWS Cloud Practitioner (Tiếng Anh)</option>
        </select>
      </div>

      <div className="section-block mt-4">
        <h3 className="section-title">Chế độ làm bài</h3>
        <div className="mode-grid">
          <div className={`mode-card ${mode === QUIZ_MODES.RANDOM ? 'active' : ''}`} onClick={() => setMode(QUIZ_MODES.RANDOM)}>
            <Shuffle className="mode-icon text-accent" />
            <div className="mode-name">Ngẫu nhiên</div>
            <div className="mode-desc">Trộn đề thi tất cả</div>
          </div>
          <div className={`mode-card ${mode === QUIZ_MODES.TOPIC ? 'active' : ''}`} onClick={() => setMode(QUIZ_MODES.TOPIC)}>
            <BookOpen className="mode-icon text-teal" />
            <div className="mode-name">Theo chủ đề</div>
            <div className="mode-desc">Chọn chủ đề cụ thể</div>
          </div>
          <div className={`mode-card ${mode === QUIZ_MODES.LEVEL ? 'active' : ''}`} onClick={() => setMode(QUIZ_MODES.LEVEL)}>
            <Target className="mode-icon text-orange" />
            <div className="mode-name">Theo độ khó</div>
            <div className="mode-desc">NB / TH / VD / VDC</div>
          </div>
          <div className={`mode-card ${mode === QUIZ_MODES.WRONG ? 'active' : ''}`} onClick={() => setMode(QUIZ_MODES.WRONG)}>
            <XOctagon className="mode-icon text-red" />
            <div className="mode-name">Ôn câu sai</div>
            <div className="mode-desc">({allWrongQs?.size || 0} câu)</div>
          </div>
        </div>
      </div>

      {mode === QUIZ_MODES.TOPIC && (
        <div className="filter-wrap fade-in">
          <h4 className="filter-title">Chọn chủ đề</h4>
          <div className="pill-group">
            {extractTopicsList.map(t => (
              <button 
                key={t}
                className={`pill ${selectedTopics.includes(t) ? 'active' : ''}`}
                onClick={() => toggleTopic(t)}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      )}

      {mode === QUIZ_MODES.LEVEL && (
        <div className="filter-wrap fade-in">
          <h4 className="filter-title">Chọn mức độ</h4>
          <div className="pill-group">
            {extractLevelsList.map(l => (
              <button 
                key={l}
                className={`pill level-${l} ${selectedLevels.includes(l) ? 'active' : ''}`}
                onClick={() => toggleLevel(l)}
              >
                {l}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="section-block mt-4 flex items-center justify-between p-4 bg-surface2 rounded-xl">
        <div className="flex items-center gap-3">
          <Timer className="text-accent" />
          <div>
            <h4 className="font-bold text-white text-sm">Chế độ thi (Exam Mode)</h4>
            <p className="text-xs text-slate-400">Giới hạn thời gian 1 phút / câu</p>
          </div>
        </div>
        <ToggleSwitch 
          checked={isExamMode} 
          onChange={(e) => setIsExamMode(e.target.checked)} 
        />
      </div>

      {errorMsg && (
        <div className="text-red font-semibold text-center mt-4 fade-in">
          ❌ {errorMsg}
        </div>
      )}

      <div className="start-row mt-6">
        <button className="btn-primary start-btn" onClick={handleStart}>
          Bắt đầu Luyện Tập 🚀
        </button>
      </div>
    </div>
  );
}
