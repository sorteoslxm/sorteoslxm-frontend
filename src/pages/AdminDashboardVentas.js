// FILE: src/pages/AdminDashboardVentas.js
import React, { useEffect, useState } from "react";
import API_URL from "../config/api";

export default function AdminDashboardVentas() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("adminToken");
        const res = await fetch(`${API_URL}/admin/dashboard/ventas`, {
          headers: { "x-admin-token": token },
        });
        const json = await res.json();
        setData(json);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <p className="p-6 text-gray-400">Cargando…</p>;
  if (!data) return <p className="p-6 text-red-500">Error</p>;

  return (
    <div className="max-w-6xl mx-auto p-6 text-white">
      <h2 className="text-3xl font-extrabold mb-6">📊 Dashboard de Ventas</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card titulo="💰 Total recaudado" valor={`$${data.totales.totalRecaudado}`} />
        <Card titulo="🎟️ Chances vendidas" valor={data.totales.totalChancesVendidas} />
        <Card titulo="📦 Sorteos activos" valor={data.totales.sorteosConVentas} />
      </div>

      <div className="bg-zinc-800 rounded-xl border border-zinc-700 overflow-hidden">
        <table className="w-full">
          <thead className="bg-zinc-700">
            <tr>
              <th className="p-3">Sorteo</th>
              <th className="p-3 text-center">Chances</th>
              <th className="p-3 text-right">Recaudado</th>
            </tr>
          </thead>
          <tbody>
            {data.ventasPorSorteo.map((s) => (
              <tr key={s.sorteoId} className="border-t border-zinc-700">
                <td className="p-3">{s.titulo}</td>
                <td className="p-3 text-center">{s.chancesVendidas}</td>
                <td className="p-3 text-right font-bold text-green-400">
                  ${s.totalRecaudado}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Card({ titulo, valor }) {
  return (
    <div className="bg-zinc-800 border border-zinc-700 rounded-xl p-4">
      <p className="text-gray-400 text-sm">{titulo}</p>
      <p className="text-2xl font-extrabold">{valor}</p>
    </div>
  );
}
