import Button from "../Button/Button.jsx";
import { WHATSAPP_URL, INSTAGRAM_URL, MAPS_EMBED_URL, HOURS, ADDRESS_STREET, ADDRESS_LOCALITY } from "../../config/business.js";
import "./VisitUs.css";

export default function VisitUs() {
  return (
    <section id="visit" className="section visit">
      <div className="container visit__grid">
        <div>
          <h2 className="visit__title">
            {ADDRESS_STREET}
            <br />
            {ADDRESS_LOCALITY}
          </h2>

          <div className="visit__hours">
            {HOURS.map((row, index) => (
              <div key={row.label} className={`visit__hours-row ${index === HOURS.length - 1 ? "visit__hours-row--last" : ""}`}>
                <span className="mono">{row.label}</span>
                <span className={row.muted ? "visit__hours-muted" : ""}>{row.value}</span>
              </div>
            ))}
          </div>

          <div className="visit__actions">
            <Button as="a" href={WHATSAPP_URL} target="_blank" rel="noreferrer" variant="copper" className="visit__btn">
              Escribinos
            </Button>
            <Button as="a" href={INSTAGRAM_URL} target="_blank" rel="noreferrer" variant="outline" className="visit__btn">
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
