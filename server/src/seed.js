import "dotenv/config";
import { connectDB } from "./db.js";
import Vehicle from "./models/Vehicle.js";
import mongoose from "mongoose";

// TODO: reemplazar year/price/km/engine con los datos reales de cada unidad.
const vehicles = [
  {
    name: "Audi Q5",
    year: 2023,
    price: 55000,
    km: 42699,
    engine: "2.0 TDI",
    image: "/vehicles/audi.png",
  },
  {
    name: "Toyota Corolla Cross",
    year: 2023,
    price: 38000,
    km: 35000,
    engine: "2.0 CVT",
    image: "/vehicles/corolla-cross.png",
  },
  {
    name: "Ford Ranger Raptor",
    year: 2023,
    price: 42500,
    km: 15000,
    engine: "3.0 V6 EcoBoost",
    image: "/vehicles/raptor.png",
  },
];

async function seed() {
  await connectDB();
  await Vehicle.deleteMany({});
  await Vehicle.insertMany(vehicles);
  console.log(`Seeded ${vehicles.length} vehicles.`);
  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
