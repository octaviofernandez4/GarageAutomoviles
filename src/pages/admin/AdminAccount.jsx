import { useState } from "react";
import Button from "../../components/Button/Button.jsx";
import { changePasswordRequest } from "../../api/auth.js";
import { PASSWORD_RULES, validatePassword } from "../../utils/passwordPolicy.js";
import { useAdminAuth } from "../../context/AdminAuthContext.jsx";
import "./AdminAccount.css";

export default function AdminAccount() {
  const { token, admin } = useAdminAuth();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const { valid, errors } = validatePassword(newPassword, { email: admin?.email, name: admin?.name });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (!valid) {
      setError("La nueva contraseña no cumple los requisitos.");
      return;
    }

    setSubmitting(true);
    try {
      await changePasswordRequest(token, currentPassword, newPassword);
      setSuccess(true);
      setCurrentPassword("");
      setNewPassword("");
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="admin-account">
      <h1 className="admin-account__title">Mi cuenta</h1>
      <p className="admin-account__subtitle mono">{admin?.email}</p>

      <form className="admin-account__form" onSubmit={handleSubmit}>
        <h2 className="admin-account__form-title">Cambiar contraseña</h2>

        <label className="admin-account__field">
          <span className="mono">Contraseña actual</span>
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            autoComplete="current-password"
            required
          />
        </label>

        <label className="admin-account__field">
          <span className="mono">Contraseña nueva</span>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            autoComplete="new-password"
            required
          />
        </label>

        <ul className="admin-account__rules">
          {PASSWORD_RULES.map((rule) => {
            const met = rule.test(newPassword);
            return (
              <li key={rule.key} className={met ? "admin-account__rule--met" : ""}>
                <span aria-hidden="true">{met ? "✓" : "○"}</span> {rule.label}
              </li>
            );
          })}
        </ul>

        {error && <p className="admin-account__error">{error}</p>}
        {success && <p className="admin-account__success">Contraseña actualizada.</p>}

        <Button
          type="submit"
          variant="copper"
          className="admin-account__submit"
          disabled={submitting || !newPassword || !currentPassword}
        >
          {submitting ? "Guardando..." : "Cambiar contraseña"}
        </Button>
      </form>
    </div>
  );
}
