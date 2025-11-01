import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import './App.css'
import Home from './Home'
import Register from "./components/Register"
import Login from "./components/Login"
import CreateBlog from './components/CreateBlog'
import Profile from './components/Profile'
import Navbar from './components/Navbar'
import EditBlog from './components/EditBlog'
import SingleBlog from './components/SingleBlog'
import AdminPage from './components/AdminPage'
function App() {
  const [count, setCount] = useState(0)

  return (

    <Routes>
     
      {/* Use 'element' instead of 'Component' */}
      <Route path='/' element={<Home />} />
      <Route path='/register' element={<Register/>} />
      <Route path='/login' element={<Login/>} />
      <Route path='/create' element={<CreateBlog/>} />
      <Route path='/profile' element={<Profile/>} />
       <Route path="/blog/:id" element={<SingleBlog />} />
        <Route path="/edit/:id" element={<EditBlog />} />
        <Route path="/admin" element={<AdminPage />} />
    </Routes>
  )
}

export default App
