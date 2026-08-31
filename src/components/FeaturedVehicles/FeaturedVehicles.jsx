import VehicleCard from "../VehicleCard/VehicleCard.jsx";
import "./FeaturedVehicles.css";

export default function FeaturedVehicles({ vehicles }) {
  const featured = vehicles.slice(0, 3);

  return (
    <section className="section featured">
      <div className="container">
        <div className="featured__heading">
          <div>
            <div className="overline">01 — Stock</div>
            <h2 className="featured__title">Disponibles ahora</h2>
          </div>
          <p className="featured__note">Precio final publicado. Sin gastos ocultos ni “consultar”.</p>
        </div>

        {featured.length > 0 && (
          <div className="featured__grid">
            {featured.map((vehicle) => (
              <VehicleCard key={vehicle.id} vehicle={vehicle} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
