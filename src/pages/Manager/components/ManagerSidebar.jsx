import logo from "../../../assets/logo.png";
import { useNavigate } from "react-router-dom";

const ManagerSidebar = () => {
    const navigate = useNavigate();

    return <aside className="manager-sidebar">
        <button className="sidebar-logo" type="button">
          <img src={logo} alt="복지모니 로고" />
        </button>
        <nav className="sidebar-menu" aria-label="관리자 메뉴">
          <button type="button" onClick={() => navigate("/login")}>
            <span>⌂</span>
            홈
          </button>
        </nav>
        <button className="sidebar-logout" type="button" onClick={() => navigate("/login")}>
          로그아웃
        </button>
      </aside>
}

export default ManagerSidebar;