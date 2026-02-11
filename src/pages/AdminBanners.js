// FILE: src/pages/AdminBanners.js
import React, { useEffect, useState } from "react";
import API_URL from "../config/api";
import { useNavigate } from "react-router-dom";

export default function AdminBanners() {
  const [principal, setPrincipal] = useState(null);
  const [secundarios, setSecundarios] = useState([]);
  const [file, setFile] = useState(null);
  const [link, setLink] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) navigate("/admin/login");
  }, [navigate]);

  const fetchBanners = async () => {
    const res = await fetch(`${API_URL}/banners`);
    const data = await res.json();

    const p = data.find(b => b.destacado) || null;
    const s = data
      .filter(b => !b.destacado)
      .sort((a, b) => (a.orden ?? 0) - (b.orden ?? 0));

    setPrincipal(p);
    setSecundarios(s);
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  const uploadBanner = async () => {
    if (!file) return alert("Seleccioná una imagen");

    const token = localStorage.getItem("adminToken");
    const formData = new FormData();
    formData.append("banner", file);
    formData.append("link", link);

    await fetch(`${API_URL}/banners/upload`, {
      method: "POST",
      headers: { "x-admin-token": token },
      body: formData,
    });

    setFile(null);
    setLink("");
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

    await fetch(`${API_URL}/banners/${id}/destacar`, {
      method: "PATCH",
      headers: { "x-admin-token": token },
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
    const ordenFinal = Math.max(newOrden, 0);

    await fetch(`${API_URL}/banners/${id}/orden`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "x-admin-token": token,
      },
      body: JSON.stringify({ orden: ordenFinal }),
    });

    fetchBanners();
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Banners</h1>

      {/* SUBIR BANNER */}
      <div className="mb-8 space-y-2">
        <input type="file" onChange={(e) => setFile(e.target.files[0])} />
        <input
          type="text"
          placeholder="Link (opcional)"
          value={link}
          onChange={(e) => setLink(e.target.value)}
          className="border p-2 rounded w-full"
        />
        <button
          onClick={uploadBanner}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Subir banner
        </button>
      </div>

      {/* BANNER PRINCIPAL */}
      {principal && (
        <div className="bg-white shadow rounded p-3 mb-6">
          <img
            src={principal.url}
            alt="banner principal"
            className="w-full h-32 object-cover rounded"
          />
          <div className="flex flex-col gap-2 mt-2">
            <input
              type="text"
              className="border p-2 rounded w-full"
              value={principal.link || ""}
              placeholder="Agregar/editar link"
              onChange={(e) => updateLink(principal.id, e.target.value)}
            />
            <button
              onClick={() => togglePrincipal(principal.id)}
              className="bg-red-600 text-white px-3 py-1 rounded w-full"
            >
              ❌ Quitar principal
            </button>
            <button
              onClick={() => deleteBanner(principal.id)}
              className="bg-red-600 text-white px-3 py-1 rounded w-full"
            >
              🗑 Eliminar
            </button>
          </div>
        </div>
      )}

      {/* BANNERS SECUNDARIOS */}
      <h2 className="text-xl font-bold mb-4">Banners secundarios</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {secundarios.map((b, index) => (
          <div key={b.id} className="bg-white shadow rounded p-3">
            <img
              src={b.url}
              alt="banner"
              className="w-full h-32 object-cover rounded"
            />

            <div className="flex items-center justify-between mt-2 text-sm">
              <span className="font-bold">Orden: {b.orden ?? index}</span>

              <div className="flex gap-2">
                <button
                  onClick={() =>
                    updateOrden(b.id, (b.orden ?? index) - 1)
                  }
                  className="px-2 py-1 bg-gray-200 rounded"
                >
                  ⬆
                </button>
                <button
                  onClick={() =>
                    updateOrden(b.id, (b.orden ?? index) + 1)
                  }
                  className="px-2 py-1 bg-gray-200 rounded"
                >
                  ⬇
                </button>
              </div>
            </div>

            <input
              type="text"
              className="border p-2 rounded w-full mt-3"
              value={b.link || ""}
              placeholder="Agregar/editar link"
              onChange={(e) => updateLink(b.id, e.target.value)}
            />

            <button
              onClick={() => togglePrincipal(b.id)}
              className="px-3 py-1 rounded mt-3 w-full text-white bg-blue-600"
            >
              🥇 Hacer principal
            </button>

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
