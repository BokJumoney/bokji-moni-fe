import './ChatArea.css';
import ChatHeader from '../ChatHeader/ChatHeader';
import MessageList from '../MessageList/MessageList';
import ChatInput from '../ChatInput/ChatInput';

function ChatArea({ messages, isLoading, onSend, onReset }) {
  return (
    <main className="chat-area">
      <ChatHeader onReset={onReset} isLoading={isLoading} />
      <div className="chat-content">
        {
          <MessageList messages={messages} isLoading={isLoading} />
        }
      </div>
      <ChatInput onSend={onSend} isLoading={isLoading} />
    </main>
  );
}

export default ChatArea;
