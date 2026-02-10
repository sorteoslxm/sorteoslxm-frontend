// FILE: src/pages/AdminDashboardVentas.js
import React, { useEffect, useState } from "react";
import API_URL from "../config/api";

export default function AdminDashboardVentas() {
  const [data, setData] = useState({
    totales: {
      totalRecaudado: 0,
      totalChancesVendidas: 0,
      sorteosConVentas: 0,
    },
    ventasPorSorteo: [],
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("adminToken");
        const res = await fetch(`${API_URL}/admin/dashboard/ventas`, {
          headers: { "x-admin-token": token },
        });

        const json = await res.json();

        setData({
          totales: json.totales || {
            totalRecaudado: 0,
            totalChancesVendidas: 0,
            sorteosConVentas: 0,
          },
          ventasPorSorteo: Array.isArray(json.ventasPorSorteo)
            ? json.ventasPorSorteo
            : [],
        });
      } catch (e) {
        console.error("Error dashboard ventas:", e);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <p className="p-6 text-gray-400">Cargando…</p>;

  return (
    <div className="max-w-6xl mx-auto p-6 text-white">
      <h2 className="text-3xl font-extrabold mb-2">
        📊 Dashboard de Ventas
      </h2>

      <p className="text-sm text-gray-400 mb-6">
        Solo se contabilizan <strong>ventas confirmadas manualmente</strong>.
      </p>

      {/* TOTALES */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card
          titulo="💰 Total recaudado"
          valor={`$ ${formatMoney(data.totales.totalRecaudado)}`}
          highlight
        />
        <Card
          titulo="🎟️ Chances vendidas"
          valor={data.totales.totalChancesVendidas}
        />
        <Card
          titulo="📦 Sorteos con ventas"
          valor={data.totales.sorteosConVentas}
        />
      </div>

      {/* TABLA */}
      <div className="bg-zinc-800 rounded-xl border border-zinc-700 overflow-hidden">
        {data.ventasPorSorteo.length === 0 ? (
          <p className="p-6 text-center text-gray-400">
            Todavía no hay ventas confirmadas
          </p>
        ) : (
          <table className="w-full">
            <thead className="bg-zinc-700 text-sm uppercase text-gray-300">
              <tr>
                <th className="p-3 text-left">Sorteo</th>
                <th className="p-3 text-center">Chances</th>
                <th className="p-3 text-right">Recaudado</th>
              </tr>
            </thead>
            <tbody>
              {data.ventasPorSorteo.map((s) => (
                <tr
                  key={s.sorteoId}
                  className="border-t border-zinc-700 hover:bg-zinc-700/40 transition"
                >
                  <td className="p-3 font-medium">{s.titulo}</td>
                  <td className="p-3 text-center">{s.chancesVendidas}</td>
                  <td className="p-3 text-right font-bold text-green-400">
                    $ {formatMoney(s.totalRecaudado)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

/* ===============================
   CARD
================================ */
function Card({ titulo, valor, highlight = false }) {
  return (
    <div
      className={`rounded-xl p-4 border ${
        highlight
          ? "bg-green-500/10 border-green-500"
          : "bg-zinc-800 border-zinc-700"
      }`}
    >
      <p className="text-gray-400 text-sm">{titulo}</p>
      <p
        className={`text-2xl font-extrabold ${
          highlight ? "text-green-400" : ""
        }`}
      >
        {valor}
      </p>
    </div>
  );
}

/* ===============================
   HELPERS
================================ */
function formatMoney(value) {
  return Number(value || 0).toLocaleString("es-AR");
}
