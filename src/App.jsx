import { BrowserRouter, Routes, Route ,Link, Navigate} from "react-router-dom";
import Home from "./components/Home";
import Register from "./components/Register";
import Login from "./components/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import Dashboard from "./components/Dashboard";
import Complaint from "./components/Complaint";
import ComplaintReport from "./components/ComplaintReport";
import Logout from "./components/Logout";

import GpLogin from "./components/GpLogin";
import GpDashboard from "./components/GpDashboard";
import Headder from "./components/Headder";




import { useState, useEffect } from "react";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
  }, []);

  return (
    <BrowserRouter>
   <Headder/>

      <nav className="bg-blue-600 p-4 text-white flex gap-4">       
        {!isAuthenticated ? (
          <>
            <Link to="/register" className="hover:text-yellow-300">Register</Link>
             <Link to="/login" className="hover:text-yellow-300">Login</Link>
             <Link to="/gp" className="hover:text-yellow-300">Grama Panchayath Login</Link> 
             

          </>
        ) : (
          <>
            <Link to="/home" className="hover:text-yellow-300">Home</Link>
            <Link to="/complaint" className="hover:text-yellow-300">Complaint</Link>
            <Link to="/complaint-report" className="hover:text-yellow-300">Dashboard</Link>            
            <Link to="/logout" className="hover:text-yellow-300">Logout</Link>
          </>
        )}
      </nav>

      <Routes>
        {/* Add default and fallback routes to prevent blank pages */}
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />

        <Route path="/home" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/gp" element={<GpLogin />} />
        <Route path="/gpdashboard" element={
          <ProtectedRoute>
            <GpDashboard />
          </ProtectedRoute>
        } />
        <Route path="/complaint" element={
          <ProtectedRoute>
            <Complaint />
          </ProtectedRoute>
        } />
        <Route path="/complaint-report" element={
          <ProtectedRoute>
            <ComplaintReport />
          </ProtectedRoute>
        } />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />      

      </Routes>
    </BrowserRouter>
  );
}

export default App;