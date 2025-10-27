import React from "react"
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Login from "./pages/user/Login"
import Home from "./pages/general/Home"
import Register from "./pages/user/Register"

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login/>} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
