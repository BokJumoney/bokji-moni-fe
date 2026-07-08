import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login/Login";
import ChatLayout from "./layouts/ChatLayout.jsx";


function App() {

  return (
    <>
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route element={<ChatLayout />} >
              <Route path="/" element={<MainPage />} />
              <Route path="/chat/:chatRoomId" element={<ChatArea />} />
          </Route>
        </Routes>
    </>
  )
}

export default App
