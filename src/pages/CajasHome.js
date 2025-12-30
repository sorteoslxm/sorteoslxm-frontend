import React from "react";
import { Link } from "react-router-dom";

export default function CajasHome() {
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

      {/* GRID DE LOTES */}
      <section className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* CAJA 100K */}
        <Link
          to="/cajas/100k"
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
              💰 Caja $100.000
            </h2>
            <p className="text-gray-200">
              100 cajas • 11 con premio
            </p>
          </div>

          <div className="flex items-center justify-between mb-8">
            <div className="text-white">
              <span className="text-sm text-gray-300">Desde</span>
              <div className="text-2xl font-extrabold">$5.000</div>
            </div>
          </div>

          <div className="bg-yellow-500 text-black text-center py-3 rounded-xl font-extrabold tracking-wide">
            VER CAJA
          </div>
        </Link>

        {/* CAJA 500K */}
        <div
          className="
            rounded-3xl
            p-6
            border
            border-white/10
            bg-white/5
            text-gray-400
            flex
            flex-col
            justify-between
          "
        >
          <div>
            <h2 className="text-2xl font-extrabold mb-2">
              🔒 Caja $500.000
            </h2>
            <p>
              Próximamente
            </p>
          </div>

          <div className="mt-8 bg-white/10 text-center py-3 rounded-xl">
            MUY PRONTO
          </div>
        </div>

        {/* CAJA 1M */}
        <div
          className="
            rounded-3xl
            p-6
            border
            border-white/10
            bg-white/5
            text-gray-400
            flex
            flex-col
            justify-between
          "
        >
          <div>
            <h2 className="text-2xl font-extrabold mb-2">
              🔒 Caja $1.000.000
            </h2>
            <p>
              Próximamente
            </p>
          </div>

          <div className="mt-8 bg-white/10 text-center py-3 rounded-xl">
            MUY PRONTO
          </div>
        </div>
      </section>

      {/* TEXTO DE CONFIANZA */}
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
