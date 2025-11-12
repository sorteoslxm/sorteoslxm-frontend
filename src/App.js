// web/sorteos-lxm/client/src/App.js
<h1 style={{ textAlign: "center", marginTop: "20px", color: "#00bfff" }}>
  🚀 Sorteos LXM — Versión React limpia (Build {new Date().toLocaleDateString()})
</h1>

import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SorteosList from "./components/SorteosList";
import SorteoDetalle from "./components/SorteoDetalle";

// 🔧 Corrección de rutas de pago
import PagoExito from "./pages/PagoExito";
import PagoError from "./pages/PagoError";
import PagoPendiente from "./pages/PagoPendiente";

import AdminLogin from "./pages/AdminLogin";
import AdminHome from "./pages/AdminHome";
import AdminDashboard from "./pages/AdminDashboard";
import AdminBanners from "./pages/AdminBanners";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Router>
      <Routes>
        {/* Público */}
        <Route path="/" element={<SorteosList />} />
        <Route path="/sorteo/:id" element={<SorteoDetalle />} />
        <Route path="/pago-exito" element={<PagoExito />} />
        <Route path="/pago-error" element={<PagoError />} />
        <Route path="/pago-pendiente" element={<PagoPendiente />} />

        {/* Admin */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/admin/home"
          element={
            <ProtectedRoute>
              <AdminHome />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/banners"
          element={
            <ProtectedRoute>
              <AdminBanners />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
