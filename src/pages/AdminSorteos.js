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
          <div key={s.id} className="bg-white p-4 rounded shadow">
            <img
              src={s.imagenUrl}
              className="w-full h-40 object-cover rounded"
              alt=""
            />

            <h2 className="text-xl font-bold mt-2">{s.titulo}</h2>

            <p className="text-gray-700">
              {s.descripcion?.substring(0, 80)}...
            </p>

            <div className="flex gap-2 mt-4">
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
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
