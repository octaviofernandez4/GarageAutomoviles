import Button from "../Button/Button.jsx";
import "./VisitUs.css";

const WHATSAPP_URL = "https://wa.me/5493810000000";
const INSTAGRAM_URL = "https://instagram.com/elgarageautomoviles";
const MAPS_EMBED_URL =
  "https://www.google.com/maps?q=Av.+Aconquija+1763,+Yerba+Buena,+Tucum%C3%A1n&output=embed";

const HOURS = [
  { label: "Lun a Vie", value: "09:00–13:00 · 16:30–20:30" },
  { label: "Sábados", value: "09:00–13:00" },
  { label: "Domingos", value: "Cerrado · atendemos por WhatsApp", muted: true },
];

export default function VisitUs() {
  return (
    <section id="visit" className="section visit">
      <div className="container visit__grid">
        <div>
          <div className="overline">04 — Visitanos</div>
          <h2 className="visit__title">
            Av. Aconquija 1763
            <br />
            Yerba Buena
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
