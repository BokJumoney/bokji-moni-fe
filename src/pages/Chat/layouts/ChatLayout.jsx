import './ChatLayout.css';
import Drawer from "../../../components/drawer/Drawer.jsx";
import { Outlet, useNavigate } from "react-router-dom";
import { useState } from "react";
// import { mockUser, mockChatRooms } from "../data/mockData.js";

function ChatLayout() {
    // TODO: 백엔드 연동 시 useEffect에서 채팅방 목록 fetch로 교체
    const [chatRooms, setChatRooms] = useState(mockChatRooms);
    const navigate = useNavigate();

    const handleNewChat = () => {
        const newRoom = { id: Date.now(), title: "새 대화" };
        setChatRooms([newRoom, ...chatRooms]);
        navigate(`/chat/${newRoom.id}`);
    };

    return (
        <div className="chat-layout">
            <Drawer
                chatRooms={chatRooms}
                user={mockUser}
                onNewChat={handleNewChat}
            />
            <div className="chat-area">
                <Outlet />
            </div>
        </div>
    )
}

export default ChatLayout;
