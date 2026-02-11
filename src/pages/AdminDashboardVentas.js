import React, { useEffect, useState, useMemo } from "react";
import API_URL from "../config/api";

export default function AdminDashboardVentas() {
  const [data, setData] = useState({
    totales: {},
    ventasPorSorteo: [],
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sorteoSeleccionado, setSorteoSeleccionado] = useState("todos");

  /* ===============================
     FETCH DATA
  ================================ */
  const fetchData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("adminToken");

      const res = await fetch(`${API_URL}/admin/dashboard/ventas`, {
        headers: { "x-admin-token": token },
      });

      if (!res.ok) throw new Error("Error al traer dashboard");

      const json = await res.json();

      setData({
        totales: json?.totales || {},
        ventasPorSorteo: Array.isArray(json?.ventasPorSorteo)
          ? json.ventasPorSorteo
          : [],
      });
    } catch (e) {
      console.error(e);
      setError("Error al cargar datos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  /* ===============================
     FILTRADO
  ================================ */
  const ventasFiltradas = useMemo(() => {
    if (sorteoSeleccionado === "todos") {
      return data.ventasPorSorteo;
    }

    return data.ventasPorSorteo.filter(
      (s) => s.sorteoId === sorteoSeleccionado
    );
  }, [data, sorteoSeleccionado]);

  /* ===============================
     MÉTRICAS PRINCIPALES
  ================================ */
  const totalGeneral = useMemo(() => {
    return ventasFiltradas.reduce(
      (acc, s) => acc + Number(s.totalRecaudado || 0),
      0
    );
  }, [ventasFiltradas]);

  const totalChances = useMemo(() => {
    return ventasFiltradas.reduce(
      (acc, s) => acc + Number(s.chancesVendidas || 0),
      0
    );
  }, [ventasFiltradas]);

  const ticketPromedio =
    totalChances > 0 ? totalGeneral / totalChances : 0;

  /* ===============================
     RANKING
  ================================ */
  const ranking = [...ventasFiltradas].sort(
    (a, b) => b.totalRecaudado - a.totalRecaudado
  );

  if (loading)
    return <p className="p-6 text-gray-400">Cargando dashboard...</p>;

  if (error)
    return <p className="p-6 text-red-500">{error}</p>;

  return (
    <div className="max-w-7xl mx-auto p-6 text-white">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-extrabold">
          📊 Dashboard Empresarial
        </h2>

        <button
          onClick={fetchData}
          className="bg-zinc-700 hover:bg-zinc-600 px-4 py-2 rounded-lg text-sm transition"
        >
          🔄 Refrescar
        </button>
      </div>

      {/* FILTRO */}
      <div className="mb-6">
        <select
          value={sorteoSeleccionado}
          onChange={(e) => setSorteoSeleccionado(e.target.value)}
          className="bg-zinc-800 border border-zinc-600 rounded px-4 py-2"
        >
          <option value="todos">Todos los sorteos</option>
          {data.ventasPorSorteo.map((s) => (
            <option key={s.sorteoId} value={s.sorteoId}>
              {s.titulo}
            </option>
          ))}
        </select>
      </div>

      {/* MÉTRICAS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-10">
        <MetricCard
          title="💰 Recaudación Total"
          value={`$ ${formatMoney(totalGeneral)}`}
          highlight
        />

        <MetricCard
          title="🎟️ Chances Vendidas"
          value={totalChances}
        />

        <MetricCard
          title="📈 Ticket Promedio"
          value={`$ ${formatMoney(ticketPromedio)}`}
        />

        <MetricCard
          title="🏆 Sorteos"
          value={ventasFiltradas.length}
        />
      </div>

      {/* RANKING + OBJETIVO */}
      <div className="mb-10">
        <h3 className="text-xl font-bold mb-4">
          🏁 Objetivo Monetario por Sorteo
        </h3>

        {ranking.length === 0 ? (
          <p className="text-gray-400">
            No hay datos disponibles.
          </p>
        ) : (
          <div className="space-y-6">
            {ranking.map((s) => {
              const objetivo = Number(s.objetivoMonetario || 0);
              const recaudado = Number(s.totalRecaudado || 0);

              const porcentaje =
                objetivo > 0
                  ? Math.min((recaudado / objetivo) * 100, 100)
                  : 0;

              return (
                <div
                  key={s.sorteoId}
                  className="bg-zinc-800 border border-zinc-700 p-5 rounded-xl"
                >
                  <div className="flex justify-between mb-2">
                    <span className="font-semibold">
                      {s.titulo}
                    </span>
                    <span className="text-green-400 font-bold">
                      $ {formatMoney(recaudado)}
                    </span>
                  </div>

                  {objetivo > 0 && (
                    <>
                      <div className="w-full bg-zinc-700 rounded-full h-3 mb-2 overflow-hidden">
                        <div
                          className="h-3 bg-green-500 transition-all duration-500"
                          style={{ width: `${porcentaje}%` }}
                        />
                      </div>

                      <div className="flex justify-between text-xs text-gray-400">
                        <span>
                          {porcentaje.toFixed(1)}%
                        </span>
                        <span>
                          Objetivo: $ {formatMoney(objetivo)}
                        </span>
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

/* ===============================
   METRIC CARD
================================ */
function MetricCard({ title, value, highlight = false }) {
  return (
    <div
      className={`rounded-xl p-4 border ${
        highlight
          ? "bg-green-500/10 border-green-500"
          : "bg-zinc-800 border-zinc-700"
      }`}
    >
      <p className="text-gray-400 text-sm mb-1">{title}</p>
      <p
        className={`text-2xl font-extrabold ${
          highlight ? "text-green-400" : ""
        }`}
      >
        {value}
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
