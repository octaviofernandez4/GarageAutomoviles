import { Link } from "react-router-dom";
import { optimizedImage } from "../../utils/cloudinary.js";
import "./VehicleCard.css";

export default function VehicleCard({ vehicle }) {
  const { id, name, year, image, badge, kmFmt, engine, gearbox, priceFmt } = vehicle;

  return (
    <Link to={`/stock/${id}`} className="vehicle-card">
      <div className="vehicle-card__photo">
        <img src={optimizedImage(image, 600)} alt={name} loading="lazy" />
        <span className="vehicle-card__badge mono">{badge}</span>
      </div>
      <div className="vehicle-card__body">
        <div className="vehicle-card__top">
          <h3 className="vehicle-card__name">{name}</h3>
          <span className="vehicle-card__year mono">{year}</span>
        </div>
        <div className="vehicle-card__specs">
          <div>
            <div className="vehicle-card__spec-label mono">km</div>
            <div className="vehicle-card__spec-value">{kmFmt}</div>
          </div>
          <div>
            <div className="vehicle-card__spec-label mono">motor</div>
            <div className="vehicle-card__spec-value">{engine}</div>
          </div>
          <div>
            <div className="vehicle-card__spec-label mono">caja</div>
            <div className="vehicle-card__spec-value">{gearbox}</div>
          </div>
        </div>
        <div className="vehicle-card__footer">
          <span className="vehicle-card__price">{priceFmt}</span>
          <span className="vehicle-card__cta">Ver ficha →</span>
        </div>
      </div>
    </Link>
  );
}
