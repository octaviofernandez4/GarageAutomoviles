import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAdminAuth } from "../../context/AdminAuthContext.jsx";
import "./AdminLayout.css";

export default function AdminLayout() {
  const { admin, logout } = useAdminAuth();
  const navigate = useNavigate();

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
        <nav className="admin-layout__nav">
          <NavLink
            to="/admin"
            end
            className={({ isActive }) => (isActive ? "admin-layout__link--active" : "")}
          >
            Vehículos
          </NavLink>
          <NavLink
            to="/admin/cuenta"
            className={({ isActive }) => (isActive ? "admin-layout__link--active" : "")}
          >
            Mi cuenta
          </NavLink>
        </nav>
        <div className="admin-layout__user">
          <span className="mono">{admin?.name}</span>
          <button type="button" className="admin-layout__logout" onClick={handleLogout}>
            Salir
          </button>
        </div>
      </header>
      <main className="admin-layout__content">
        <Outlet />
      </main>
    </div>
  );
}
