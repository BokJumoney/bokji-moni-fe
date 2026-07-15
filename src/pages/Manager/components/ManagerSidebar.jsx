import logo from "../../../assets/logo.png";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/useAuth";

const ManagerSidebar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { logout } = useAuth();

    const handleLogout = async () => {
        await logout();
        navigate("/login");
    };

    return <aside className="manager-sidebar">
        <button className="sidebar-logo" type="button" onClick={() => navigate("/admin/policies")}>
          <img src={logo} alt="복지모니 로고" />
        </button>
        <nav className="sidebar-menu" aria-label="관리자 메뉴">
          <button
            className={location.pathname === "/admin/policies" ? "active" : ""}
            type="button"
            onClick={() => navigate("/admin/policies")}
          >
            <span aria-hidden="true">▣</span>
            복지 정책 업로드하기
          </button>
          <button
            className={location.pathname === "/admin/applications" ? "active" : ""}
            type="button"
            onClick={() => navigate("/admin/applications")}
          >
            <span aria-hidden="true">▤</span>
            신청서 업로드하기
          </button>
        </nav>
        <button className="sidebar-logout" type="button" onClick={handleLogout}>
          로그아웃
        </button>
      </aside>
}

export default ManagerSidebar;
