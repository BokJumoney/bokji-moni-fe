import './Header.css'
import logo from "../../assets/logo.png";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/useAuth';

export default function Header() {
    const navigate = useNavigate()
    const { user, logout } = useAuth()

    const goToLogin = () => {
        navigate('/login')
    }

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    return (
        <header className="header">
            <div className="header__inner">
                {/* 로고 */}
                <a href="/" className="header__logo">
                    <img src={logo} className="header__logo-img" alt="logo" />
                </a>

                {user ? (
                    <div className="header__user-menu">
                        {user.role === 'admin' && (
                            <span className="header__admin-badge">관리자</span>
                        )}
                        <span className="header__user-name">{user.name}님</span>
                        <button type="button" onClick={handleLogout} className="header__logout-btn">로그아웃</button>
                    </div>
                ) : (
                    <button type="button" onClick={goToLogin} className="header__login-btn">로그인</button>
                )}
            </div>
        </header>
    )
}