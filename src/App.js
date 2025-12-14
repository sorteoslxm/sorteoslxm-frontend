// FILE: /Users/mustamusic/web/sorteos-lxm/src/App.js
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import SorteoDetalle from "./pages/SorteoDetalle";

import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import AdminBanners from "./pages/AdminBanners";

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

        {/* 💳 Post-pago MercadoPago */}
        {/* MercadoPago suele volver a /success */}
        <Route path="/success" element={<Success />} />

        {/* Rutas internas por si las usás manualmente */}
        <Route path="/pago/exito" element={<Success />} />
        <Route path="/pago/pendiente" element={<Pending />} />
        <Route path="/pago/error" element={<Failure />} />

        {/* 🔐 Login Admin */}
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* 🛠️ Admin */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminDashboard />
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
