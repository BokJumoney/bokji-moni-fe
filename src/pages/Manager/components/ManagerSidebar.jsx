import logo from "../../../assets/logo.png";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/useAuth";

const ManagerSidebar = () => {
    const navigate = useNavigate();
    const { logout } = useAuth();

    const handleLogout = async () => {
        await logout();
        navigate("/login");
    };

    return <aside className="manager-sidebar">
        <button className="sidebar-logo" type="button">
          <img src={logo} alt="복지모니 로고" />
        </button>
        <nav className="sidebar-menu" aria-label="관리자 메뉴">
          <button type="button" onClick={() => navigate("/")}>
            <span>⌂</span>
            홈
          </button>
        </nav>
        <button className="sidebar-logout" type="button" onClick={handleLogout}>
          로그아웃
        </button>
      </aside>
}

export default ManagerSidebar;