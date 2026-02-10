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

    // 🔑 PAGO MANUAL
    aliasPago: "",

    // 💰 OFERTAS
    oferta1Chances: 1,
    oferta1Precio: "",
    oferta2Chances: 5,
    oferta2Precio: "",
    oferta3Chances: 10,
    oferta3Precio: "",

    destacado: false,
    sorteoPrincipal: false,

    mostrarCuentaRegresiva: false,
    textoCuentaRegresiva: "",

    ultimasChances: false,
    textoUltimas: "",
    porcentajeAutoUltimas: 0,

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

          mostrarCuentaRegresiva: data.mostrarCuentaRegresiva || false,
          textoCuentaRegresiva: data.textoCuentaRegresiva || "",

          ultimasChances: data.ultimasChances || false,
          textoUltimas: data.textoUltimas || "",
          porcentajeAutoUltimas: data.porcentajeAutoUltimas || 0,

          chancesOcupadas: data.chancesOcupadas || 0,
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
        porcentajeAutoUltimas: Number(form.porcentajeAutoUltimas),
      }),
    });

    alert("✅ Cambios guardados correctamente");
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

  if (loading) return <p className="text-gray-400">Cargando…</p>;

  return (
    <div className="p-6 max-w-xl mx-auto bg-zinc-900 text-white rounded-xl border border-zinc-700">
      <h1 className="text-3xl font-extrabold mb-6">✏️ Editar Sorteo</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="titulo" value={form.titulo} onChange={handleChange} className="p-2 w-full rounded bg-black border border-zinc-700" placeholder="Título" />
        <textarea name="descripcion" value={form.descripcion} onChange={handleChange} className="p-2 w-full rounded bg-black border border-zinc-700" placeholder="Descripción" />
        <input name="numerosTotales" type="number" value={form.numerosTotales} onChange={handleChange} className="p-2 w-full rounded bg-black border border-zinc-700" placeholder="Total de chances" />
        <input name="imagenUrl" value={form.imagenUrl} onChange={handleChange} className="p-2 w-full rounded bg-black border border-zinc-700" placeholder="URL imagen" />

        {/* 💳 ALIAS */}
        <div className="border border-zinc-700 rounded p-3">
          <h3 className="font-bold mb-2">💳 Pago por transferencia</h3>
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
          <h3 className="font-bold">💰 Ofertas de chances</h3>

          <input name="oferta1Precio" value={form.oferta1Precio} onChange={handleChange} className="p-2 w-full rounded bg-black border border-zinc-700" placeholder="1 chance - Precio" />
          <input name="oferta2Precio" value={form.oferta2Precio} onChange={handleChange} className="p-2 w-full rounded bg-black border border-zinc-700" placeholder="5 chances - Precio" />
          <input name="oferta3Precio" value={form.oferta3Precio} onChange={handleChange} className="p-2 w-full rounded bg-black border border-zinc-700" placeholder="10 chances - Precio" />
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
        {eliminando ? "Eliminando..." : "🗑️ Eliminar sorteo"}
      </button>
    </div>
  );
}
