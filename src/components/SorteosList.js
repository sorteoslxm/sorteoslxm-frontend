import React, { useEffect, useState } from "react";
import API_URL from "../config/api";

export default function SorteosList() {
  const [sorteos, setSorteos] = useState([]);

  useEffect(() => {
    const fetchSorteos = async () => {
      try {
        const res = await fetch(`${API_URL}/api/sorteos`);
        const data = await res.json();
        console.log("🎟️ Datos sorteos:", data);
        setSorteos(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error cargando sorteos:", err);
      }
    };
    fetchSorteos();
  }, []);

  if (!sorteos.length) {
    return <p className="text-center text-gray-600 mt-10">No hay sorteos disponibles.</p>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
      {sorteos.map((s) => (
        <div key={s.id} className="bg-white shadow rounded-2xl p-4 text-center">
          <img
            src={s.imagen || s.imagenUrl || ""}
            alt={s.nombre || s.titulo || "Sorteo"}
            className="rounded-xl mb-2 w-full h-64 object-cover"
          />
          <h2 className="font-semibold text-lg">{s.nombre || s.titulo}</h2>
          <p>{s.descripcion || s["Casco MMG"] || "Sin descripción"}</p>
          <p className="font-bold mt-2">💰 ${s.precio}</p>
        </div>
      ))}
    </div>
  );
}
