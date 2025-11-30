// FILE: /Users/mustamusic/web/sorteos-lxm/src/pages/AdminBanners.js
import React, { useEffect, useState } from "react";
import API_URL from "../config/api";
import { useNavigate } from "react-router-dom";

export default function AdminBanners() {
  const [banners, setBanners] = useState([]);
  const [file, setFile] = useState(null);
  const navigate = useNavigate();

  // Verifica token
  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) navigate("/admin/login");
  }, [navigate]);

  const fetchBanners = async () => {
    try {
      const res = await fetch(`${API_URL}/banners`);
      const data = await res.json();
      setBanners(data);
    } catch (error) {
      console.error("Error cargando banners:", error);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  const uploadBanner = async () => {
    if (!file) return alert("Seleccioná una imagen");

    const token = localStorage.getItem("adminToken");

    const formData = new FormData();
    formData.append("banner", file);

    try {
      const res = await fetch(`${API_URL}/banners/upload`, {
        method: "POST",
        headers: {
          "x-admin-token": token  // 🔥 TOKEN CORRECTO
        },
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        console.error("Error subiendo banner:", data);
        alert(data.error);
        return;
      }

      setFile(null);
      fetchBanners(); // 🔥 Actualiza la lista después de subir
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const deleteBanner = async (id) => {
    const token = localStorage.getItem("adminToken");

    try {
      const res = await fetch(`${API_URL}/banners/${id}`, {
        method: "DELETE",
        headers: {
          "x-admin-token": token
        }
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error);
        return;
      }

      fetchBanners();
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Banners</h1>

      <div className="mb-6">
        <input type="file" onChange={e => setFile(e.target.files[0])} />
        <button
          onClick={uploadBanner}
          className="bg-blue-600 text-white px-4 py-2 rounded ml-2"
        >
          Subir
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {banners.map((b) => (
          <div key={b.id} className="bg-white shadow rounded p-3">
            <img src={b.url} className="w-full h-32 object-cover rounded" alt="banner" />

            <button
              onClick={() => deleteBanner(b.id)}
              className="bg-red-600 text-white px-3 py-1 rounded mt-2"
            >
              🗑 Eliminar
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
