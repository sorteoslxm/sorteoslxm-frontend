import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function ResultadoCajaPerder() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-zinc-900 to-black flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="max-w-md w-full text-center rounded-3xl border border-zinc-700 bg-zinc-900/80 p-8 shadow-2xl"
      >
        {/* ICON */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="text-5xl mb-4"
        >
          🎁
        </motion.div>

        {/* TEXTO */}
        <h1 className="text-2xl font-extrabold text-white mb-2">
          Esta caja no salió premiada
        </h1>

        <p className="text-yellow-400 font-semibold mb-6">
          💥 La próxima puede ser la tuya
        </p>

        {/* INFO */}
        <div className="text-sm text-zinc-400 space-y-1 mb-8">
          <p>⚡ Apertura instantánea</p>
          <p>🔒 Compra segura con MercadoPago</p>
          <p>🎯 Cada caja es una nueva oportunidad</p>
        </div>

        {/* CTA */}
        <button
          onClick={() => navigate("/cajas")}
          className="w-full py-4 rounded-xl font-bold text-lg
            bg-gradient-to-r from-yellow-400 to-orange-500
            text-black shadow-xl active:scale-95 transition"
        >
          👉 Seguí participando
        </button>
      </motion.div>
    </div>
  );
}

