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

// 🔐 Rutas protegidas
import AdminRoute from "./components/AdminRoute";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Público */}
        <Route path="/" element={<Home />} />
        <Route path="/sorteo/:id" element={<SorteoDetalle />} />

        {/* Login Admin */}
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* Admin: Panel */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />

        {/* Admin: Banners */}
        <Route
          path="/admin/banners"
          element={
            <AdminRoute>
              <AdminBanners />
            </AdminRoute>
          }
        />

        {/* Admin: Sorteos */}
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
