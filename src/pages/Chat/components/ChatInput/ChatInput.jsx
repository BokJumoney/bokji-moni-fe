import React from 'react';
import './ChatInput.css';

function ChatInput() {
  return (
    <div className="chat-input-wrapper">
      <div className="chat-input-container">
        <button className="attach-btn">
          <span className="attach-icon">📎</span>
        </button>
        <input 
          type="text" 
          className="chat-input-field" 
          placeholder="추가로 입력하고 싶은 내용을 자유롭게 작성해주세요."
        />
        <button className="send-btn">
          <span className="send-icon">➤</span>
        </button>
      </div>
      <div className="security-notice">
        <span className="lock-icon">🔒</span>
        입력하신 정보는 안전하게 보호되며, 추천 서비스 제공에만 사용됩니다.
      </div>
    </div>
  );
}

export default ChatInput;
