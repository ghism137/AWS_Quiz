import { useState, useCallback } from 'react';

// Fisher-Yates shuffle
export function shuffleArray(array) {
  let arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function useQuizEngine(fullBankData, bankName) {
  const [quizState, setQuizState] = useState('setup'); // setup, play, result, wrong
  const [currentList, setCurrentList] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [totalScore, setTotalScore] = useState(() => {
    return parseInt(localStorage.getItem(`${bankName}_score`) || '0', 10);
  });
  
  // Array of { q, chosen, correct }
  const [wrongAnswers, setWrongAnswers] = useState([]);
  const [allWrongQs, setAllWrongQs] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(`${bankName}_wrongQ`) || '[]');
    } catch {
      return [];
    }
  });

  const saveTotalScore = (newScore) => {
    setTotalScore(newScore);
    localStorage.setItem(`${bankName}_score`, newScore.toString());
  };

  const saveWrongData = (newAllWrong) => {
    // Keep max 200 items to avoid locastorage overflow
    const limited = newAllWrong.slice(-200);
    setAllWrongQs(limited);
    localStorage.setItem(`${bankName}_wrongQ`, JSON.stringify(limited));
  };

  const generateQuiz = useCallback((mode, selectedTopics, selectedLevels) => {
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
    
    setCurrentList(shuffled);
    setCurrentIdx(0);
    setScore(0);
    setStreak(0);
    setBestStreak(0);
    setWrongAnswers([]);
    setQuizState('play');
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

  const finishQuiz = useCallback(() => {
    const finalScore = score + (streak > 0 ? 1 : 0); // Need to wait for submitAnswer to resolve in UI
    // The problem is React state async. We better do finish explicitly via the UI.
    // Let's rely on UI to call finishQuiz explicitly if needed.
    saveTotalScore(totalScore + score);
    setQuizState('result');
  }, [score, streak, totalScore]);

  return {
    quizState, setQuizState,
    currentList, currentIdx,
    score, streak, bestStreak, totalScore,
    wrongAnswers, allWrongQs,
    generateQuiz, submitAnswer, nextQuestion, finishQuiz,
    saveTotalScore
  };
}
