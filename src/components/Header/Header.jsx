import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import Button from "../Button/Button.jsx";
import useGoVisit from "../../hooks/useGoVisit.js";
import "./Header.css";

const NAV_LINKS = [
  { label: "Inicio", to: "/", end: true },
  { label: "Stock", to: "/stock" },
  { label: "Tasá tu usado", to: "/tasar" },
];

const WHATSAPP_URL = "https://wa.me/5493810000000";

export default function Header() {
  const [open, setOpen] = useState(false);
  const goVisit = useGoVisit();

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
  }, [open]);

  return (
    <header className="header">
      <div className="header__checker header__checker--top" aria-hidden="true" />

      <div className="header__bar">
        <div className="container header__inner">
          <Link to="/" className="header__logo">
            <img src="/GarageAutomoviles.jpg" alt="El Garage Automóviles" />
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
          </nav>

          <Button as="a" href={WHATSAPP_URL} target="_blank" rel="noreferrer" variant="bone" className="header__cta">
            <span className="header__cta-dot" aria-hidden="true" />
            WhatsApp
          </Button>

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
      </div>

      <div className="header__checker header__checker--bottom" aria-hidden="true" />
    </header>
  );
}
