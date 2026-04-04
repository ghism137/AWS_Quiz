import { useState, useCallback, useEffect } from 'react';
import { storageService } from '../utils/storageService';

// Fisher-Yates shuffle
export function shuffleArray(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function useQuizEngine(fullBankData, bankName) {
  const [currentList, setCurrentList] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [examTimeLimit, setExamTimeLimit] = useState(0); // 0 means no timer
  
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [totalScore, setTotalScore] = useState(() => 
    parseInt(storageService.getItem(`${bankName}_score`, '0'), 10)
  );
  
  // Array of { q, chosen, correct }
  const [wrongAnswers, setWrongAnswers] = useState([]);
  const [allWrongQs, setAllWrongQs] = useState(() => 
    storageService.getJSON(`${bankName}_wrongQ`, [])
  );

  // Reset engine data when bankName changes
  useEffect(() => {
    setTotalScore(parseInt(storageService.getItem(`${bankName}_score`, '0'), 10));
    setAllWrongQs(storageService.getJSON(`${bankName}_wrongQ`, []));
    setScore(0);
    setStreak(0);
    setBestStreak(0);
    setCurrentList([]);
    setCurrentIdx(0);
    setExamTimeLimit(0);
    setWrongAnswers([]);
  }, [bankName, fullBankData]);

  const addTotalScore = useCallback((additionalScore) => {
    setTotalScore((prev) => {
      const newScore = prev + additionalScore;
      storageService.setItem(`${bankName}_score`, newScore.toString());
      return newScore;
    });
  }, [bankName]);

  const saveWrongData = (newAllWrong) => {
    // Keep max 200 items to avoid locastorage overflow
    const limited = newAllWrong.slice(-200);
    setAllWrongQs(limited);
    storageService.setJSON(`${bankName}_wrongQ`, limited);
  };

  const generateQuiz = useCallback((mode, selectedTopics, selectedLevels, isExamMode = false) => {
    let pool = [...fullBankData];
    
    if (mode === 'wrong') {
      if (allWrongQs.length === 0) {
        alert("You have no wrong questions saved!");
        return false;
      }
      pool = fullBankData.filter(q => allWrongQs.includes(q.id));
    } else {
      if (mode === 'topic' && selectedTopics.length > 0) {
        pool = pool.filter(q => selectedTopics.includes(q.topic));
      }
      if (mode === 'level' && selectedLevels.length > 0) {
        pool = pool.filter(q => selectedLevels.includes(q.level));
      }
    }
    
    if (pool.length === 0) {
      alert("No questions match the filters.");
      return false;
    }

    const maxQ = Math.min(pool.length, 50);
    const shuffled = shuffleArray(pool).slice(0, maxQ);
    
    const timeLimit = isExamMode ? maxQ * 60 : 0; // 1 min per q
    setExamTimeLimit(timeLimit);
    
    setCurrentList(shuffled);
    setCurrentIdx(0);
    setScore(0);
    setStreak(0);
    setBestStreak(0);
    setWrongAnswers([]);
    return true;
  }, [fullBankData, allWrongQs]);

  const submitAnswer = useCallback((chosenArr, correctArr, isCorrect, question) => {
    if (isCorrect) {
      setScore(s => s + 1);
      const newStreak = streak + 1;
      setStreak(newStreak);
      if (newStreak > bestStreak) setBestStreak(newStreak);
    } else {
      setStreak(0);
      setWrongAnswers(prev => [...prev, { 
        q: question, 
        chosen: chosenArr.join(', '), 
        correct: correctArr.join(', ')
      }]);
      // Add id to allWrongQs if not there
      if (!allWrongQs.includes(question.id)) {
        saveWrongData([...allWrongQs, question.id]);
      }
    }
  }, [streak, bestStreak, allWrongQs]);

  const nextQuestion = useCallback(() => {
    if (currentIdx + 1 < currentList.length) {
      setCurrentIdx(currentIdx + 1);
      return false; // Not finished
    } else {
      finishQuiz();
      return true; // Finished
    }
  }, [currentIdx, currentList]);

  const finishQuiz = useCallback((finalScore = null) => {
    // Prevent double submissions by allowing optional final score
    const scoreToApply = finalScore !== null ? finalScore : score;
    addTotalScore(scoreToApply);
  }, [score, addTotalScore]);

  return {
    currentList, currentIdx, examTimeLimit,
    score, streak, bestStreak, totalScore,
    wrongAnswers, allWrongQs,
    generateQuiz, submitAnswer, nextQuestion, finishQuiz,
    addTotalScore
  };
}
