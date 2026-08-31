import { Link } from "react-router-dom";
import Button from "../Button/Button.jsx";
import "./Hero.css";

const WHATSAPP_URL = "https://wa.me/5493810000000";

const STATS = [
  { value: "7.000+", label: "clientes" },
  { value: "760+", label: "autos vendidos" },
  { value: "12 años", label: "en Tucumán" },
];

export default function Hero({ total }) {
  return (
    <section className="hero">
      <div className="container hero__grid">
        <div className="hero__copy">
          <h1 className="hero__title">
            Autos seleccionados
            <br />
            <span className="hero__title-dot">•</span> Historial verificado
          </h1>
          <p className="hero__subtitle">
            Financiación <span className="hero__bullet">•</span> Permutas{" "}
            <span className="hero__bullet">•</span> Entrega inmediata
          </p>
          <div className="hero__location">
            <span className="hero__location-dot" aria-hidden="true" />
            <span className="mono">Yerba Buena, Tucumán</span>
          </div>
          <div className="hero__actions">
            <Button as="a" href={WHATSAPP_URL} target="_blank" rel="noreferrer" variant="copper" className="hero__btn">
              Consultanos
            </Button>
            <Button to="/stock" variant="outline" className="hero__btn">
              Ver las {total} unidades
            </Button>
          </div>
          <div className="hero__stats">
            {STATS.map((stat) => (
              <div key={stat.label}>
                <div className="hero__stat-value">{stat.value}</div>
                <div className="hero__stat-label mono">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="hero__photo">
          <img src="/hero-car.jpg" alt="" />
          <div className="hero__photo-overlay" aria-hidden="true" />
        </div>
      </div>
    </section>
  );
}
