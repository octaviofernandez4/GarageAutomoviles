import { formatMoney } from "../../utils/format.js";
import "./StockFilters.css";

export default function StockFilters({
  filters,
  onChange,
  onClear,
  open,
  onCloseDrawer,
  brands,
  bodies,
  priceMin,
  priceMax: priceCeiling,
}) {
  const { brand, body, priceMax, onlyAuto } = filters;

  return (
    <aside className={`stock-filters ${open ? "stock-filters--open" : ""}`}>
      <div className="stock-filters__head">
        <span className="stock-filters__title">Filtros</span>
        <div className="stock-filters__head-actions">
          <button type="button" className="stock-filters__clear" onClick={onClear}>
            Limpiar
          </button>
          <button
            type="button"
            className="stock-filters__close"
            onClick={onCloseDrawer}
            aria-label="Cerrar filtros"
          >
            ×
          </button>
        </div>
      </div>

      <div className="stock-filters__label mono">Marca</div>
      <div className="stock-filters__chips">
        {brands.map((b) => (
          <button
            key={b}
            type="button"
            className={`stock-filters__chip ${brand === b ? "stock-filters__chip--active" : ""}`}
            onClick={() => onChange({ brand: brand === b ? null : b })}
          >
            {b}
          </button>
        ))}
      </div>

      <div className="stock-filters__label mono">Carrocería</div>
      <div className="stock-filters__chips">
        {bodies.map((b) => (
          <button
            key={b}
            type="button"
            className={`stock-filters__chip ${body === b ? "stock-filters__chip--active" : ""}`}
            onClick={() => onChange({ body: body === b ? null : b })}
          >
            {b}
          </button>
        ))}
      </div>

      <div className="stock-filters__price-head">
        <span className="mono">Hasta</span>
        <span className="stock-filters__price-value">{formatMoney(priceMax)}</span>
      </div>
      <input
        type="range"
        min={priceMin}
        max={priceCeiling}
        step={500}
        value={priceMax}
        onChange={(e) => onChange({ priceMax: Number(e.target.value) })}
        className="stock-filters__range"
      />

      <div className="stock-filters__auto">
        <label className="stock-filters__checkbox">
          <input
            type="checkbox"
            checked={onlyAuto}
            onChange={(e) => onChange({ onlyAuto: e.target.checked })}
          />
          Solo caja automática
        </label>
      </div>
    </aside>
  );
}
