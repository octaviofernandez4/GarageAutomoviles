import Button from "../Button/Button.jsx";
import useReveal from "../../hooks/useReveal.js";
import "./Hero.css";

export default function Hero() {
  const { ref, className } = useReveal("left");

  return (
    <section id="top" className="hero">
      <div className="hero__photo" aria-hidden="true" />
      <div className="hero__fade" aria-hidden="true" />
      <div className="hero__glow" aria-hidden="true" />
      <div ref={ref} className={`container hero__content ${className}`}>
        <p className="eyebrow">El Garage Automóviles</p>
        <h1 className="hero__title">Autos seleccionados con historial verificado</h1>
        <p className="hero__subtitle">Financiación · Patentes · Entrega inmediata</p>
        <div className="hero__actions">
          <Button as="a" href="#stock" variant="primary">
            Ver stock disponible
          </Button>
          <Button as="a" href="#contact" variant="outlined">
            Contactar Asesor
          </Button>
        </div>
      </div>
    </section>
  );
}
