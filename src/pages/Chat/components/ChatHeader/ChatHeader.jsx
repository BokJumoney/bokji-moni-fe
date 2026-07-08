import './ChatHeader.css';

function ChatHeader() {
  return (
    <header className="chat-header">
      <div className="bot-info">
        <div className="bot-avatar">🤖</div>
        <div className="bot-details">
          <h2 className="bot-name">복지머니</h2>
          <p className="bot-desc">AI가 복지 정보를 찾아드려요!</p>
        </div>
      </div>
      <button className="reset-btn">
        <span className="reset-icon">↻</span> 새로운 채팅
      </button>
    </header>
  );
}

export default ChatHeader;
