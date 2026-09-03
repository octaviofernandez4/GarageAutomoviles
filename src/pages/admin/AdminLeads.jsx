import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useOutletContext } from "react-router-dom";
import { DATE_RANGE_OPTIONS, isWithinDateRange } from "../../utils/dateRange.js";
import "./AdminLeads.css";

function formatDate(value) {
  return new Date(value).toLocaleString("es-AR", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function whatsappLink(lead) {
  const digits = (lead.telefono || "").replace(/\D/g, "");
  const text = lead.vehiculoNombre
    ? `Hola, te contacto de El Garage Automóviles por tu ${lead.modelo} ${lead.anio} y tu interés en el ${lead.vehiculoNombre}.`
    : `Hola, te contacto de El Garage Automóviles por la tasación de tu ${lead.modelo} ${lead.anio}.`;
  return `https://wa.me/${digits}?text=${encodeURIComponent(text)}`;
}

export default function AdminLeads() {
  const { summary } = useOutletContext();
  const { leads, status } = summary;
  const [query, setQuery] = useState("");
  const [dateRange, setDateRange] = useState("all");
  const [highlightId, setHighlightId] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const openId = location.state?.openLeadId;
    if (!openId) return;
    setDateRange("all");
    setQuery("");
    setHighlightId(openId);
    navigate(location.pathname, { replace: true, state: {} });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.state]);

  useEffect(() => {
    if (!highlightId) return;
    const el = document.getElementById(`lead-${highlightId}`);
    el?.scrollIntoView({ behavior: "smooth", block: "center" });
    const t = setTimeout(() => setHighlightId(null), 2400);
    return () => clearTimeout(t);
  }, [highlightId]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return leads.filter((lead) => {
      if (!isWithinDateRange(lead.createdAt, dateRange)) return false;
      if (!q) return true;
      return [lead.modelo, lead.telefono, lead.vehiculoNombre]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(q);
    });
  }, [leads, query, dateRange]);

  return (
    <div className="admin-leads">
      <div className="admin-leads__head">
        <h1 className="admin-leads__title">Tasaciones</h1>
        <p className="admin-leads__summary mono">{leads.length} pedidos recibidos</p>
      </div>

      {leads.length > 0 && (
        <div className="admin-leads__toolbar">
          <div className="admin-leads__search">
            <span className="admin-leads__search-icon" aria-hidden="true" />
            <input
              type="search"
              placeholder="Buscar por modelo o teléfono…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>

          <div className="admin-leads__chips">
            {DATE_RANGE_OPTIONS.map((opt) => (
              <button
                key={opt.key}
                type="button"
                className={`admin-leads__chip ${dateRange === opt.key ? "admin-leads__chip--active" : ""}`}
                onClick={() => setDateRange(opt.key)}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {status === "loading" && <p className="admin-leads__state">Cargando...</p>}
      {status === "success" && leads.length === 0 && (
        <p className="admin-leads__state">Todavía no llegó ningún pedido de tasación.</p>
      )}
      {status === "success" && leads.length > 0 && filtered.length === 0 && (
        <p className="admin-leads__state">Ninguna tasación coincide con estos filtros.</p>
      )}

      {status === "success" && filtered.length > 0 && (
        <div className="admin-leads__list">
          {filtered.map((lead) => (
            <div
              key={lead._id}
              id={`lead-${lead._id}`}
              className={`admin-leads__card ${lead._id === highlightId ? "admin-leads__card--highlight" : ""}`}
            >
              <div className="admin-leads__card-head">
                <div>
                  <div className="admin-leads__card-title">
                    {lead.modelo} ({lead.anio})
                  </div>
                  <div className="admin-leads__card-meta">{formatDate(lead.createdAt)}</div>
                </div>
                <a href={whatsappLink(lead)} target="_blank" rel="noreferrer" className="admin-leads__whatsapp">
                  Escribir por WhatsApp
                </a>
              </div>

              {lead.vehiculoNombre && (
                <div className="admin-leads__target">
                  <span className="mono">Quiere comprar</span> {lead.vehiculoNombre}
                </div>
              )}

              <div className="admin-leads__grid">
                <div>
                  <span className="mono">Teléfono</span>
                  <div>{lead.telefono}</div>
                </div>
                <div>
                  <span className="mono">Kilómetros</span>
                  <div>{lead.km != null ? lead.km.toLocaleString("es-AR") : "s/d"}</div>
                </div>
                <div>
                  <span className="mono">Estado</span>
                  <div>{lead.estado || "s/d"}</div>
                </div>
                {lead.historial && (
                  <div>
                    <span className="mono">Historial de service</span>
                    <div>{lead.historial}</div>
                  </div>
                )}
                {lead.neumaticos && (
                  <div>
                    <span className="mono">Neumáticos</span>
                    <div>{lead.neumaticos}</div>
                  </div>
                )}
                {/* "Busca llevarse" solo aplica a la tasación genérica: si ya eligió un auto puntual
                    (vehiculoNombre), mostrar además "busca" es contradictorio. */}
                {lead.busca && !lead.vehiculoNombre && (
                  <div>
                    <span className="mono">Busca llevarse</span>
                    <div>{lead.busca}</div>
                  </div>
                )}
              </div>

              {lead.detalles && (
                <div className="admin-leads__details">
                  <span className="mono">Detalles</span>
                  <p>{lead.detalles}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
