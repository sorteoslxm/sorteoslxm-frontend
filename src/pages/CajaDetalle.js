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

  const premioMayor = Array.isArray(caja.premios)
    ? caja.premios.find((p) => p.esMayor)
    : null;

  // 👉 SOLO premios secundarios, sin títulos del admin
  const premiosSecundarios = Array.isArray(caja.premios)
    ? caja.premios.filter(
        (p) => !p.esMayor && typeof p.monto === "number"
      )
    : [];

  const porcentaje = caja?.porcentajeVendido || 0;

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
              🎁 PREMIO MAYOR
            </h2>

            <p className="text-4xl font-black text-white mb-4">
              ${Number(premioMayor.monto).toLocaleString("es-AR")}
            </p>

            {/* BARRA */}
            <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden mb-2">
              <div
                className="bg-yellow-400 h-full transition-all duration-500"
                style={{ width: `${porcentaje}%` }}
              />
            </div>

            <p className="text-xs text-gray-300 mb-4">
              {porcentaje}% completado
            </p>

            <p className="text-sm text-gray-200">
              Abrís la caja y ves el resultado al instante.
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
                  className="flex justify-center bg-black/40 p-3 rounded-lg font-bold text-yellow-400"
                >
                  ${Number(p.monto).toLocaleString("es-AR")}
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

          <PacksPublicos cajaId={caja.id} />
        </div>

        {/* TEXTO INFERIOR */}
        <div className="mt-16 rounded-3xl border border-zinc-800 bg-black/40 p-8 text-center space-y-4">
          <p className="text-base font-semibold text-white">
            🎁 Apertura de cajas ganadoras
          </p>

          <p className="text-sm text-gray-300 leading-relaxed max-w-xl mx-auto">
            Comprás tu caja, la abrís y el resultado se muestra al instante.
            <br />
            Todo es automático y sin intermediarios.
          </p>

          <p className="text-sm text-gray-300">
            💳 Pagá de forma segura con{" "}
            <span className="font-bold text-blue-400">
              MercadoPago
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
