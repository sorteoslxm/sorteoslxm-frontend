// FILE: web/sorteos-lxm/src/pages/CajaDetalle.js
import { getFakeProgress } from "../utils/fakeProgress";
import PacksPublicos from "../components/PacksPublicos";

export default function CajaDetalle({ caja }) {
  const progress = getFakeProgress();

  return (
    <div className="space-y-10">
      {/* ===== PREMIO MAYOR (SIEMPRE VISIBLE) ===== */}
      <div className="bg-gradient-to-r from-yellow-500/20 to-black p-6 rounded-xl border border-yellow-400">
        <h2 className="text-2xl font-extrabold text-yellow-400">
          🏆 Premio Mayor
        </h2>

        <p className="text-4xl font-black my-2">
          ${caja.premioMayorMonto}
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

      {/* ===== PACKS ===== */}
      <PacksPublicos
        cajaId={caja._id}
        onComprar={(pack) => {
          console.log("Comprar pack:", pack);
          // acá engancha MercadoPago
        }}
      />
    </div>
  );
}
