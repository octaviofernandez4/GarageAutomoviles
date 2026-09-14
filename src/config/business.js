export const SITE_URL = "https://elgarageautomovilesyb.com";
export const BUSINESS_NAME = "El Garage Automóviles";

export const PHONE_INTL = "5493810000000";
export const WHATSAPP_URL = `https://wa.me/${PHONE_INTL}`;
export const INSTAGRAM_URL = "https://instagram.com/elgarageautomoviles";

export const ADDRESS_STREET = "Av. Aconquija 1763";
export const ADDRESS_LOCALITY = "Yerba Buena";
export const ADDRESS_REGION = "Tucumán";
export const ADDRESS_COUNTRY = "AR";
export const ADDRESS_FULL = `${ADDRESS_STREET}, ${ADDRESS_LOCALITY}, ${ADDRESS_REGION}`;

export const MAPS_URL = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(ADDRESS_FULL)}`;
export const MAPS_EMBED_URL = `https://www.google.com/maps?q=${encodeURIComponent(ADDRESS_FULL)}&output=embed`;

export const HOURS = [
  { label: "Lun a Vie", value: "09:00–13:00 · 16:30–20:30" },
  { label: "Sábados", value: "09:00–13:00" },
  { label: "Domingos", value: "Cerrado · atendemos por WhatsApp", muted: true },
];
