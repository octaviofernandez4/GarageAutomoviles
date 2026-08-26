import { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Header from "./components/Header/Header.jsx";
import Footer from "./components/Footer/Footer.jsx";
import Home from "./pages/Home.jsx";
import Stock from "./pages/Stock.jsx";
import VehicleDetail from "./pages/VehicleDetail.jsx";
import TradeIn from "./pages/TradeIn.jsx";
import "./App.css";

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

export default function App() {
  return (
    <div className="app">
      <ScrollToTop />
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/stock" element={<Stock />} />
        <Route path="/stock/:id" element={<VehicleDetail />} />
        <Route path="/tasar" element={<TradeIn />} />
      </Routes>
      <Footer />
    </div>
  );
}
