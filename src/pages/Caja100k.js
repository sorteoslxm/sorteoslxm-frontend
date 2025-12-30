import React, { useState } from "react";

export default function Caja100k() {
  const [telefono, setTelefono] = useState("");
  const [chances, setChances] = useState(3);

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

    // 👉 ACÁ después conectamos con backend / MercadoPago
    console.log("Comprar", { telefono, chances });
  };

  return (
    <div
      className="min-h-screen px-4 py-10"
      style={{
        background:
          "radial-gradient(circle at top, #020617 0%, #020617 40%, #1e1b4b 100%)",
      }}
    >
      {/* HERO */}
      <section className="max-w-5xl mx-auto text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
          💰 Caja $100.000
        </h1>
        <p className="text-gray-300 text-lg">
          100 cajas • 11 con premio • Resultado inmediato
        </p>
      </section>

      {/* INFO */}
      <section className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
        {[
          { t: "Premio mayor", d: "$100.000" },
          { t: "Premios chicos", d: "$20.000 y $10.000" },
          { t: "Créditos", d: "Para usar en la web" },
        ].map((i, idx) => (
          <div
            key={idx}
            className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center"
          >
            <div className="text-white font-extrabold text-xl mb-2">
              {i.t}
            </div>
            <div className="text-gray-300">{i.d}</div>
          </div>
        ))}
      </section>

      {/* CHANCES */}
      <section className="max-w-5xl mx-auto mb-16">
        <h2 className="text-white text-2xl font-extrabold mb-6 text-center">
          Elegí tus chances
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* 1 chance */}
          <div
            onClick={() => setChances(1)}
            className={`cursor-pointer rounded-3xl p-6 border transition
              ${
                chances === 1
                  ? "border-blue-500 bg-blue-500/20 scale-[1.03]"
                  : "border-white/10 bg-white/5 hover:scale-[1.02]"
              }`}
          >
            <h3 className="text-xl font-extrabold text-white mb-2">
              1 chance
            </h3>
            <p className="text-gray-300 mb-4">
              Una oportunidad
            </p>
            <div className="text-2xl font-extrabold text-white">
              $5.000
            </div>
          </div>

          {/* 2 chances */}
          <div
            onClick={() => setChances(2)}
            className={`cursor-pointer rounded-3xl p-6 border transition
              ${
                chances === 2
                  ? "border-green-500 bg-green-500/20 scale-[1.04]"
                  : "border-white/10 bg-white/5 hover:scale-[1.02]"
              }`}
          >
            <h3 className="text-xl font-extrabold text-white mb-2">
              2 chances
            </h3>
            <p className="text-gray-300 mb-4">
              Más oportunidades
            </p>
            <div className="text-2xl font-extrabold text-white">
              $9.000
            </div>
          </div>

          {/* 3 chances */}
          <div
            onClick={() => setChances(3)}
            className={`cursor-pointer rounded-3xl p-6 border transition relative
              ${
                chances === 3
                  ? "border-yellow-500 bg-yellow-500/25 scale-[1.06]"
                  : "border-yellow-500/40 bg-yellow-500/10 hover:scale-[1.03]"
              }`}
          >
            <span className="absolute top-4 right-4 bg-yellow-500 text-black px-3 py-1 rounded-full text-sm font-bold">
              RECOMENDADO
            </span>

            <h3 className="text-xl font-extrabold text-yellow-300 mb-2">
              3 chances
            </h3>
            <p className="text-gray-200 mb-4">
              Mejor opción
            </p>
            <div className="text-3xl font-extrabold text-yellow-300">
              $12.000
            </div>
          </div>
        </div>
      </section>

      {/* CELULAR */}
      <section className="max-w-xl mx-auto mb-10">
        <label className="block text-white font-bold mb-2">
          📱 Dejá tu celular
        </label>
        <input
          type="tel"
          value={telefono}
          onChange={e => setTelefono(e.target.value)}
          placeholder="Ej: 11 2345 6789"
          className="w-full px-4 py-3 rounded-xl bg-white text-black font-semibold outline-none"
        />
        <p className="text-gray-400 text-sm mt-2">
          Si ganás un premio, nos comunicamos por WhatsApp
        </p>
      </section>

      {/* CTA */}
      <section className="flex justify-center">
        <button
          onClick={handleComprar}
          className="bg-yellow-500 text-black px-10 py-4 rounded-2xl text-xl font-extrabold hover:bg-yellow-400 transition shadow-2xl"
        >
          COMPRAR {chances} CHANCE{chances > 1 && "S"} – $
          {precios[chances].toLocaleString()}
        </button>
      </section>
    </div>
  );
}
