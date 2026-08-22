import Button from "../Button/Button.jsx";
import useReveal from "../../hooks/useReveal.js";
import "./VisitUs.css";

const WHATSAPP_URL = "https://wa.me/5493810000000";
const INSTAGRAM_URL = "https://instagram.com/elgarageautomoviles";
const MAPS_EMBED_URL =
  "https://www.google.com/maps?q=Av.+Aconquija+1763,+Yerba+Buena,+Tucum%C3%A1n&output=embed";
const MAPS_DIRECTIONS_URL =
  "https://www.google.com/maps/search/?api=1&query=Av.+Aconquija+1763,+Yerba+Buena,+Tucum%C3%A1n";

export default function VisitUs() {
  const { ref, className } = useReveal("left");

  return (
    <section id="contact" className="section visit">
      <div ref={ref} className={`container visit__grid ${className}`}>
        <div className="visit__info">
          <p className="eyebrow">Visitanos</p>
          <p className="visit__intro">
            Atención personalizada en nuestro showroom exclusivo.
          </p>

          <div className="visit__block">
            <h3 className="visit__block-title">Dirección</h3>
            <a href={MAPS_DIRECTIONS_URL} target="_blank" rel="noreferrer" className="visit__address">
              <p>Av. Aconquija 1763</p>
              <p>Yerba Buena, Tucumán</p>
            </a>
          </div>

          <div className="visit__block">
            <h3 className="visit__block-title">Horarios</h3>
            <p>Lunes a Viernes 09:00 - 13:00 / 16:30 - 20:30</p>
            <p>Sábados 09:00 - 13:00</p>
          </div>

          <div className="visit__actions">
            <Button as="a" href={WHATSAPP_URL} target="_blank" rel="noreferrer" variant="primary">
              WhatsApp
            </Button>
            <Button as="a" href={INSTAGRAM_URL} target="_blank" rel="noreferrer" variant="outlined">
              Instagram
            </Button>
          </div>
        </div>

        <div className="visit__map">
          <iframe
            title="Ubicación El Garage Automóviles"
            src={MAPS_EMBED_URL}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </section>
  );
}
