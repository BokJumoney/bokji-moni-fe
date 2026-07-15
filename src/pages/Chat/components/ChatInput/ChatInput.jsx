import { useState } from 'react';
import './ChatInput.css';

function ChatInput({ onSend, isLoading }) {
  const [message, setMessage] = useState('');

  const handleSend = () => {
    if (!message.trim() || isLoading) return;
    onSend(message);
    setMessage('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.nativeEvent.isComposing) {
      handleSend();
    }
  };

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
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isLoading}
        />
        <button className="send-btn" onClick={handleSend} disabled={isLoading}>
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
