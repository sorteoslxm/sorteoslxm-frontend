import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API_URL from "../config/api";

export default function CajasHome() {
  const [cajas, setCajas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
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

    load();
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
        <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-6 drop-shadow-xl">
          🎁 Cajas con premios ocultos
        </h1>
        <p className="text-gray-300 text-lg max-w-2xl mx-auto">
          Elegí tus chances, abrí cajas y descubrí si te llevás un premio.
          Algunas están vacías. Otras pagan fuerte.
        </p>
      </section>

      {/* GRID */}
      <section className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {loading ? (
          <p className="text-gray-400">Cargando cajas…</p>
        ) : cajas.length === 0 ? (
          <p className="text-gray-400">No hay cajas activas.</p>
        ) : (
          cajas.map(caja => (
            <Link
              key={caja.id}
              to={`/cajas/${caja.slug}`}
              className="
                relative
                rounded-3xl
                p-6
                border
                border-yellow-500/40
                bg-gradient-to-b from-yellow-400/20 to-yellow-900/40
                shadow-2xl
                hover:scale-[1.04]
                transition
              "
            >
              <span className="absolute top-4 right-4 bg-yellow-500 text-black px-3 py-1 rounded-full font-bold text-sm shadow">
                ACTIVA
              </span>

              <div className="mb-6">
                <h2 className="text-2xl font-extrabold text-yellow-300 mb-2">
                  💰 {caja.titulo}
                </h2>
                <p className="text-gray-200">
                  {caja.totalCajas} cajas •{" "}
                  {caja.cajasVendidas ?? 0} vendidas
                </p>
              </div>

              <div className="flex items-center justify-between mb-8">
                <div className="text-white">
                  <span className="text-sm text-gray-300">Desde</span>
                  <div className="text-2xl font-extrabold">
                    ${caja.precioCaja?.toLocaleString("es-AR")}
                  </div>
                </div>
              </div>

              <div className="bg-yellow-500 text-black text-center py-3 rounded-xl font-extrabold tracking-wide">
                VER CAJA
              </div>
            </Link>
          ))
        )}
      </section>

      {/* CONFIANZA */}
      <section className="max-w-4xl mx-auto mt-24 text-center">
        <p className="text-gray-400 text-sm">
          ✔ Pagos con MercadoPago &nbsp;•&nbsp;
          ✔ Premios reales &nbsp;•&nbsp;
          ✔ Resultados inmediatos
        </p>
      </section>
    </div>
  );
}
