import './ChatArea.css';
import ChatHeader from '../ChatHeader/ChatHeader';
import MessageList from '../MessageList/MessageList';
import ChatInput from '../ChatInput/ChatInput';
import QuickStart from '../QuickStart/QuickStart';

function ChatArea({ messages, isLoading, onSend, onReset, onQuickStart }) {
  return (
    <main className="chat-area">
      <ChatHeader onReset={onReset} isLoading={isLoading} />
      <div className="chat-content">
        {messages.length === 0 && !isLoading ? (
          <div className="chat-welcome">
            <QuickStart onSelect={onQuickStart} />
          </div>
        ) : (
          <MessageList messages={messages} isLoading={isLoading} />
        )}
      </div>
      <ChatInput onSend={onSend} isLoading={isLoading} />
    </main>
  );
}

export default ChatArea;
