import './Header.css'
import logo from "../../assets/logo.png";

export default function Header() {
    return (
        <header className="header">
            <div className="header__inner">
                {/* 로고 */}
                <a href="/" className="header__logo">
                    <img src={logo} className="header__logo-img" alt="logo" />
                </a>

                {/* 네비게이션 */}
                <nav className="header__nav">
                    <a href="/" className="header__nav-link header__nav-link--active">홈</a>
                    <a href="/introduce" className="header__nav-link">서비스 소개</a>
                </nav>

                {/* 로그인 버튼 */}
                <button type="button" onClick="location.href='/login'" className="header__login-btn">로그인</button>
            </div>
        </header>
    )
}