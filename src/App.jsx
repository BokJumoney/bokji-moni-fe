import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login/Login";
import Chat from "./pages/Chat/ChatPage";
import Main from "./pages/Main/MainPage";
import Signup from "./pages/Signup/Signup";


function App() {

  return (
    <>
        <Routes>
            <Route path="/" element={<Main />} />
            <Route path="/login" element={<Login />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/signup" element={<Signup />} />
        </Routes>
    </>
  )
}

export default App
