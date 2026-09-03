const BASE = {
  width: 18,
  height: 18,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round",
  strokeLinejoin: "round",
};

export function DashboardIcon(props) {
  return (
    <svg {...BASE} {...props}>
      <rect x="3.5" y="3.5" width="7.5" height="7.5" rx="1.6" />
      <rect x="13" y="3.5" width="7.5" height="4.5" rx="1.6" />
      <rect x="13" y="10.5" width="7.5" height="10" rx="1.6" />
      <rect x="3.5" y="13.5" width="7.5" height="7" rx="1.6" />
    </svg>
  );
}

export function ChatIcon(props) {
  return (
    <svg {...BASE} {...props}>
      <path d="M4 5.5h16v10.5a1.5 1.5 0 0 1-1.5 1.5H9l-4.5 4V5.5Z" />
      <path d="M8 9.5h8M8 13h5" />
    </svg>
  );
}

export function DocIcon(props) {
  return (
    <svg {...BASE} {...props}>
      <path d="M6.5 3h8l3 3v15h-11z" />
      <path d="M14 3v3.5h3.5" />
      <path d="M9 12h6M9 15.5h6M9 8.5h2" />
    </svg>
  );
}

export function CarIcon(props) {
  return (
    <svg {...BASE} {...props}>
      <path d="M4.5 16v-3.6l1.9-4.6a2 2 0 0 1 1.85-1.25h7.5a2 2 0 0 1 1.85 1.25l1.9 4.6V16" />
      <path d="M3.5 16h17v2.2a1 1 0 0 1-1 1h-1.4a1 1 0 0 1-1-1V17H6.9v1.2a1 1 0 0 1-1 1H4.5a1 1 0 0 1-1-1z" />
      <circle cx="7.5" cy="13.2" r="0.9" fill="currentColor" stroke="none" />
      <circle cx="16.5" cy="13.2" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function GearIcon(props) {
  return (
    <svg {...BASE} {...props}>
      <circle cx="12" cy="12" r="3" />
      <path d="M12 3.5v2.3M12 18.2v2.3M20.5 12h-2.3M5.8 12H3.5M17.7 6.3l-1.6 1.6M7.9 16.1l-1.6 1.6M17.7 17.7l-1.6-1.6M7.9 7.9 6.3 6.3" />
    </svg>
  );
}

export function SearchIcon(props) {
  return (
    <svg {...BASE} {...props}>
      <circle cx="10.5" cy="10.5" r="6.5" />
      <path d="m19.5 19.5-4.3-4.3" />
    </svg>
  );
}

export function BellIcon(props) {
  return (
    <svg {...BASE} {...props}>
      <path d="M6 10a6 6 0 0 1 12 0v4.2l1.6 2.6H4.4L6 14.2Z" />
      <path d="M9.5 19.5a2.5 2.5 0 0 0 5 0" />
    </svg>
  );
}

export function MenuIcon(props) {
  return (
    <svg {...BASE} {...props}>
      <path d="M4 6.5h16M4 12h16M4 17.5h16" />
    </svg>
  );
}

export function SendIcon(props) {
  return (
    <svg {...BASE} {...props}>
      <path d="M4.5 12 20 4.5l-4.2 15.2-4.4-6.1-6.9-1.6Z" />
      <path d="M11.4 13.6 20 4.5" />
    </svg>
  );
}

export function CloseIcon(props) {
  return (
    <svg {...BASE} {...props}>
      <path d="M6 6l12 12M18 6 6 18" />
    </svg>
  );
}

export function LogoutIcon(props) {
  return (
    <svg {...BASE} {...props}>
      <path d="M9 4.5H6a1.5 1.5 0 0 0-1.5 1.5v12A1.5 1.5 0 0 0 6 19.5h3" />
      <path d="M14 15.5 19 12l-5-3.5M19 12H9.5" />
    </svg>
  );
}

export function ChevronLeftIcon(props) {
  return (
    <svg {...BASE} {...props}>
      <path d="m14.5 5-7 7 7 7" />
    </svg>
  );
}

export function SparkleIcon(props) {
  return (
    <svg {...BASE} {...props}>
      <path d="M12 3.5 13.4 9l5.1 1.5-5.1 1.5L12 17.5 10.6 12l-5.1-1.5L10.6 9Z" />
    </svg>
  );
}

export function PencilIcon(props) {
  return (
    <svg {...BASE} {...props}>
      <path d="M15.5 4.5 19.5 8.5 8.5 19.5 4 20l0.5-4.5Z" />
      <path d="M14 6 18 10" />
    </svg>
  );
}

export function EyeIcon(props) {
  return (
    <svg {...BASE} {...props}>
      <path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z" />
      <circle cx="12" cy="12" r="2.6" />
    </svg>
  );
}

export function EyeOffIcon(props) {
  return (
    <svg {...BASE} {...props}>
      <path d="M3.5 3.5l17 17" />
      <path d="M10.6 5.7A10.6 10.6 0 0 1 12 5.5c6 0 9.5 6.5 9.5 6.5a15.4 15.4 0 0 1-3.1 3.9M7.4 7.4C4.9 9 2.5 12 2.5 12s3.5 6.5 9.5 6.5a9.7 9.7 0 0 0 3-.5" />
      <path d="M9.6 10a2.6 2.6 0 0 0 3.7 3.7" />
    </svg>
  );
}

export function MoreIcon(props) {
  return (
    <svg {...BASE} {...props} fill="currentColor" stroke="none">
      <circle cx="5" cy="12" r="1.7" />
      <circle cx="12" cy="12" r="1.7" />
      <circle cx="19" cy="12" r="1.7" />
    </svg>
  );
}

export function CameraIcon(props) {
  return (
    <svg {...BASE} {...props}>
      <path d="M4 8.5h2.8L8 6.2h8l1.2 2.3H20v10.3H4Z" />
      <circle cx="12" cy="13" r="3.2" />
    </svg>
  );
}

export function SlidersIcon(props) {
  return (
    <svg {...BASE} {...props}>
      <path d="M5 6.5h14M5 12h14M5 17.5h14" />
      <circle cx="9" cy="6.5" r="1.8" fill="currentColor" stroke="none" />
      <circle cx="16" cy="12" r="1.8" fill="currentColor" stroke="none" />
      <circle cx="10.5" cy="17.5" r="1.8" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function PlusIcon(props) {
  return (
    <svg {...BASE} {...props}>
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}
