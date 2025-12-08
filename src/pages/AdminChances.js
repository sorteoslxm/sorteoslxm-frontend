// FILE: src/pages/AdminChances.js
import React, { useEffect, useState } from "react";
import API_URL from "../config/api";

export default function AdminChances() {
  const [chances, setChances] = useState([]);
  const [sorteos, setSorteos] = useState({});
  const [limit, setLimit] = useState(300);
  const [loading, setLoading] = useState(true);

  /* =====================================================
      CARGAR TODOS LOS SORTEOS (PARA MOSTRAR TITULO)
  ====================================================== */
  useEffect(() => {
    fetch(`${API_URL}/sorteos`)
      .then((res) => res.json())
      .then((data) => {
        let dict = {};
        if (Array.isArray(data)) {
          data.forEach((s) => (dict[s.id] = s));
        }
        setSorteos(dict);
      })
      .catch((err) => console.error("Error cargando sorteos", err));
  }, []);

  /* =====================================================
      CARGAR CHANCES DEL BACKEND
  ====================================================== */
  useEffect(() => {
    const token = localStorage.getItem("adminToken");

    setLoading(true);

    fetch(`${API_URL}/chances?limit=${limit}`, {
      headers: token ? { "x-admin-token": token } : {},
    })
      .then((res) => res.json())
      .then((data) => {
        // 💣 VALIDACIÓN TOTAL
        if (!data) {
          setChances([]);
          return;
        }

        // Si viene como {chances: [...]}
        if (Array.isArray(data.chances)) {
          setChances(data.chances);
          return;
        }

        // Si viene un objeto (Firebase muchas veces lo hace)
        if (!Array.isArray(data) && typeof data === "object") {
          setChances(Object.values(data));
          return;
        }

        // Si es array normal
        if (Array.isArray(data)) {
          setChances(data);
          return;
        }

        console.warn("⚠ Backend devolvió algo raro:", data);
        setChances([]);
      })
      .catch((err) => {
        console.error("Error cargando chances", err);
        setChances([]);
      })
      .finally(() => setLoading(false));
  }, [limit]);

  /* =====================================================
      AGRUPAR CHANCES POR SORTEO ID
  ====================================================== */
  const sorteosAgrupados = chances.reduce((acc, chance) => {
    const id = chance.sorteoId || "SIN-ID";
    if (!acc[id]) acc[id] = [];
    acc[id].push(chance);
    return acc;
  }, {});

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-4xl font-extrabold mb-6 text-blue-700 tracking-tight">
        🎟️ Panel de Chances
      </h1>

      <div className="bg-white border p-4 rounded-lg shadow-md">
        <label className="text-sm font-semibold">Cantidad de registros a cargar:</label>
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

      {/* =====================================================
            LISTA AGRUPADA POR SORTEO
      ====================================================== */}
      {!loading &&
        Object.keys(sorteosAgrupados).map((sorteoId) => {
          const lista = sorteosAgrupados[sorteoId].sort(
            (a, b) => b.createdAt - a.createdAt
          );

          const info = sorteos[sorteoId];

          return (
            <div key={sorteoId} className="mt-10 border rounded-lg shadow-lg overflow-hidden">

              {/* HEADER */}
              <div className="bg-blue-600 text-white p-4 text-xl font-bold">
                {info ? info.titulo : "🟥 Sorteo eliminado / sin título"}
                <span className="text-sm ml-3 opacity-80">
                  ({lista.length} chances vendidas)
                </span>
              </div>

              <div className="bg-white">
                {lista.map((c) => (
                  <div
                    key={c.id}
                    className="border-b p-4 flex justify-between hover:bg-gray-50"
                  >
                    <div>
                      <div className="font-bold text-blue-700">
                        {c.telefono || "Sin teléfono"}
                      </div>

                      <div className="text-sm text-gray-700">
                        📌 Chance <strong>LXM-{String(c.numero).padStart(6, "0")}</strong>
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
