// FILE: web/sorteos-lxm/src/pages/AdminCompras.js
import React, { useEffect, useState } from "react";
import API_URL from "../config/api";

export default function AdminCompras() {
  const [compras, setCompras] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    fetch(`${API_URL}/compras`, {
      headers: token ? { "x-admin-token": token } : {}
    })
      .then(res => res.json())
      .then(data => setCompras(data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">🧾 Historial de Compras</h1>

      {compras.length === 0 && <p>No hay compras aún</p>}

      {compras.map(c => (
        <div key={c.id} className="mb-3 p-3 border rounded bg-white">
          <div className="flex justify-between">
            <div>
              <b>{c.telefono || "—"}</b> • {c.cantidad} chance(s)
              <div className="text-sm text-gray-600">{c.createdAt ? new Date(c.createdAt).toLocaleString() : ""}</div>
            </div>
            <div className="text-right">
              <div className="font-bold">{c.status}</div>
              <div className="text-xs text-gray-600">pref: {c.mpPreferenceId || "—"}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
