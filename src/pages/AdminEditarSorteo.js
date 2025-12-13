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
    mpCuenta: "",
    destacado: false,
    sorteoPrincipal: false,

    mostrarCuentaRegresiva: false,
    textoCuentaRegresiva: "",

    activarAutoUltimas: 0,
    ultimasChances: false,
    porcentajeAutoUltimas: 0,
    textoUltimas: "",

    chancesOcupadas: 0,
  });

  const [loading, setLoading] = useState(true);
  const [eliminando, setEliminando] = useState(false);

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
          mpCuenta: data.mpCuenta || "",

          destacado: data.destacado || false,
          sorteoPrincipal: data.sorteoPrincipal || false,

          mostrarCuentaRegresiva: data.mostrarCuentaRegresiva || false,
          textoCuentaRegresiva: data.textoCuentaRegresiva || "",

          activarAutoUltimas: data.activarAutoUltimas || 0,
          ultimasChances: data.ultimasChances || false,
          porcentajeAutoUltimas: data.porcentajeAutoUltimas || 0,
          textoUltimas: data.textoUltimas || "",

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
        activarAutoUltimas: Number(form.activarAutoUltimas),
        porcentajeAutoUltimas: Number(form.porcentajeAutoUltimas),
      }),
    });

    alert("✅ Cambios guardados correctamente");
  };

  /* 🟥 ELIMINAR SORTEO */
  const handleEliminar = async () => {
    const confirmar = window.confirm(
      "⚠️ ¿Seguro que querés eliminar este sorteo?\n\nNo se borra definitivamente, pero dejará de mostrarse."
    );

    if (!confirmar) return;

    try {
      setEliminando(true);

      const res = await fetch(`${API_URL}/sorteos/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Error eliminando sorteo");

      alert("🗑️ Sorteo eliminado correctamente");
      navigate("/admin"); // ajustá si tu ruta admin es otra
    } catch (err) {
      console.error(err);
      alert("❌ Error al eliminar sorteo");
    } finally {
      setEliminando(false);
    }
  };

  if (loading) return <p>Cargando...</p>;

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">✏️ Editar Sorteo</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="titulo"
          value={form.titulo}
          onChange={handleChange}
          className="border p-2 w-full rounded"
          placeholder="Título"
        />

        <textarea
          name="descripcion"
          value={form.descripcion}
          onChange={handleChange}
          className="border p-2 w-full rounded"
          placeholder="Descripción"
        />

        <input
          name="precio"
          type="number"
          value={form.precio}
          onChange={handleChange}
          className="border p-2 w-full rounded"
          placeholder="Precio"
        />

        <input
          name="numerosTotales"
          type="number"
          value={form.numerosTotales}
          onChange={handleChange}
          className="border p-2 w-full rounded"
          placeholder="Total de chances"
        />

        <input
          name="imagenUrl"
          value={form.imagenUrl}
          onChange={handleChange}
          className="border p-2 w-full rounded"
          placeholder="URL imagen"
        />

        {/* CUENTA MP */}
        <select
          name="mpCuenta"
          value={form.mpCuenta}
          onChange={handleChange}
          className="border p-2 rounded w-full"
        >
          <option value="">Seleccionar Cuenta MP</option>
          <option value="MERCADOPAGO_ACCESS_TOKEN_1">Cuenta #1</option>
          <option value="MERCADOPAGO_ACCESS_TOKEN_2">Cuenta #2</option>
        </select>

        {/* Destacado */}
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

        {/* Principal */}
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={form.sorteoPrincipal}
            onChange={(e) =>
              setForm({ ...form, sorteoPrincipal: e.target.checked })
            }
          />
          <span>🔥 Marcar como principal</span>
        </label>

        {/* Chances ocupadas */}
        <div>
          <label className="font-bold">📌 Chances ocupadas</label>
          <input
            disabled
            value={form.chancesOcupadas}
            className="border p-2 rounded w-full mt-1 bg-gray-100"
          />
        </div>

        <button className="bg-green-600 py-2 text-white rounded w-full">
          Guardar cambios
        </button>
      </form>

      {/* 🟥 BOTÓN ELIMINAR */}
      <button
        onClick={handleEliminar}
        disabled={eliminando}
        className="mt-6 bg-red-600 py-2 text-white rounded w-full"
      >
        {eliminando ? "Eliminando..." : "🗑️ Eliminar sorteo"}
      </button>
    </div>
  );
}
