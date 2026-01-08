// FILE: src/pages/ResultadoCajaGanar.js
import { motion } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";

export default function ResultadoCajaGanar() {
  const navigate = useNavigate();
  const { state } = useLocation();

  const premio = state?.premio || {
    nombre: "Premio misterioso",
    descripcion: "Nuestro equipo te contactará",
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-zinc-900 to-black flex items-center justify-center px-4">
      <motion.div
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="max-w-md w-full text-center rounded-3xl border border-yellow-400/40 
                   bg-zinc-900/90 p-8 shadow-2xl"
      >
        {/* ICON */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 220 }}
          className="text-6xl mb-4"
        >
          🏆
        </motion.div>

        <h1 className="text-3xl font-extrabold text-yellow-400 mb-2">
          ¡GANASTE!
        </h1>

        <p className="text-white font-semibold mb-6">
          {premio.nombre}
        </p>

        <p className="text-zinc-400 text-sm mb-8">
          {premio.descripcion}
        </p>

        <button
          onClick={() => navigate("/cajas")}
          className="w-full py-4 rounded-xl font-bold text-lg
            bg-gradient-to-r from-yellow-400 to-orange-500
            text-black shadow-xl active:scale-95 transition"
        >
          🔥 Ver más cajas
        </button>
      </motion.div>
    </div>
  );
}
