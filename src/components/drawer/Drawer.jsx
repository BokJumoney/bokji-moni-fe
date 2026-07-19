import './Drawer.css';
import { useState, useRef, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/useAuth";
import SettingsModal from "../settings/SettingsModal";

const ToggleIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
         strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <line x1="9" y1="3" x2="9" y2="21" />
    </svg>
);

const PlusIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
         strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="5" x2="12" y2="19" />
        <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
);

const SearchIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
         strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="7" />
        <line x1="21" y1="21" x2="16.5" y2="16.5" />
    </svg>
);

function Drawer({ chatRooms, roomsLoading, roomsError, onNewChat, onRetry }) {
    const [isOpen, setIsOpen] = useState(false);
    const [searchKeyword, setSearchKeyword] = useState("");
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [settingsModalSection, setSettingsModalSection] = useState(null);
    const footerRef = useRef(null);
    const searchInputRef = useRef(null);
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    // 설정 메뉴가 열려 있을 때 바깥을 클릭하면 닫는다
    useEffect(() => {
        if (!isSettingsOpen) return;
        const handleClickOutside = (e) => {
            if (footerRef.current && !footerRef.current.contains(e.target)) {
                setIsSettingsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isSettingsOpen]);

    const filteredRooms = chatRooms.filter((room) =>
        room.title.toLowerCase().includes(searchKeyword.toLowerCase())
    );

    // 접힌 상태에서 검색 아이콘을 누르면 드로어를 펼치고 검색창에 포커스
    const handleSearchClick = () => {
        setIsOpen(true);
        setTimeout(() => searchInputRef.current?.focus(), 0);
    };

    const handleLogout = async () => {
        setIsSettingsOpen(false);
        await logout();
        navigate("/login");
    };

    const openSettingsModal = () => {
        setIsSettingsOpen(false);
        setSettingsModalSection("account");
    };

    return (
        <>
        <aside className={isOpen ? "drawer" : "drawer closed"}>
            <header className="drawer-header">
                <button
                    className="drawer-toggle-btn"
                    onClick={() => setIsOpen(!isOpen)}
                    title={isOpen ? "드로어 닫기" : "드로어 열기"}
                >
                    <ToggleIcon />
                </button>
            </header>

            <section className="drawer-actions">
                <button className="drawer-action-btn" onClick={onNewChat}>
                    <PlusIcon />
                    <span className="drawer-label">새 채팅</span>
                </button>

                {/* 접힘/펼침에서 같은 엘리먼트를 유지해야 아이콘이 순간이동하지 않는다 */}
                <div
                    className="drawer-search"
                    onClick={isOpen ? undefined : handleSearchClick}
                >
                    <SearchIcon />
                    <input
                        ref={searchInputRef}
                        type="text"
                        placeholder="채팅 검색"
                        value={searchKeyword}
                        onChange={(e) => setSearchKeyword(e.target.value)}
                    />
                </div>
            </section>

            <nav className="drawer-chatroom">
                <p className="drawer-section-title">채팅방</p>
                <ul className="drawer-chatroom-list">
                    {roomsLoading && (
                        <li className="drawer-chatroom-empty">불러오는 중...</li>
                    )}
                    {!roomsLoading && roomsError && (
                        <li className="drawer-chatroom-empty">
                            <span>{roomsError}</span>
                            <button
                                className="drawer-chatroom-retry"
                                onClick={onRetry}
                            >
                                다시 시도
                            </button>
                        </li>
                    )}
                    {!roomsLoading && !roomsError && filteredRooms.map((room) => (
                        <li key={room.id}>
                            <NavLink
                                to={`/chat/${room.id}`}
                                className={({ isActive }) =>
                                    isActive ? "drawer-chatroom-item active" : "drawer-chatroom-item"
                                }
                            >
                                {room.title}
                            </NavLink>
                        </li>
                    ))}
                    {!roomsLoading && !roomsError && filteredRooms.length === 0 && (
                        <li className="drawer-chatroom-empty">
                            {searchKeyword ? "검색 결과가 없어요" : "채팅방이 없어요"}
                        </li>
                    )}
                </ul>
            </nav>

            <footer className="drawer-footer" ref={footerRef}>
                {isSettingsOpen && (
                    <div className="settings-menu">
                        <button onClick={openSettingsModal}>설정</button>
                        <div className="settings-menu-divider" />
                        <button className="logout" onClick={handleLogout}>로그아웃</button>
                    </div>
                )}
                {user && (
                    <button
                        className="settings-btn"
                        onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                    >
                        <div className="user-profile-img">{user.name.charAt(0)}</div>
                        <div className="user-info">
                            <span className="user-name">{user.name}</span>
                            <span className="user-email">{user.email}</span>
                        </div>
                    </button>
                )}
            </footer>
        </aside>
        <SettingsModal
            key={settingsModalSection || "closed"}
            isOpen={settingsModalSection !== null}
            initialSection={settingsModalSection || "account"}
            onClose={() => setSettingsModalSection(null)}
        />
        </>
    )
}

export default Drawer;
