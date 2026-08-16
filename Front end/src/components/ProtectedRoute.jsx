import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedRoute() {
  const { user, initializing } = useSelector((state) => state.auth);

  if (initializing) return null;

  return user ? <Outlet /> : <Navigate to="/login" replace />;
}
