// FILE: src/pages/AdminDashboardVentas.js
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API_URL from "../config/api";

export default function AdminDashboardVentas() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Auth admin
  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) navigate("/admin/login");
  }, [navigate]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("adminToken");

        const res = await fetch(`${API_URL}/admin/dashboard/ventas`, {
          headers: {
            "x-admin-token": token,
          },
        });

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

  if (loading) return <p className="p-6">Cargando dashboard...</p>;
  if (!data) return <p className="p-6 text-red-600">Error cargando datos</p>;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">📊 Dashboard de Ventas</h1>

        <button
          onClick={() => navigate("/admin")}
          className="bg-gray-600 text-white px-4 py-2 rounded"
        >
          ← Volver
        </button>
      </div>

      {/* RESUMEN GENERAL */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card titulo="💰 Total Recaudado" valor={`$${data.totales.totalRecaudado}`} />
        <Card titulo="🎟️ Chances Vendidas" valor={data.totales.totalChancesVendidas} />
        <Card titulo="📦 Sorteos con ventas" valor={data.totales.sorteosConVentas} />
      </div>

      {/* VENTAS POR SORTEO */}
      <div className="bg-white rounded shadow">
        <table className="w-full text-left">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3">Sorteo</th>
              <th className="p-3 text-center">Chances</th>
              <th className="p-3 text-right">Recaudado</th>
            </tr>
          </thead>
          <tbody>
            {data.ventasPorSorteo.map((s) => (
              <tr key={s.sorteoId} className="border-t">
                <td className="p-3 font-medium">{s.titulo}</td>
                <td className="p-3 text-center">{s.chancesVendidas}</td>
                <td className="p-3 text-right font-bold text-green-600">
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
    <div className="bg-white rounded shadow p-4">
      <p className="text-gray-500">{titulo}</p>
      <p className="text-2xl font-bold mt-1">{valor}</p>
    </div>
  );
}
