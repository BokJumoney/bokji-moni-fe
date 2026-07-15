import { Routes, Route, Navigate } from "react-router-dom";
import "./App.css"

import Login from "./pages/Login/Login";
import Signup from "./pages/Signup/Signup";
import ManagerPage from "./pages/Manager/ManagerPage"
import ChatPage from "./pages/Chat/ChatPage";
import MainPage from "./pages/Main/MainPage";
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

function App() {

  return (
    <>
      <Routes>
        <Route path="/login" element={
          <PublicOnlyRoute>
            <Login />
          </PublicOnlyRoute>
        } />
        <Route path="/signup" element={
          <PublicOnlyRoute>
            <Signup />
          </PublicOnlyRoute>
        } />
        <Route path="/manager" element={
          <ProtectedRoute>
            <ManagerPage />
          </ProtectedRoute>
        } />
        <Route element={
          <ProtectedRoute>
            <ChatLayout />
          </ProtectedRoute>
        }>
          <Route path="/" element={<MainPage />} />
          <Route path="/chat/:chatRoomId" element={<ChatPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes >
    </>
  )
}

export default App