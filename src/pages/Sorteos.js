// FILE: /Users/mustamusic/web/sorteos-lxm/src/pages/Sorteos.js

import React, { useEffect, useState } from "react";
import SorteoCard from "../components/SorteoCard";
import API_URL from "../config/api";

export default function Sorteos() {
  const [sorteos, setSorteos] = useState([]);
  const [principal, setPrincipal] = useState(null);

  useEffect(() => {
    fetch(`${API_URL}/sorteos`)
      .then((res) => res.json())
      .then((data) => {
        setSorteos(data.filter((x) => !x.sorteoPrincipal));
        setPrincipal(data.find((x) => x.sorteoPrincipal) || null);
      })
      .catch((err) => console.error("Error cargando sorteos:", err));
  }, []);

  return (
    <div className="p-4 max-w-screen-lg mx-auto">

      {/* 🔥 SORTEO PRINCIPAL */}
      {principal && (
        <div className="mb-8 p-4 rounded-2xl shadow-xl bg-gradient-to-br from-blue-600 to-blue-800 text-white animate-[fadeIn_1s]">
          <h2 className="text-3xl font-extrabold mb-3 text-center drop-shadow-lg">
            🔥 GRAN SORTEO PRINCIPAL 🔥
          </h2>

          <img
            src={principal.imagenUrl}
            alt="Sorteo principal"
            className="w-full rounded-xl mb-4 shadow-lg"
          />

          <p className="text-xl font-semibold text-center mb-2">
            {principal.titulo}
          </p>

          <p className="text-center text-sm opacity-90 mb-4">
            {principal.descripcion}
          </p>

          <a
            href={`/sorteo/${principal.id}`}
            className="block text-center bg-yellow-400 text-black font-bold py-3 rounded-xl hover:bg-yellow-300 transition"
          >
            PARTICIPAR AHORA 🚀
          </a>
        </div>
      )}

      {/* 🟩 LISTA NORMAL DE SORTEOS */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-2">
        {sorteos.map((sorteo) => (
          <SorteoCard key={sorteo.id} sorteo={sorteo} />
        ))}
      </div>
    </div>
  );
}
