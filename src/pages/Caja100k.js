import React, { useState } from "react";

export default function Caja100k() {
  const [telefono, setTelefono] = useState("");
  const [chances, setChances] = useState(3);

  /* =============================
     CONFIG CAJAS (visual por ahora)
  ============================== */
  const TOTAL_CAJAS = 100;
  const [cajasVendidas, setCajasVendidas] = useState(37); // mock visual
  const cajasRestantes = TOTAL_CAJAS - cajasVendidas;

  /* =============================
     PRECIOS
  ============================== */
  const precios = {
    1: 5000,
    2: 9000,
    3: 12000,
  };

  const handleComprar = () => {
    if (!telefono || telefono.length < 8) {
      alert("Ingresá un número de celular válido");
      return;
    }

    console.log("Comprar", { telefono, chances });

    // mock visual de venta
    setCajasVendidas(prev => Math.min(prev + chances, TOTAL_CAJAS));
  };

  return (
    <div
      className="min-h-screen px-4 py-12"
      style={{
        background:
          "radial-gradient(circle at top, #020617 0%, #020617 40%, #1e1b4b 100%)",
      }}
    >
      {/* HERO */}
      <section className="max-w-4xl mx-auto mb-20">
        <div className="relative bg-gradient-to-br from-yellow-400/25 to-yellow-600/10 border border-yellow-500/40 rounded-3xl p-10 text-center shadow-[0_0_70px_rgba(234,179,8,0.35)]">
          <h1 className="text-4xl md:text-5xl font-extrabold text-yellow-300 mb-4 drop-shadow">
            💰 Caja $100.000
          </h1>

          <p className="text-lg text-gray-200 font-semibold">
            {TOTAL_CAJAS} cajas • Resultado inmediato
          </p>

          <div className="mt-6 inline-block bg-black/40 px-6 py-3 rounded-full text-yellow-300 font-extrabold text-xl animate-pulse">
            ⏳ {cajasRestantes} cajas disponibles
          </div>
        </div>
      </section>

      {/* PREMIOS (SIN MECÁNICA) */}
      <section className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
        {/* PREMIO MAYOR */}
        <div className="rounded-3xl p-8 text-center border border-yellow-400/50 bg-gradient-to-br from-yellow-400/20 to-yellow-600/10 shadow-[0_0_70px_rgba(234,179,8,0.35)]">
          <div className="text-5xl mb-4">🏆</div>
          <h3 className="text-2xl font-extrabold text-yellow-300 mb-2">
            Premio Mayor
          </h3>
          <p className="text-4xl font-extrabold text-white mb-2">
            $100.000
          </p>
          <p className="text-gray-200 font-semibold">
            En efectivo
          </p>
        </div>

        {/* PREMIOS EFECTIVO */}
        <div className="rounded-3xl p-8 text-center border border-blue-400/50 bg-gradient-to-br from-blue-400/20 to-blue-600/10 shadow-[0_0_70px_rgba(59,130,246,0.35)]">
          <div className="text-5xl mb-4">🎁</div>
          <h3 className="text-2xl font-extrabold text-blue-300 mb-2">
            Premios en efectivo
          </h3>
          <p className="text-3xl font-extrabold text-white mb-2">
            $20.000 y $10.000
          </p>
          <p className="text-gray-200 font-semibold">
            Múltiples ganadores
          </p>
        </div>

        {/* CRÉDITOS */}
        <div className="rounded-3xl p-8 text-center border border-violet-400/50 bg-gradient-to-br from-violet-400/20 to-violet-600/10 shadow-[0_0_70px_rgba(139,92,246,0.35)]">
          <div className="text-5xl mb-4">💳</div>
          <h3 className="text-2xl font-extrabold text-violet-300 mb-2">
            Premios en créditos
          </h3>
          <p className="text-3xl font-extrabold text-white mb-2">
            Para la web
          </p>
          <p className="text-gray-200 font-semibold">
            Usalos en futuras compras
          </p>
        </div>
      </section>

      {/* CHANCES */}
      <section className="max-w-5xl mx-auto mb-20">
        <h2 className="text-white text-3xl font-extrabold mb-10 text-center">
          Elegí tus chances
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[1, 2, 3].map(n => {
            const active = chances === n;

            const base =
              n === 1
                ? "from-blue-400/70 to-blue-600/70 border-blue-400/40"
                : n === 2
                ? "from-violet-400/70 to-violet-600/70 border-violet-400/40"
                : "from-yellow-300/60 to-yellow-500/60 border-yellow-400/60";

            const activeStyle =
              n === 1
                ? "from-blue-500 to-blue-700 shadow-[0_0_45px_rgba(59,130,246,0.7)]"
                : n === 2
                ? "from-violet-500 to-violet-700 shadow-[0_0_45px_rgba(139,92,246,0.7)]"
                : "from-yellow-400 to-yellow-600 shadow-[0_0_60px_rgba(234,179,8,0.9)]";

            return (
              <div
                key={n}
                onClick={() => setChances(n)}
                className={`
                  relative cursor-pointer rounded-3xl p-8 border bg-gradient-to-br transition-all duration-300
                  ${active ? activeStyle + " scale-[1.07] ring-4 ring-white/30" : base + " hover:scale-[1.04]"}
                `}
              >
                {n === 3 && (
                  <span className="absolute top-4 right-4 bg-black/80 text-yellow-300 px-4 py-1 rounded-full text-sm font-extrabold">
                    RECOMENDADO
                  </span>
                )}

                <h3 className={`text-2xl font-extrabold mb-3 ${n === 3 ? "text-black" : "text-white"}`}>
                  {n} chance{n > 1 && "s"}
                </h3>

                <div className={`text-3xl font-extrabold ${n === 3 ? "text-black" : "text-white"}`}>
                  ${precios[n].toLocaleString()}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* CELULAR */}
      <section className="max-w-xl mx-auto mb-12">
        <label className="block text-white font-bold mb-2 text-lg">
          📱 Dejá tu celular
        </label>
        <input
          type="tel"
          value={telefono}
          onChange={e => setTelefono(e.target.value)}
          placeholder="Ej: 11 2345 6789"
          className="w-full px-5 py-4 rounded-2xl bg-white text-black font-bold text-lg outline-none"
        />
        <p className="text-gray-400 text-sm mt-2">
          Si ganás, nos comunicamos por WhatsApp
        </p>
      </section>

      {/* CTA */}
      <section className="flex justify-center">
        <button
          onClick={handleComprar}
          className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-black px-14 py-5 rounded-3xl text-2xl font-extrabold hover:scale-[1.06] transition shadow-[0_0_60px_rgba(234,179,8,0.9)]"
        >
          COMPRAR {chances} CHANCE{chances > 1 && "S"} = $
          {precios[chances].toLocaleString()}
        </button>
      </section>
    </div>
  );
}
