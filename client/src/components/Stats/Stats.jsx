import useReveal from "../../hooks/useReveal.js";
import "./Stats.css";

const STATS = [
  { value: "7000+", label: "Clientes en Redes" },
  { value: "760+", label: "Autos Publicados" },
];

export default function Stats() {
  const { ref, className } = useReveal("right");

  return (
    <section className="stats">
      <div ref={ref} className={`container stats__row ${className}`}>
        {STATS.map((stat) => (
          <div key={stat.label} className="stats__item">
            <span className="stats__value">{stat.value}</span>
            <span className="stats__label">{stat.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
