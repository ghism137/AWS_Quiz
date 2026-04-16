import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ErrorBoundary } from 'react-error-boundary';
import Header from './components/Header';

const SetupBoard = React.lazy(() => import('./components/SetupBoard'));
const QuizPlayground = React.lazy(() => import('./components/QuizPlayground'));
const ResultBoard = React.lazy(() => import('./components/ResultBoard'));
const StudyBoard = React.lazy(() => import('./components/StudyBoard'));

function ErrorFallback({ error, resetErrorBoundary }) {
  return (
    <div role="alert" className="p-8 text-center text-red glass-panel m-8 rounded-xl">
      <h2 className="text-2xl font-bold mb-4">Màn hình xanh tử thần 😔</h2>
      <p>Có lỗi hệ thống xảy ra trong quá trình kết xuất:</p>
      <pre className="text-sm bg-bg p-4 mt-4 overflow-auto rounded text-left border border-red">{error.message}</pre>
      <button onClick={resetErrorBoundary} className="btn-primary mt-6">Thử lại</button>
    </div>
  );
}

function QuizApp() {
  return (
    <BrowserRouter>
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <div className="layout-container">
          <Header />
          <main className="mt-8">
            <Suspense fallback={<div className="text-center mt-10 text-slate-400">Đang tải phân hệ...</div>}>
              <Routes>
                <Route path="/" element={<SetupBoard />} />
                <Route path="/play" element={<QuizPlayground />} />
                <Route path="/result" element={<ResultBoard />} />
                <Route path="/study" element={<StudyBoard />} />
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </Suspense>
          </main>
        </div>
      </ErrorBoundary>
    </BrowserRouter>
  );
}

export default QuizApp;
