import Button from "../Button/Button.jsx";
import "./TradeInTeaser.css";

export default function TradeInTeaser() {
  return (
    <section className="trade-teaser">
      <div className="container trade-teaser__grid">
        <div className="trade-teaser__copy">         
          <h2 className="trade-teaser__title">
            Tu usado vale más
            <br />
            de lo que te dijeron
          </h2>
          <p className="trade-teaser__desc">
            Tasamos en 24 horas con precios reales de mercado en Tucumán, y lo tomamos como
            anticipo de la unidad que elijas.
          </p>
          <Button to="/tasar" variant="bone" className="trade-teaser__btn">
            Cotizar mi auto
          </Button>
        </div>
        <div className="trade-teaser__photo">
          <img src="/vehicles/yaris.png" alt="Toyota Yaris tomado en parte de pago" />
          <div className="trade-teaser__overlay" aria-hidden="true" />
        </div>
      </div>
    </section>
  );
}
