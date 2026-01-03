// FILE: web/sorteos-lxm/src/pages/CajaDetalle.js
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API_URL from "../config/api";

export default function CajaDetalle() {
  const { slug } = useParams();
  const [caja, setCaja] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCaja = async () => {
      try {
        const res = await fetch(`${API_URL}/cajas/${slug}`);
        const data = await res.json();
        setCaja(data);
      } catch (err) {
        console.error("Error cargando caja:", err);
      } finally {
        setLoading(false);
      }
    };

    loadCaja();
  }, [slug]);

  if (loading) {
    return <p className="p-10 text-white">Cargando caja…</p>;
  }

  if (!caja || caja.estado !== "activa") {
    return (
      <p className="p-10 text-gray-400">
        Esta caja no está disponible.
      </p>
    );
  }

  const progreso =
    caja.totalCajas > 0
      ? Math.round((caja.cajasVendidas / caja.totalCajas) * 100)
      : 0;

  // 👉 Premio mayor primero + solo visibles
  const premiosOrdenados = [...(caja.premios || [])]
    .filter((p) => p.visible)
    .sort((a, b) => b.monto - a.monto);

  return (
    <div className="min-h-screen px-4 py-10 text-white bg-black">
      <div className="max-w-4xl mx-auto space-y-10">
        <h1 className="text-4xl font-extrabold">{caja.titulo}</h1>

        {/* PROGRESO */}
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span>Progreso</span>
            <span>
              {caja.cajasVendidas}/{caja.totalCajas}
            </span>
          </div>
          <div className="h-3 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-yellow-500 transition-all"
              style={{ width: `${progreso}%` }}
            />
          </div>
        </div>

        {/* PRECIO */}
        <div className="text-2xl font-bold">
          Precio por caja: ${caja.precioCaja.toLocaleString("es-AR")}
        </div>

        {/* PREMIOS */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">🎁 Premios</h2>

          {premiosOrdenados.map((p, i) => (
            <div
              key={i}
              className="p-4 rounded-xl border border-yellow-500/30 bg-zinc-900 flex justify-between items-center"
            >
              <div>
                <div className="font-bold text-lg">{p.nombre}</div>
                <div className="text-sm text-gray-300">
                  ${p.monto.toLocaleString("es-AR")}
                </div>
              </div>

              {p.nombre.toLowerCase().includes("mayor") && (
                <span className="px-3 py-1 rounded-full bg-yellow-500 text-black text-xs font-extrabold">
                  PREMIO MAYOR
                </span>
              )}
            </div>
          ))}
        </div>

        {/* CTA */}
        <button className="w-full bg-yellow-500 text-black py-4 rounded-xl font-extrabold text-lg">
          COMPRAR CAJA
        </button>
      </div>
    </div>
  );
}
