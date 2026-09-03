import { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Header from "./components/Header/Header.jsx";
import Footer from "./components/Footer/Footer.jsx";
import ChatWidget from "./components/ChatWidget/ChatWidget.jsx";
import Home from "./pages/Home.jsx";
import Stock from "./pages/Stock.jsx";
import VehicleDetail from "./pages/VehicleDetail.jsx";
import TradeIn from "./pages/TradeIn.jsx";
import AdminLogin from "./pages/admin/AdminLogin.jsx";
import AdminLayout from "./pages/admin/AdminLayout.jsx";
import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import AdminVehicles from "./pages/admin/AdminVehicles.jsx";
import AdminVehicleForm from "./pages/admin/AdminVehicleForm.jsx";
import AdminSettings from "./pages/admin/AdminSettings.jsx";
import AdminChats from "./pages/admin/AdminChats.jsx";
import AdminLeads from "./pages/admin/AdminLeads.jsx";
import RequireAdmin from "./components/RequireAdmin/RequireAdmin.jsx";
import { AdminAuthProvider } from "./context/AdminAuthContext.jsx";
import "./App.css";

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

export default function App() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/admin");
  const isLanding = location.pathname === "/";

  return (
    <AdminAuthProvider>
      <div className="app">
        <ScrollToTop />
        {!isAdmin && <Header />}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/stock" element={<Stock />} />
          <Route path="/stock/:id" element={<VehicleDetail />} />
          <Route path="/tasar" element={<TradeIn />} />

          <Route path="/admin/login" element={<AdminLogin />} />
          <Route
            path="/admin"
            element={
              <RequireAdmin>
                <AdminLayout />
              </RequireAdmin>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="vehiculos" element={<AdminVehicles />} />
            <Route path="vehiculos/nuevo" element={<AdminVehicleForm mode="create" />} />
            <Route path="vehiculos/:id/editar" element={<AdminVehicleForm mode="edit" />} />
            <Route path="ajustes" element={<AdminSettings />} />
            <Route path="chats" element={<AdminChats />} />
            <Route path="tasaciones" element={<AdminLeads />} />
          </Route>
        </Routes>
        {!isAdmin && <Footer />}
        {isLanding && <ChatWidget />}
      </div>
    </AdminAuthProvider>
  );
}
