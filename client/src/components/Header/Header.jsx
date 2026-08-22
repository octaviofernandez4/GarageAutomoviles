import { useEffect, useState } from "react";
import Button from "../Button/Button.jsx";
import "./Header.css";

const NAV_LINKS = [
  { label: "Stock", href: "#stock" },
  { label: "Nosotros", href: "#why-us" },
  { label: "Testimonios", href: "#testimonials" },
  { label: "Contacto", href: "#contact" },
];

export default function Header() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
  }, [open]);

  return (
    <header className="header">
      <div className="container header__inner">
        <a href="#top" className="header__logo">     
          <span className="header__wordmark">El Garage Automóviles</span>
        </a>

        <nav className={`header__nav ${open ? "header__nav--open" : ""}`}>
          <ul>
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <a href={link.href} onClick={() => setOpen(false)}>
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
          <Button
            as="a"
            href="#stock"
            variant="primary"
            className="header__cta header__cta--mobile"
            onClick={() => setOpen(false)}
          >
            Ver Stock
          </Button>
        </nav>

        <Button as="a" href="#stock" variant="primary" className="header__cta header__cta--desktop">
          Ver Stock
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
    </header>
  );
}
