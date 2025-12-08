// FILE: web/sorteos-lxm/src/pages/AdminChances.js
import React, { useEffect, useState } from "react";
import API_URL from "../config/api";

export default function AdminChances() {
  const [chances, setChances] = useState([]);
  const [sorteos, setSorteos] = useState({});
  const [limit, setLimit] = useState(200);
  const [loading, setLoading] = useState(true);

  // Cargar todos los sorteos (para mostrar el título)
  useEffect(() => {
    fetch(`${API_URL}/sorteos`)
      .then((res) => res.json())
      .then((data) => {
        const dict = {};
        data.forEach((s) => (dict[s.id] = s));
        setSorteos(dict);
      })
      .catch((err) => console.error("Error cargando sorteos", err));
  }, []);

  // Cargar chances
  useEffect(() => {
    const token = localStorage.getItem("adminToken");

    setLoading(true);
    fetch(`${API_URL}/chances?limit=${limit}`, {
      headers: token ? { "x-admin-token": token } : {},
    })
      .then((res) => res.json())
      .then((data) => {
        // 🔥 SIEMPRE validar array
        if (!Array.isArray(data)) {
          console.warn("⚠ Backend devolvió algo no-array:", data);
          setChances([]);
        } else {
          setChances(data);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setChances([]);
        setLoading(false);
      });
  }, [limit]);

  // Agrupar por sorteoId
  const sorteosAgrupados = chances.reduce((acc, chance) => {
    const id = chance.sorteoId || "SIN-ID";
    if (!acc[id]) acc[id] = [];
    acc[id].push(chance);
    return acc;
  }, {});

  return (
    <div className="p-6 max-w-6xl mx-auto">

      <h1 className="text-3xl font-bold mb-4">🎟️ Panel de Chances</h1>

      <div className="bg-white border p-4 rounded-lg shadow">
        <label className="text-sm font-semibold">Cantidad de chances a mostrar:</label>
        <input
          type="number"
          value={limit}
          onChange={(e) => setLimit(e.target.value)}
          className="border p-2 w-24 ml-2 rounded"
        />
      </div>

      {loading && <p className="mt-6 text-gray-600">Cargando chances...</p>}

      {!loading && chances.length === 0 && (
        <p className="mt-6 text-gray-600">No hay chances registradas.</p>
      )}

      {!loading && Object.keys(sorteosAgrupados).map((sorteoId) => {
        const lista = sorteosAgrupados[sorteoId];
        const infoSorteo = sorteos[sorteoId];

        return (
          <div key={sorteoId} className="mt-10">

            {/* HEADER del sorteo */}
            <div className="bg-blue-600 text-white p-4 rounded-t-lg shadow text-lg font-semibold">
              {infoSorteo ? infoSorteo.titulo : "Sorteo sin título"}  
              <span className="text-sm ml-3 opacity-80">
                ({lista.length} chances)
              </span>
            </div>

            <div className="border border-gray-300 rounded-b-lg bg-white shadow">
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
                      Chance LXM-{String(c.numero).padStart(6, "0")}
                    </div>
                  </div>

                  <div className="text-right text-xs text-gray-600">
                    {new Date(c.createdAt).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>

          </div>
        );
      })}
    </div>
  );
}
