// FILE: /Users/mustamusic/web/sorteos-lxm/src/pages/AdminSorteos.js
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API_URL from "../config/api";

export default function AdminSorteos() {
  const [sorteos, setSorteos] = useState([]);

  const fetchSorteos = async () => {
    const res = await fetch(`${API_URL}/sorteos`);
    const data = await res.json();
    setSorteos(data);
  };

  useEffect(() => {
    fetchSorteos();
  }, []);

  const eliminar = async (id) => {
    if (!window.confirm("¿Eliminar este sorteo?")) return;

    await fetch(`${API_URL}/sorteos/${id}`, { method: "DELETE" });
    fetchSorteos();
  };

  const toggleDestacado = async (sorteo) => {
    await fetch(`${API_URL}/sorteos/${sorteo.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ destacado: !sorteo.destacado }),
    });

    fetchSorteos();
  };

  const togglePrincipal = async (sorteo) => {
    await fetch(`${API_URL}/sorteos/${sorteo.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sorteoPrincipal: !sorteo.sorteoPrincipal }),
    });

    fetchSorteos();
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">🎁 Gestión de Sorteos</h1>

      <Link
        to="/admin/sorteos/nuevo"
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        ➕ Nuevo sorteo
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        {sorteos.map((s) => (
          <div key={s.id} className="bg-white p-4 rounded shadow relative">

            {/* 🥇 Badge de sorteo principal */}
            {s.sorteoPrincipal && (
              <span className="absolute top-2 right-2 bg-red-500 text-white text-sm px-2 py-1 rounded">
                🥇 Sorteo Principal
              </span>
            )}

            {/* ⭐ Badge de destacado */}
            {!s.sorteoPrincipal && s.destacado && (
              <span className="absolute top-2 right-2 bg-yellow-400 text-black text-sm px-2 py-1 rounded">
                ⭐ Destacado ({s.ordenDestacado})
              </span>
            )}

            <img
              src={s.imagenUrl}
              className="w-full h-40 object-cover rounded"
              alt=""
            />

            <h2 className="text-xl font-bold mt-2">{s.titulo}</h2>

            <p className="text-gray-700">{s.descripcion?.substring(0, 80)}...</p>

            <div className="flex flex-wrap gap-2 mt-4">
              <Link
                to={`/admin/sorteos/editar/${s.id}`}
                className="bg-yellow-500 text-white px-3 py-1 rounded"
              >
                ✏️ Editar
              </Link>

              <button
                onClick={() => eliminar(s.id)}
                className="bg-red-500 text-white px-3 py-1 rounded"
              >
                ❌ Borrar
              </button>

              <button
                onClick={() => toggleDestacado(s)}
                className={`px-3 py-1 rounded text-white ${
                  s.destacado ? "bg-gray-600" : "bg-green-600"
                }`}
                disabled={s.sorteoPrincipal}
              >
                {s.destacado ? "⛔ Quitar destacado" : "⭐ Destacar"}
              </button>

              <button
                onClick={() => togglePrincipal(s)}
                className={`px-3 py-1 rounded text-white ${
                  s.sorteoPrincipal ? "bg-red-600" : "bg-blue-600"
                }`}
              >
                {s.sorteoPrincipal ? "❌ Quitar principal" : "🥇 Hacer principal"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
