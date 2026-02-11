import React, { useEffect, useState } from "react";
import API_URL from "../config/api";

export default function AdminVentasPendientes() {
  const [ventas, setVentas] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("adminToken");

  const cargarVentas = async () => {
    try {
      const res = await fetch(`${API_URL}/admin/ventas/pendientes`, {
        headers: { "x-admin-token": token },
      });
      const json = await res.json();
      setVentas(Array.isArray(json) ? json : []);
    } catch (e) {
      console.error("Error cargando pendientes:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarVentas();
  }, []);

  const confirmarPago = async (ventaId) => {
    if (!window.confirm("¿Confirmar este pago?")) return;

    try {
      await fetch(`${API_URL}/admin/ventas/${ventaId}/confirmar`, {
        method: "PUT",
        headers: { "x-admin-token": token },
      });

      alert("✅ Pago confirmado");
      cargarVentas();
    } catch {
      alert("❌ Error confirmando pago");
    }
  };

  if (loading) return <p className="p-6 text-gray-400">Cargando…</p>;

  return (
    <div className="max-w-6xl mx-auto p-6 text-white">
      <h2 className="text-3xl font-extrabold mb-6">
        ⏳ Ventas pendientes
      </h2>

      {ventas.length === 0 ? (
        <p className="text-gray-400">No hay pagos pendientes</p>
      ) : (
        <div className="bg-zinc-800 border border-zinc-700 rounded-xl overflow-hidden">
          <table className="w-full">
            <thead className="bg-zinc-700 text-sm uppercase text-gray-300">
              <tr>
                <th className="p-3 text-left">Sorteo</th>
                <th className="p-3">Chances</th>
                <th className="p-3">Monto</th>
                <th className="p-3">WhatsApp</th>
                <th className="p-3 text-right">Acción</th>
              </tr>
            </thead>
            <tbody>
              {ventas.map((v) => (
                <tr
                  key={v.id}
                  className="border-t border-zinc-700 hover:bg-zinc-700/40"
                >
                  <td className="p-3">{v.sorteoTitulo}</td>
                  <td className="p-3 text-center">{v.cantidad}</td>
                  <td className="p-3 text-center font-bold text-green-400">
                    $ {v.precio}
                  </td>
                  <td className="p-3 text-center">{v.telefono}</td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() => confirmarPago(v.id)}
                      className="bg-green-600 hover:bg-green-500 px-4 py-2 rounded font-bold"
                    >
                      Confirmar pago
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
