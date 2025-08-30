import React, { useState } from 'react';
import './Question.css';
import Tag from './Tag';
import SelectionBox from './SelectionBox';

const Question = ({ question, questionNumber, totalQuestions, selectedAnswer, onAnswerSelect, timeElapsed }) => {
  const [expandedOption, setExpandedOption] = useState(null);

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleOptionClick = (optionKey) => {
    onAnswerSelect(optionKey);
    setExpandedOption(expandedOption === optionKey ? null : optionKey);
  };

  const getOptionState = (optionKey) => {
    if (!selectedAnswer) return 'default';
    if (selectedAnswer === optionKey) {
      return question.answer === optionKey ? 'correct' : 'incorrect';
    }
    if (question.answer === optionKey) return 'correct';
    return 'default';
  };

  return (
    <div className="question-container">
      <div className="question-card">
        <div className="question-header">
          <div className="question-title">
            <h2>사용자 중심 전략수립</h2>
            <span className="time">{formatTime(timeElapsed)}</span>
          </div>
        </div>
        
        <div className="divider"></div>
        
        <div className="question-info">
          <div className="question-number">{questionNumber}.</div>
          <div className="question-tags">
            <Tag text="아이디어 워크숍" />
            <Tag text="난이도 하" />
          </div>
        </div>
        
        <div className="question-text">
          {question.question}
        </div>
        
        <div className="question-image">
          <div className="image-placeholder">
            <span>이미지 영역</span>
          </div>
        </div>
        
        <div className="options-container">
          {Object.entries(question.options).map(([key, option]) => (
            <SelectionBox
              key={key}
              optionKey={key}
              text={option}
              state={getOptionState(key)}
              isExpanded={expandedOption === key}
              onClick={() => handleOptionClick(key)}
              explanation={selectedAnswer && question.answer === key ? question.explanation : null}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Question;
