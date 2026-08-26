import { Link } from "react-router-dom";
import "./QuickSearch.css";

const CHIPS = [
  { label: "SUV", to: "/stock?body=SUV" },
  { label: "Pick-up", to: "/stock?body=Pick-up" },
  { label: "Hasta US$ 20.000", to: "/stock?priceMax=20000" },
  { label: "Automáticos", to: "/stock?onlyAuto=1" },
  { label: "Menos de 40.000 km", to: "/stock?order=kmAsc" },
];

export default function QuickSearch() {
  return (
    <section className="quick-search">
      <div className="container quick-search__inner">
        <span className="mono quick-search__label">Buscar rápido</span>
        <div className="quick-search__chips">
          {CHIPS.map((chip) => (
            <Link key={chip.label} to={chip.to} className="quick-search__chip">
              {chip.label}
            </Link>
          ))}
        </div>
        <Link to="/stock" className="quick-search__all">
          Ver stock completo →
        </Link>
      </div>
    </section>
  );
}
