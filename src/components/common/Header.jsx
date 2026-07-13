import './Header.css'
import logo from "../../assets/logo.png";
import { useNavigate } from 'react-router-dom';

export default function Header() {
    const navigate = useNavigate()

    const goToLogin = () => {
        navigate('/login')
    }

    return (
        <header className="header">
            <div className="header__inner">
                {/* 로고 */}
                <a href="/" className="header__logo">
                    <img src={logo} className="header__logo-img" alt="logo" />
                </a>

                {/* 로그인 버튼 */}
                <button type="button" onClick={goToLogin} className="header__login-btn">로그인</button>
            </div>
        </header>
    )
}