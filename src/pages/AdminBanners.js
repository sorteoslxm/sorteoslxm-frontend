// FILE: /Users/mustamusic/web/sorteos-lxm/src/pages/AdminBanners.js
import React, { useEffect, useState } from "react";
import API_URL from "../config/api";
import { useNavigate } from "react-router-dom";

export default function AdminBanners() {
  const [banners, setBanners] = useState([]);
  const [file, setFile] = useState(null);
  const [link, setLink] = useState(""); // <--- AGREGADO
  const [orden, setOrden] = useState(""); // Orden del banner
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
    formData.append("link", link);  // <--- guardamos link también
    formData.append("orden", orden); // Enviamos el orden también

    const res = await fetch(`${API_URL}/banners/upload`, {
      method: "POST",
      headers: { "x-admin-token": token },
      body: formData,
    });

    setFile(null);
    setLink("");
    setOrden(""); // Limpiamos el campo de orden
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

  const updateLink = async (id, newLink) => {
    const token = localStorage.getItem("adminToken");

    await fetch(`${API_URL}/banners/${id}/link`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "x-admin-token": token,
      },
      body: JSON.stringify({ link: newLink }),
    });

    fetchBanners();
  };

  const updateOrden = async (id, newOrden) => {
    const token = localStorage.getItem("adminToken");

    await fetch(`${API_URL}/banners/${id}/orden`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "x-admin-token": token,
      },
      body: JSON.stringify({ orden: newOrden }),
    });

    fetchBanners();
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Banners</h1>

      {/* SUBIR */}
      <div className="mb-6 space-y-2">
        <input type="file" onChange={e => setFile(e.target.files[0])} />

        <input
          type="text"
          placeholder="Link (opcional)"
          value={link}
          onChange={(e) => setLink(e.target.value)}
          className="border p-2 rounded w-full"
        />

        <input
          type="number"
          placeholder="Orden (opcional)"
          value={orden}
          onChange={(e) => setOrden(e.target.value)}
          className="border p-2 rounded w-full"
        />

        <button
          onClick={uploadBanner}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Subir banner
        </button>
      </div>

      {/* LISTA */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {banners.map((b) => (
          <div key={b.id} className="bg-white shadow rounded p-3">

            <img src={b.url} className="w-full h-32 object-cover rounded" alt="banner" />

            {/* EDITAR LINK */}
            <input
              type="text"
              className="border p-2 rounded w-full mt-3"
              value={b.link || ""}
              placeholder="Agregar/editar link"
              onChange={(e) => updateLink(b.id, e.target.value)}
            />

            {/* ORDEN */}
            <input
              type="number"
              className="border p-2 rounded w-full mt-3"
              value={b.orden || ""}
              placeholder="Orden"
              onChange={(e) => updateOrden(b.id, e.target.value)}
            />

            {/* PRINCIPAL */}
            <button
              onClick={() => togglePrincipal(b.id)}
              className={`px-3 py-1 rounded mt-3 w-full text-white ${
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
