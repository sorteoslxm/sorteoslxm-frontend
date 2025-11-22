// FILE: /Users/mustamusic/web/sorteos-lxm/src/pages/AdminEditarSorteo.js
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API_URL from "../config/api";

export default function AdminEditarSorteo() {
  const { id } = useParams();
  const [form, setForm] = useState(null);

  useEffect(() => {
    fetch(`${API_URL}/sorteos/${id}`)
      .then((r) => r.json())
      .then(setForm);
  }, [id]);

  if (!form) return <p>Cargando...</p>;

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    await fetch(`${API_URL}/sorteos/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    alert("Guardado");
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">✏️ Editar Sorteo</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="titulo"
          value={form.titulo}
          className="border p-2 rounded w-full"
          onChange={handleChange}
        />

        <textarea
          name="descripcion"
          value={form.descripcion}
          className="border p-2 rounded w-full"
          onChange={handleChange}
        />

        <input
          name="precio"
          type="number"
          value={form.precio}
          className="border p-2 rounded w-full"
          onChange={handleChange}
        />

        <input
          name="numerosTotales"
          type="number"
          value={form.numerosTotales}
          className="border p-2 rounded w-full"
          onChange={handleChange}
        />

        <input
          name="imagenUrl"
          value={form.imagenUrl}
          className="border p-2 rounded w-full"
          onChange={handleChange}
        />

        <input
          name="mpCuenta"
          value={form.mpCuenta || ""}
          placeholder="Cuenta MercadoPago"
          className="border p-2 rounded w-full"
          onChange={handleChange}
        />

        <button className="bg-green-600 text-white py-2 rounded w-full">
          Guardar cambios
        </button>
      </form>
    </div>
  );
}
