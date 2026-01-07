// FILE: src/pages/CajaDetalle.js
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import API_URL from "../config/api";
import PacksPublicos from "../components/PacksPublicos";

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
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-400">
        Cargando caja…
      </div>
    );
  }

  if (!caja) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-400">
        Caja no encontrada
      </div>
    );
  }

  const premioMayor = caja.premios?.find(p => p.esMayor);
  const premiosSecundarios =
    Array.isArray(caja.premios)
      ? caja.premios.filter(p => !p.esMayor && p?.nombre && p?.monto)
      : [];

  return (
    <div
      className="min-h-screen px-4 py-10"
      style={{
        background:
          "radial-gradient(circle at top, #1e1b4b 0%, #020617 65%)",
      }}
    >
      <div className="max-w-6xl mx-auto space-y-12">

        {/* VOLVER */}
        <Link
          to="/cajas"
          className="inline-block text-yellow-400 text-sm hover:underline"
        >
          ← Volver a cajas
        </Link>

        {/* HERO */}
        <div className="relative rounded-3xl p-8 border border-yellow-500/40 bg-gradient-to-b from-yellow-400/20 to-yellow-900/40 shadow-2xl">
          <h1 className="text-3xl md:text-4xl font-extrabold text-yellow-300 mb-2">
            {caja.nombre}
          </h1>

          {caja.descripcion && (
            <p className="text-gray-200 max-w-xl">
              {caja.descripcion}
            </p>
          )}
        </div>

        {/* PREMIO MAYOR */}
        {premioMayor && (
          <div className="rounded-3xl p-8 border border-yellow-500/40 bg-gradient-to-r from-yellow-500/20 to-black shadow-xl">
            <h2 className="text-2xl font-extrabold text-yellow-400 mb-2">
              🏆 Premio Mayor
            </h2>

            <p className="text-4xl font-black text-white mb-4">
              ${Number(premioMayor.monto).toLocaleString()}
            </p>

            <p className="text-sm leading-relaxed">
              <span className="font-bold text-white">
                Jugá con una caja o con varias. 🍀
              </span>
              <br />
              <span className="font-bold text-yellow-400">
                El premio mayor puede ser tuyo.
              </span>
              <br />
              <span className="font-bold text-white">
                Abrís la caja y ves el resultado al instante.
              </span>
            </p>
          </div>
        )}

        {/* PREMIOS SECUNDARIOS */}
        {premiosSecundarios.length > 0 && (
          <div className="rounded-3xl p-8 border border-zinc-700 bg-zinc-900 shadow-xl">
            <h3 className="text-xl font-extrabold text-white mb-4">
              🎁 Premios en juego
            </h3>

            <ul className="grid md:grid-cols-2 gap-3 text-sm text-gray-200">
              {premiosSecundarios.map((p, i) => (
                <li
                  key={i}
                  className="flex justify-between bg-black/40 p-3 rounded-lg"
                >
                  <span>{p.nombre}</span>
                  <span className="font-bold text-yellow-400">
                    ${Number(p.monto).toLocaleString()}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* PACKS */}
        <div>
          <h2 className="text-2xl font-extrabold text-yellow-300 mb-6">
            Elegí tu pack
          </h2>

          <PacksPublicos
            cajaId={caja.id}
            onComprar={(pack) => {
              console.log("Comprar pack:", pack);
              // MP acá
            }}
          />
        </div>

        {/* TEXTO INFERIOR */}
        <div className="text-center text-sm text-gray-400 space-y-1">
          <p>🔥 Premios importantes aún en juego</p>
          <p>⚡ Todo es automático y transparente</p>
        </div>
      </div>
    </div>
  );
}
