import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login/Login";
import ManagerPage from "./pages/Manager/ManagerPage"
import "./App.css"

function App() {

  return (
    <>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/manager" element={<ManagerPage />} />
        </Routes>
    </>
  )
}

export default App
