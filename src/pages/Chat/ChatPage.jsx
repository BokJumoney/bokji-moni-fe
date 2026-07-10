import './ChatPage.css';
import ChatArea from './components/ChatArea/ChatArea';
import Header from "../../components/common/Header.jsx";

function ChatPage() {
    return (
        <>
            {/* ── Header / Navigation ── */}
            <Header />

            {/* - Chat - */}
            <div className="chat-page-container">
                <ChatArea />
            </div>
        </>
    )
}

export default ChatPage;