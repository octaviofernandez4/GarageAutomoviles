import Hero from "../components/Hero/Hero.jsx";
import QuickSearch from "../components/QuickSearch/QuickSearch.jsx";
import FeaturedVehicles from "../components/FeaturedVehicles/FeaturedVehicles.jsx";
import Standard from "../components/Standard/Standard.jsx";
import TradeInTeaser from "../components/TradeInTeaser/TradeInTeaser.jsx";
import VisitUs from "../components/VisitUs/VisitUs.jsx";
import useVehicles from "../hooks/useVehicles.js";
import { decorateVehicle } from "../utils/format.js";

export default function Home() {
  const { vehicles } = useVehicles();
  const decorated = vehicles.map(decorateVehicle);

  return (
    <main>
      <Hero total={vehicles.length} />
      <QuickSearch />
      <FeaturedVehicles vehicles={decorated} />
      <Standard />
      <TradeInTeaser />
      <VisitUs />
    </main>
  );
}
