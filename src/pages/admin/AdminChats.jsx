import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useOutletContext } from "react-router-dom";
import { ChevronLeftIcon, SendIcon } from "../../components/admin/icons.jsx";
import { DATE_RANGE_OPTIONS, isWithinDateRange } from "../../utils/dateRange.js";
import "./AdminChats.css";

function formatDate(value) {
  return new Date(value).toLocaleString("es-AR", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function initialsOf(name) {
  return (name || "?")
    .trim()
    .split(/\s+/)
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export default function AdminChats() {
  const { summary } = useOutletContext();
  const { sessions, status } = summary;
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedId, setSelectedId] = useState(null);
  const [mobileView, setMobileView] = useState("list");
  const [dateRange, setDateRange] = useState("all");
  const [onlyWithPhone, setOnlyWithPhone] = useState(false);

  useEffect(() => {
    const openId = location.state?.openSessionId;
    if (!openId) return;
    setDateRange("all");
    setOnlyWithPhone(false);
    setSelectedId(openId);
    setMobileView("detail");
    navigate(location.pathname, { replace: true, state: {} });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.state]);

  const visibleSessions = useMemo(
    () =>
      sessions.filter((s) => {
        if (onlyWithPhone && !s.visitorPhone) return false;
        return isWithinDateRange(s.lastAt, dateRange);
      }),
    [sessions, dateRange, onlyWithPhone]
  );

  useEffect(() => {
    if (visibleSessions.length === 0) return;
    if (!visibleSessions.some((s) => s.sessionId === selectedId)) {
      setSelectedId(visibleSessions[0].sessionId);
    }
  }, [visibleSessions, selectedId]);

  const selected = useMemo(
    () => sessions.find((s) => s.sessionId === selectedId) || null,
    [sessions, selectedId]
  );

  const whatsappLink = (session, textOverride) => {
    const digits = (session.visitorPhone || "").replace(/\D/g, "");
    const name = session.visitorName ? `Hola ${session.visitorName}, ` : "Hola, ";
    const text = textOverride || `${name}soy de El Garage Automóviles, te escribo por tu consulta en el chat de la web.`;
    return `https://wa.me/${digits}?text=${encodeURIComponent(text)}`;
  };

  const [composeText, setComposeText] = useState("");

  const handleCompose = (e) => {
    e.preventDefault();
    if (!selected || !selected.visitorPhone || !composeText.trim()) return;
    window.open(whatsappLink(selected, composeText.trim()), "_blank", "noreferrer");
    setComposeText("");
  };

  return (
    <div className="admin-chats">
      <div className="admin-chats__head">
        <h1 className="admin-chats__title">Conversaciones</h1>
        <p className="admin-chats__summary mono">
          {sessions.length} conversaciones · {sessions.reduce((n, s) => n + s.messages.length, 0)} mensajes
        </p>
      </div>

      {sessions.length > 0 && (
        <div className="admin-chats__toolbar">
          <div className="admin-chats__chips">
            {DATE_RANGE_OPTIONS.map((opt) => (
              <button
                key={opt.key}
                type="button"
                className={`admin-chats__chip ${dateRange === opt.key ? "admin-chats__chip--active" : ""}`}
                onClick={() => setDateRange(opt.key)}
              >
                {opt.label}
              </button>
            ))}
          </div>

          <label className="admin-chats__toggle">
            <input
              type="checkbox"
              checked={onlyWithPhone}
              onChange={(e) => setOnlyWithPhone(e.target.checked)}
            />
            Solo con WhatsApp
          </label>
        </div>
      )}

      {status === "loading" && <p className="admin-chats__state">Cargando...</p>}

      {status === "success" && sessions.length === 0 && (
        <p className="admin-chats__state">Todavía no hay conversaciones con el chatbot.</p>
      )}

      {status === "success" && sessions.length > 0 && visibleSessions.length === 0 && (
        <p className="admin-chats__state">Ninguna conversación coincide con estos filtros.</p>
      )}

      {status === "success" && visibleSessions.length > 0 && (
        <div
          className={`admin-chats__board ${mobileView === "detail" ? "admin-chats__board--mobile-detail" : ""}`}
        >
          <div className="admin-chats__list">
            {visibleSessions.map((session) => {
              const firstMessage = session.messages[0]?.userMessage || "";
              const isActive = session.sessionId === selectedId;
              return (
                <button
                  key={session.sessionId}
                  type="button"
                  className={`admin-chats__session ${isActive ? "admin-chats__session--active" : ""}`}
                  onClick={() => {
                    setSelectedId(session.sessionId);
                    setMobileView("detail");
                  }}
                >
                  <span className="admin-chats__session-avatar">{initialsOf(session.visitorName)}</span>
                  <span className="admin-chats__session-body">
                    <span className="admin-chats__session-name">
                      {session.visitorName || "Visitante sin nombre"}
                    </span>
                    <span className="admin-chats__session-preview">{firstMessage}</span>
                  </span>
                  <span className="admin-chats__session-meta">
                    {session.messages.length} · {formatDate(session.lastAt)}
                  </span>
                </button>
              );
            })}
          </div>

          {selected && (
            <div className="admin-chats__detail">
              <div className="admin-chats__detail-head">
                <button
                  type="button"
                  className="admin-chats__back"
                  onClick={() => setMobileView("list")}
                  aria-label="Volver a la lista"
                >
                  <ChevronLeftIcon />
                </button>
                <span className="admin-chats__detail-avatar">{initialsOf(selected.visitorName)}</span>
                <div className="admin-chats__detail-info">
                  <span className="admin-chats__detail-name">
                    {selected.visitorName || "Visitante sin nombre"}
                  </span>
                  <span className="admin-chats__detail-status">
                    {selected.visitorPhone ? "Cliente activo · WhatsApp" : "No dejó su WhatsApp"}
                  </span>
                </div>
                {selected.visitorPhone && (
                  <a
                    href={whatsappLink(selected)}
                    target="_blank"
                    rel="noreferrer"
                    className="admin-chats__whatsapp"
                  >
                    Continuar por WhatsApp
                  </a>
                )}
              </div>

              <div className="admin-chats__thread">
                {selected.messages.map((m) => (
                  <div key={m._id} className="admin-chats__exchange">
                    <div className="admin-chats__bubble admin-chats__bubble--user">{m.userMessage}</div>
                    <div className="admin-chats__bubble admin-chats__bubble--assistant">{m.assistantReply}</div>
                  </div>
                ))}
              </div>

              <form className="admin-chats__compose" onSubmit={handleCompose}>
                <input
                  type="text"
                  value={composeText}
                  onChange={(e) => setComposeText(e.target.value)}
                  placeholder={
                    selected.visitorPhone
                      ? "Escribe un mensaje…"
                      : "Este visitante no dejó su WhatsApp"
                  }
                  disabled={!selected.visitorPhone}
                />
                <button type="submit" disabled={!selected.visitorPhone || !composeText.trim()} aria-label="Enviar">
                  <SendIcon />
                </button>
              </form>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
