import "./BrandsStrip.css";

const BRANDS = ["Volkswagen", "Mercedes-Benz", "Ford", "Audi", "Toyota", "BMW", "Kia"];

export default function BrandsStrip() {
  return (
    <div className="brands">
      <div className="container brands__row">
        {BRANDS.map((brand) => (
          <span key={brand} className="brands__item">
            {brand}
          </span>
        ))}
      </div>
    </div>
  );
}
