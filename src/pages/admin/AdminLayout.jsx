import { useCallback, useRef, useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { useAdminAuth } from "../../context/AdminAuthContext.jsx";
import "./AdminLayout.css";

export default function AdminLayout() {
  const { admin, logout } = useAdminAuth();
  const navigate = useNavigate();
  const [toast, setToast] = useState(null);
  const timeoutRef = useRef(null);

  const showToast = useCallback((message) => {
    clearTimeout(timeoutRef.current);
    setToast(message);
    timeoutRef.current = setTimeout(() => setToast(null), 2600);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  return (
    <div className="admin-layout">
      <header className="admin-layout__bar">
        <Link to="/admin" className="admin-layout__brand">
          El Garage · Admin
        </Link>
        <span className="admin-layout__section">Stock de vehículos</span>
        <div className="admin-layout__spacer" />
        <div className="admin-layout__user">
          <Link to="/admin/cuenta" className="admin-layout__user-link">
            {admin?.name}
          </Link>
          <button type="button" className="admin-layout__logout" onClick={handleLogout}>
            Salir
          </button>
        </div>
      </header>
      <main className="admin-layout__content">
        <Outlet context={{ showToast }} />
      </main>

      {toast && (
        <div className="admin-toast">
          <span className="admin-toast__dot" aria-hidden="true" />
          {toast}
        </div>
      )}
    </div>
  );
}
