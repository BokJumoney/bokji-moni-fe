import './ChatLayout.css';
import Drawer from "../components/drawer/Drawer.jsx";
import { Outlet, useNavigate } from "react-router-dom";
import { useState, useCallback, useEffect } from "react";
import { getSessions } from "../services/chat/chatApi";
import { useAuth } from "../context/useAuth";

const mapRooms = (data) => {
    const items = Array.isArray(data?.items) ? data.items : [];
    return items.map((it) => ({
        id: it.session_id,
        title: it.title,
        lastMessagePreview: it.last_message_preview,
        messageCount: it.message_count,
        lastMessageAt: it.last_message_at,
    }));
};

function ChatLayout() {
    const [chatRooms, setChatRooms] = useState([]);
    const [roomsLoaded, setRoomsLoaded] = useState(false);
    const [roomsError, setRoomsError] = useState(null);
    const [chatKey, setChatKey] = useState(0);
    const navigate = useNavigate();
    const { user } = useAuth();

    const roomsLoading = user != null && !roomsLoaded;

    const refreshRooms = useCallback(async () => {
        setRoomsError(null);
        setRoomsLoaded(false);
        try {
            setChatRooms(mapRooms(await getSessions()));
        } catch (err) {
            setRoomsError(err?.message || '채팅방 목록을 불러오지 못했습니다.');
        } finally {
            setRoomsLoaded(true);
        }
    }, []);

    useEffect(() => {
        if (!user) return;
        let cancelled = false;
        getSessions()
            .then((data) => {
                if (cancelled) return;
                setChatRooms(mapRooms(data));
                setRoomsLoaded(true);
            })
            .catch((err) => {
                if (cancelled) return;
                setRoomsError(err?.message || '채팅방 목록을 불러오지 못했습니다.');
                setRoomsLoaded(true);
            });
        return () => { cancelled = true; };
    }, [user]);

    const handleNewChat = () => {
        setChatKey((k) => k + 1);
        navigate('/chat');
    };

    return (
        <div className="chat-layout">
            <Drawer
                chatRooms={chatRooms}
                roomsLoading={roomsLoading}
                roomsError={roomsError}
                onNewChat={handleNewChat}
                onRetry={refreshRooms}
            />
            <div className="chat-area">
                <Outlet key={chatKey} context={{ refreshRooms }} />
            </div>
        </div>
    )
}

export default ChatLayout;