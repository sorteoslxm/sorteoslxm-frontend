// FILE: web/sorteos-lxm/src/pages/CajasHome.js
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API_URL from "../config/api";

export default function CajasHome() {
  const [cajas, setCajas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCajas = async () => {
      try {
        const res = await fetch(`${API_URL}/cajas`);
        const data = await res.json();
        setCajas(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error cargando cajas:", err);
      } finally {
        setLoading(false);
      }
    };

    loadCajas();
  }, []);

  return (
    <div
      className="min-h-screen px-4 py-10"
      style={{
        background:
          "radial-gradient(circle at top, #1e1b4b 0%, #020617 65%)",
      }}
    >
      {/* HERO */}
      <section className="max-w-6xl mx-auto text-center mb-20">
        <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-6">
          🎁 Cajas con premios ocultos
        </h1>
        <p className="text-gray-300 text-lg max-w-2xl mx-auto">
          Elegí tus chances, abrí cajas y descubrí si te llevás un premio.
        </p>
      </section>

      {/* GRID */}
      <section className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {loading ? (
          <p className="text-gray-400">Cargando cajas…</p>
        ) : cajas.length === 0 ? (
          <p className="text-gray-400">No hay cajas activas.</p>
        ) : (
          cajas.map((caja) => {
            const totalCajas = Number(caja.totalCajas || 0);
            const vendidas = Number(caja.cajasVendidas || 0);

            const porcentaje =
              totalCajas > 0
                ? Math.round((vendidas / totalCajas) * 100)
                : 0;

            return (
              <Link
                key={caja.id}
                to={`/cajas/${caja.id}`}
                className="
                  relative rounded-3xl p-6
                  border border-yellow-500/40
                  bg-gradient-to-b from-yellow-400/20 to-yellow-900/40
                  shadow-2xl
                  hover:shadow-yellow-500/40
                  hover:shadow-2xl
                  hover:scale-[1.04]
                  transition
                "
              >
                {/* BADGE */}
                <span className="absolute top-4 right-4 bg-green-500 text-black px-3 py-1 rounded-full font-bold text-sm">
                  ACTIVA
                </span>

                {/* TITULO */}
                <h2 className="text-2xl font-extrabold text-yellow-300 mb-2">
                  {caja.nombre}
                </h2>

                {/* INFO */}
                <p className="text-gray-200 mb-4">
                  {caja.premios?.length || 0} premios disponibles
                </p>

                {/* PROGRESO (solo si hay stock) */}
                {totalCajas > 0 && (
                  <div className="mb-6">
                    <div className="flex justify-between text-xs text-gray-300 mb-1">
                      <span>Vendidas</span>
                      <span>{porcentaje}%</span>
                    </div>
                    <div className="w-full bg-black/40 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-yellow-400 h-full transition-all duration-500"
                        style={{ width: `${porcentaje}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* CTA */}
                <div className="bg-yellow-500 text-black text-center py-3 rounded-xl font-extrabold">
                  VER CAJA
                </div>
              </Link>
            );
          })
        )}
      </section>
    </div>
  );
}
