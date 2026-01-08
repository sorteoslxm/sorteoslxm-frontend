// FILE: src/pages/AbrirCaja.js
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Confetti from "react-confetti";

export default function AbrirCaja() {
  const navigate = useNavigate();

  const [fase, setFase] = useState("idle"); // idle | opening
  const [resultado, setResultado] = useState(null); // win | lose
  const [showConfetti, setShowConfetti] = useState(false);

  // 🔒 Anti-refresh / anti-repeat
  useEffect(() => {
    const yaAbierta = localStorage.getItem("caja_abierta");
    if (yaAbierta) {
      navigate("/cajas");
    }
  }, [navigate]);

  useEffect(() => {
    if (fase === "opening") {
      new Audio("/sonidos/open.mp3").play();

      const timer = setTimeout(() => {
        // 🎲 PROBABILIDAD (mock)
        const win = Math.random() < 0.3; // 30% ganar
        const res = win ? "win" : "lose";

        setResultado(res);
        localStorage.setItem("caja_abierta", "true");

        if (win) {
          new Audio("/sonidos/win.mp3").play();
          setShowConfetti(true);
          setTimeout(() => {
            navigate("/resultado-caja/ganar", {
              state: {
                premio: {
                  nombre: "🔥 Premio Especial",
                  descripcion: "Ganaste un premio exclusivo",
                },
              },
            });
          }, 1600);
        } else {
          new Audio("/sonidos/lose.mp3").play();
          setTimeout(() => {
            navigate("/resultado-caja/perder");
          }, 1200);
        }
      }, 1800);

      return () => clearTimeout(timer);
    }
  }, [fase, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-zinc-900 to-black flex items-center justify-center px-4">
      {showConfetti && <Confetti recycle={false} numberOfPieces={350} />}

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
                    ? [1, 1.08, 0.96, 1.04, 1]
                    : 1,
                opacity: 1,
                rotate:
                  fase === "opening"
                    ? [0, -3, 3, -2, 2, 0]
                    : 0,
              }}
              transition={{
                duration: fase === "opening" ? 1.4 : 0.4,
                ease: "easeInOut",
              }}
              className="relative"
            >
              {fase === "opening" && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0.3, 0.8, 0.3] }}
                  transition={{ duration: 1.2, repeat: Infinity }}
                  className="absolute inset-0 rounded-xl blur-3xl bg-yellow-400/60"
                />
              )}

              <img
                src="/caja.png"
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
