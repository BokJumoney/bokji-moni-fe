import { useEffect, useRef } from 'react';
import { FiDownload, FiFileText } from 'react-icons/fi';
import WelfareCard from '../../../../components/welfare/WelfareCard';
import { formatTime } from '../../../../utils/messageUtils';
import { resolveApiUrl } from '../../../../services/common/request';
import MarkdownMessage from './MarkdownMessage';
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
            {msg.role === 'assistant' ? (
              <MarkdownMessage content={msg.content} />
            ) : (
              <p className="message-text">{msg.content}</p>
            )}
            {msg.files && msg.files.length > 0 && (
              <div className="message-files" aria-label="다운로드할 신청서">
                {msg.files.map((file, index) => (
                  <a
                    key={file.fileId || `${file.downloadUrl}-${index}`}
                    className="message-file-card"
                    href={resolveApiUrl(file.downloadUrl)}
                    download={file.originalFilename || true}
                    aria-label={`${file.originalFilename || '신청서'} 다운로드`}
                  >
                    <span className="message-file-icon" aria-hidden="true">
                      <FiFileText />
                    </span>
                    <span className="message-file-details">
                      <strong className="message-file-name">
                        {file.originalFilename || '신청서 파일'}
                      </strong>
                      <span className="message-file-meta">신청서 파일</span>
                    </span>
                    <span className="message-file-download">
                      <FiDownload aria-hidden="true" />
                      다운로드
                    </span>
                  </a>
                ))}
              </div>
            )}
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
