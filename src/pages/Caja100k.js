import React, { useState, useMemo } from "react";

export default function Caja100k() {
  const [telefono, setTelefono] = useState("");
  const [chances, setChances] = useState(3);

  /* =============================
     CONFIG CAJAS
  ============================== */
  const TOTAL_CAJAS = 100;
  const PRECIO_BASE = 1000; // cada caja equivale a $1000 de recaudación
  const [cajasVendidas, setCajasVendidas] = useState(37); // mock visual

  const cajasRestantes = TOTAL_CAJAS - cajasVendidas;
  const recaudacion = cajasVendidas * PRECIO_BASE;

  /* =============================
     PRECIOS CHANCES
  ============================== */
  const precios = {
    1: 5000,
    2: 9000,
    3: 12000,
  };

  /* =============================
     PREMIOS (por recaudación)
  ============================== */
  const premios = useMemo(
    () => [
      { titulo: "💰 Premio Mayor", valor: "$100.000", unlock: 100000 },
      { titulo: "🎁 Premio", valor: "$20.000", unlock: 60000 },
      { titulo: "🎁 Premio", valor: "$10.000", unlock: 40000 },
    ],
    []
  );

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
      <section className="max-w-4xl mx-auto mb-16">
        <div className="relative bg-gradient-to-br from-yellow-400/20 to-yellow-600/10 border border-yellow-500/40 rounded-3xl p-10 text-center shadow-[0_0_60px_rgba(234,179,8,0.25)]">
          <h1 className="text-4xl md:text-5xl font-extrabold text-yellow-300 mb-4">
            💰 Caja $100.000
          </h1>
          <p className="text-lg text-gray-200 font-semibold">
            {TOTAL_CAJAS} cajas • Resultado inmediato
          </p>

          {/* CONTADOR */}
          <div className="mt-6 text-yellow-300 font-extrabold text-xl">
            🔓 {cajasRestantes} cajas restantes
          </div>
        </div>
      </section>

      {/* PREMIOS */}
      <section className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
        {premios.map((p, idx) => {
          const activo = recaudacion >= p.unlock;

          return (
            <div
              key={idx}
              className={`
                rounded-3xl p-8 text-center border transition relative
                ${
                  activo
                    ? "bg-yellow-500/15 border-yellow-500/40 shadow-[0_0_35px_rgba(234,179,8,0.4)]"
                    : "bg-gray-800/40 border-gray-600/40 opacity-50"
                }
              `}
            >
              {!activo && (
                <span className="absolute top-3 right-3 text-xs bg-black/70 px-3 py-1 rounded-full text-gray-300">
                  🔒 ${p.unlock.toLocaleString()}
                </span>
              )}

              <div className="text-4xl mb-4">{p.titulo.split(" ")[0]}</div>
              <div className="text-white font-extrabold text-xl mb-2">
                {p.titulo}
              </div>
              <div className="text-gray-200 text-lg font-semibold">
                {p.valor}
              </div>
            </div>
          );
        })}
      </section>

      {/* CHANCES */}
      <section className="max-w-5xl mx-auto mb-20">
        <h2 className="text-white text-3xl font-extrabold mb-10 text-center">
          Elegí tus chances
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[1, 2, 3].map(n => {
            const isActive = chances === n;
            const styles = {
              1: {
                active:
                  "from-blue-500 to-blue-700 border-blue-400 shadow-[0_0_45px_rgba(59,130,246,0.6)]",
                base: "from-blue-400/70 to-blue-600/70 border-blue-400/40",
              },
              2: {
                active:
                  "from-violet-500 to-violet-700 border-violet-400 shadow-[0_0_45px_rgba(139,92,246,0.6)]",
                base:
                  "from-violet-400/70 to-violet-600/70 border-violet-400/40",
              },
              3: {
                active:
                  "from-yellow-400 to-yellow-600 border-yellow-300 shadow-[0_0_60px_rgba(234,179,8,0.8)]",
                base:
                  "from-yellow-300/60 to-yellow-500/60 border-yellow-400/60",
              },
            };

            return (
              <div
                key={n}
                onClick={() => setChances(n)}
                className={`
                  cursor-pointer rounded-3xl p-8 border transition-all duration-300
                  bg-gradient-to-br
                  ${isActive ? styles[n].active : styles[n].base}
                  ${isActive ? "scale-[1.07] ring-4 ring-white/30 animate-pulse" : "hover:scale-[1.04]"}
                `}
              >
                {n === 3 && (
                  <span className="absolute top-4 right-4 bg-black/80 text-yellow-300 px-4 py-1 rounded-full text-sm font-extrabold">
                    RECOMENDADO
                  </span>
                )}

                <h3 className={`text-2xl font-extrabold ${n === 3 ? "text-black" : "text-white"} mb-3`}>
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
      </section>

      {/* CTA */}
      <section className="flex justify-center">
        <button
          onClick={handleComprar}
          className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-black px-14 py-5 rounded-3xl text-2xl font-extrabold hover:scale-[1.05] transition shadow-[0_0_50px_rgba(234,179,8,0.8)]"
        >
          COMPRAR {chances} CHANCE{chances > 1 && "S"} = $
          {precios[chances].toLocaleString()}
        </button>
      </section>
    </div>
  );
}
