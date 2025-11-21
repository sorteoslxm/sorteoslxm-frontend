// FILE: /Users/mustamusic/web/sorteos-lxm/src/App.js

import { BrowserRouter, Routes, Route } from "react-router-dom";

// Páginas públicas
import Home from "./pages/Home";
import SorteoDetalle from "./pages/SorteoDetalle";

// Panel admin
import AdminHome from "./pages/AdminHome";
import AdminBanners from "./pages/AdminBanners";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* HOME */}
        <Route path="/" element={<Home />} />

        {/* Página individual de sorteo */}
        <Route path="/sorteo/:id" element={<SorteoDetalle />} />

        {/* ADMIN */}
        <Route path="/admin" element={<AdminHome />} />
        <Route path="/admin/banners" element={<AdminBanners />} />
      </Routes>
    </BrowserRouter>
  );
}
