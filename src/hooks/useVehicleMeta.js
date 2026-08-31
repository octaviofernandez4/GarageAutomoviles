import { useEffect, useState } from "react";
import { fetchVehicleMeta } from "../api/vehicles.js";
import { FALLBACK_VEHICLES } from "../data/vehicles.js";

function computeLocalMeta() {
  const brands = [...new Set(FALLBACK_VEHICLES.map((v) => v.brand))].sort();
  const bodies = [...new Set(FALLBACK_VEHICLES.map((v) => v.body))].sort();
  const prices = FALLBACK_VEHICLES.map((v) => v.price);

  return {
    brands,
    bodies,
    priceMin: Math.min(...prices),
    priceMax: Math.max(...prices),
  };
}

export default function useVehicleMeta() {
  const [meta, setMeta] = useState(computeLocalMeta);

  useEffect(() => {
    let cancelled = false;

    fetchVehicleMeta()
      .then((data) => {
        if (!cancelled) setMeta(data);
      })
      .catch(() => {
        // Sin backend disponible: nos quedamos con la metadata local.
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return meta;
}
