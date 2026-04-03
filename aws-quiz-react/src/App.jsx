import React from 'react';
import Header from './components/Header';
import SetupBoard from './components/SetupBoard';
import QuizPlayground from './components/QuizPlayground';
import ResultBoard from './components/ResultBoard';
import StudyBoard from './components/StudyBoard';
import { useQuizContext } from './context/QuizContext';

function QuizApp() {
  const { quizState } = useQuizContext();

  return (
    <div className="layout-container">
      <Header />
      <main className="mt-8">
        {quizState === 'setup' && <SetupBoard />}
        {quizState === 'play' && <QuizPlayground />}
        {quizState === 'result' && <ResultBoard />}
        {quizState === 'study' && <StudyBoard />}
      </main>
    </div>
  );
}

export default QuizApp;
