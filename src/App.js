// FILE: /Users/mustamusic/web/sorteos-lxm/src/App.js

import { BrowserRouter, Routes, Route } from "react-router-dom";

// Páginas públicas
import Home from "./pages/Home";
import SorteoDetalle from "./pages/SorteoDetalle";

// Panel admin (ruta corregida)
import AdminDashboard from "./pages/AdminDashboard";
import AdminBanners from "./pages/AdminBanners";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* HOME */}
        <Route path="/" element={<Home />} />

        {/* Página individual de sorteo */}
        <Route path="/sorteo/:id" element={<SorteoDetalle />} />

        {/* Admin */}
        <Route path="/admin/sorteos" element={<AdminDashboard />} />
        <Route path="/admin/banners" element={<AdminBanners />} />
      </Routes>
    </BrowserRouter>
  );
}
