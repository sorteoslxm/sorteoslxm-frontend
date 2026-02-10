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
    numerosTotales: "",
    imagenUrl: "",

    aliasPago: "",

    oferta1Chances: 1,
    oferta1Precio: "",
    oferta2Chances: 5,
    oferta2Precio: "",
    oferta3Chances: 10,
    oferta3Precio: "",

    masVendido: 2,
    porcentajeVendido: 0,

    chancesOcupadas: 0,
    cerrado: false, // 🔒 NUEVO
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
          numerosTotales: data.numerosTotales || "",
          imagenUrl: data.imagenUrl || "",

          aliasPago: data.aliasPago || "",

          oferta1Chances: data.oferta1Chances || 1,
          oferta1Precio: data.oferta1Precio || "",
          oferta2Chances: data.oferta2Chances || 5,
          oferta2Precio: data.oferta2Precio || "",
          oferta3Chances: data.oferta3Chances || 10,
          oferta3Precio: data.oferta3Precio || "",

          masVendido: data.masVendido || 2,
          porcentajeVendido: data.porcentajeVendido || 0,

          chancesOcupadas: data.chancesOcupadas || 0,
          cerrado: data.cerrado || false, // 🔒
        });
      } catch (err) {
        console.error("Error cargando sorteo:", err);
      }
      setLoading(false);
    };

    cargar();
  }, [id]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    await fetch(`${API_URL}/sorteos/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        masVendido: Number(form.masVendido),
        porcentajeVendido: Number(form.porcentajeVendido),
      }),
    });

    alert("✅ Sorteo actualizado correctamente");
  };

  const handleEliminar = async () => {
    if (!window.confirm("⚠️ ¿Eliminar este sorteo?")) return;

    try {
      setEliminando(true);
      await fetch(`${API_URL}/sorteos/${id}`, { method: "DELETE" });
      alert("🗑️ Sorteo eliminado");
      navigate("/admin");
    } catch {
      alert("❌ Error al eliminar");
    } finally {
      setEliminando(false);
    }
  };

  const toggleCerrado = async () => {
    const confirmar = window.confirm(
      form.cerrado
        ? "¿Reabrir este sorteo?"
        : "⚠️ ¿Cerrar este sorteo? No se podrán realizar más compras."
    );
    if (!confirmar) return;

    await fetch(`${API_URL}/sorteos/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        cerrado: !form.cerrado,
      }),
    });

    setForm({ ...form, cerrado: !form.cerrado });

    alert(form.cerrado ? "🔓 Sorteo reabierto" : "🔒 Sorteo cerrado");
  };

  if (loading) return <p className="text-gray-400">Cargando…</p>;

  return (
    <div className="p-6 max-w-xl mx-auto bg-zinc-900 text-white rounded-xl border border-zinc-700">
      <h1 className="text-3xl font-extrabold mb-6">✏️ Editar Sorteo</h1>

      <form onSubmit={handleSubmit} className="space-y-4">

        <input
          name="titulo"
          value={form.titulo}
          onChange={handleChange}
          className="p-2 w-full rounded bg-black border border-zinc-700"
          placeholder="Título"
        />

        <textarea
          name="descripcion"
          value={form.descripcion}
          onChange={handleChange}
          className="p-2 w-full rounded bg-black border border-zinc-700"
          placeholder="Descripción"
        />

        <input
          name="numerosTotales"
          type="number"
          value={form.numerosTotales}
          onChange={handleChange}
          className="p-2 w-full rounded bg-black border border-zinc-700"
          placeholder="Total de chances"
        />

        <input
          name="imagenUrl"
          value={form.imagenUrl}
          onChange={handleChange}
          className="p-2 w-full rounded bg-black border border-zinc-700"
          placeholder="URL imagen"
        />

        {/* 💳 ALIAS */}
        <div className="border border-zinc-700 rounded p-3">
          <h3 className="font-bold mb-2">💳 Alias de pago</h3>
          <input
            name="aliasPago"
            value={form.aliasPago}
            onChange={handleChange}
            className="p-2 w-full rounded bg-black border border-zinc-700"
            placeholder="alias.mp"
          />
        </div>

        {/* 💰 OFERTAS */}
        <div className="border border-zinc-700 rounded p-3 space-y-3">
          <h3 className="font-bold">💰 Ofertas</h3>

          <input
            name="oferta1Precio"
            value={form.oferta1Precio}
            onChange={handleChange}
            className="p-2 w-full rounded bg-black border border-zinc-700"
            placeholder="1 chance - Precio"
          />

          <input
            name="oferta2Precio"
            value={form.oferta2Precio}
            onChange={handleChange}
            className="p-2 w-full rounded bg-black border border-zinc-700"
            placeholder="5 chances - Precio"
          />

          <input
            name="oferta3Precio"
            value={form.oferta3Precio}
            onChange={handleChange}
            className="p-2 w-full rounded bg-black border border-zinc-700"
            placeholder="10 chances - Precio"
          />
        </div>

        {/* ⭐ MAS VENDIDO */}
        <div className="border border-zinc-700 rounded p-3">
          <h3 className="font-bold mb-2">⭐ Pack más vendido</h3>
          <select
            name="masVendido"
            value={form.masVendido}
            onChange={handleChange}
            className="w-full p-2 bg-black border border-zinc-700 rounded"
          >
            <option value={1}>1 chance</option>
            <option value={2}>5 chances</option>
            <option value={3}>10 chances</option>
          </select>
        </div>

        {/* 📊 PORCENTAJE */}
        <div className="border border-zinc-700 rounded p-3">
          <h3 className="font-bold mb-2">📊 % vendido</h3>
          <input
            type="number"
            min="0"
            max="100"
            name="porcentajeVendido"
            value={form.porcentajeVendido}
            onChange={handleChange}
            className="w-full p-2 bg-black border border-zinc-700 rounded"
          />
          <p className="text-xs text-gray-400 mt-1">
            Se muestra como barra de progreso en el sorteo
          </p>
        </div>

        <button className="bg-green-600 py-2 rounded w-full font-bold">
          Guardar cambios
        </button>
      </form>

      {/* 🔒 CERRAR / REABRIR */}
      <button
        onClick={toggleCerrado}
        className={`mt-4 py-2 rounded w-full font-bold ${
          form.cerrado ? "bg-yellow-600" : "bg-orange-600"
        }`}
      >
        {form.cerrado ? "🔓 Reabrir sorteo" : "🔒 Cerrar sorteo"}
      </button>

      <button
        onClick={handleEliminar}
        disabled={eliminando}
        className="mt-6 bg-red-600 py-2 rounded w-full font-bold"
      >
        {eliminando ? "Eliminando..." : "🗑️ Eliminar sorteo"}
      </button>
    </div>
  );
}
