import "./BottomNav.css";

function HomeIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M4 11.5 12 4l8 7.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6 10v9h12v-9" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="11" cy="11" r="6.5" />
      <path d="m20 20-4.3-4.3" strokeLinecap="round" />
    </svg>
  );
}

function ProfileIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="12" cy="8" r="3.5" />
      <path d="M4.5 20c1.4-3.8 4.3-5.8 7.5-5.8s6.1 2 7.5 5.8" strokeLinecap="round" />
    </svg>
  );
}

const ITEMS = [
  { icon: HomeIcon, label: "Inicio", href: "#top" },
  { icon: SearchIcon, label: "Buscar", href: "#stock" },
  { icon: ProfileIcon, label: "Contacto", href: "#contact" },
];

export default function BottomNav() {
  return (
    <nav className="bottom-nav" aria-label="Navegación móvil">
      {ITEMS.map(({ icon: Icon, label, href }, index) => (
        <a key={label} href={href} className={`bottom-nav__item ${index === 0 ? "bottom-nav__item--active" : ""}`}>
          <span className="bottom-nav__icon">
            <Icon />
          </span>
          <span className="bottom-nav__label">{label}</span>
        </a>
      ))}
    </nav>
  );
}
