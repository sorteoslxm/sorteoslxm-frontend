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
          headers: {
            "x-admin-token": token,
          },
        });

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
      navigate("/admin");
    } catch (err) {
      console.error(err);
      alert("❌ Error al eliminar sorteo");
    } finally {
      setEliminando(false);
    }
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
          className="p-2 w-full rounded bg-black border border-zinc-700 text-white placeholder-gray-400"
          placeholder="Título"
        />

        <textarea
          name="descripcion"
          value={form.descripcion}
          onChange={handleChange}
          className="p-2 w-full rounded bg-black border border-zinc-700 text-white placeholder-gray-400"
          placeholder="Descripción"
        />

        <input
          name="precio"
          type="number"
          value={form.precio}
          onChange={handleChange}
          className="p-2 w-full rounded bg-black border border-zinc-700 text-white"
          placeholder="Precio"
        />

        <input
          name="numerosTotales"
          type="number"
          value={form.numerosTotales}
          onChange={handleChange}
          className="p-2 w-full rounded bg-black border border-zinc-700 text-white"
          placeholder="Total de chances"
        />

        <input
          name="imagenUrl"
          value={form.imagenUrl}
          onChange={handleChange}
          className="p-2 w-full rounded bg-black border border-zinc-700 text-white placeholder-gray-400"
          placeholder="URL imagen"
        />

        <select
          name="mpCuenta"
          value={form.mpCuenta}
          onChange={handleChange}
          className="p-2 rounded w-full bg-black border border-zinc-700 text-white"
        >
          <option value="">Seleccionar Cuenta MP</option>
          <option value="MERCADOPAGO_ACCESS_TOKEN_1">Cuenta #1</option>
          <option value="MERCADOPAGO_ACCESS_TOKEN_2">Cuenta #2</option>
        </select>

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

        <div className="border border-zinc-700 rounded p-3">
          <label className="flex items-center gap-2 mb-2">
            <input
              type="checkbox"
              checked={form.mostrarCuentaRegresiva}
              onChange={(e) =>
                setForm({ ...form, mostrarCuentaRegresiva: e.target.checked })
              }
            />
            <span>⏱️ Mostrar cuenta regresiva</span>
          </label>

          {form.mostrarCuentaRegresiva && (
            <input
              name="textoCuentaRegresiva"
              value={form.textoCuentaRegresiva}
              onChange={handleChange}
              className="p-2 w-full rounded bg-black border border-zinc-700 text-white"
              placeholder="Ej: Sorteo termina pronto"
            />
          )}
        </div>

        <div className="border rounded p-3 bg-yellow-400/10 border-yellow-400">
          <h3 className="font-bold mb-2 text-yellow-400">
            🔥 Últimas chances
          </h3>

          <label className="flex items-center gap-2 mb-2">
            <input
              type="checkbox"
              checked={form.ultimasChances}
              onChange={(e) =>
                setForm({ ...form, ultimasChances: e.target.checked })
              }
            />
            <span>Activar mensaje de últimas chances</span>
          </label>

          <input
            name="textoUltimas"
            value={form.textoUltimas}
            onChange={handleChange}
            className="p-2 w-full rounded bg-black border border-zinc-700 text-white mb-2"
            placeholder="Ej: ¡Últimas chances disponibles!"
          />

          <label className="text-sm text-gray-300">
            Activar automáticamente cuando queden menos de (% restante)
          </label>

          <input
            name="porcentajeAutoUltimas"
            type="number"
            value={form.porcentajeAutoUltimas}
            onChange={handleChange}
            className="p-2 w-full rounded bg-black border border-zinc-700 text-white mt-1"
            placeholder="Ej: 10"
          />
        </div>

        <div>
          <label className="font-bold">📌 Chances ocupadas</label>
          <input
            disabled
            value={form.chancesOcupadas}
            className="p-2 rounded w-full mt-1 bg-zinc-800 border border-zinc-700 text-white"
          />
        </div>

        <button className="bg-green-600 py-2 text-white rounded w-full font-bold">
          Guardar cambios
        </button>
      </form>

      <button
        onClick={handleEliminar}
        disabled={eliminando}
        className="mt-6 bg-red-600 py-2 text-white rounded w-full font-bold"
      >
        {eliminando ? "Eliminando..." : "🗑️ Eliminar sorteo"}
      </button>
    </div>
  );
}
