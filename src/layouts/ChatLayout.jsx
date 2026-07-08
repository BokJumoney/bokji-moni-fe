import './ChatLayout.css';
import Drawer from "../components/drawer/Drawer.jsx";
import {Outlet} from "react-router-dom";

function ChatLayout() {

    return (
        <>
            <div className="chat-layout">
                <Drawer />
                <div className="chat-area">
                    <Outlet />
                </div>
            </div>
        </>

    )
}

export default ChatLayout;