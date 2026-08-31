import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import StockFilters from "../components/StockFilters/StockFilters.jsx";
import StockCard from "../components/StockCard/StockCard.jsx";
import Button from "../components/Button/Button.jsx";
import useVehicles from "../hooks/useVehicles.js";
import useVehicleMeta from "../hooks/useVehicleMeta.js";
import { decorateVehicle } from "../utils/format.js";
import "./Stock.css";

function readInitialFilters(searchParams, meta) {
  const brand = searchParams.get("brand");
  const body = searchParams.get("body");
  const priceMax = searchParams.get("priceMax");
  const onlyAuto = searchParams.get("onlyAuto");

  return {
    brand: brand || null,
    body: body || null,
    priceMax: priceMax ? Number(priceMax) : meta.priceMax,
    onlyAuto: onlyAuto === "1",
  };
}

export default function Stock() {
  const { vehicles } = useVehicles();
  const meta = useVehicleMeta();
  const [searchParams] = useSearchParams();

  const [filters, setFilters] = useState(() => readInitialFilters(searchParams, meta));
  const [order, setOrder] = useState(() => searchParams.get("order") || "recent");
  const [drawerOpen, setDrawerOpen] = useState(false);

  const results = useMemo(() => {
    let list = vehicles.filter(
      (v) =>
        (!filters.brand || v.brand === filters.brand) &&
        (!filters.body || v.body === filters.body) &&
        v.price <= filters.priceMax &&
        (!filters.onlyAuto || v.auto)
    );

    if (order === "priceAsc") list = [...list].sort((a, b) => a.price - b.price);
    if (order === "priceDesc") list = [...list].sort((a, b) => b.price - a.price);
    if (order === "kmAsc") list = [...list].sort((a, b) => a.km - b.km);

    return list.map(decorateVehicle);
  }, [vehicles, filters, order]);

  const handleFilterChange = (patch) => setFilters((prev) => ({ ...prev, ...patch }));
  const handleClear = () =>
    setFilters({ brand: null, body: null, priceMax: meta.priceMax, onlyAuto: false });

  return (
    <main className="stock-page">
      <div className="container">
        <div className="stock-page__head">
          <div>
            <div className="overline">Stock</div>
            <h1 className="stock-page__title">{results.length} unidades</h1>
          </div>
          <div className="stock-page__order">
            <span className="mono">Orden</span>
            <select value={order} onChange={(e) => setOrder(e.target.value)} className="stock-page__select">
              <option value="recent">Ingreso reciente</option>
              <option value="priceAsc">Precio: menor a mayor</option>
              <option value="priceDesc">Precio: mayor a menor</option>
              <option value="kmAsc">Menos kilómetros</option>
            </select>
          </div>
        </div>

        <button type="button" className="stock-page__filters-toggle" onClick={() => setDrawerOpen(true)}>
          Filtros
        </button>

        <div className="stock-page__layout">
          <StockFilters
            filters={filters}
            onChange={handleFilterChange}
            onClear={handleClear}
            open={drawerOpen}
            onCloseDrawer={() => setDrawerOpen(false)}
            brands={meta.brands}
            bodies={meta.bodies}
            priceMin={meta.priceMin}
            priceMax={meta.priceMax}
          />

          <div>
            {results.length > 0 && (
              <div className="stock-page__results">
                {results.map((vehicle) => (
                  <StockCard key={vehicle.id} vehicle={vehicle} />
                ))}
              </div>
            )}

            {results.length === 0 && (
              <div className="stock-page__empty">
                <p className="stock-page__empty-title">Ninguna unidad cumple con esos filtros.</p>
                <p className="stock-page__empty-desc">Contanos qué buscás y lo salimos a buscar por vos.</p>
                <Button variant="copper" className="stock-page__empty-btn" onClick={handleClear}>
                  Limpiar filtros
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
