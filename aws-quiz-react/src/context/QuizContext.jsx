import React, { createContext, useState, useEffect, useMemo, useContext } from 'react';
import { useQuizEngine } from '../hooks/useQuizEngine';
import { DTDM_Q } from '../data/dtdm_questions';
import { ALL_Q } from '../data/questions';

export const QuizContext = createContext();
export const useQuizContext = () => useContext(QuizContext);

export const QuizProvider = ({ children }) => {
  const [activeBank, setActiveBank] = useState('dtdm'); // 'dtdm' or 'aws'
  
  const bankTitle = activeBank === 'dtdm' ? 'Điện toán Đám mây' : 'AWS Cloud Practitioner';
  const fullBankData = activeBank === 'dtdm' ? DTDM_Q : ALL_Q;

  // We use separate engines to keep state isolated per bank
  const engineDTDM = useQuizEngine(DTDM_Q, 'dtdm');
  const engineAWS = useQuizEngine(ALL_Q, 'aws');

  // Active engine
  const activeEngine = activeBank === 'dtdm' ? engineDTDM : engineAWS;

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
