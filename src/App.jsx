import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login/Login";
import Main from "./pages/Main/MainPage";


function App() {

  return (
    <>
        <Routes>
            <Route path="/" element={<Main />} />
            <Route path="/login" element={<Login />} />
        </Routes>
    </>
  )
}

export default App
