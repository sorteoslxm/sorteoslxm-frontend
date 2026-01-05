// FILE: web/sorteos-lxm/src/pages/CajaDetalle.js
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API_URL from "../config/api";
import { getFakeProgress } from "../utils/fakeProgress";
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

        if (!res.ok) {
          throw new Error("Caja no encontrada");
        }

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
      <div className="text-center text-gray-400 py-20">
        Cargando caja…
      </div>
    );
  }

  if (error || !caja) {
    return (
      <div className="text-center text-red-400 py-20">
        {error || "Error cargando la caja"}
      </div>
    );
  }

  const premioMayor = caja.premios?.find((p) => p.esMayor);
  const progress = getFakeProgress();

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 space-y-10">
      {/* ===== PREMIO MAYOR ===== */}
      {premioMayor && (
        <div className="bg-gradient-to-r from-yellow-500/20 to-black p-6 rounded-xl border border-yellow-400">
          <h2 className="text-2xl font-extrabold text-yellow-400">
            🏆 Premio Mayor
          </h2>

          <p className="text-4xl font-black my-2">
            ${Number(premioMayor.monto).toLocaleString()}
          </p>

          <p className="text-sm text-gray-300">
            Se sortea entre todos los participantes
          </p>

          {/* Progreso */}
          <div className="mt-4">
            <div className="h-3 bg-zinc-800 rounded">
              <div
                className="h-3 bg-yellow-400 rounded transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-xs text-gray-400 mt-1">
              {progress}% completado
            </p>
          </div>
        </div>
      )}

      {/* ===== PACKS ===== */}
      <PacksPublicos
        cajaId={caja.id}
        onComprar={(pack) => {
          console.log("Comprar pack:", pack);
          // acá engancha MercadoPago
        }}
      />
    </div>
  );
}
