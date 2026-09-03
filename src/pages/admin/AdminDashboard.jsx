import { Link, useOutletContext } from "react-router-dom";
import { useAdminAuth } from "../../context/AdminAuthContext.jsx";
import "./AdminDashboard.css";

function formatDate(value) {
  return new Date(value).toLocaleString("es-AR", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatDay() {
  const today = new Date().toLocaleDateString("es-AR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
  return today.charAt(0).toUpperCase() + today.slice(1);
}

export default function AdminDashboard() {
  const { admin } = useAdminAuth();
  const { summary } = useOutletContext();
  const { vehicles, leads, sessions, status } = summary;

  const counts = {
    publicado: vehicles.filter((v) => v.status === "publicado").length,
    borrador: vehicles.filter((v) => v.status === "borrador").length,
    vendido: vehicles.filter((v) => v.status === "vendido").length,
  };

  const recentLeads = leads.slice(0, 5);
  const recentSessions = sessions.slice(0, 5);

  return (
    <div className="admin-dashboard">
      <div className="admin-dashboard__head">
        <div>
          <h1 className="admin-dashboard__title">Hola, {admin?.name || "administrador"}</h1>
          <p className="admin-dashboard__date">{formatDay()}</p>
        </div>
      </div>

      {status === "loading" && <p className="admin-dashboard__state">Cargando...</p>}

      {status === "success" && (
        <>
          <div className="admin-dashboard__stats">
            <div className="admin-dashboard__stat">
              <span className="admin-dashboard__stat-value">{counts.publicado}</span>
              <span className="admin-dashboard__stat-label mono">Publicados</span>
            </div>
            <div className="admin-dashboard__stat">
              <span className="admin-dashboard__stat-value">{counts.borrador}</span>
              <span className="admin-dashboard__stat-label mono">Borradores</span>
            </div>
            <div className="admin-dashboard__stat">
              <span className="admin-dashboard__stat-value">{counts.vendido}</span>
              <span className="admin-dashboard__stat-label mono">Vendidos</span>
            </div>
            <div className="admin-dashboard__stat admin-dashboard__stat--accent">
              <span className="admin-dashboard__stat-value">{leads.length}</span>
              <span className="admin-dashboard__stat-label mono">Tasaciones</span>
            </div>
            <div className="admin-dashboard__stat admin-dashboard__stat--accent">
              <span className="admin-dashboard__stat-value">{sessions.length}</span>
              <span className="admin-dashboard__stat-label mono">Conversaciones</span>
            </div>
          </div>

          <div className="admin-dashboard__panels">
            <section className="admin-dashboard__panel">
              <div className="admin-dashboard__panel-head">
                <h2>Últimas tasaciones</h2>
                <Link to="/admin/tasaciones">Ver todas →</Link>
              </div>
              {recentLeads.length === 0 && <p className="admin-dashboard__empty">Todavía no llegó ningún pedido.</p>}
              <ul className="admin-dashboard__list">
                {recentLeads.map((lead) => (
                  <li key={lead._id}>
                    <div>
                      <span className="admin-dashboard__list-title">
                        {lead.modelo} ({lead.anio})
                      </span>
                      <span className="admin-dashboard__list-meta">{formatDate(lead.createdAt)}</span>
                    </div>
                    <span className="admin-dashboard__list-tag">{lead.telefono}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section className="admin-dashboard__panel">
              <div className="admin-dashboard__panel-head">
                <h2>Últimas conversaciones</h2>
                <Link to="/admin/chats">Ver todas →</Link>
              </div>
              {recentSessions.length === 0 && (
                <p className="admin-dashboard__empty">Todavía no hay conversaciones con el chatbot.</p>
              )}
              <ul className="admin-dashboard__list">
                {recentSessions.map((session) => (
                  <li key={session.sessionId}>
                    <div>
                      <span className="admin-dashboard__list-title">
                        {session.visitorName || "Visitante sin nombre"}
                      </span>
                      <span className="admin-dashboard__list-meta">{formatDate(session.lastAt)}</span>
                    </div>
                    <span className="admin-dashboard__list-tag">{session.messages.length} msj</span>
                  </li>
                ))}
              </ul>
            </section>
          </div>
        </>
      )}
    </div>
  );
}
