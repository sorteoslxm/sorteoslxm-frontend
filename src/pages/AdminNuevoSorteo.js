// FILE: /Users/mustamusic/web/sorteos-lxm/src/pages/AdminNuevoSorteo.js

import React, { useState } from "react";

// ⚠️ Ruta API puesta directamente:
const API = "https://sorteoslxm-server-clean.onrender.com/sorteos";
// Si estás trabajando local:  const API = "http://localhost:5000/sorteos";

export default function AdminNuevoSorteo() {
  const [form, setForm] = useState({
    titulo: "",
    descripcion: "",
    precio: "",
    numerosTotales: "",
    imagenUrl: "",
    mpCuenta: "",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch(API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      alert("Sorteo creado correctamente");
      window.location.href = "/admin/sorteos";
    } else {
      alert("❌ Error al crear sorteo");
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">➕ Nuevo Sorteo</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="titulo"
          placeholder="Título"
          className="border p-2 rounded w-full"
          onChange={handleChange}
        />

        <textarea
          name="descripcion"
          placeholder="Descripción"
          className="border p-2 rounded w-full"
          onChange={handleChange}
        />

        <input
          name="precio"
          type="number"
          placeholder="Precio (ej: 500)"
          className="border p-2 rounded w-full"
          onChange={handleChange}
        />

        <input
          name="numerosTotales"
          type="number"
          placeholder="Cantidad de números"
          className="border p-2 rounded w-full"
          onChange={handleChange}
        />

        <input
          name="imagenUrl"
          placeholder="URL de imagen"
          className="border p-2 rounded w-full"
          onChange={handleChange}
        />

        <input
          name="mpCuenta"
          placeholder="Cuenta de MercadoPago"
          className="border p-2 rounded w-full"
          onChange={handleChange}
        />

        <button className="bg-blue-600 text-white py-2 rounded w-full">
          Crear Sorteo
        </button>
      </form>
    </div>
  );
}
