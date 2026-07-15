import './ChatLayout.css';
import Drawer from "../components/drawer/Drawer.jsx";
import { Outlet, useNavigate } from "react-router-dom";
import { useState } from "react";

function ChatLayout() {
    const [chatRooms, setChatRooms] = useState([]);
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
                onNewChat={handleNewChat}
            />
            <div className="chat-area">
                <Outlet />
            </div>
        </div>
    )
}

export default ChatLayout;