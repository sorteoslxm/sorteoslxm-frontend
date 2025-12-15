import React, { useEffect, useState } from "react";
import API_URL from "../config/api";
import { useNavigate } from "react-router-dom";

export default function AdminBanners() {
  const [banners, setBanners] = useState([]);
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
    setBanners(data);
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
      headers: {
        "x-admin-token": token,
      },
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
      headers: {
        "x-admin-token": token,
      },
    });

    fetchBanners();
  };

  const togglePrincipal = async (id) => {
    const token = localStorage.getItem("adminToken");

    await fetch(`${API_URL}/banners/${id}/principal`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "x-admin-token": token,
      },
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
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Banners</h1>

      {/* SUBIR */}
      <div className="mb-6 space-y-2">
        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
        />

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

      {/* LISTA */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {banners.map((b) => (
          <div key={b.id} className="bg-white shadow rounded p-3">
            <img
              src={b.url}
              alt="banner"
              className="w-full h-32 object-cover rounded"
            />

            {/* EDITAR LINK */}
            <input
              type="text"
              className="border p-2 rounded w-full mt-3"
              value={b.link || ""}
              placeholder="Agregar/editar link"
              onChange={(e) => updateLink(b.id, e.target.value)}
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

            {/* ELIMINAR */}
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
