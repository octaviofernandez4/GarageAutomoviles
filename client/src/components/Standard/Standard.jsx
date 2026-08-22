import { ShieldCheckIcon, RefreshIcon, CashIcon, BoltIcon } from "./icons.jsx";
import useReveal from "../../hooks/useReveal.js";
import "./Standard.css";

const FEATURES = [
  {
    icon: ShieldCheckIcon,
    title: "Historial Verificado",
    description: "Auditoría completa de VIN, patentes y documentación 100% al día para tu tranquilidad.",
  },
  {
    icon: CashIcon,
    title: "Financiación Propia",
    description: "Planes a medida con tasas preferenciales, aprobación crediticia en el acto.",
  },
  {
    icon: RefreshIcon,
    title: "Recibimos tu Usado",
    description: "Tasación transparente y al mejor valor de mercado como parte de pago.",
  },
  {
    icon: BoltIcon,
    title: "Entrega Inmediata",
    description: "Proceso de compra ágil. Liberá tu nuevo vehículo el mismo día.",
  },
];

export default function Standard() {
  const { ref, className } = useReveal("left");

  return (
    <section id="why-us" className="section standard">
      <div ref={ref} className={`container ${className}`}>
        <h2 className="section-title standard__title">El Standard El Garage</h2>
        <div className="standard__grid">
          {FEATURES.map(({ icon: Icon, title, description }) => (
            <div key={title} className="standard__item">
              <div className="standard__icon">
                <Icon />
              </div>
              <h3 className="standard__item-title">{title}</h3>
              <p className="standard__item-desc">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
