// FILE: /Users/mustamusic/web/sorteos-lxm/src/pages/Sorteos.js
import React, { useEffect, useState } from "react";
import SorteoCard from "../components/SorteoCard";
import BotonCompra from "../components/BotonCompra";
import API_URL from "../config/api";

export default function Sorteos() {
  const [sorteos, setSorteos] = useState([]);
  const [principal, setPrincipal] = useState(null);

  useEffect(() => {
    fetch(`${API_URL}/sorteos`)
      .then(res => res.json())
      .then(data => {
        setSorteos(data.filter(x => !x.sorteoPrincipal));
        setPrincipal(data.find(x => x.sorteoPrincipal) || null);
      })
      .catch(err => console.error("Error cargando sorteos:", err));
  }, []);

  return (
    <div className="p-4 max-w-screen-lg mx-auto">
      {principal && (
        <div className="mb-8 p-4 rounded-2xl shadow-xl bg-gradient-to-br from-blue-600 to-blue-800 text-white">
          <h2 className="text-3xl font-extrabold mb-3 text-center">🔥 SORTEO PRINCIPAL 🔥</h2>
          <img
            src={principal.imagenUrl}
            alt="Sorteo principal"
            className="w-full rounded-xl mb-4 shadow-lg"
          />
          <p className="text-xl font-semibold text-center mb-2">{principal.titulo}</p>
          <p className="text-center text-sm opacity-90 mb-4">{principal.descripcion}</p>

          <div className="flex justify-center">
            <BotonCompra sorteo={principal} />
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-2">
        {sorteos.map(sorteo => (
          <div key={sorteo.id}>
            <SorteoCard sorteo={sorteo} />
            <div className="flex justify-center mt-2">
              <BotonCompra sorteo={sorteo} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
