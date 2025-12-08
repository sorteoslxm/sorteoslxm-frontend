// FILE: web/sorteos-lxm/src/pages/AdminChances.js
import React, { useEffect, useState } from "react";
import API_URL from "../config/api";

export default function AdminChances() {
  const [chances, setChances] = useState([]);
  const [limit, setLimit] = useState(200);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("adminToken");

    setLoading(true);
    fetch(`${API_URL}/chances?limit=${limit}`, {
      headers: token ? { "x-admin-token": token } : {}
    })
      .then(res => res.json())
      .then(data => {
        setChances(data || []);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [limit]);

  // 📌 Agrupar chances por sorteoId
  const sorteosAgrupados = chances.reduce((acc, chance) => {
    const id = chance.sorteoId || "SIN-ID";

    if (!acc[id]) acc[id] = [];
    acc[id].push(chance);

    return acc;
  }, {});
  
  return (
    <div className="p-6 max-w-5xl mx-auto">

      <h1 className="text-3xl font-bold mb-4">🎟️ Control de Chances</h1>

      <div className="bg-white border p-4 rounded-lg">
        <label className="text-sm font-semibold">Cantidad de chances a mostrar:</label>
        <input
          type="number"
          value={limit}
          onChange={(e) => setLimit(e.target.value)}
          className="border p-2 w-24 ml-2 rounded"
        />
      </div>

      {loading && (
        <p className="mt-6 text-gray-600">Cargando chances...</p>
      )}

      {!loading && Object.keys(sorteosAgrupados).length === 0 && (
        <p className="mt-6 text-gray-600">No hay chances registradas.</p>
      )}

      {/* LISTA AGRUPADA POR SORTEO */}
      <div className="mt-6">
        {Object.entries(sorteosAgrupados).map(([sorteoId, lista]) => (
          <div key={sorteoId} className="mb-8">
            
            {/* Header del sorteo */}
            <div className="bg-gray-800 text-white p-3 rounded-t-lg text-lg font-semibold">
              Sorteo: {sorteoId}  
              <span className="text-sm ml-3 opacity-80">
                ({lista.length} chances)
              </span>
            </div>

            {/* Lista de chances */}
            <div className="border border-gray-300 rounded-b-lg bg-white">
              {lista.map((c) => (
                <div
                  key={c.id}
                  className="border-b p-4 hover:bg-gray-50 flex justify-between items-center"
                >
                  <div>
                    <div className="font-bold text-blue-700">
                      {c.telefono || "Sin teléfono"}
                    </div>
                    <div className="text-sm text-gray-600">
                      Chance LXM-{String(c.numero).padStart(5, "0")}
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-xs text-gray-600">
                      {new Date(c.createdAt).toLocaleString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </div>
        ))}
      </div>

    </div>
  );
}
