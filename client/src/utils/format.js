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
  return `${numberFormatter.format(value)} km`;
}

export function formatNumber(value) {
  return numberFormatter.format(value);
}

export function decorateVehicle(vehicle) {
  return {
    ...vehicle,
    priceFmt: formatMoney(vehicle.price),
    kmFmt: formatKm(vehicle.km),
    summary: `${vehicle.year} · ${formatKm(vehicle.km)} · ${vehicle.engine} · ${vehicle.gearbox}`,
  };
}
