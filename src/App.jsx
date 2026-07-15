import { Navigate, Routes, Route } from "react-router-dom";
import Login from "./pages/Login/Login";
import ManagerPage from "./pages/Manager/ManagerPage"
import PolicyUploadPage from "./pages/Manager/PolicyUploadPage";
import ApplicationUploadPage from "./pages/Manager/ApplicationUploadPage";
import "./App.css"
import Signup from "./pages/Signup/Signup";

function App() {

  return (
    <>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={<ManagerPage />}>
            <Route index element={<Navigate to="/admin/policies" replace />} />
            <Route path="policies" element={<PolicyUploadPage />} />
            <Route path="applications" element={<ApplicationUploadPage />} />
          </Route>
          <Route path="/signup" element={<Signup />} />
        </Routes>
    </>
  )
}

export default App
