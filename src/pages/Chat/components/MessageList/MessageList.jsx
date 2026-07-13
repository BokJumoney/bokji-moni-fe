import { useEffect, useRef } from 'react';
import WelfareCard from '../../../../components/welfare/WelfareCard';
import { formatTime } from '../../../../utils/messageUtils';
import './MessageList.css';

function MessageList({ messages, isLoading }) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  return (
    <div className="message-list">
      {messages.map((msg) => (
        <div key={msg.id} className={`message-row ${msg.role === 'user' ? 'user-row' : 'bot-row'}`}>
          {msg.role === 'assistant' && (
            <div className="message-avatar">🤖</div>
          )}
          <div className={`message ${msg.role === 'user' ? 'user-message' : 'bot-message'}`}>
            <p>{msg.content}</p>
            {msg.sources && msg.sources.length > 0 && (
              <div className="message-sources">
                {msg.sources.map((src, i) => (
                  <WelfareCard key={i} title={src.title} description={src.description} />
                ))}
              </div>
            )}
            <span className="message-time">{formatTime(msg.timestamp)}</span>
          </div>
        </div>
      ))}

      {isLoading && (
        <div className="message-row bot-row">
          <div className="message-avatar">🤖</div>
          <div className="message bot-message">
            <div className="typing-indicator">
              <span className="typing-dot" />
              <span className="typing-dot" />
              <span className="typing-dot" />
            </div>
          </div>
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  );
}

export default MessageList;
