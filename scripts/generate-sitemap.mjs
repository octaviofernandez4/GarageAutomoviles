import { writeFileSync } from "node:fs";

const SITE_URL = "https://elgarageautomovilesyb.com";
const API_BASE = process.env.VITE_API_URL || "";

const staticPaths = ["/", "/stock", "/tasar"];

async function fetchVehiclePaths() {
  if (!API_BASE) return [];
  try {
    const res = await fetch(`${API_BASE}/api/vehicles`);
    if (!res.ok) return [];
    const vehicles = await res.json();
    return vehicles.map((v) => `/stock/${v.id}`);
  } catch (err) {
    console.warn("No pudimos traer los vehículos para el sitemap, sigo solo con las páginas fijas:", err.message);
    return [];
  }
}

const vehiclePaths = await fetchVehiclePaths();
const allPaths = [...staticPaths, ...vehiclePaths];

const urls = allPaths
  .map((path) => `  <url><loc>${SITE_URL}${path}</loc></url>`)
  .join("\n");

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;

writeFileSync("dist/sitemap.xml", xml);
console.log(`sitemap.xml generado con ${allPaths.length} URLs.`);
