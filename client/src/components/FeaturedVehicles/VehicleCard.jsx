import Button from "../Button/Button.jsx";
import "./VehicleCard.css";

const currencyFormatter = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const kmFormatter = new Intl.NumberFormat("es-AR");

export default function VehicleCard({ vehicle }) {
  const { name, image, km, engine, price } = vehicle;

  return (
    <article className="vehicle-card">
      <div className="vehicle-card__image-wrap">
        <img src={image} alt={name} loading="lazy" className="vehicle-card__image" />
      </div>
      <div className="vehicle-card__body">
        <h3 className="vehicle-card__name">{name}</h3>
        <div className="vehicle-card__meta">
          <div>
            <span className="vehicle-card__meta-label">Kilometraje</span>
            <span className="vehicle-card__meta-value">{kmFormatter.format(km)} km</span>
          </div>
          <div>
            <span className="vehicle-card__meta-label">Motor</span>
            <span className="vehicle-card__meta-value">{engine}</span>
          </div>
        </div>
        <div className="vehicle-card__footer">
          <span className="vehicle-card__price">{currencyFormatter.format(price)}</span>
          <Button variant="outlined" className="vehicle-card__cta">
            Consultar
          </Button>
        </div>
      </div>
    </article>
  );
}
