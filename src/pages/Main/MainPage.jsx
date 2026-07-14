import './MainPage.css'
import mascotImg from '../../assets/moni_logo_login.png'
import bgImg from '../../assets/background.png'
import logo from '../../assets/logo.png'

function MainPage() {
  return (
    <div className="main-page" style={{ backgroundImage: `url(${bgImg})` }}>

      {/* ── Header / Navigation ── */}
      <header className="header">
        <div className="header__inner">
          {/* 로고 */}
          <a href="/" className="header__logo">
            <img src={logo} className="header__logo-img" alt="logo" />
          </a>

          {/* 네비게이션 */}
          <nav className="header__nav">
            <a href="#" className="header__nav-link header__nav-link--active">홈</a>
            <a href="#" className="header__nav-link">서비스 소개</a>
            <a href="#" className="header__nav-link">복지 가이드</a>
            <a href="#" className="header__nav-link">마이페이지</a>
          </nav>

          {/* 로그인 버튼 */}
          <button className="header__login-btn">로그인</button>
        </div>
      </header>

      {/* ── Hero Section ── */}
      <section className="hero">
        <div className="hero__inner">

          {/* 좌측: 텍스트 + 검색바 */}
          <div className="hero__content">
            <h1 className="hero__title">
              지금 받을 수 있는
              <br />
              <span className="hero__title--highlight">복지</span> 찾아드립니다
            </h1>

            <p className="hero__description">
              AI가 당신의 상황을 이해하고
              <br />
              맞춤 복지 정책을 추천해드려요.
            </p>

            {/* 검색 입력바 */}
            <div className="hero__search">
              <input
                type="text"
                className="hero__search-input"
                placeholder="궁금한 복지 내용을 입력해주세요"
              />
              <button className="hero__search-btn" type="button">
                <svg className="hero__search-btn-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                질문하기
              </button>
            </div>
          </div>

          {/* 우측: 마스코트 이미지 */}
          <div className="hero__visual">
            <img
              src={mascotImg}
              alt="복지AI 마스코트 모니"
              className="hero__mascot-img"
            />
          </div>

        </div>
      </section>

    </div>
  )
}

export default MainPage
