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

        {/* 🛠️ Admin protegido */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/cajas"
          element={
            <AdminRoute>
              <AdminCajas />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/compras"
          element={
            <AdminRoute>
              <AdminCompras />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/chances"
          element={
            <AdminRoute>
              <AdminChances />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/dashboard/ventas"
          element={
            <AdminRoute>
              <AdminDashboardVentas />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/banners"
          element={
            <AdminRoute>
              <AdminBanners />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/sorteos"
          element={
            <AdminRoute>
              <AdminSorteos />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/sorteos/nuevo"
          element={
            <AdminRoute>
              <AdminNuevoSorteo />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/sorteos/editar/:id"
          element={
            <AdminRoute>
              <AdminEditarSorteo />
            </AdminRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
