// FILE: src/pages/AdminEditarSorteo.js
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API_URL from "../config/api";

export default function AdminEditarSorteo() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    titulo: "",
    descripcion: "",
    precio: "",
    numerosTotales: "",
    imagenUrl: "",

    // 💳 Pago
    aliasPago: "",

    // 💰 Ofertas
    oferta1Chances: 1,
    oferta1Precio: "",
    oferta2Chances: 5,
    oferta2Precio: "",
    oferta3Chances: 10,
    oferta3Precio: "",

    // ⭐ Flags
    destacado: false,
    sorteoPrincipal: false,
    masVendido: false,

    // 📊 Progreso manual
    porcentajeVendidoManual: 0,

    chancesOcupadas: 0,
  });

  const [loading, setLoading] = useState(true);
  const [eliminando, setEliminando] = useState(false);

  useEffect(() => {
    const cargar = async () => {
      try {
        const token = localStorage.getItem("adminToken");
        const res = await fetch(`${API_URL}/sorteos/${id}`, {
          headers: { "x-admin-token": token },
        });
        const data = await res.json();

        setForm({
          titulo: data.titulo || "",
          descripcion: data.descripcion || "",
          precio: data.precio || "",
          numerosTotales: data.numerosTotales || "",
          imagenUrl: data.imagenUrl || "",

          aliasPago: data.aliasPago || "",

          oferta1Chances: data.oferta1Chances || 1,
          oferta1Precio: data.oferta1Precio || "",
          oferta2Chances: data.oferta2Chances || 5,
          oferta2Precio: data.oferta2Precio || "",
          oferta3Chances: data.oferta3Chances || 10,
          oferta3Precio: data.oferta3Precio || "",

          destacado: data.destacado || false,
          sorteoPrincipal: data.sorteoPrincipal || false,
          masVendido: data.masVendido || false,

          porcentajeVendidoManual: data.porcentajeVendidoManual || 0,

          chancesOcupadas: data.chancesOcupadas || 0,
        });
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    cargar();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    await fetch(`${API_URL}/sorteos/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        porcentajeVendidoManual: Number(form.porcentajeVendidoManual),
      }),
    });

    alert("✅ Sorteo actualizado");
  };

  const handleEliminar = async () => {
    if (!window.confirm("¿Eliminar este sorteo?")) return;
    setEliminando(true);
    await fetch(`${API_URL}/sorteos/${id}`, { method: "DELETE" });
    navigate("/admin");
  };

  if (loading) return <p className="text-gray-400">Cargando…</p>;

  return (
    <div className="p-6 max-w-xl mx-auto bg-zinc-900 text-white rounded-xl border border-zinc-700">
      <h1 className="text-3xl font-extrabold mb-6">✏️ Editar Sorteo</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="titulo" value={form.titulo} onChange={handleChange} className="input" placeholder="Título" />
        <textarea name="descripcion" value={form.descripcion} onChange={handleChange} className="input" placeholder="Descripción" />
        <input name="numerosTotales" type="number" value={form.numerosTotales} onChange={handleChange} className="input" placeholder="Total de chances" />
        <input name="imagenUrl" value={form.imagenUrl} onChange={handleChange} className="input" placeholder="URL imagen" />

        {/* 💳 Pago */}
        <div className="box">
          <h3 className="font-bold mb-2">💳 Alias de pago</h3>
          <input name="aliasPago" value={form.aliasPago} onChange={handleChange} className="input" placeholder="SORTEOSLXM" />
        </div>

        {/* 💰 Ofertas */}
        <div className="box space-y-2">
          <h3 className="font-bold">💰 Precios</h3>
          <input name="oferta1Precio" value={form.oferta1Precio} onChange={handleChange} className="input" placeholder="1 chance $" />
          <input name="oferta2Precio" value={form.oferta2Precio} onChange={handleChange} className="input" placeholder="5 chances $" />
          <input name="oferta3Precio" value={form.oferta3Precio} onChange={handleChange} className="input" placeholder="10 chances $" />
        </div>

        {/* ⭐ Configuración */}
        <div className="box space-y-2">
          <label className="flex gap-2">
            <input type="checkbox" name="masVendido" checked={form.masVendido} onChange={handleChange} />
            Marcar como MÁS VENDIDO
          </label>

          <label className="flex gap-2">
            <input type="checkbox" name="destacado" checked={form.destacado} onChange={handleChange} />
            Destacado
          </label>

          <label className="flex gap-2">
            <input type="checkbox" name="sorteoPrincipal" checked={form.sorteoPrincipal} onChange={handleChange} />
            Sorteo principal
          </label>
        </div>

        {/* 📊 Barra manual */}
        <div className="box">
          <h3 className="font-bold mb-2">📊 Porcentaje vendido (manual)</h3>
          <input
            type="number"
            name="porcentajeVendidoManual"
            min="0"
            max="100"
            value={form.porcentajeVendidoManual}
            onChange={handleChange}
            className="input"
            placeholder="Ej: 65"
          />
        </div>

        <button className="bg-green-600 py-2 rounded w-full font-bold">
          Guardar cambios
        </button>
      </form>

      <button
        onClick={handleEliminar}
        disabled={eliminando}
        className="mt-6 bg-red-600 py-2 rounded w-full font-bold"
      >
        🗑️ Eliminar sorteo
      </button>
    </div>
  );
}

/* helpers tailwind */
const base = "p-2 w-full rounded bg-black border border-zinc-700";
document.documentElement.style.setProperty("--input", base);
