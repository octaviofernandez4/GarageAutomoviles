import { useEffect, useMemo, useState } from "react";
import { Link, useOutletContext } from "react-router-dom";
import { fetchAdminVehicles, deleteVehicle, setVehicleStatus } from "../../api/vehiclesAdmin.js";
import { useAdminAuth } from "../../context/AdminAuthContext.jsx";
import "./AdminVehicles.css";

const STATUS_LABEL = { publicado: "Publicado", borrador: "Borrador", vendido: "Vendido" };
const STATUS_FILTERS = [
  { key: "all", label: "Todos" },
  { key: "publicado", label: "Publicados" },
  { key: "borrador", label: "Borradores" },
  { key: "vendido", label: "Vendidos" },
];

const SORTERS = {
  priceDesc: (a, b) => b.price - a.price,
  priceAsc: (a, b) => a.price - b.price,
  yearDesc: (a, b) => b.year - a.year,
  nameAsc: (a, b) => a.name.localeCompare(b.name),
};

function formatMoney(value) {
  return `US$ ${Number(value || 0).toLocaleString("es-AR")}`;
}

export default function AdminVehicles() {
  const { token } = useAdminAuth();
  const { showToast } = useOutletContext();
  const [vehicles, setVehicles] = useState([]);
  const [status, setStatus] = useState("loading");
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sort, setSort] = useState("priceDesc");
  const [confirming, setConfirming] = useState(null);
  const [busyId, setBusyId] = useState(null);

  const load = () => {
    setStatus("loading");
    fetchAdminVehicles(token)
      .then((data) => {
        setVehicles(data);
        setStatus("success");
      })
      .catch(() => setStatus("error"));
  };

  useEffect(load, []);

  const counts = useMemo(
    () => ({
      all: vehicles.length,
      publicado: vehicles.filter((v) => v.status === "publicado").length,
      borrador: vehicles.filter((v) => v.status === "borrador").length,
      vendido: vehicles.filter((v) => v.status === "vendido").length,
    }),
    [vehicles]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = vehicles;
    if (statusFilter !== "all") {
      list = list.filter((v) => v.status === statusFilter);
    }
    if (q) {
      list = list.filter((v) => [v.name, v.brand, v.body].join(" ").toLowerCase().includes(q));
    }
    return [...list].sort(SORTERS[sort]);
  }, [vehicles, statusFilter, query, sort]);

  const handleToggleStatus = async (vehicle) => {
    const target = vehicle.status === "publicado" ? "borrador" : "publicado";
    setBusyId(vehicle.id);
    try {
      const updated = await setVehicleStatus(token, vehicle.id, target);
      setVehicles((prev) => prev.map((v) => (v.id === vehicle.id ? updated : v)));
      showToast("Cambios guardados");
    } catch (err) {
      showToast(err.message);
    } finally {
      setBusyId(null);
    }
  };

  const handleDelete = async () => {
    if (!confirming) return;
    setBusyId(confirming.id);
    try {
      await deleteVehicle(token, confirming.id);
      setVehicles((prev) => prev.filter((v) => v.id !== confirming.id));
      showToast("Vehículo borrado");
    } catch (err) {
      showToast(err.message);
    } finally {
      setBusyId(null);
      setConfirming(null);
    }
  };

  return (
    <div className="admin-vehicles">
      <div className="admin-vehicles__head">
        <div>
          <h1 className="admin-vehicles__title">Vehículos</h1>
          <p className="admin-vehicles__summary mono">
            {counts.publicado} publicados · {counts.borrador} en borrador · {counts.vendido} vendidos
          </p>
        </div>
        <Link to="/admin/vehiculos/nuevo" className="admin-vehicles__new">
          + Nuevo vehículo
        </Link>
      </div>

      <div className="admin-vehicles__toolbar">
        <div className="admin-vehicles__search">
          <span className="admin-vehicles__search-icon" aria-hidden="true" />
          <input
            type="search"
            placeholder="Buscar por nombre, marca o carrocería…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        <div className="admin-vehicles__chips">
          {STATUS_FILTERS.map((f) => (
            <button
              key={f.key}
              type="button"
              className={`admin-vehicles__chip ${statusFilter === f.key ? "admin-vehicles__chip--active" : ""}`}
              onClick={() => setStatusFilter(f.key)}
            >
              {f.label} ({counts[f.key]})
            </button>
          ))}
        </div>

        <select className="admin-vehicles__sort" value={sort} onChange={(e) => setSort(e.target.value)}>
          <option value="priceDesc">Precio: mayor a menor</option>
          <option value="priceAsc">Precio: menor a mayor</option>
          <option value="yearDesc">Año más nuevo</option>
          <option value="nameAsc">Nombre A–Z</option>
        </select>
      </div>

      {status === "loading" && <p className="admin-vehicles__state">Cargando...</p>}
      {status === "error" && (
        <p className="admin-vehicles__state">No pudimos cargar el listado. ¿Está corriendo el backend?</p>
      )}

      {status === "success" && (
        <div className="admin-vehicles__table">
          <div className="admin-vehicles__row admin-vehicles__row--head mono">
            <span>Foto</span>
            <span>Vehículo</span>
            <span className="admin-vehicles__col-price">Precio</span>
            <span className="admin-vehicles__col-status">Estado</span>
            <span className="admin-vehicles__col-actions">Acciones</span>
          </div>

          {filtered.map((vehicle) => (
            <div key={vehicle.id} className="admin-vehicles__row">
              <div className="admin-vehicles__thumb">
                {vehicle.images?.[0] ? (
                  <img src={vehicle.images[0]} alt="" />
                ) : (
                  <span className="mono">{vehicle.images?.length || 0} fotos</span>
                )}
              </div>

              <div className="admin-vehicles__info">
                <div className="admin-vehicles__name">{vehicle.name}</div>
                <div className="admin-vehicles__meta mono">
                  {vehicle.brand} · {vehicle.body} · {vehicle.year}
                </div>
              </div>

              <div className="admin-vehicles__col-price admin-vehicles__price">
                {formatMoney(vehicle.price)}
              </div>

              <div className="admin-vehicles__col-status">
                <span className={`admin-vehicles__pill admin-vehicles__pill--${vehicle.status}`}>
                  <span className="admin-vehicles__pill-dot" aria-hidden="true" />
                  {STATUS_LABEL[vehicle.status]}
                </span>
              </div>

              <div className="admin-vehicles__col-actions admin-vehicles__actions">
                <button
                  type="button"
                  className="admin-vehicles__action"
                  disabled={busyId === vehicle.id}
                  onClick={() => handleToggleStatus(vehicle)}
                >
                  {vehicle.status === "publicado" ? "Ocultar" : "Publicar"}
                </button>
                <Link to={`/admin/vehiculos/${vehicle.id}/editar`} className="admin-vehicles__action admin-vehicles__action--edit">
                  Editar
                </Link>
                <button
                  type="button"
                  className="admin-vehicles__action admin-vehicles__action--delete"
                  disabled={busyId === vehicle.id}
                  onClick={() => setConfirming(vehicle)}
                >
                  Borrar
                </button>
              </div>
            </div>
          ))}

          {filtered.length === 0 && (
            <div className="admin-vehicles__empty">
              <p className="admin-vehicles__empty-title">Sin resultados</p>
              <p className="admin-vehicles__empty-desc">Probá con otra búsqueda o cambiá el filtro de estado.</p>
            </div>
          )}
        </div>
      )}

      {confirming && (
        <div className="admin-modal-overlay" onClick={() => setConfirming(null)}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <h2 className="admin-modal__title">¿Borrar este vehículo?</h2>
            <p className="admin-modal__text">
              {confirming.name} se va a eliminar del stock y dejar de verse en la web. No se puede
              deshacer.
            </p>
            <div className="admin-modal__actions">
              <button type="button" className="admin-modal__cancel" onClick={() => setConfirming(null)}>
                Cancelar
              </button>
              <button type="button" className="admin-modal__confirm" onClick={handleDelete}>
                Sí, borrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
