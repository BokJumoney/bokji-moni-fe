import './Drawer.css';

function Drawer() {

    return (
        <aside className="drawer">
            <header className="drawer-header">
                <button className="drawer-toggle-btn">O</button>
            </header>
            <nav className="drawer-chatroom">
                <ul className="drawer-chatroom-list">
                    <li className="drawer-chatroom-item">1번 채팅방</li>
                    <li className="drawer-chatroom-item">2번 채팅방</li>
                </ul>
            </nav>
            <footer className="drawer-footer">
                <button className="settings-btn"></button>
            </footer>
        </aside>
    )
}

export default Drawer;