import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");

  // Redirect to /login instead of / (which doesn't exist)
  return token ? children : <Navigate to="/login" />;
}