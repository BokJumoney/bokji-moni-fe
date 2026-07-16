import { Routes, Route, Navigate, useParams } from "react-router-dom";
import Login from "./pages/Login/Login";
import ManagerPage from "./pages/Manager/ManagerPage"
import PolicyUploadPage from "./pages/Manager/PolicyUploadPage";
import ApplicationUploadPage from "./pages/Manager/ApplicationUploadPage";
import "./App.css"

import Signup from "./pages/Signup/Signup";
import ChatPage from "./pages/Chat/ChatPage";
import MainPage from "./pages/Main/MainPage";
import MyPage from "./pages/MyPage/MyPage";
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
            <ProtectedRoute>
              <ManagerPage />
            </ProtectedRoute>
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
