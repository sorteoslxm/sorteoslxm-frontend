// FILE: /Users/mustamusic/web/sorteos-lxm/src/pages/AdminDashboard.js

import React, { useState } from "react";
import axios from "axios";
import API_URL from "../config/api";

const CLOUD_NAME = "dx9tmn9pu"; // <-- tu cloud name
const UPLOAD_PRESET = "sorteos_lxm"; // <-- preset para permitir uploads

const AdminDashboard = () => {
  const [uploading, setUploading] = useState(false);

  const [sorteo, setSorteo] = useState({
    titulo: "",
    descripcion: "",
    precio: "",
    numerosTotales: "",
    imagenUrl: "",
    mpAccount: "cuenta1",
    featured: false,
    bannerPrincipal: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSorteo({ ...sorteo, [name]: type === "checkbox" ? checked : value });
  };

  const uploadToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);

    setUploading(true);

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await res.json();
    setUploading(false);
    return data.secure_url;
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const url = await uploadToCloudinary(file);
    setSorteo({ ...sorteo, imagenUrl: url });
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    const logged = localStorage.getItem("adminLogged");
    if (!logged) {
      alert("No estás autenticado");
      return;
    }

    try {
      await axios.post(`${API_URL}/sorteos`, sorteo);
      alert("Sorteo creado correctamente!");

      setSorteo({
        titulo: "",
        descripcion: "",
        precio: "",
        numerosTotales: "",
        imagenUrl: "",
        mpAccount: "cuenta1",
        featured: false,
        bannerPrincipal: false,
      });
    } catch (err) {
      console.error("Error al crear sorteo:", err);
      alert("Error al crear sorteo");
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-4">Panel de Administración</h1>

      <form onSubmit={onSubmit} className="space-y-4">

        <input name="titulo" value={sorteo.titulo} onChange={handleChange} placeholder="Título" className="w-full p-2 border rounded" />

        <textarea name="descripcion" value={sorteo.descripcion} onChange={handleChange} placeholder="Descripción" className="w-full p-2 border rounded" />

        <input name="precio" type="number" value={sorteo.precio} onChange={handleChange} placeholder="Precio" className="w-full p-2 border rounded" />

        <input name="numerosTotales" type="number" value={sorteo.numerosTotales} onChange={handleChange} placeholder="Cantidad total" className="w-full p-2 border rounded" />

        {/* SUBIR IMAGEN */}
        <div>
          <label className="font-bold">Imagen del sorteo</label>
          <input type="file" onChange={handleImageUpload} className="w-full p-2 border rounded" />
        </div>

        {uploading && <p className="text-blue-500">Subiendo imagen...</p>}

        {sorteo.imagenUrl && (
          <img src={sorteo.imagenUrl} alt="preview" className="w-full rounded border" />
        )}

        {/* MERCADO PAGO */}
        <select
          name="mpAccount"
          value={sorteo.mpAccount}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        >
          <option value="cuenta1">Cuenta Mercado Pago 1</option>
          <option value="cuenta2">Cuenta Mercado Pago 2</option>
          <option value="cuenta3">Cuenta Mercado Pago 3</option>
        </select>

        {/* ⭐ DESTACADO */}
        <label className="flex gap-2 items-center">
          <input
            type="checkbox"
            name="featured"
            checked={sorteo.featured}
            onChange={handleChange}
          />
          Destacar sorteo ⭐
        </label>

        {/* 🏆 BANNER PRINCIPAL */}
        <label className="flex gap-2 items-center">
          <input
            type="checkbox"
            name="bannerPrincipal"
            checked={sorteo.bannerPrincipal}
            onChange={handleChange}
          />
          Usar como banner principal 🏆
        </label>

        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          Crear sorteo
        </button>
      </form>
    </div>
  );
};

export default AdminDashboard;
