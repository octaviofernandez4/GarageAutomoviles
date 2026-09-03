import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import useGoVisit from "../../hooks/useGoVisit.js";
import "./Header.css";

const NAV_LINKS = [
  { label: "Inicio", to: "/", end: true },
  { label: "Stock", to: "/stock" },
  { label: "Tasá tu usado", to: "/tasar" },
];

const WHATSAPP_URL = "https://wa.me/5493810000000";

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true">
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.39 1.26 4.81L2 22l5.42-1.36a9.9 9.9 0 0 0 4.62 1.15h.01c5.46 0 9.9-4.45 9.9-9.9C21.95 6.44 17.5 2 12.04 2zm5.76 14.16c-.24.68-1.4 1.3-1.94 1.38-.5.08-1.11.11-1.79-.11-.41-.13-.94-.3-1.62-.6-2.85-1.23-4.71-4.1-4.85-4.29-.14-.19-1.15-1.53-1.15-2.92 0-1.39.73-2.07.99-2.35.26-.28.57-.35.76-.35h.55c.18 0 .42-.03.65.5.24.55.81 1.94.88 2.08.07.14.12.31.02.5-.1.19-.15.31-.29.48-.14.17-.3.37-.43.5-.14.14-.29.29-.13.57.17.28.75 1.24 1.61 2.01 1.11 1 2.04 1.31 2.32 1.46.28.14.44.12.6-.07.17-.19.71-.83.9-1.11.19-.28.38-.23.64-.14.26.1 1.65.78 1.93.92.28.14.47.21.54.33.07.12.07.68-.17 1.36z" />
    </svg>
  );
}

function WhatsAppCta({ className, onClick }) {
  return (
    <a
      href={WHATSAPP_URL}
      target="_blank"
      rel="noreferrer"
      className={`header__cta ${className || ""}`}
      onClick={onClick}
    >
      WhatsApp
      <WhatsAppIcon />
      <span className="header__cta-badge" aria-hidden="true" />
    </a>
  );
}

export default function Header() {
  const [open, setOpen] = useState(false);
  const goVisit = useGoVisit();

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
  }, [open]);

  return (
    <header className="header">
      <div className="header__checker header__checker--top" aria-hidden="true" />

      <div className="container header__inner">
        <Link to="/" className="header__logo">
          El Garage
        </Link>

        <nav className={`header__nav ${open ? "header__nav--open" : ""}`}>
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) => `header__link ${isActive ? "header__link--active" : ""}`}
              onClick={() => setOpen(false)}
            >
              {link.label}
            </NavLink>
          ))}
          <button
            type="button"
            className="header__link header__link--button"
            onClick={() => {
              setOpen(false);
              goVisit();
            }}
          >
            Visitanos
          </button>

          <WhatsAppCta className="header__cta--mobile" onClick={() => setOpen(false)} />
        </nav>

        <WhatsAppCta />

        <button
          className={`header__toggle ${open ? "header__toggle--open" : ""}`}
          aria-label="Abrir menú"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      <div className="header__checker header__checker--bottom" aria-hidden="true" />
    </header>
  );
}
