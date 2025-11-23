// FILE: /Users/mustamusic/web/sorteos-lxm/src/App.js

import { BrowserRouter, Routes, Route } from "react-router-dom";

// Páginas públicas
import Home from "./pages/Home";
import SorteoDetalle from "./pages/SorteoDetalle";

// Panel admin
import AdminLogin from "./pages/AdminLogin";
import AdminHome from "./pages/AdminHome";
import AdminBanners from "./pages/AdminBanners";
import AdminSorteos from "./pages/AdminSorteos";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* HOME */}
        <Route path="/" element={<Home />} />

        {/* DURACIÓN DE SORTEO */}
        <Route path="/sorteo/:id" element={<SorteoDetalle />} />

        {/* ADMIN LOGIN */}
        <Route path="/admin" element={<AdminLogin />} />

        {/* ADMIN INTERNO */}
        <Route path="/admin/home" element={<AdminHome />} />
        <Route path="/admin/banners" element={<AdminBanners />} />
        <Route path="/admin/sorteos" element={<AdminSorteos />} />

      </Routes>
    </BrowserRouter>
  );
}
