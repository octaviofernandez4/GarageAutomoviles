import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Button from "../components/Button/Button.jsx";
import useVehicles from "../hooks/useVehicles.js";
import { decorateVehicle, formatMoney } from "../utils/format.js";
import "./VehicleDetail.css";

const WHATSAPP_NUMBER = "5493810000000";

export default function VehicleDetail() {
  const { id } = useParams();
  const { vehicles, status } = useVehicles();
  const found = vehicles.find((v) => v.id === id);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    setActiveImage(0);
  }, [id]);

  if (status === "loading") {
    return (
      <main className="detail-page">
        <div className="container">
          <p className="detail-page__state">Cargando vehículo...</p>
        </div>
      </main>
    );
  }

  if (!found) {
    return (
      <main className="detail-page">
        <div className="container">
          <p className="detail-page__state">No encontramos esa unidad.</p>
          <Link to="/stock" className="detail-page__back">
            ← Volver al stock
          </Link>
        </div>
      </main>
    );
  }

  const current = decorateVehicle(found);
  const cuota = Math.round((current.price * 0.5) / 24 / 100) * 100;
  const financeLine = `Anticipo ${formatMoney(Math.round(current.price * 0.5))} + 24 cuotas de ${formatMoney(cuota)}`;
  const waLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    `Hola, me interesa el ${current.name} ${current.year} publicado en ${current.priceFmt}`
  )}`;

  const specs = [
    { k: "Año", v: String(current.year) },
    { k: "Kilómetros", v: current.kmFmt },
    { k: "Motor", v: current.engine },
    { k: "Transmisión", v: current.gearbox },
    { k: "Combustible", v: current.fuel },
    { k: "Tracción", v: current.traction },
    { k: "Carrocería", v: current.body },
    { k: "Dueños anteriores", v: String(current.owners) },
  ];

  return (
    <main className="detail-page">
      <div className="container detail-page__back-row">
        <Link to="/stock" className="detail-page__back">
          ← Volver al stock
        </Link>
      </div>

      <div className="container detail-page__grid">
        <div>
          <div className="detail-page__photo">
            <img src={current.images[activeImage] ?? current.image} alt={current.name} />
          </div>

          {current.images.length > 1 && (
            <div className="detail-page__gallery">
              {current.images.map((src, i) => (
                <button
                  key={src + i}
                  type="button"
                  className={`detail-page__gallery-item ${
                    i === activeImage ? "detail-page__gallery-item--active" : ""
                  }`}
                  onClick={() => setActiveImage(i)}
                  aria-label={`Ver foto ${i + 1} de ${current.name}`}
                >
                  <img src={src} alt="" loading="lazy" />
                </button>
              ))}
            </div>
          )}

          <div className="detail-page__section">
            <h2 className="detail-page__section-title">Ficha técnica</h2>
            <div className="detail-page__specs">
              {specs.map((spec) => (
                <div key={spec.k} className="detail-page__spec-row">
                  <span className="detail-page__spec-key">{spec.k}</span>
                  <span className="detail-page__spec-value">{spec.v}</span>
                </div>
              ))}
            </div>
          </div>

          {current.checks?.length > 0 && (
            <div className="detail-page__section">
              <h2 className="detail-page__section-title">Informe de la unidad</h2>
              <div className="detail-page__checks">
                {current.checks.map((check, i) => (
                  <div key={check.title + i} className="detail-page__check">
                    <span className="detail-page__check-dot" aria-hidden="true" />
                    <div>
                      <div className="detail-page__check-title">{check.title}</div>
                      <div className="detail-page__check-desc">{check.description}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <aside className="detail-page__aside">
          <div className="detail-page__panel">
            <div className="detail-page__badge mono">{current.badge}</div>
            <h1 className="detail-page__name">{current.name}</h1>
            <p className="detail-page__summary">{current.summary}</p>

            <div className="detail-page__price-block">
              <div className="detail-page__price">{current.priceFmt}</div>
              <div className="detail-page__price-note">Precio final · transferencia y verificación incluidas</div>
            </div>

            <div className="detail-page__finance">
              <div className="detail-page__finance-label mono">Financiación estimada</div>
              <div className="detail-page__finance-line">{financeLine}</div>
              <div className="detail-page__finance-note">Sujeto a aprobación crediticia. Tasas a confirmar.</div>
            </div>

            <div className="detail-page__actions">
              <Button as="a" href={waLink} target="_blank" rel="noreferrer" variant="copper" className="detail-page__action">
                Consultar por WhatsApp
              </Button>
              <Button to="/tasar" variant="outline" className="detail-page__action">
                Entregar mi usado en parte de pago
              </Button>
            </div>

            <div className="detail-page__visit-note">
              Podés verla en Av. Aconquija 1763, Yerba Buena. Coordinamos test drive sin cargo.
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}
