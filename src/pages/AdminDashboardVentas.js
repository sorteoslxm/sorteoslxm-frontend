// FILE: src/pages/AdminDashboardVentas.js
import React, { useEffect, useState } from "react";
import API_URL from "../config/api";

export default function AdminDashboardVentas() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [confirmando, setConfirmando] = useState(null);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const res = await fetch(`${API_URL}/admin/dashboard/ventas`, {
        headers: { "x-admin-token": token },
      });
      const json = await res.json();
      setData(json);
    } catch (e) {
      console.error("Error dashboard ventas:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const confirmarVenta = async (ventaId) => {
    if (!window.confirm("¿Confirmar esta transferencia?")) return;

    try {
      setConfirmando(ventaId);
      const token = localStorage.getItem("adminToken");

      await fetch(`${API_URL}/admin/ventas/${ventaId}/confirmar`, {
        method: "POST",
        headers: { "x-admin-token": token },
      });

      await fetchData();
    } catch (e) {
      alert("Error al confirmar venta");
    } finally {
      setConfirmando(null);
    }
  };

  if (loading) return <p className="p-6 text-gray-400">Cargando…</p>;
  if (!data) return <p className="p-6 text-red-500">Error al cargar datos</p>;

  return (
    <div className="max-w-6xl mx-auto p-6 text-white space-y-10">
      <div>
        <h2 className="text-3xl font-extrabold mb-2">📊 Dashboard de Ventas</h2>
        <p className="text-sm text-gray-400">
          Solo se contabilizan <strong>ventas confirmadas manualmente</strong>.
        </p>
      </div>

      {/* TOTALES */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

      {/* BARRA POR SORTEO (MANUAL) */}
      <div>
        <h3 className="text-xl font-bold mb-3">📈 Progreso por sorteo</h3>

        <div className="space-y-3">
          {data.ventasPorSorteo.map((s) => (
            <div key={s.sorteoId} className="bg-zinc-800 border border-zinc-700 rounded p-3">
              <div className="flex justify-between text-sm mb-1">
                <span>{s.titulo}</span>
                <span>{s.porcentajeVendido}%</span>
              </div>

              <div className="w-full bg-zinc-700 rounded h-2 overflow-hidden">
                <div
                  className="h-full bg-green-500 transition-all"
                  style={{ width: `${s.porcentajeVendido}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* VENTAS PENDIENTES */}
      <div>
        <h3 className="text-xl font-bold mb-3">⏳ Ventas pendientes</h3>

        {data.ventasPendientes.length === 0 ? (
          <p className="text-gray-400 text-sm">
            No hay ventas pendientes 🎉
          </p>
        ) : (
          <div className="bg-zinc-800 border border-zinc-700 rounded overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-zinc-700">
                <tr>
                  <th className="p-3 text-left">Comprador</th>
                  <th className="p-3">Sorteo</th>
                  <th className="p-3">Chances</th>
                  <th className="p-3 text-right">Monto</th>
                  <th className="p-3"></th>
                </tr>
              </thead>
              <tbody>
                {data.ventasPendientes.map((v) => (
                  <tr key={v.id} className="border-t border-zinc-700">
                    <td className="p-3">{v.nombre}</td>
                    <td className="p-3">{v.sorteoTitulo}</td>
                    <td className="p-3 text-center">{v.chances}</td>
                    <td className="p-3 text-right">
                      $ {formatMoney(v.monto)}
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => confirmarVenta(v.id)}
                        disabled={confirmando === v.id}
                        className="bg-green-600 hover:bg-green-700 px-3 py-1 rounded font-bold"
                      >
                        {confirmando === v.id ? "Confirmando..." : "Confirmar"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

/* ===============================
   COMPONENTES / HELPERS
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
      <p className={`text-2xl font-extrabold ${highlight ? "text-green-400" : ""}`}>
        {valor}
      </p>
    </div>
  );
}

function formatMoney(value) {
  return Number(value || 0).toLocaleString("es-AR");
}
