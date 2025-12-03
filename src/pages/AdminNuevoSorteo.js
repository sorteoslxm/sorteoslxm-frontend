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
    mpCuenta: "",
    destacado: false,
    sorteoPrincipal: false,
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
        <input name="titulo" className="border p-2 rounded w-full" placeholder="Título" onChange={handleChange} />

        <textarea name="descripcion" className="border p-2 rounded w-full" placeholder="Descripción" onChange={handleChange} />

        <input name="precio" type="number" className="border p-2 rounded w-full" placeholder="Precio" onChange={handleChange} />

        <input name="numerosTotales" type="number" className="border p-2 rounded w-full" placeholder="Números totales" onChange={handleChange} />

        <input name="imagenUrl" className="border p-2 rounded w-full" placeholder="URL imagen" onChange={handleChange} />

        <input name="mpCuenta" className="border p-2 rounded w-full" placeholder="Cuenta MercadoPago" onChange={handleChange} />

        {/*⭐ Destacado */}
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={form.destacado} onChange={(e) => setForm({ ...form, destacado: e.target.checked })} />
          <span>⭐ Destacar sorteo</span>
        </label>

        {/*🔥 Sorteo Principal */}
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={form.sorteoPrincipal} onChange={(e) => setForm({ ...form, sorteoPrincipal: e.target.checked })} />
          <span>🔥 Marcar como SORTEO PRINCIPAL</span>
        </label>

        <button className="bg-blue-600 text-white py-2 rounded w-full">
          Crear Sorteo
        </button>
      </form>
    </div>
  );
}
