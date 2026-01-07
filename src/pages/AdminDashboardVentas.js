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
          headers: {
            "x-admin-token": token,
          },
        });

        if (!res.ok) throw new Error("Error cargando ventas");

        const json = await res.json();
        setData(json);
      } catch (e) {
        console.error("Error cargando dashboard ventas:", e);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading)
    return <p className="p-6 text-gray-400">Cargando dashboard…</p>;

  if (!data)
    return (
      <p className="p-6 text-red-500 font-bold">
        Error cargando datos de ventas
      </p>
    );

  return (
    <div className="max-w-6xl mx-auto">
      <h2 className="text-3xl font-extrabold mb-6">📊 Dashboard de Ventas</h2>

      {/* RESUMEN */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card
          titulo="💰 Total Recaudado"
          valor={`$${data.totales.totalRecaudado}`}
        />
        <Card
          titulo="🎟️ Chances Vendidas"
          valor={data.totales.totalChancesVendidas}
        />
        <Card
          titulo="📦 Sorteos con ventas"
          valor={data.totales.sorteosConVentas}
        />
      </div>

      {/* TABLA */}
      <div className="bg-zinc-800 rounded-xl shadow border border-zinc-700 overflow-hidden">
        <table className="w-full text-left text-white">
          <thead className="bg-zinc-700">
            <tr>
              <th className="p-3">Sorteo</th>
              <th className="p-3 text-center">Chances</th>
              <th className="p-3 text-right">Recaudado</th>
            </tr>
          </thead>
          <tbody>
            {data.ventasPorSorteo.map((s) => (
              <tr
                key={s.sorteoId}
                className="border-t border-zinc-700 hover:bg-zinc-700/40"
              >
                <td className="p-3 font-medium">{s.titulo}</td>
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
    <div className="bg-zinc-800 rounded-xl border border-zinc-700 p-4 shadow">
      <p className="text-gray-400 text-sm">{titulo}</p>
      <p className="text-2xl font-extrabold mt-1 text-white">{valor}</p>
    </div>
  );
}
