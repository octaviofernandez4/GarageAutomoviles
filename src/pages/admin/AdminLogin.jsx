import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import Button from "../../components/Button/Button.jsx";
import { useAdminAuth } from "../../context/AdminAuthContext.jsx";
import "./AdminLogin.css";

export default function AdminLogin() {
  const { status, login } = useAdminAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  if (status === "authenticated") {
    return <Navigate to={location.state?.from?.pathname || "/admin"} replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      await login(email, password);
      navigate(location.state?.from?.pathname || "/admin", { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="admin-login">
      <div className="admin-login__wrap">
        <Link to="/" className="admin-login__back">
          ← Volver al inicio
        </Link>

        <form className="admin-login__card" onSubmit={handleSubmit}>
          <div className="overline">El Garage · Admin</div>
          <h1 className="admin-login__title">Iniciar sesión</h1>

          <label className="admin-login__field">
            <span className="mono">Email</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="username"
              required
            />
          </label>

          <label className="admin-login__field">
            <span className="mono">Contraseña</span>
            <div className="admin-login__password-wrap">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
              />
              <button
                type="button"
                className="admin-login__toggle-password"
                onClick={() => setShowPassword((v) => !v)}
              >
                {showPassword ? "Ocultar" : "Ver"}
              </button>
            </div>
          </label>

          {error && <p className="admin-login__error">{error}</p>}

          <Button type="submit" variant="copper" className="admin-login__submit" disabled={submitting}>
            {submitting ? "Entrando..." : "Entrar"}
          </Button>
        </form>
      </div>
    </main>
  );
}
