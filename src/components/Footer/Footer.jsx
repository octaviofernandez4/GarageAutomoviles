import { Link } from "react-router-dom";
import useGoVisit from "../../hooks/useGoVisit.js";
import "./Footer.css";

const WHATSAPP_URL = "https://wa.me/5493810000000";
const INSTAGRAM_URL = "https://instagram.com/elgarageautomoviles";
const MAPS_URL =
  "https://www.google.com/maps/search/?api=1&query=Av.+Aconquija+1763,+Yerba+Buena,+Tucum%C3%A1n";

export default function Footer() {
  const goVisit = useGoVisit();

  return (
    <footer className="footer">
      <div className="container footer__grid">
        <div className="footer__brand">
          <img src="/ElGarage.jpg" alt="El Garage Automóviles" className="footer__logo" />
          <p className="footer__tagline">
            Usados seleccionados con historial verificado. Av. Aconquija 1763, Yerba Buena, Tucumán.
          </p>
        </div>

        <div className="footer__col">
          <div className="footer__heading mono">Navegar</div>
          <div className="footer__links">
            <Link to="/stock">Stock</Link>
            <Link to="/tasar">Tasá tu usado</Link>
            <button type="button" className="footer__link-button" onClick={goVisit}>
              Visitanos
            </button>
          </div>
        </div>

        <div className="footer__col">
          <div className="footer__heading mono">Contacto</div>
          <div className="footer__links">
            <a href={WHATSAPP_URL} target="_blank" rel="noreferrer">
              WhatsApp
            </a>
            <a href={INSTAGRAM_URL} target="_blank" rel="noreferrer">
              Instagram
            </a>
            <a href={MAPS_URL} target="_blank" rel="noreferrer">
              Cómo llegar
            </a>
          </div>
        </div>

        <div className="footer__col">
          <div className="footer__heading mono">Legales</div>
          <div className="footer__links footer__links--static">
            <span>Política de privacidad</span>
            <span>Términos de servicio</span>
          </div>
        </div>
      </div>

      <div className="container footer__bottom">
        <div className="footer__copy mono">© 2026 El Garage Automóviles</div>
        <Link to="/admin" className="footer__admin mono">
          Acceso interno
        </Link>
      </div>
    </footer>
  );
}
