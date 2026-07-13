import './ChatPage.css';
import useChat from '../../hooks/useChat';
import ChatArea from './components/ChatArea/ChatArea';

function ChatPage() {
    const { messages, isLoading, sendMessage, resetChat } = useChat();

    return (
        <div className="chat-page-container">
            <ChatArea
                messages={messages}
                isLoading={isLoading}
                onSend={sendMessage}
                onReset={resetChat}
                onQuickStart={sendMessage}
            />
        </div>
    );
}

export default ChatPage;
