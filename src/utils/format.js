const moneyFormatter = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const numberFormatter = new Intl.NumberFormat("es-AR");

export function formatMoney(value) {
  return moneyFormatter.format(value);
}

export function formatKm(value) {
  if (value == null || Number.isNaN(Number(value))) return "s/d";
  return `${numberFormatter.format(value)} km`;
}

export function formatNumber(value) {
  return numberFormatter.format(value);
}

export function formatSpec(value) {
  return value || "s/d";
}

export function decorateVehicle(vehicle) {
  const images = vehicle.images?.length ? vehicle.images : [vehicle.image].filter(Boolean);

  return {
    ...vehicle,
    images,
    image: images[0],
    priceFmt: formatMoney(vehicle.price),
    kmFmt: formatKm(vehicle.km),
    summary: `${vehicle.year} · ${formatKm(vehicle.km)} · ${formatSpec(vehicle.engine)} · ${formatSpec(vehicle.gearbox)}`,
  };
}
