import "./Footer.css";

const NAV_LINKS = [
  { label: "Stock", href: "#stock" },
  { label: "Nosotros", href: "#why-us" },
  { label: "Testimonios", href: "#testimonials" },
  { label: "Contacto", href: "#contact" },
];

const LEGAL_LINKS = [
  { label: "Política de Privacidad", href: "#privacy-policy" },
  { label: "Términos de Servicio", href: "#terms-of-service" },
  { label: "Ubicación", href: "#contact" },
];

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <div className="footer__brand">
          <span className="footer__logo">El Garage</span>
          <p className="footer__tagline">
            Vehículos seleccionados de alta gama con historial garantizado y confiabilidad
            premium.
          </p>
        </div>

        <div className="footer__col">
          <h4 className="footer__heading">Navegación</h4>
          <ul>
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <a href={link.href}>{link.label}</a>
              </li>
            ))}
          </ul>
        </div>

        <div className="footer__col">
          <h4 className="footer__heading">Legales</h4>
          <ul>
            {LEGAL_LINKS.map((link) => (
              <li key={link.href}>
                <a href={link.href}>{link.label}</a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="container footer__bottom">
        <p>© {new Date().getFullYear()} El Garage Automóviles. Selección Premium.</p>
      </div>
    </footer>
  );
}
