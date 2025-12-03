// FILE: /Users/mustamusic/web/sorteos-lxm/src/pages/AdminBanners.js
import React, { useEffect, useState } from "react";
import API_URL from "../config/api";
import { useNavigate } from "react-router-dom";

export default function AdminBanners() {
  const [banners, setBanners] = useState([]);
  const [file, setFile] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) navigate("/admin/login");
  }, [navigate]);

  const fetchBanners = async () => {
    const res = await fetch(`${API_URL}/banners`);
    setBanners(await res.json());
  };

  useEffect(fetchBanners, []);

  const uploadBanner = async () => {
    if (!file) return alert("Seleccioná una imagen");

    const token = localStorage.getItem("adminToken");
    const formData = new FormData();
    formData.append("banner", file);

    const res = await fetch(`${API_URL}/banners/upload`, {
      method: "POST",
      headers: { "x-admin-token": token },
      body: formData,
    });

    setFile(null);
    fetchBanners();
  };

  const deleteBanner = async (id) => {
    const token = localStorage.getItem("adminToken");

    await fetch(`${API_URL}/banners/${id}`, {
      method: "DELETE",
      headers: { "x-admin-token": token },
    });

    fetchBanners();
  };

  const togglePrincipal = async (id) => {
    const token = localStorage.getItem("adminToken");

    await fetch(`${API_URL}/banners/${id}/principal`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", "x-admin-token": token },
    });

    fetchBanners();
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Banners</h1>

      {/* SUBIR */}
      <div className="mb-6">
        <input type="file" onChange={e => setFile(e.target.files[0])} />
        <button
          onClick={uploadBanner}
          className="bg-blue-600 text-white px-4 py-2 rounded ml-2"
        >
          Subir
        </button>
      </div>

      {/* LISTA */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {banners.map((b) => (
          <div key={b.id} className="bg-white shadow rounded p-3">

            <img src={b.url} className="w-full h-32 object-cover rounded" alt="banner" />

            {/* PRINCIPAL */}
            <button
              onClick={() => togglePrincipal(b.id)}
              className={`px-3 py-1 rounded mt-2 w-full text-white ${
                b.bannerPrincipal ? "bg-red-600" : "bg-blue-600"
              }`}
            >
              {b.bannerPrincipal ? "❌ Quitar principal" : "🥇 Banner principal"}
            </button>

            {/* 🗑 Eliminar */}
            <button
              onClick={() => deleteBanner(b.id)}
              className="bg-red-600 text-white px-3 py-1 rounded mt-2 w-full"
            >
              🗑 Eliminar
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
