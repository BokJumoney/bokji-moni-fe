import './ChatArea.css';
import ChatHeader from '../ChatHeader/ChatHeader';
import MessageList from '../MessageList/MessageList';
import QuickStart from '../QuickStart/QuickStart';
import ChatInput from '../ChatInput/ChatInput';

function ChatArea() {
  return (
    <main className="chat-area">
      <ChatHeader />
      <div className="chat-content">
        <MessageList />
        <QuickStart />
      </div>
      <ChatInput />
    </main>
  );
}

export default ChatArea;
