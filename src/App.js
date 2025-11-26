// FILE: /Users/mustamusic/web/sorteos-lxm/src/App.js

import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import SorteoDetalle from "./pages/SorteoDetalle";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import AdminBanners from "./pages/AdminBanners";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />

        {/* 👇 Sorteos */}
        <Route path="/sorteo/:id" element={<SorteoDetalle />} />

        {/* 👇 Login */}
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* 👇 Dashboard */}
        <Route path="/admin" element={<AdminDashboard />} />

        {/* 👇 Panel Banners */}
        <Route path="/admin/banners" element={<AdminBanners />} />
      </Routes>
    </BrowserRouter>
  );
}
