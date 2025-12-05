// FILE: src/pages/AdminEditarSorteo.js
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

    // Contador manual
    mostrarCuentaRegresiva: false,
    textoCuentaRegresiva: "",

    // Últimas chances automático
    activarAutoUltimas: 0,
    ultimasChances: false,
    porcentajeAutoUltimas: 0,
    textoUltimas: "",

    // Chances ocupadas
    chancesOcupadas: 0,
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

    alert("Cambios guardados correctamente");
  };

  if (loading) return <p>Cargando...</p>;

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">✏️ Editar Sorteo</h1>

      <form onSubmit={handleSubmit} className="space-y-4">

        <input name="titulo" value={form.titulo} onChange={handleChange} className="border p-2 w-full rounded" placeholder="Título" />

        <textarea name="descripcion" value={form.descripcion} onChange={handleChange} className="border p-2 w-full rounded" placeholder="Descripción" />

        <input name="precio" type="number" value={form.precio} onChange={handleChange} className="border p-2 w-full rounded" placeholder="Precio" />

        <input name="numerosTotales" type="number" value={form.numerosTotales} onChange={handleChange} className="border p-2 w-full rounded" placeholder="Total de chances" />

        <input name="imagenUrl" value={form.imagenUrl} onChange={handleChange} className="border p-2 w-full rounded" placeholder="URL imagen" />

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
          <input type="checkbox" checked={form.destacado} onChange={(e) => setForm({ ...form, destacado: e.target.checked })} />
          <span>⭐ Mostrar como destacado</span>
        </label>

        {/* Principal */}
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={form.sorteoPrincipal} onChange={(e) => setForm({ ...form, sorteoPrincipal: e.target.checked })} />
          <span>🔥 Marcar como principal</span>
        </label>


        {/* CHANCES OCUPADAS */}
        <div>
          <label className="font-bold">📌 Chances ocupadas (solo lectura)</label>
          <input
            disabled
            value={form.chancesOcupadas}
            className="border p-2 rounded w-full mt-1 bg-gray-100"
          />
        </div>


        {/* Últimas chances manual */}
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={form.ultimasChances}
            onChange={(e) =>
              setForm({ ...form, ultimasChances: e.target.checked })
            }
          />
          <span>⏳ Activar últimas chances (manual)</span>
        </label>

        {form.ultimasChances && (
          <input
            name="textoUltimas"
            value={form.textoUltimas}
            onChange={handleChange}
            className="border p-2 rounded w-full"
            placeholder="Ej: Últimas 20 chances!"
          />
        )}


        {/* Últimas chances automáticas */}
        <div>
          <label className="font-bold">⏳ Activar automático cuando queden X chances:</label>
          <input
            name="activarAutoUltimas"
            type="number"
            value={form.activarAutoUltimas}
            onChange={handleChange}
            className="border p-2 rounded w-full mt-1"
            placeholder="Ej: 50"
          />
        </div>

        <button className="bg-green-600 py-2 text-white rounded w-full">
          Guardar cambios
        </button>
      </form>
    </div>
  );
}
