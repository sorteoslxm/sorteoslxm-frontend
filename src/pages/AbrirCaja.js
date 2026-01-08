// FILE: src/pages/AbrirCaja.js
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function AbrirCaja() {
  const navigate = useNavigate();
  const [fase, setFase] = useState("idle"); // idle | opening | opened

  useEffect(() => {
    if (fase === "opening") {
      const timer = setTimeout(() => {
        setFase("opened");

        // 👉 cuando exista la pantalla ganar / perder
        // navigate("/resultado-caja");
      }, 1800);

      return () => clearTimeout(timer);
    }
  }, [fase, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-zinc-900 to-black flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">

        {/* TITULO */}
        <h1 className="text-2xl font-extrabold text-white mb-2">
          🎁 Tu caja está lista
        </h1>
        <p className="text-zinc-400 mb-8">
          Respirá… el resultado se revela ahora
        </p>

        {/* CAJA */}
        <div className="relative flex justify-center mb-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={fase}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{
                scale:
                  fase === "opening"
                    ? [1, 1.06, 0.98, 1.02, 1]
                    : 1,
                opacity: 1,
                rotate:
                  fase === "opening"
                    ? [0, -2, 2, -1, 1, 0]
                    : 0
              }}
              transition={{
                duration: fase === "opening" ? 1.3 : 0.4,
                ease: "easeInOut"
              }}
              className="relative"
            >
              {/* Glow ritual */}
              {fase === "opening" && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0.2, 0.7, 0.2] }}
                  transition={{ duration: 1.2, repeat: Infinity }}
                  className="absolute inset-0 rounded-xl blur-3xl bg-yellow-400/50"
                />
              )}

              {/* Imagen caja */}
              <img
                src="/caja.png" // reemplazar por tu asset final
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
            className="w-full py-4 rounded-xl font-extrabold text-lg 
                       bg-gradient-to-r from-yellow-400 to-orange-500 
                       text-black shadow-2xl 
                       hover:scale-[1.02] active:scale-95 transition"
          >
            🔓 Abrir mi caja
          </button>
        )}

        {fase === "opening" && (
          <p className="text-yellow-400 font-bold animate-pulse">
            Revelando resultado…
          </p>
        )}
      </div>
    </div>
  );
}
