import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { fetchVehicles } from "../../api/vehicles.js";
import { deleteVehicle } from "../../api/vehiclesAdmin.js";
import { formatMoney } from "../../utils/format.js";
import { useAdminAuth } from "../../context/AdminAuthContext.jsx";
import "./AdminVehicles.css";

export default function AdminVehicles() {
  const { token } = useAdminAuth();
  const [vehicles, setVehicles] = useState([]);
  const [status, setStatus] = useState("loading");
  const [query, setQuery] = useState("");
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState("");

  const load = () => {
    setStatus("loading");
    fetchVehicles()
      .then((data) => {
        setVehicles(data);
        setStatus("success");
      })
      .catch(() => setStatus("error"));
  };

  useEffect(load, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return vehicles;
    return vehicles.filter((v) =>
      [v.name, v.brand, v.body, v.id].join(" ").toLowerCase().includes(q)
    );
  }, [vehicles, query]);

  const handleDelete = async (vehicle) => {
    if (!window.confirm(`¿Borrar "${vehicle.name}"? Esta acción no se puede deshacer.`)) return;

    setError("");
    setDeletingId(vehicle.id);
    try {
      await deleteVehicle(token, vehicle.id);
      setVehicles((prev) => prev.filter((v) => v.id !== vehicle.id));
    } catch (err) {
      setError(err.message);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="admin-vehicles">
      <div className="admin-vehicles__head">
        <h1 className="admin-vehicles__title">Vehículos ({vehicles.length})</h1>
        <Link to="/admin/vehiculos/nuevo" className="btn btn--copper admin-vehicles__new">
          + Nuevo vehículo
        </Link>
      </div>

      <input
        type="search"
        className="admin-vehicles__search"
        placeholder="Buscar por nombre, marca o carrocería..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      {error && <p className="admin-vehicles__error">{error}</p>}

      {status === "loading" && <p className="admin-vehicles__state">Cargando...</p>}
      {status === "error" && (
        <p className="admin-vehicles__state">No pudimos cargar el listado. ¿Está corriendo el backend?</p>
      )}

      {status === "success" && (
        <div className="admin-vehicles__table">
          {filtered.map((vehicle) => (
            <div key={vehicle.id} className="admin-vehicles__row">
              <img
                src={vehicle.images?.[0]}
                alt={vehicle.name}
                className="admin-vehicles__thumb"
              />
              <div className="admin-vehicles__info">
                <div className="admin-vehicles__name">{vehicle.name}</div>
                <div className="admin-vehicles__meta mono">
                  {vehicle.brand} · {vehicle.body} · {vehicle.year}
                </div>
              </div>
              <div className="admin-vehicles__price">{formatMoney(vehicle.price)}</div>
              <div className="admin-vehicles__actions">
                <Link to={`/admin/vehiculos/${vehicle.id}/editar`} className="admin-vehicles__edit">
                  Editar
                </Link>
                <button
                  type="button"
                  className="admin-vehicles__delete"
                  disabled={deletingId === vehicle.id}
                  onClick={() => handleDelete(vehicle)}
                >
                  {deletingId === vehicle.id ? "Borrando..." : "Borrar"}
                </button>
              </div>
            </div>
          ))}

          {filtered.length === 0 && <p className="admin-vehicles__state">Sin resultados.</p>}
        </div>
      )}
    </div>
  );
}
