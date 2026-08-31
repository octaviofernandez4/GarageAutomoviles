import { Navigate, useLocation } from "react-router-dom";
import { useAdminAuth } from "../../context/AdminAuthContext.jsx";

export default function RequireAdmin({ children }) {
  const { status } = useAdminAuth();
  const location = useLocation();

  if (status === "loading") {
    return <div className="admin-loading">Cargando...</div>;
  }

  if (status === "anonymous") {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return children;
}
