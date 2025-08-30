import React, { useState, useEffect } from 'react';
import './App.css';
import Question from './components/Question';
import data from './data.json';

function App() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);

  const currentQuestion = data[currentQuestionIndex];
  const totalQuestions = data.length;

  // 타이머 효과
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeElapsed(prev => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswerSelect = (questionId, answer) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      setShowResults(true);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setShowResults(false);
    setTimeElapsed(0);
  };

  if (showResults) {
    const correctAnswers = data.filter((question, index) => 
      selectedAnswers[index] === question.answer
    ).length;

    return (
      <div className="app">
        <div className="quiz-container">
          <div className="header">
            <div className="header-content">
              <div className="logo">Shum</div>
              <button className="signin-btn">Sign in</button>
            </div>
          </div>
          
          <div className="result-content">
            <div className="result-card">
              <h1>퀴즈 완료!</h1>
              <div className="result-stats">
                <div className="stat">
                  <span className="stat-label">정답률</span>
                  <span className="stat-value">{Math.round((correctAnswers / totalQuestions) * 100)}%</span>
                </div>
                <div className="stat">
                  <span className="stat-label">정답 수</span>
                  <span className="stat-value">{correctAnswers}/{totalQuestions}</span>
                </div>
                <div className="stat">
                  <span className="stat-label">소요 시간</span>
                  <span className="stat-value">{formatTime(timeElapsed)}</span>
                </div>
              </div>
              <button className="restart-btn" onClick={resetQuiz}>
                다시 시작하기
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <div className="quiz-container">
        <div className="header">
          <div className="header-content">
            <div className="logo">Shum</div>
            <button className="signin-btn">Sign in</button>
          </div>
        </div>
        
        <div className="main-content">
          <Question
            question={currentQuestion}
            questionNumber={currentQuestionIndex + 1}
            totalQuestions={totalQuestions}
            selectedAnswer={selectedAnswers[currentQuestionIndex]}
            onAnswerSelect={(answer) => handleAnswerSelect(currentQuestionIndex, answer)}
            timeElapsed={timeElapsed}
          />
        </div>
        
        <div className="footer">
          <div className="footer-content">
            <button 
              className="next-btn"
              onClick={handleNext}
              disabled={!selectedAnswers[currentQuestionIndex]}
            >
              {currentQuestionIndex === totalQuestions - 1 ? '완료' : '다음'}
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M5.33 4L10.26 8L5.33 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
