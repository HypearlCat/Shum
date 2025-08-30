import React from 'react';
import './SelectionBox.css';

const SelectionBox = ({ optionKey, text, state, isExpanded, onClick, explanation }) => {
  const getCheckboxIcon = () => {
    switch (state) {
      case 'correct':
        return (
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <circle cx="10" cy="10" r="8" fill="#27CDA5" />
            <path d="M6 10L8.5 12.5L14 7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        );
      case 'incorrect':
        return (
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <circle cx="10" cy="10" r="8" fill="#F01E29" />
            <path d="M7 7L13 13M13 7L7 13" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        );
      default:
        return (
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <circle cx="10" cy="10" r="8" stroke="#CED4DA" strokeWidth="2" fill="white"/>
          </svg>
        );
    }
  };

  const getArrowIcon = () => {
    return (
      <svg width="12" height="7" viewBox="0 0 12 7" fill="none">
        <path d="M1 1L6 6L11 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    );
  };

  return (
    <div 
      className={`selection-box ${state} ${isExpanded ? 'expanded' : ''}`}
      onClick={onClick}
    >
      <div className="selection-content">
        <div className="checkbox">
          {getCheckboxIcon()}
        </div>
        <div className="option-text">
          {text}
        </div>
        <div className="arrow">
          {getArrowIcon()}
        </div>
      </div>
      
      {isExpanded && explanation && (
        <div className="explanation">
          <div className="divider"></div>
          <div className="explanation-label">해설</div>
          <div className="explanation-text">
            {explanation}
          </div>
        </div>
      )}
    </div>
  );
};

export default SelectionBox;
