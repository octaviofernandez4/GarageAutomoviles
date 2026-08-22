// Copia local de los vehículos destacados, usada como respaldo cuando el
// front se despliega sin el backend/base de datos conectados.
// TODO: reemplazar year/price/km/engine con los datos reales de cada unidad
// (mismo TODO pendiente en server/src/seed.js — mantener ambos en sync).
export const FALLBACK_VEHICLES = [
  {
    _id: "fallback-audi-q5",
    name: "Audi Q5",
    year: 2023,
    price: 55000,
    km: 42699,
    engine: "2.0 TDI",
    image: "/vehicles/audi.png",
  },
  {
    _id: "fallback-corolla-cross",
    name: "Toyota Corolla Cross",
    year: 2023,
    price: 38000,
    km: 35000,
    engine: "2.0 CVT",
    image: "/vehicles/corolla-cross.png",
  },
  {
    _id: "fallback-raptor",
    name: "Ford Ranger Raptor",
    year: 2023,
    price: 42500,
    km: 15000,
    engine: "3.0 V6 EcoBoost",
    image: "/vehicles/raptor.png",
  },
];
