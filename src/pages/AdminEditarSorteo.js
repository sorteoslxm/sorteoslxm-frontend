// FILE: /Users/mustamusic/web/sorteos-lxm/src/pages/AdminEditarSorteo.js

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API_URL from "../config/api";

export default function AdminEditarSorteo() {
  const { id } = useParams();

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

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargar = async () => {
      try {
        const res = await fetch(`${API_URL}/sorteos/${id}`);
        const data = await res.json();

        setForm({
          titulo: data.titulo || "",
          descripcion: data.descripcion || "",
          precio: data.precio || "",
          numerosTotales: data.numerosTotales || "",
          imagenUrl: data.imagenUrl || "",
          mpCuenta: data.mpCuenta || "",
          destacado: data.destacado || false,
          sorteoPrincipal: data.sorteoPrincipal || false,
        });
      } catch (err) {
        console.error("Error cargando sorteo:", err);
      }

      setLoading(false);
    };

    cargar();
  }, [id]);

  if (loading) return <p>Cargando...</p>;

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    await fetch(`${API_URL}/sorteos/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    alert("Cambios guardados");
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">✏️ Editar Sorteo</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="titulo"
          value={form.titulo}
          onChange={handleChange}
          className="border p-2 rounded w-full"
          placeholder="Título"
        />

        <textarea
          name="descripcion"
          value={form.descripcion}
          onChange={handleChange}
          className="border p-2 rounded w-full"
          placeholder="Descripción"
        />

        <input
          name="precio"
          type="number"
          value={form.precio}
          onChange={handleChange}
          className="border p-2 rounded w-full"
          placeholder="Precio"
        />

        <input
          name="numerosTotales"
          type="number"
          value={form.numerosTotales}
          onChange={handleChange}
          className="border p-2 rounded w-full"
          placeholder="Números totales"
        />

        <input
          name="imagenUrl"
          value={form.imagenUrl}
          onChange={handleChange}
          className="border p-2 rounded w-full"
          placeholder="URL imagen"
        />

        <input
          name="mpCuenta"
          value={form.mpCuenta}
          onChange={handleChange}
          className="border p-2 rounded w-full"
          placeholder="Cuenta MercadoPago"
        />

        {/* ⭐ Destacado */}
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={form.destacado}
            onChange={(e) =>
              setForm({ ...form, destacado: e.target.checked })
            }
          />
          <span>⭐ Mostrar como destacado</span>
        </label>

        {/* 🔥 Sorteo Principal */}
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={form.sorteoPrincipal}
            onChange={(e) =>
              setForm({ ...form, sorteoPrincipal: e.target.checked })
            }
          />
          <span>🔥 Marcar como SORTEO PRINCIPAL (solo 1)</span>
        </label>

        <button className="bg-green-600 text-white py-2 rounded w-full">
          Guardar cambios
        </button>
      </form>
    </div>
  );
}
