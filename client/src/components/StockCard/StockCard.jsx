import { Link } from "react-router-dom";
import "./StockCard.css";

export default function StockCard({ vehicle }) {
  const { id, name, image, badge, summary, priceFmt } = vehicle;

  return (
    <Link to={`/stock/${id}`} className="stock-card">
      <div className="stock-card__photo">
        <img src={image} alt={name} loading="lazy" />
      </div>
      <div className="stock-card__body">
        <div className="stock-card__badge mono">{badge}</div>
        <h3 className="stock-card__name">{name}</h3>
        <div className="stock-card__summary">{summary}</div>
        <div className="stock-card__footer">
          <span className="stock-card__price">{priceFmt}</span>
          <span className="stock-card__cta">Ficha →</span>
        </div>
      </div>
    </Link>
  );
}
