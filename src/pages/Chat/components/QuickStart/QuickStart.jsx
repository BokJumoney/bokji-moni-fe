import React from 'react';
import './QuickStart.css';

function QuickStart() {
  const options = [
    { icon: '💼', text: '취업 준비 지원' },
    { icon: '🏠', text: '주거 지원 혜택' },
    { icon: '💚', text: '저소득층 지원' },
    { icon: '👶', text: '육아 지원' },
    { icon: '👨‍👩‍👦', text: '한부모 가정 지원' },
  ];

  return (
    <div className="quick-start-container">
      <h3 className="quick-start-title">예시 질문으로 시작하기</h3>
      <div className="quick-start-buttons">
        {options.map((opt, index) => (
          <button key={index} className="quick-start-btn">
            <span className="btn-icon">{opt.icon}</span>
            {opt.text}
          </button>
        ))}
      </div>
    </div>
  );
}

export default QuickStart;
