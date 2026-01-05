// FILE: web/sorteos-lxm/src/pages/CajaDetalle.js
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API_URL from "../config/api";
import { getFakeProgress } from "../utils/fakeProgress";
import PacksPublicos from "../components/PacksPublicos";

export default function CajaDetalle() {
  const { id } = useParams();
  const [caja, setCaja] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCaja = async () => {
      try {
        const res = await fetch(`${API_URL}/cajas/${id}`);
        const data = await res.json();
        setCaja(data);
      } catch (err) {
        console.error("Error cargando caja:", err);
      } finally {
        setLoading(false);
      }
    };

    loadCaja();
  }, [id]);

  if (loading) {
    return <p className="text-gray-400">Cargando caja…</p>;
  }

  if (!caja) {
    return <p className="text-gray-400">Caja no encontrada</p>;
  }

  const premioMayor = caja.premios?.find((p) => p.esMayor);
  const progress = getFakeProgress();

  return (
    <div className="space-y-10">
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
