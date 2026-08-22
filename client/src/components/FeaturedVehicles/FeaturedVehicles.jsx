import { useEffect, useState } from "react";
import { fetchVehicles } from "../../api/vehicles.js";
import { FALLBACK_VEHICLES } from "../../data/vehicles.js";
import VehicleCard from "./VehicleCard.jsx";
import useReveal from "../../hooks/useReveal.js";
import "./FeaturedVehicles.css";

export default function FeaturedVehicles() {
  const [vehicles, setVehicles] = useState([]);
  const [status, setStatus] = useState("loading");
  const { ref, className } = useReveal("right");

  useEffect(() => {
    let cancelled = false;

    fetchVehicles()
      .then((data) => {
        if (cancelled) return;
        setVehicles(data);
        setStatus("success");
      })
      .catch(() => {
        if (cancelled) return;
        // Sin backend disponible (ej. deploy solo del front): mostramos
        // la copia local en lugar de un estado de error.
        setVehicles(FALLBACK_VEHICLES);
        setStatus("success");
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section id="stock" className="section featured">
      <div ref={ref} className={`container ${className}`}>
        <div className="section-heading">
          <h2 className="section-title">Vehículos Destacados</h2>
          <a href="#stock" className="featured__link">
            Ver todos <span aria-hidden="true">→</span>
          </a>
        </div>

        {status === "loading" && <p className="featured__state">Cargando vehículos...</p>}
        {status === "success" && vehicles.length === 0 && (
          <p className="featured__state">Todavía no hay vehículos publicados.</p>
        )}

        {status === "success" && vehicles.length > 0 && (
          <div className="featured__grid">
            {vehicles.map((vehicle) => (
              <VehicleCard key={vehicle._id} vehicle={vehicle} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
