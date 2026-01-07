import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function AbrirCaja() {
  const navigate = useNavigate();
  const [fase, setFase] = useState("idle"); // idle | opening | opened

  // Simula tiempo de apertura
  useEffect(() => {
    if (fase === "opening") {
      const timer = setTimeout(() => {
        setFase("opened");

        // 👉 luego esto navega a ganar / perder
        setTimeout(() => {
          navigate("/resultado-caja"); // lo hacemos después
        }, 800);
      }, 1800);

      return () => clearTimeout(timer);
    }
  }, [fase, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-zinc-900 to-black flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">

        {/* TITULO */}
        <h1 className="text-2xl font-bold text-white mb-2">
          🎁 Tu caja está lista
        </h1>
        <p className="text-zinc-400 mb-8">
          Respirá… lo que salga acá puede cambiar todo
        </p>

        {/* CAJA */}
        <div className="relative flex justify-center mb-10">
          <AnimatePresence>
            <motion.div
              key={fase}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{
                scale: fase === "opening" ? [1, 1.05, 0.98, 1] : 1,
                opacity: 1,
                rotate: fase === "opening" ? [0, -2, 2, -1, 1, 0] : 0
              }}
              transition={{
                duration: fase === "opening" ? 1.2 : 0.4,
                ease: "easeInOut"
              }}
              className="relative"
            >
              {/* Glow */}
              {fase === "opening" && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0.3, 0.8, 0.3] }}
                  transition={{ duration: 1.2, repeat: Infinity }}
                  className="absolute inset-0 rounded-xl blur-2xl bg-yellow-500/40"
                />
              )}

              {/* Imagen caja */}
              <img
                src="/caja.png" // ⚠️ reemplazar por tu imagen
                alt="Caja sorpresa"
                className="relative w-56 select-none"
                draggable={false}
              />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* CTA */}
        {fase === "idle" && (
          <button
            onClick={() => setFase("opening")}
            className="w-full py-4 rounded-xl font-bold text-lg bg-gradient-to-r from-yellow-400 to-orange-500 text-black shadow-xl active:scale-95 transition"
          >
            🔓 Abrir caja ahora
          </button>
        )}

        {fase === "opening" && (
          <p className="text-yellow-400 font-semibold animate-pulse">
            Abriendo…
          </p>
        )}
      </div>
    </div>
  );
}
