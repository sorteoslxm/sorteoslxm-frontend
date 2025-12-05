// FILE: web/sorteos-lxm/src/pages/AdminChances.js
import React, { useEffect, useState } from "react";
import API_URL from "../config/api";

export default function AdminChances() {
  const [chances, setChances] = useState([]);
  const [limit, setLimit] = useState(50); // cuántas últimas chances ver

  useEffect(() => {
    const token = localStorage.getItem("adminToken");

    fetch(`${API_URL}/chances?limit=${limit}`, {
      headers: token ? { "x-admin-token": token } : {}
    })
      .then(res => res.json())
      .then(data => setChances(data))
      .catch(err => console.error(err));
  }, [limit]);

  return (
    <div className="p-6 max-w-4xl mx-auto">

      <h1 className="text-2xl font-bold mb-4">🎟️ Control de Chances</h1>

      <label className="text-sm">Cantidad de chances a mostrar:</label>
      <input
        type="number"
        value={limit}
        onChange={(e) => setLimit(e.target.value)}
        className="border p-2 w-24 ml-2"
      />

      <div className="mt-6">
        {chances.length === 0 && <p>No hay chances registradas.</p>}

        {chances.map((c) => (
          <div key={c.id} className="border p-3 bg-white mb-2 rounded">
            <div className="flex justify-between">
              <div>
                <b>{c.telefono}</b>  
                <div className="text-sm text-gray-600">Sorteo: {c.sorteoId}</div>
              </div>
              <div className="text-right">
                <b>Chance #{c.numero}</b>
                <div className="text-xs text-gray-600">
                  {new Date(c.createdAt).toLocaleString()}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
