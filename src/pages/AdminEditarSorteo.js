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
    mostrarCuentaRegresiva: false,
    textoCuentaRegresiva: "",
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargar = async () => {
      try {
        const res = await fetch(`${API_URL}/sorteos/${id}`);
        const data = await res.json();

        setForm({
          titulo: data.titulo,
          descripcion: data.descripcion,
          precio: data.precio,
          numerosTotales: data.numerosTotales,
          imagenUrl: data.imagenUrl,
          mpCuenta: data.mpCuenta,
          destacado: data.destacado,
          sorteoPrincipal: data.sorteoPrincipal,
          mostrarCuentaRegresiva: data.mostrarCuentaRegresiva || false,
          textoCuentaRegresiva: data.textoCuentaRegresiva || "",
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
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    alert("Cambios guardados correctamente");
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">✏️ Editar Sorteo</h1>

      <form onSubmit={handleSubmit} className="space-y-4">

        <input name="titulo" value={form.titulo} onChange={handleChange} className="border p-2 w-full rounded" placeholder="Título" />

        <textarea name="descripcion" value={form.descripcion} onChange={handleChange} className="border p-2 w-full rounded" placeholder="Descripción" />

        <input name="precio" type="number" value={form.precio} onChange={handleChange} className="border p-2 w-full rounded" placeholder="Precio" />

        <input name="numerosTotales" type="number" value={form.numerosTotales} onChange={handleChange} className="border p-2 w-full rounded" placeholder="Números totales" />

        <input name="imagenUrl" value={form.imagenUrl} onChange={handleChange} className="border p-2 w-full rounded" placeholder="URL imagen" />

        {/* CUENTA MERCADOPAGO */}
        <select
          name="mpCuenta"
          value={form.mpCuenta}
          onChange={handleChange}
          className="border p-2 rounded w-full"
        >
          <option value="">Seleccionar Cuenta MP</option>
          <option value="MERCADOPAGO_ACCESS_TOKEN_1">Cuenta MP #1</option>
          <option value="MERCADOPAGO_ACCESS_TOKEN_2">Cuenta MP #2</option>
        </select>

        {/* ⭐ destacado */}
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={form.destacado} onChange={(e) => setForm({ ...form, destacado: e.target.checked })} />
          <span>⭐ Mostrar como destacado</span>
        </label>

        {/* 🔥 principal */}
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={form.sorteoPrincipal} onChange={(e) => setForm({ ...form, sorteoPrincipal: e.target.checked })} />
          <span>🔥 Marcar como principal</span>
        </label>

        {/* COUNTDOWN */}
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={form.mostrarCuentaRegresiva}
            onChange={(e) =>
              setForm({ ...form, mostrarCuentaRegresiva: e.target.checked })
            }
          />
          <span>⏳ Activar contador regresivo</span>
        </label>

        {form.mostrarCuentaRegresiva && (
          <input
            name="textoCuentaRegresiva"
            value={form.textoCuentaRegresiva}
            onChange={handleChange}
            className="border p-2 rounded w-full"
            placeholder="Ej: Últimas 50 chances!"
          />
        )}

        <button className="bg-green-600 py-2 text-white rounded w-full">
          Guardar cambios
        </button>
      </form>
    </div>
  );
}
