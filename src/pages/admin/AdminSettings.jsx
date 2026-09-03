import { useState } from "react";
import Button from "../../components/Button/Button.jsx";
import { changePasswordRequest } from "../../api/auth.js";
import { PASSWORD_RULES, validatePassword } from "../../utils/passwordPolicy.js";
import { useAdminAuth } from "../../context/AdminAuthContext.jsx";
import "./AdminSettings.css";

export default function AdminSettings() {
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
    <div className="admin-settings">
      <h1 className="admin-settings__title">Ajustes</h1>
      <p className="admin-settings__subtitle mono">{admin?.email}</p>

      <form className="admin-settings__form" onSubmit={handleSubmit}>
        <h2 className="admin-settings__form-title">Cambiar contraseña</h2>

        <label className="admin-settings__field">
          <span className="mono">Contraseña actual</span>
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            autoComplete="current-password"
            required
          />
        </label>

        <label className="admin-settings__field">
          <span className="mono">Contraseña nueva</span>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            autoComplete="new-password"
            required
          />
        </label>

        <ul className="admin-settings__rules">
          {PASSWORD_RULES.map((rule) => {
            const met = rule.test(newPassword);
            return (
              <li key={rule.key} className={met ? "admin-settings__rule--met" : ""}>
                <span aria-hidden="true">{met ? "✓" : "○"}</span> {rule.label}
              </li>
            );
          })}
        </ul>

        {error && <p className="admin-settings__error">{error}</p>}
        {success && <p className="admin-settings__success">Contraseña actualizada.</p>}

        <Button
          type="submit"
          variant="copper"
          className="admin-settings__submit"
          disabled={submitting || !newPassword || !currentPassword}
        >
          {submitting ? "Guardando..." : "Cambiar contraseña"}
        </Button>
      </form>
    </div>
  );
}
