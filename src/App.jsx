import { useEffect } from "react";
import { Routes, Route, Navigate, useNavigate, useParams } from "react-router-dom";
import Login from "./pages/Login/Login";
import ManagerPage from "./pages/Manager/ManagerPage"
import PolicyUploadPage from "./pages/Manager/PolicyUploadPage";
import ApplicationUploadPage from "./pages/Manager/ApplicationUploadPage";
import "./App.css"

import Signup from "./pages/Signup/Signup";
import ChatPage from "./pages/Chat/ChatPage";
import MainPage from "./pages/Main/MainPage";
// import MyPage from "./pages/MyPage/MyPage";
import ChatLayout from "./layouts/ChatLayout.jsx";
import { useAuth } from "./context/useAuth";

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="loading-screen">로딩 중...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function AdminAccessDenied() {
  const navigate = useNavigate();

  useEffect(() => {
    window.alert("관리자만 접근할 수 있는 페이지입니다.");
    navigate("/", { replace: true });
  }, [navigate]);

  return null;
}

function AdminRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="loading-screen">濡쒕뵫 以?..</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== "admin") {
    return <AdminAccessDenied />;
  }

  return children;
}

function PublicOnlyRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="loading-screen">로딩 중...</div>;
  }

  if (user) {
    return <Navigate to="/" replace />;
  }

  return children;
}

function ChatPageRoute() {
  const { chatRoomId } = useParams();
  return <ChatPage key={chatRoomId || 'new'} />;
}

function App() {

  return (
    <>
      <Routes>
        <Route
          path="/login"
          element={
            <PublicOnlyRoute>
              <Login />
            </PublicOnlyRoute>
          }
        />
        <Route
          path="/signup"
          element={
            <PublicOnlyRoute>
              <Signup />
            </PublicOnlyRoute>
          }
        />

        <Route
          path="/admin"
          element={
            <AdminRoute>
              <ManagerPage />
            </AdminRoute>
          }
        >
          <Route index element={<Navigate to="/admin/policies" replace />} />
          <Route path="policies" element={<PolicyUploadPage />} />
          <Route path="applications" element={<ApplicationUploadPage />} />
        </Route>

        <Route element={<ChatLayout />}>
          <Route path="/" element={<MainPage />} />
          <Route
            path="/chat"
            element={
              <ProtectedRoute>
                <ChatPageRoute />
              </ProtectedRoute>
            }
          />
          <Route
            path="/chat/:chatRoomId"
            element={
              <ProtectedRoute>
                <ChatPageRoute />
              </ProtectedRoute>
            }
          />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  )
}

export default App
