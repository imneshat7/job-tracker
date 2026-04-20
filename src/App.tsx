import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import {useAuth} from './context/AuthContext.js';
import Login from "./pages/Login.js";
import Dashboard from "./pages/Dashboard.js";
import type { ReactNode } from "react";


function ProtectedRoute ({children} : {children : ReactNode}) {
  const {user , loading} = useAuth();
    if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>
    if(!user) return <Navigate to="/login" />
    return children;
}

function App() {
  const {user , loading} = useAuth();
    if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element = { user ? <Navigate to='/dashboard' /> : <Login />}/>
        <Route path='/dashboard' element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>}
        />
        <Route path="/" element={<Navigate to={user ? "/dashboard" : "/login"} />} />
        <Route path="*" element={<Navigate to={user ? "/dashboard" : "/login"} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
