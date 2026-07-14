import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login/Login";
import ChatPage from "./pages/Chat/ChatPage";
import MainPage from "./pages/Main/MainPage";
import ChatLayout from "./layouts/ChatLayout.jsx";

import ManagerPage from "./pages/Manager/ManagerPage"
import "./App.css"
import Signup from "./pages/Signup/Signup";

function App() {

  return (
    <>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/manager" element={<ManagerPage />} />
          <Route path="/signup" element={<Signup />} />

          <Route element={<ChatLayout />} >
              <Route path="/" element={<MainPage />} />
              <Route path="/chat/:chatRoomId" element={<ChatPage />} />
          </Route>
        </Routes>
    </>
  )
}

export default App
