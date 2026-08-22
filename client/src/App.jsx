import Header from "./components/Header/Header.jsx";
import Hero from "./components/Hero/Hero.jsx";
import BrandsStrip from "./components/BrandsStrip/BrandsStrip.jsx";
import FeaturedVehicles from "./components/FeaturedVehicles/FeaturedVehicles.jsx";
import Standard from "./components/Standard/Standard.jsx";
import Stats from "./components/Stats/Stats.jsx";
import VisitUs from "./components/VisitUs/VisitUs.jsx";
import Footer from "./components/Footer/Footer.jsx";
import BottomNav from "./components/BottomNav/BottomNav.jsx";
import "./App.css";

export default function App() {
  return (
    <div className="app">
      <Header />
      <main>
        <Hero />
        <BrandsStrip />
        <FeaturedVehicles />
        <Standard />
        <Stats />
        <VisitUs />
      </main>
      <Footer />
      <BottomNav />
    </div>
  );
}
