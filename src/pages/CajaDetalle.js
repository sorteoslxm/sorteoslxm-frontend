// FILE: web/sorteos-lxm/src/pages/CajaDetalle.js
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import API_URL from "../config/api";
import PacksPublicos from "../components/PacksPublicos";

export default function CajaDetalle() {
  const { slug } = useParams();
  const [caja, setCaja] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadCaja = async () => {
      try {
        const res = await fetch(`${API_URL}/cajas/${slug}`);
        if (!res.ok) throw new Error("Caja no encontrada");
        const data = await res.json();
        setCaja(data);
      } catch (err) {
        console.error(err);
        setError("Caja no encontrada");
      } finally {
        setLoading(false);
      }
    };

    if (slug) loadCaja();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-400">
        Cargando caja…
      </div>
    );
  }

  if (error || !caja) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-400">
        {error || "Error cargando la caja"}
      </div>
    );
  }

  const premioMayor = caja.premios?.find((p) => p.esMayor);

  /* 📊 PROGRESO REAL */
  const chancesVendidas = caja.chancesVendidas || 0;
  const chancesTotales = caja.chancesTotales || 0;

  const progress =
    chancesTotales > 0
      ? Math.min(
          100,
          Math.round((chancesVendidas / chancesTotales) * 100)
        )
      : 0;

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

        {/* HERO CAJA */}
        <div
          className="
            relative rounded-3xl p-8
            border border-yellow-500/40
            bg-gradient-to-b from-yellow-400/20 to-yellow-900/40
            shadow-2xl
          "
        >
          <span className="absolute top-4 right-4 bg-green-500 text-black px-3 py-1 rounded-full font-bold text-sm">
            {caja.estado?.toUpperCase() || "ACTIVA"}
          </span>

          <h1 className="text-3xl md:text-4xl font-extrabold text-yellow-300 mb-2">
            {caja.nombre}
          </h1>

          <p className="text-gray-200 mb-6">
            {caja.premios?.length || 0} premios disponibles
          </p>

          {/* PROGRESO REAL */}
          <div className="max-w-md">
            <div className="flex justify-between text-xs text-gray-300 mb-1">
              <span>Progreso real</span>
              <span>{progress}%</span>
            </div>

            <div className="w-full bg-black/40 rounded-full h-2 overflow-hidden">
              <div
                className="bg-yellow-400 h-full transition-all duration-700"
                style={{ width: `${progress}%` }}
              />
            </div>

            <p className="text-xs text-gray-400 mt-1">
              {chancesVendidas} / {chancesTotales} chances vendidas
            </p>
          </div>
        </div>

        {/* PREMIO MAYOR */}
        {premioMayor && (
          <div
            className="
              rounded-3xl p-8
              border border-yellow-500/40
              bg-gradient-to-r from-yellow-500/20 to-black
              shadow-xl
            "
          >
            <h2 className="text-2xl font-extrabold text-yellow-400 mb-2">
              🏆 Premio Mayor
            </h2>

            <p className="text-4xl font-black text-white mb-2">
              ${Number(premioMayor.monto).toLocaleString()}
            </p>

            <p className="text-sm text-gray-300 leading-relaxed">
              <span className="font-semibold text-white">
                Jugá con una chance o con varias. 🍀
              </span>
              <br />
              <span className="text-yellow-400 font-bold">
                El premio mayor puede ser tuyo.
              </span>
              <br />
              <span className="text-xs text-gray-400">
                La suerte arranca cuando participás.
              </span>
            </p>
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
              // MercadoPago acá
            }}
          />
        </div>
      </div>
    </div>
  );
}
