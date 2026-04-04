import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import SetupBoard from './components/SetupBoard';
import QuizPlayground from './components/QuizPlayground';
import ResultBoard from './components/ResultBoard';
import StudyBoard from './components/StudyBoard';

function QuizApp() {
  return (
    <BrowserRouter>
      <div className="layout-container">
        <Header />
        <main className="mt-8">
          <Routes>
            <Route path="/" element={<SetupBoard />} />
            <Route path="/play" element={<QuizPlayground />} />
            <Route path="/result" element={<ResultBoard />} />
            <Route path="/study" element={<StudyBoard />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default QuizApp;
