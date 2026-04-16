import React, { createContext, useState, useEffect, useMemo, useContext } from 'react';
import { useQuizEngine } from '../hooks/useQuizEngine';

export const QuizContext = createContext();
export const useQuizContext = () => useContext(QuizContext);

export const QuizProvider = ({ children }) => {
  const [activeBank, setActiveBank] = useState('dtdm'); // 'dtdm' or 'aws'
  const [fullBankData, setFullBankData] = useState([]);
  
  const bankTitle = activeBank === 'dtdm' ? 'Điện toán Đám mây' : 'AWS Cloud Practitioner';

  useEffect(() => {
    let isMounted = true;
    if (activeBank === 'dtdm') {
      import('../data/dtdm_questions.json').then(module => {
        if (isMounted) setFullBankData(module.default || module);
      });
    } else {
      import('../data/questions.json').then(module => {
        if (isMounted) setFullBankData(module.default || module);
      });
    }
    return () => {
      isMounted = false;
    };
  }, [activeBank]);

  // Single engine instance that automatically resets its state when activeBank changes
  // (We handled this logic inside useQuizEngine.js via useEffect)
  const activeEngine = useQuizEngine(fullBankData, activeBank);

  const extractTopicsList = useMemo(() => {
    const topicsSet = new Set();
    fullBankData.forEach(q => {
      if (q.topic) topicsSet.add(q.topic);
    });
    return Array.from(topicsSet).sort();
  }, [fullBankData]);

  const extractLevelsList = useMemo(() => {
    const levelsSet = new Set();
    fullBankData.forEach(q => {
      if (q.level) levelsSet.add(q.level);
    });
    return Array.from(levelsSet).sort();
  }, [fullBankData]);

  return (
    <QuizContext.Provider value={{
      activeBank, setActiveBank, bankTitle, fullBankData,
      extractTopicsList, extractLevelsList,
      ...activeEngine
    }}>
      {children}
    </QuizContext.Provider>
  );
};
