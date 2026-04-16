import React from 'react'
import {Navigate, Route, Routes} from 'react-router-dom'
import {useAuth} from './context/AuthContext.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Admin from './pages/Admin.jsx'

function ProtectedRoute({ children }) {
  const {user, loading} = useAuth();

  if(loading){
    return <p>Checking session...</p>
  }
  
  if(!user){
    return <Navigate to="/login" replace/>
  }

  return children;
}

function AdminRoute({ children }) {
  const {user, loading} = useAuth();
  
  if(loading){
    return <p>Checking session...</p>
  }

  if(!user || user.role !== 'admin'){
    return <Navigate to="/login" replace/>
  }
  
  return children;
}


const App = () => {
  return (
    <Routes>
    <Route path = '/' element={<Navigate to="/dashboard" replace/>}/>
    <Route path = '/login' element={<Login/>}/>
    <Route path = '/register' element={<Register/>}/>
    <Route path = '/dashboard' element={
      <ProtectedRoute>
        <Dashboard/>
      </ProtectedRoute>
    }/>
    <Route path = '/admin' element={
      <AdminRoute>
        <Admin/>
      </AdminRoute>
    }/>
    </Routes>
  )
}

export default App
