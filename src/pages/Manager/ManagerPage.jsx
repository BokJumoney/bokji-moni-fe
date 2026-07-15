import { Outlet } from "react-router-dom";
import "./ManagerPage.css";
import ManagerSidebar from "./components/ManagerSidebar";

const ManagerPage = () => (
  <section className="manager-page">
    <ManagerSidebar />
    <Outlet />
  </section>
);

export default ManagerPage;
