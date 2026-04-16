import React, { useState, useEffect } from 'react';
import DOMPurify from 'dompurify';

export default function StudyBoard() {
  const [studyData, setStudyData] = useState(null);

  useEffect(() => {
    import('../data/study-data.json').then(module => {
      setStudyData(module.default.STUDY_DATA);
    });
  }, []);

  if (!studyData) {
    return <div className="text-center mt-10 text-slate-400">Đang tải tài liệu ôn tập...</div>;
  }

  return (
    <div className="study-board fade-in">
      <div className="section-title text-center mb-6">Tài liệu ôn tập (Sơ đồ Mindmap text)</div>
      
      <div className="flex flex-col gap-6">
        {studyData.map((item) => (
          <div key={item.id} className="glass-panel p-6">
            <div className="flex items-center gap-3 mb-4 border-b border-white/10 pb-4">
              <span className="text-3xl">{item.icon}</span>
              <h3 className="text-xl font-bold text-accent2 m-0">{item.title}</h3>
              <span className="q-badge-topic ml-auto">{item.badge}</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-sm font-semibold text-teal mb-3 uppercase tracking-wider">Khái niệm trọng tâm</h4>
                <ul className="list-none space-y-2">
                  {item.concepts.map((c, i) => (
                    <li key={i} className="text-sm text-slate-300 flex items-start gap-2">
                      <span className="text-teal mt-1">✓</span>
                      <span dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(c) }}></span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-red mb-3 uppercase tracking-wider">Lưu ý / Bẫy thường gặp</h4>
                <ul className="list-none space-y-2">
                  {item.traps.map((t, i) => (
                    <li key={i} className="text-sm text-slate-300 flex items-start gap-2">
                      <span className="text-red mt-1">⚠️</span>
                      <span dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(t) }}></span>
                    </li>
                  ))}
                </ul>

                <div className="mt-6 pt-4 border-t border-white/5">
                  <span className="text-xs text-muted font-mono">Related: </span>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {item.related.map(r => (
                      <span key={r} className="text-[10px] bg-slate-800 text-slate-400 px-2 py-1 rounded">
                        {r}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
