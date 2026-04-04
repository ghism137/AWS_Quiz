import React, { useState } from 'react';
import { useQuizContext } from '../context/QuizContext';
import { BookOpen, Target, Shuffle, XOctagon, Timer } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function SetupBoard() {
  const { 
    activeBank, setActiveBank, 
    generateQuiz, extractTopicsList, extractLevelsList,
    allWrongQs
  } = useQuizContext();

  const [mode, setMode] = useState('random');
  const [selectedTopics, setSelectedTopics] = useState([]);
  const [selectedLevels, setSelectedLevels] = useState([]);
  const [isExamMode, setIsExamMode] = useState(false);
  const navigate = useNavigate();

  const toggleTopic = (t) => {
    setSelectedTopics(prev => prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t]);
  };

  const toggleLevel = (l) => {
    setSelectedLevels(prev => prev.includes(l) ? prev.filter(x => x !== l) : [...prev, l]);
  };

  const handleStart = () => {
    const success = generateQuiz(mode, selectedTopics, selectedLevels, isExamMode);
    if (success) {
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
          <div className={`mode-card ${mode === 'random' ? 'active' : ''}`} onClick={() => setMode('random')}>
            <Shuffle className="mode-icon text-accent" />
            <div className="mode-name">Ngẫu nhiên</div>
            <div className="mode-desc">Trộn đề thi tất cả</div>
          </div>
          <div className={`mode-card ${mode === 'topic' ? 'active' : ''}`} onClick={() => setMode('topic')}>
            <BookOpen className="mode-icon text-teal" />
            <div className="mode-name">Theo chủ đề</div>
            <div className="mode-desc">Chọn chủ đề cụ thể</div>
          </div>
          <div className={`mode-card ${mode === 'level' ? 'active' : ''}`} onClick={() => setMode('level')}>
            <Target className="mode-icon text-orange" />
            <div className="mode-name">Theo độ khó</div>
            <div className="mode-desc">NB / TH / VD / VDC</div>
          </div>
          <div className={`mode-card ${mode === 'wrong' ? 'active' : ''}`} onClick={() => setMode('wrong')}>
            <XOctagon className="mode-icon text-red" />
            <div className="mode-name">Ôn câu sai</div>
            <div className="mode-desc">({allWrongQs.length} câu)</div>
          </div>
        </div>
      </div>

      {mode === 'topic' && (
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

      {mode === 'level' && (
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
        <label className="relative inline-flex items-center cursor-pointer">
          <input 
            type="checkbox" 
            className="sr-only peer" 
            checked={isExamMode}
            onChange={(e) => setIsExamMode(e.target.checked)}
          />
          <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent"></div>
        </label>
      </div>

      <div className="start-row mt-6">
        <button className="btn-primary start-btn" onClick={handleStart}>
          Bắt đầu Luyện Tập 🚀
        </button>
      </div>
    </div>
  );
}
