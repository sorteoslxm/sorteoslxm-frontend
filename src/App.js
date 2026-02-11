// FILE: /Users/mustamusic/web/sorteos-lxm/src/App.js
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import SorteoDetalle from "./pages/SorteoDetalle";
import ComoFunciona from "./pages/ComoFunciona";

/* 🧱 CAJAS (PÚBLICO) */
import CajasHome from "./pages/CajasHome";
import CajaDetalle from "./pages/CajaDetalle";

/* 🎁 APERTURA DE CAJAS */
import AbrirCaja from "./pages/AbrirCaja";
import ResultadoCajaPerder from "./pages/ResultadoCajaPerder";
import ResultadoCajaGanar from "./pages/ResultadoCajaGanar";

/* 🔐 ADMIN */
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import AdminBanners from "./pages/AdminBanners";
import AdminCajas from "./pages/AdminCajas";
import AdminEditarCaja from "./pages/AdminEditarCaja";
import AdminSorteos from "./pages/AdminSorteos";
import AdminNuevoSorteo from "./pages/AdminNuevoSorteo";
import AdminEditarSorteo from "./pages/AdminEditarSorteo";
import AdminCompras from "./pages/AdminCompras";
import AdminChances from "./pages/AdminChances";
import AdminDashboardVentas from "./pages/AdminDashboardVentas";
import AdminVentasPendientes from "./pages/AdminVentasPendientes"; // ✅ NUEVO
import AdminPacks from "./components/AdminPacks";

import AdminRoute from "./components/AdminRoute";

/* ⭐ Estados de pago */
import Success from "./pages/Success";
import Pending from "./pages/Pending";
import Failure from "./pages/Failure";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 🌍 PÚBLICO */}
        <Route path="/" element={<Home />} />
        <Route path="/sorteo/:id" element={<SorteoDetalle />} />
        <Route path="/como-funciona" element={<ComoFunciona />} />

        {/* 🧱 CAJAS */}
        <Route path="/cajas" element={<CajasHome />} />
        <Route path="/cajas/:slug" element={<CajaDetalle />} />

        {/* 🎁 APERTURA DE CAJA */}
        <Route path="/abrir-caja/:id" element={<AbrirCaja />} />

        {/* 🎁 RESULTADO CAJA */}
        <Route path="/resultado-caja/perder" element={<ResultadoCajaPerder />} />
        <Route path="/resultado-caja/ganar" element={<ResultadoCajaGanar />} />

        {/* 💳 POST PAGO */}
        <Route path="/success" element={<Success />} />
        <Route path="/pago/exito" element={<Success />} />
        <Route path="/pago/pendiente" element={<Pending />} />
        <Route path="/pago/error" element={<Failure />} />

        {/* 🔐 LOGIN ADMIN */}
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* 🛠️ ADMIN (LAYOUT PROTEGIDO) */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        >
          {/* 📦 CAJAS */}
          <Route path="cajas" element={<AdminCajas />} />
          <Route path="cajas/editar/:id" element={<AdminEditarCaja />} />
          <Route path="cajas/:cajaId/packs" element={<AdminPacks />} />

          {/* 🎟️ SORTEOS */}
          <Route path="sorteos" element={<AdminSorteos />} />
          <Route path="sorteos/nuevo" element={<AdminNuevoSorteo />} />
          <Route path="sorteos/editar/:id" element={<AdminEditarSorteo />} />

          {/* 💰 VENTAS */}
          <Route path="dashboard/ventas" element={<AdminDashboardVentas />} />
          <Route path="ventas-pendientes" element={<AdminVentasPendientes />} /> {/* ✅ NUEVO */}

          {/* 📦 OTROS */}
          <Route path="compras" element={<AdminCompras />} />
          <Route path="chances" element={<AdminChances />} />
          <Route path="banners" element={<AdminBanners />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
