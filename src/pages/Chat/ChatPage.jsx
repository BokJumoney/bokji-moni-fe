import './ChatPage.css';
import { useParams, useNavigate, useOutletContext, useLocation } from 'react-router-dom';
import { useMemo, useCallback } from 'react';
import useChat from '../../hooks/useChat';
import ChatArea from './components/ChatArea/ChatArea';
import { createMessage } from '../../utils/messageUtils';

function ChatPage() {
    const { chatRoomId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const { refreshRooms } = useOutletContext() || {};

    const { initialMessages, pendingMessage } = useMemo(() => {
        const st = location.state;
        if (st && st.sessionId && st.sessionId === chatRoomId && Array.isArray(st.hydratedMessages)) {
            return { initialMessages: st.hydratedMessages, pendingMessage: null };
        }
        if (!chatRoomId && st?.pendingMessage) {
            return {
                initialMessages: [createMessage('user', st.pendingMessage)],
                pendingMessage: st.pendingMessage,
            };
        }
        return { initialMessages: null, pendingMessage: null };
    }, [location.state, chatRoomId]);

    const handleSessionCreated = useCallback((newSessionId, msgs) => {
        refreshRooms?.();
        navigate(`/chat/${newSessionId}`, { replace: true, state: { hydratedMessages: msgs, sessionId: newSessionId } });
    }, [navigate, refreshRooms]);

    const { messages, isLoading, historyLoading, sendMessage, resetChat } = useChat({
        sessionId: chatRoomId || null,
        initialMessages,
        pendingMessage,
        onSessionCreated: handleSessionCreated,
    });

    const handleReset = useCallback(() => {
        if (chatRoomId) {
            navigate('/chat', { replace: true });
        } else {
            resetChat();
        }
    }, [chatRoomId, navigate, resetChat]);

    return (
        <div className="chat-page-container">
            <ChatArea
                messages={messages}
                isLoading={isLoading || historyLoading}
                onSend={sendMessage}
                onReset={handleReset}
            />
        </div>
    );
}

export default ChatPage;