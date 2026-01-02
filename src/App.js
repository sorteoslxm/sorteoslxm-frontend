// FILE: /Users/mustamusic/web/sorteos-lxm/src/App.js
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import SorteoDetalle from "./pages/SorteoDetalle";
import ComoFunciona from "./pages/ComoFunciona";

/* 🧱 CAJAS */
import CajasHome from "./pages/CajasHome";
import Caja100k from "./pages/Caja100k";

/* 🔐 ADMIN */
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import AdminBanners from "./pages/AdminBanners";
import AdminCajas from "./pages/AdminCajas";
import AdminSorteos from "./pages/AdminSorteos";
import AdminNuevoSorteo from "./pages/AdminNuevoSorteo";
import AdminEditarSorteo from "./pages/AdminEditarSorteo";
import AdminCompras from "./pages/AdminCompras";
import AdminChances from "./pages/AdminChances";
import AdminDashboardVentas from "./pages/AdminDashboardVentas";

import AdminRoute from "./components/AdminRoute";

// ⭐ Estados de pago
import Success from "./pages/Success";
import Pending from "./pages/Pending";
import Failure from "./pages/Failure";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 🌍 Público */}
        <Route path="/" element={<Home />} />
        <Route path="/sorteo/:id" element={<SorteoDetalle />} />
        <Route path="/como-funciona" element={<ComoFunciona />} />

        {/* 🧱 CAJAS */}
        <Route path="/cajas" element={<CajasHome />} />
        <Route path="/cajas/100k" element={<Caja100k />} />

        {/* 💳 Post-pago MercadoPago */}
        <Route path="/success" element={<Success />} />
        <Route path="/pago/exito" element={<Success />} />
        <Route path="/pago/pendiente" element={<Pending />} />
        <Route path="/pago/error" element={<Failure />} />

        {/* 🔐 Login Admin */}
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* 🛠️ ADMIN PROTEGIDO (LAYOUT) */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="cajas" element={<AdminCajas />} />
          <Route path="compras" element={<AdminCompras />} />
          <Route path="chances" element={<AdminChances />} />
          <Route path="dashboard/ventas" element={<AdminDashboardVentas />} />
          <Route path="banners" element={<AdminBanners />} />
          <Route path="sorteos" element={<AdminSorteos />} />
          <Route path="sorteos/nuevo" element={<AdminNuevoSorteo />} />
          <Route path="sorteos/editar/:id" element={<AdminEditarSorteo />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
