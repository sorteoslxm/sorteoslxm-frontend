// FILE: /Users/mustamusic/web/sorteos-lxm/src/pages/SorteoDetalle.js

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API_URL from "../config/api";

export default function SorteoDetalle() {
  const { id } = useParams();
  const [sorteo, setSorteo] = useState(null);

  // --------------------------
  // CONFIGURACIÓN EDITABLE
  // --------------------------
  const mostrarContador = true; // activar/desactivar
  const chancesRestantes = 50;  // cambiar cuando quieras
  const mostrarGaleria = true;  // activar/desactivar
  // --------------------------

  useEffect(() => {
    fetch(`${API_URL}/sorteos/${id}`)
      .then((res) => res.json())
      .then((data) => setSorteo(data))
      .catch((err) => console.error("Error cargando sorteo:", err));
  }, [id]);

  if (!sorteo) return <p className="p-4 text-center">Cargando...</p>;

  return (
    <div className="max-w-3xl mx-auto p-4">

      {/* 🟥 Imagen principal (NO se deforma) */}
      <div className="w-full bg-black rounded-xl mb-4 flex items-center justify-center">
        <img
          src={sorteo.imagenUrl}
          alt={sorteo.titulo}
          className="w-full max-h-[420px] object-contain rounded-xl"
        />
      </div>

      {/* 🟦 Título */}
      <h1 className="text-3xl font-bold mb-2">{sorteo.titulo}</h1>

      {/* 🟪 Contador opcional */}
      {mostrarContador && (
        <div className="bg-red-600 text-white text-lg p-2 rounded-xl text-center mb-3 font-semibold">
          ⚠️ Últimas {chancesRestantes} chances
        </div>
      )}

      {/* 🟨 Precio por chance */}
      <p className="text-2xl font-bold text-green-600 mb-4">
        💰 Precio por chance: ${sorteo.precio}
      </p>

      {/* 🟧 Descripción */}
      <p className="text-lg mb-4 whitespace-pre-line text-gray-800">
        {sorteo.descripcion}
      </p>

      {/* 🟩 Galería (si existe) */}
      {mostrarGaleria && sorteo.galeria?.length > 0 && (
        <div className="mt-4">
          <h2 className="text-xl font-bold mb-2">Galería</h2>
          <div className="grid grid-cols-2 gap-3">
            {sorteo.galeria.map((foto, index) => (
              <img
                key={index}
                src={foto}
                alt={`Foto ${index}`}
                className="w-full h-32 object-cover rounded-lg"
              />
            ))}
          </div>
        </div>
      )}

      {/* 🟦 BOTÓN FIJO ABAJO */}
      <div className="fixed bottom-0 left-0 w-full p-4 bg-white shadow-2xl">
        <button className="w-full bg-blue-600 text-white py-3 rounded-xl text-xl font-bold">
          Participar
        </button>
      </div>
    </div>
  );
}
