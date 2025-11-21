// FILE: /Users/mustamusic/web/sorteos-lxm/src/pages/AdminBanners.js

import React, { useEffect, useState } from "react";
import API_URL from "../config/api";

const CLOUD_NAME = "dx9tmn9pu";
const UPLOAD_PRESET = "sorteos_lxm";

export default function AdminBanners() {
  const [uploading, setUploading] = useState(false);

  const [banners, setBanners] = useState([]);
  const [nuevoBanner, setNuevoBanner] = useState({
    titulo: "",
    imagenUrl: "",
    link: "",
  });

  const fetchBanners = async () => {
    try {
      const res = await fetch(`${API_URL}/banners`);
      const data = await res.json();
      setBanners(data);
    } catch (error) {
      console.error("Error al cargar banners:", error);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  const uploadToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);

    setUploading(true);

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
      { method: "POST", body: formData }
    );

    const data = await res.json();
    setUploading(false);
    return data.secure_url;
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const url = await uploadToCloudinary(file);
    setNuevoBanner({ ...nuevoBanner, imagenUrl: url });
  };

  const handleChange = (e) => {
    setNuevoBanner({ ...nuevoBanner, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await fetch(`${API_URL}/banners`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nuevoBanner),
      });

      setNuevoBanner({ titulo: "", imagenUrl: "", link: "" });
      fetchBanners();
    } catch (error) {
      alert("Error al crear banner");
    }
  };

  const eliminar = async (id) => {
    if (!window.confirm("¿Eliminar banner?")) return;

    await fetch(`${API_URL}/banners/${id}`, { method: "DELETE" });
    fetchBanners();
  };

  const destacar = async (id) => {
    await fetch(`${API_URL}/banners/destacar/${id}`, { method: "PUT" });
    fetchBanners();
  };

  const principal = async (id) => {
    await fetch(`${API_URL}/banners/principal/${id}`, { method: "PUT" });
    fetchBanners();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h2 className="text-3xl font-bold mb-6">🎨 Gestión de Banners</h2>

      {/* FORMULARIO */}
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-lg mb-10 max-w-xl">
        <h3 className="text-xl font-bold mb-4">➕ Nuevo Banner</h3>

        <input
          name="titulo"
          value={nuevoBanner.titulo}
          onChange={handleChange}
          placeholder="Título"
          className="border p-2 rounded w-full mb-3"
          required
        />

        {/* SUBIR IMAGEN */}
        <input type="file" onChange={handleImageUpload} className="border p-2 rounded w-full mb-3" />

        {uploading && <p className="text-blue-500">Subiendo imagen...</p>}

        {nuevoBanner.imagenUrl && (
          <img src={nuevoBanner.imagenUrl} className="w-full h-40 object-cover rounded mb-3" />
        )}

        <input
          name="link"
          value={nuevoBanner.link}
          onChange={handleChange}
          placeholder="Link opcional"
          className="border p-2 rounded w-full mb-3"
        />

        <button className="bg-green-600 text-white py-2 px-5 rounded-lg hover:bg-green-700">
          Crear banner
        </button>
      </form>

      {/* LISTA */}
      <h3 className="text-2xl font-semibold mb-4">📌 Banners creados</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {banners.map((b) => (
          <div key={b.id} className="bg-white p-4 rounded-xl shadow flex flex-col items-center">
            <img src={b.imagenUrl} alt={b.titulo} className="w-full h-40 object-cover rounded mb-3" />

            <p className="text-lg font-bold">{b.titulo}</p>

            {b.link && (
              <a href={b.link} target="_blank" className="text-blue-600 text-sm mt-1 underline">
                Abrir enlace
              </a>
            )}

            <div className="flex gap-2 mt-4">
              <button
                onClick={() => destacar(b.id)}
                className={`px-3 py-1 rounded ${
                  b.destacado ? "bg-yellow-500 text-white" : "bg-gray-200 hover:bg-yellow-300"
                }`}
              >
                ⭐ Destacar
              </button>

              <button
                onClick={() => principal(b.id)}
                className={`px-3 py-1 rounded ${
                  b.principal ? "bg-blue-600 text-white" : "bg-gray-200 hover:bg-blue-300"
                }`}
              >
                🏆 Principal
              </button>

              <button onClick={() => eliminar(b.id)} className="bg-red-500 text-white px-3 py-1 rounded">
                ❌
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
