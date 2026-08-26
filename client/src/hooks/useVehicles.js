import { useEffect, useState } from "react";
import { fetchVehicles } from "../api/vehicles.js";
import { FALLBACK_VEHICLES } from "../data/vehicles.js";

export default function useVehicles() {
  const [vehicles, setVehicles] = useState([]);
  const [status, setStatus] = useState("loading");

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
        // Sin backend disponible (ej. deploy solo del front): usamos la
        // copia local en lugar de un estado de error.
        setVehicles(FALLBACK_VEHICLES);
        setStatus("success");
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return { vehicles, status };
}
