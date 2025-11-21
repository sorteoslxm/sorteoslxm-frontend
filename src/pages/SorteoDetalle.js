// FILE: /Users/mustamusic/web/sorteos-lxm/src/pages/SorteoDetalle.js

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API_URL from "../config/api";

export default function SorteoDetalle() {
  const { id } = useParams();
  const [sorteo, setSorteo] = useState(null);

  useEffect(() => {
    fetch(`${API_URL}/sorteos/${id}`)
      .then((res) => res.json())
      .then((data) => setSorteo(data))
      .catch((err) => console.error("Error cargando sorteo:", err));
  }, [id]);

  if (!sorteo) return <p className="p-4 text-center">Cargando...</p>;

  return (
    <div className="max-w-3xl mx-auto p-4">
      <img
        src={sorteo.imagenUrl}
        alt={sorteo.titulo}
        className="w-full rounded-xl mb-4"
      />

      <h1 className="text-3xl font-bold mb-2">{sorteo.titulo}</h1>

      <p className="text-lg mb-4">{sorteo.descripcion}</p>

      <p className="text-xl font-semibold mb-4">
        Precio: ${sorteo.precio}
      </p>

      <button
        className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold w-full text-xl"
      >
        Participar
      </button>
    </div>
  );
}
