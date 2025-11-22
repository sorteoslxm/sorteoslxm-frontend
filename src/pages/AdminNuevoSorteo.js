// FILE: /Users/mustamusic/web/sorteos-lxm/src/pages/AdminNuevoSorteo.js
import React, { useState } from "react";
import API_URL from "../config/api";

export default function AdminNuevoSorteo() {
  const [form, setForm] = useState({
    titulo: "",
    descripcion: "",
    precio: "",
    numerosTotales: "",
    imagenUrl: "",
    mpCuenta: "", // ⭐ cuenta destino Mercadopago
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch(`${API_URL}/sorteos`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      alert("Sorteo creado");
      window.location.href = "/admin/sorteos";
    } else {
      alert("Error al crear sorteo");
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
          placeholder="Precio"
          className="border p-2 rounded w-full"
          onChange={handleChange}
        />

        <input
          name="numerosTotales"
          type="number"
          placeholder="Números totales"
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
          placeholder="Cuenta MercadoPago"
          className="border p-2 rounded w-full"
          onChange={handleChange}
        />

        <button className="bg-blue-600 text-white py-2 rounded w-full">
          Crear
        </button>
      </form>
    </div>
  );
}
