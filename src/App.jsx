import { Routes, Route } from "react-router-dom";
import "./App.css"

import Login from "./pages/Login/Login";
import Signup from "./pages/Signup/Signup";
import ManagerPage from "./pages/Manager/ManagerPage"
import ChatPage from "./pages/Chat/ChatPage";
import MainPage from "./pages/Main/MainPage";
import ChatLayout from "./layouts/ChatLayout.jsx";

function App() {

  return (
    <>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/manager" element={<ManagerPage />} />
        <Route element={<ChatLayout />} >
          <Route path="/" element={<MainPage />} />
          <Route path="/chat/:chatRoomId" element={<ChatPage />} />
        </Route>
      </Routes >
    </>
  )
}

export default App
