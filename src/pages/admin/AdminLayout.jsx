import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAdminAuth } from "../../context/AdminAuthContext.jsx";
import { fetchAdminVehicles } from "../../api/vehiclesAdmin.js";
import { fetchTradeInLeads } from "../../api/tradeInAdmin.js";
import { fetchChatLogs } from "../../api/chat.js";
import { groupChatSessions } from "../../utils/chatSessions.js";
import {
  BellIcon,
  CarIcon,
  ChatIcon,
  DashboardIcon,
  DocIcon,
  GearIcon,
  LogoutIcon,
  MenuIcon,
  SearchIcon,
  SparkleIcon,
} from "../../components/admin/icons.jsx";
import SimulateChatModal from "./SimulateChatModal.jsx";
import "./adminTheme.css";
import "./AdminLayout.css";

const TYPE_LABEL = { vehiculo: "Auto", tasacion: "Tasación", conversacion: "Chat" };

function formatRelative(value) {
  const diffMs = Date.now() - new Date(value).getTime();
  const minutes = Math.floor(diffMs / 60000);
  if (minutes < 1) return "ahora";
  if (minutes < 60) return `hace ${minutes}m`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `hace ${hours}h`;
  const days = Math.floor(hours / 24);
  return `hace ${days}d`;
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

export default function AdminLayout() {
  const { admin, token, logout } = useAdminAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [toast, setToast] = useState(null);
  const toastTimeoutRef = useRef(null);

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [vehicles, setVehicles] = useState([]);
  const [leads, setLeads] = useState([]);
  const [chatLogs, setChatLogs] = useState([]);
  const [summaryStatus, setSummaryStatus] = useState("loading");

  const [query, setQuery] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [simulateOpen, setSimulateOpen] = useState(false);
  const searchBoxRef = useRef(null);
  const notifRef = useRef(null);

  const showToast = useCallback((message) => {
    clearTimeout(toastTimeoutRef.current);
    setToast(message);
    toastTimeoutRef.current = setTimeout(() => setToast(null), 2600);
  }, []);

  const load = useCallback(() => {
    if (!token) return;
    Promise.allSettled([fetchAdminVehicles(token), fetchTradeInLeads(token), fetchChatLogs(token)]).then(
      ([vehiclesRes, leadsRes, chatsRes]) => {
        if (vehiclesRes.status === "fulfilled") setVehicles(vehiclesRes.value);
        if (leadsRes.status === "fulfilled") setLeads(leadsRes.value);
        if (chatsRes.status === "fulfilled") setChatLogs(chatsRes.value);
        setSummaryStatus("success");
      }
    );
  }, [token]);

  useEffect(() => {
    load();
    const interval = setInterval(load, 60000);
    return () => clearInterval(interval);
  }, [load]);

  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    function onDocClick(e) {
      if (searchBoxRef.current && !searchBoxRef.current.contains(e.target)) setSearchFocused(false);
      if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  const sessions = useMemo(() => groupChatSessions(chatLogs), [chatLogs]);

  const searchIndex = useMemo(() => {
    const items = [];
    vehicles.forEach((v) =>
      items.push({
        type: "vehiculo",
        id: v.id,
        label: v.name,
        sublabel: [v.brand, v.body].filter(Boolean).join(" · "),
        path: "/admin/vehiculos",
      })
    );
    leads.forEach((l) =>
      items.push({
        type: "tasacion",
        id: l._id,
        label: `${l.modelo} (${l.anio})`,
        sublabel: l.telefono,
        path: "/admin/tasaciones",
      })
    );
    sessions.forEach((s) =>
      items.push({
        type: "conversacion",
        id: s.sessionId,
        label: s.visitorName || "Visitante sin nombre",
        sublabel: s.messages[0]?.userMessage || "",
        path: "/admin/chats",
      })
    );
    return items;
  }, [vehicles, leads, sessions]);

  const searchResults = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return searchIndex
      .filter((item) => `${item.label} ${item.sublabel}`.toLowerCase().includes(q))
      .slice(0, 8);
  }, [query, searchIndex]);

  const notifications = useMemo(() => {
    const items = [];
    leads.forEach((l) =>
      items.push({
        id: `lead-${l._id}`,
        type: "tasacion",
        title: `Nueva tasación: ${l.modelo} (${l.anio})`,
        date: l.createdAt,
        path: "/admin/tasaciones",
        targetId: l._id,
      })
    );
    sessions.forEach((s) =>
      items.push({
        id: `chat-${s.sessionId}`,
        type: "conversacion",
        title: `${s.visitorName || "Visitante"}: ${s.messages[0]?.userMessage || "nuevo mensaje"}`,
        date: s.lastAt,
        path: "/admin/chats",
        targetId: s.sessionId,
      })
    );
    return items.sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 6);
  }, [leads, sessions]);

  const NAV_ITEMS = [
    { to: "/admin", end: true, label: "Dashboard", Icon: DashboardIcon },
    { to: "/admin/chats", label: "Conversaciones", Icon: ChatIcon, badge: sessions.length },
    { to: "/admin/tasaciones", label: "Tasaciones", Icon: DocIcon, badge: leads.length },
    { to: "/admin/vehiculos", label: "Vehículos", Icon: CarIcon },
    { to: "/admin/ajustes", label: "Ajustes", Icon: GearIcon },
  ];

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  const goToResult = (item) => {
    setQuery("");
    setSearchFocused(false);
    navigate(item.path);
  };

  const goToNotification = (n) => {
    setNotifOpen(false);
    if (n.type === "tasacion") {
      navigate(n.path, { state: { openLeadId: n.targetId } });
    } else if (n.type === "conversacion") {
      navigate(n.path, { state: { openSessionId: n.targetId } });
    } else {
      navigate(n.path);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setSearchFocused(false);
  };

  return (
    <div className="admin-shell">
      {sidebarOpen && <div className="admin-shell__backdrop" onClick={() => setSidebarOpen(false)} />}

      <aside className={`admin-shell__sidebar ${sidebarOpen ? "admin-shell__sidebar--open" : ""}`}>
        <Link to="/admin" className="admin-shell__brand">
          <span className="admin-shell__brand-dot" aria-hidden="true" />
          <span className="admin-shell__brand-text">El Garage</span>
        </Link>

        <nav className="admin-shell__nav">
          {NAV_ITEMS.map(({ to, end, label, Icon, badge }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              title={label}
              className={({ isActive }) => `admin-shell__nav-link ${isActive ? "admin-shell__nav-link--active" : ""}`}
            >
              <Icon className="admin-shell__nav-icon" />
              <span className="admin-shell__nav-label">{label}</span>
              {!!badge && <span className="admin-shell__nav-badge">{badge}</span>}
            </NavLink>
          ))}
        </nav>

        <Link to="/admin/ajustes" className="admin-shell__user">
          <span className="admin-shell__user-avatar">{initialsOf(admin?.name)}</span>
          <span className="admin-shell__user-info">
            <span className="admin-shell__user-name">{admin?.name}</span>
            <span className="admin-shell__user-email">{admin?.email}</span>
          </span>
          <button
            type="button"
            className="admin-shell__logout"
            onClick={(e) => {
              e.preventDefault();
              handleLogout();
            }}
            aria-label="Cerrar sesión"
            title="Cerrar sesión"
          >
            <LogoutIcon />
          </button>
        </Link>
      </aside>

      <div className="admin-shell__main">
        <header className="admin-shell__topbar">
          <button
            type="button"
            className="admin-shell__menu-btn"
            onClick={() => setSidebarOpen(true)}
            aria-label="Abrir menú"
          >
            <MenuIcon />
          </button>

          <form className="admin-shell__search" ref={searchBoxRef} onSubmit={handleSearchSubmit}>
            <SearchIcon className="admin-shell__search-icon" />
            <input
              type="search"
              placeholder="Buscar vehículos, tasaciones, clientes…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setSearchFocused(true)}
            />
            {query.trim() && (
              <button type="submit" className="admin-shell__search-submit">
                Buscar
              </button>
            )}
            {searchFocused && query.trim() && (
              <div className="admin-shell__search-results">
                {searchResults.length === 0 && (
                  <div className="admin-shell__search-empty">Sin resultados para "{query}"</div>
                )}
                {searchResults.map((item) => (
                  <button
                    key={`${item.type}-${item.id}`}
                    type="button"
                    className="admin-shell__search-item"
                    onClick={() => goToResult(item)}
                  >
                    <span className={`admin-shell__search-tag admin-shell__search-tag--${item.type}`}>
                      {TYPE_LABEL[item.type]}
                    </span>
                    <span className="admin-shell__search-text">
                      <span className="admin-shell__search-label">{item.label}</span>
                      {item.sublabel && <span className="admin-shell__search-sublabel">{item.sublabel}</span>}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </form>

          <div className="admin-shell__topbar-actions">
            <button type="button" className="admin-shell__simulate" onClick={() => setSimulateOpen(true)}>
              <SparkleIcon />
              <span>Simular Asistente Chat</span>
            </button>

            <div className="admin-shell__notif" ref={notifRef}>
              <button
                type="button"
                className="admin-shell__bell"
                onClick={() => setNotifOpen((v) => !v)}
                aria-label="Notificaciones"
              >
                <BellIcon />
                {notifications.length > 0 && <span className="admin-shell__bell-badge">{notifications.length}</span>}
              </button>

              {notifOpen && (
                <div className="admin-shell__notif-panel">
                  <div className="admin-shell__notif-head mono">Actividad reciente</div>
                  {notifications.length === 0 && (
                    <div className="admin-shell__notif-empty">Sin novedades todavía.</div>
                  )}
                  {notifications.map((n) => (
                    <button
                      key={n.id}
                      type="button"
                      className="admin-shell__notif-item"
                      onClick={() => goToNotification(n)}
                    >
                      <span className={`admin-shell__notif-dot admin-shell__notif-dot--${n.type}`} aria-hidden="true" />
                      <span className="admin-shell__notif-text">{n.title}</span>
                      <span className="admin-shell__notif-time">{formatRelative(n.date)}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="admin-shell__content">
          <Outlet
            context={{
              showToast,
              summary: { vehicles, leads, chatLogs, sessions, status: summaryStatus, refresh: load },
            }}
          />
        </main>
      </div>

      {toast && (
        <div className="admin-toast">
          <span className="admin-toast__dot" aria-hidden="true" />
          {toast}
        </div>
      )}

      {simulateOpen && <SimulateChatModal onClose={() => setSimulateOpen(false)} />}
    </div>
  );
}
