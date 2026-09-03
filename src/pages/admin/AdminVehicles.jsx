import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useOutletContext } from "react-router-dom";
import { fetchAdminVehicles, deleteVehicle, setVehicleStatus } from "../../api/vehiclesAdmin.js";
import { useAdminAuth } from "../../context/AdminAuthContext.jsx";
import { optimizedImage } from "../../utils/cloudinary.js";
import {
  CameraIcon,
  EyeIcon,
  EyeOffIcon,
  MoreIcon,
  PencilIcon,
  PlusIcon,
  SearchIcon,
  SlidersIcon,
} from "../../components/admin/icons.jsx";
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
  const [confirmingHide, setConfirmingHide] = useState(null);
  const [busyId, setBusyId] = useState(null);
  const [menuOpenId, setMenuOpenId] = useState(null);

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

  useEffect(() => {
    function onDocClick(e) {
      if (!e.target.closest(".admin-vehicles__menu")) setMenuOpenId(null);
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

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

  const activeFiltersCount = (statusFilter !== "all" ? 1 : 0) + (query.trim() ? 1 : 0);

  const handleResetFilters = () => {
    setStatusFilter("all");
    setQuery("");
  };

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

  const handleActionClick = (vehicle) => {
    if (vehicle.status === "publicado") {
      setConfirmingHide(vehicle);
    } else {
      handleToggleStatus(vehicle);
    }
  };

  const handleConfirmHide = async () => {
    if (!confirmingHide) return;
    await handleToggleStatus(confirmingHide);
    setConfirmingHide(null);
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
          <div className="admin-vehicles__title-row">
            <h1 className="admin-vehicles__title">Vehículos</h1>
            <span className="admin-vehicles__total-badge">{vehicles.length} Total</span>
          </div>
          <p className="admin-vehicles__subtitle">Control de stock y catálogo online</p>
        </div>
        <Link to="/admin/vehiculos/nuevo" className="admin-vehicles__new">
          + Nuevo
        </Link>
      </div>

      <div className="admin-vehicles__stats">
        <div className="admin-vehicles__stat">
          <div className="admin-vehicles__stat-head">
            <span className="admin-vehicles__stat-dot admin-vehicles__stat-dot--publicado" />
            <span className="admin-vehicles__stat-label mono">Publicados</span>
          </div>
          <span className="admin-vehicles__stat-value">{counts.publicado}</span>
        </div>
        <div className="admin-vehicles__stat">
          <div className="admin-vehicles__stat-head">
            <span className="admin-vehicles__stat-dot admin-vehicles__stat-dot--borrador" />
            <span className="admin-vehicles__stat-label mono">Borradores</span>
          </div>
          <span className="admin-vehicles__stat-value">{counts.borrador}</span>
        </div>
        <div className="admin-vehicles__stat">
          <div className="admin-vehicles__stat-head">
            <span className="admin-vehicles__stat-dot admin-vehicles__stat-dot--vendido" />
            <span className="admin-vehicles__stat-label mono">Vendidos</span>
          </div>
          <span className="admin-vehicles__stat-value">{counts.vendido}</span>
        </div>
      </div>

      <div className="admin-vehicles__toolbar">
        <div className="admin-vehicles__search">
          <SearchIcon className="admin-vehicles__search-icon" />
          <input
            type="search"
            placeholder="Buscar marca, modelo, año…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        <button
          type="button"
          className="admin-vehicles__filter-btn"
          onClick={handleResetFilters}
          disabled={activeFiltersCount === 0}
          title={activeFiltersCount > 0 ? "Limpiar filtros" : "Sin filtros activos"}
        >
          <SlidersIcon />
          {activeFiltersCount > 0 && <span className="admin-vehicles__filter-badge">{activeFiltersCount}</span>}
        </button>
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

      <div className="admin-vehicles__sort-row">
        <label className="admin-vehicles__sort-label">
          <span className="mono">Orden:</span>
          <select className="admin-vehicles__sort" value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="priceDesc">Precio: mayor a menor</option>
            <option value="priceAsc">Precio: menor a mayor</option>
            <option value="yearDesc">Año más nuevo</option>
            <option value="nameAsc">Nombre A–Z</option>
          </select>
        </label>
        <span className="admin-vehicles__showing mono">Mostrando {filtered.length}</span>
      </div>

      {status === "loading" && <p className="admin-vehicles__state">Cargando...</p>}
      {status === "error" && (
        <p className="admin-vehicles__state">No pudimos cargar el listado. ¿Está corriendo el backend?</p>
      )}

      {status === "success" && (
        <div className="admin-vehicles__cards">
          {filtered.map((vehicle) => (
            <div key={vehicle.id} className="admin-vehicles__vcard">
              <div className="admin-vehicles__vcard-thumb">
                {vehicle.images?.[0] ? (
                  <img src={optimizedImage(vehicle.images[0], 200)} alt="" />
                ) : (
                  <span className="mono">Sin foto</span>
                )}
                {vehicle.images?.length > 0 && (
                  <span className="admin-vehicles__vcard-photos">
                    <CameraIcon />
                    {vehicle.images.length}
                  </span>
                )}
                {vehicle.featured && <span className="admin-vehicles__vcard-featured">Destacado</span>}
              </div>

              <div className="admin-vehicles__vcard-body">
                <div className="admin-vehicles__vcard-head">
                  <span className="admin-vehicles__vcard-name">{vehicle.name}</span>
                  <span className={`admin-vehicles__pill admin-vehicles__pill--${vehicle.status}`}>
                    <span className="admin-vehicles__pill-dot" aria-hidden="true" />
                    {STATUS_LABEL[vehicle.status]}
                  </span>
                </div>

                <div className="admin-vehicles__vcard-meta mono">
                  {vehicle.brand} · {vehicle.body} · {vehicle.year} · {vehicle.km ? `${vehicle.km.toLocaleString("es-AR")} km` : "s/d"}
                </div>

                <div className="admin-vehicles__vcard-price">
                  <span className="mono">Precio venta</span>
                  <strong>{formatMoney(vehicle.price)}</strong>
                </div>

                <div className="admin-vehicles__vcard-actions">
                  <Link to={`/admin/vehiculos/${vehicle.id}/editar`} className="admin-vehicles__vcard-btn">
                    <PencilIcon />
                    Editar ficha
                  </Link>
                  <button
                    type="button"
                    className="admin-vehicles__vcard-btn"
                    disabled={busyId === vehicle.id}
                    onClick={() => handleActionClick(vehicle)}
                  >
                    {vehicle.status === "publicado" ? (
                      <>
                        <EyeOffIcon />
                        Ocultar
                      </>
                    ) : (
                      <>
                        <EyeIcon />
                        Publicar
                      </>
                    )}
                  </button>

                  <div className="admin-vehicles__menu">
                    <button
                      type="button"
                      className="admin-vehicles__vcard-more"
                      onClick={() => setMenuOpenId(menuOpenId === vehicle.id ? null : vehicle.id)}
                      aria-label="Más opciones"
                    >
                      <MoreIcon />
                    </button>
                    {menuOpenId === vehicle.id && (
                      <div className="admin-vehicles__menu-panel">
                        <button
                          type="button"
                          className="admin-vehicles__menu-delete"
                          onClick={() => {
                            setMenuOpenId(null);
                            setConfirming(vehicle);
                          }}
                        >
                          Borrar vehículo
                        </button>
                      </div>
                    )}
                  </div>
                </div>
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

      <Link to="/admin/vehiculos/nuevo" className="admin-vehicles__fab" aria-label="Nuevo vehículo">
        <PlusIcon />
      </Link>

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

      {confirmingHide && (
        <div className="admin-modal-overlay" onClick={() => setConfirmingHide(null)}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <h2 className="admin-modal__title">¿Ocultar este vehículo?</h2>
            <p className="admin-modal__text">
              {confirmingHide.name} va a pasar a borrador y va a dejar de verse en la web hasta que lo
              vuelvas a publicar.
            </p>
            <div className="admin-modal__actions">
              <button type="button" className="admin-modal__cancel" onClick={() => setConfirmingHide(null)}>
                Cancelar
              </button>
              <button
                type="button"
                className="admin-modal__confirm admin-modal__confirm--accent"
                onClick={handleConfirmHide}
                disabled={busyId === confirmingHide.id}
              >
                Sí, ocultar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
