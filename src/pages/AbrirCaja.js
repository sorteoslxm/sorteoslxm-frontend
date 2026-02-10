// FILE: src/pages/AbrirCaja.js
import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import Confetti from "react-confetti";
import API_URL from "../config/api";

export default function AbrirCaja() {
  const navigate = useNavigate();
  const { id } = useParams(); // id de la caja
  const [searchParams] = useSearchParams();

  const pagoId = searchParams.get("pago"); // ✅ ID del pago aprobado

  const [fase, setFase] = useState("idle"); // idle | opening
  const [showConfetti, setShowConfetti] = useState(false);
  const [loading, setLoading] = useState(false);

  const audioOpen = useRef(null);
  const audioWin = useRef(null);
  const audioLose = useRef(null);

  /* 🚫 SI NO VIENE DE MERCADOPAGO */
  useEffect(() => {
    if (!pagoId) {
      navigate("/cajas");
    }
  }, [pagoId, navigate]);

  /* 🔒 Anti refresh */
  useEffect(() => {
    const yaAbierta = sessionStorage.getItem(`caja_${id}_abierta`);
    if (yaAbierta) {
      navigate("/cajas");
    }
  }, [navigate, id]);

  /* 🔊 preload sonidos */
  useEffect(() => {
    audioOpen.current = new Audio("/sonidos/open.mp3");
    audioWin.current = new Audio("/sonidos/win.mp3");
    audioLose.current = new Audio("/sonidos/lose.mp3");
  }, []);

  /* 🎁 APERTURA REAL */
  useEffect(() => {
    if (fase !== "opening" || loading) return;

    const abrirCaja = async () => {
      try {
        setLoading(true);
        audioOpen.current?.play();

        const res = await fetch(`${API_URL}/cajas/abrir`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            cajaId: id,
            pagoId, // 🔥 NOMBRE CORRECTO
          }),
        });

        if (!res.ok) {
          navigate("/cajas");
          return;
        }

        const data = await res.json();

        sessionStorage.setItem(`caja_${id}_abierta`, "true");

        if (data.win) {
          audioWin.current?.play();
          setShowConfetti(true);

          setTimeout(() => {
            navigate("/resultado-caja/ganar", {
              state: { premio: data.premio },
            });
          }, 1400);
        } else {
          audioLose.current?.play();
          setTimeout(() => {
            navigate("/resultado-caja/perder");
          }, 1100);
        }
      } catch (error) {
        console.error("❌ Error abriendo caja:", error);
        navigate("/cajas");
      }
    };

    abrirCaja();
  }, [fase, id, navigate, loading, pagoId]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-zinc-900 to-black flex items-center justify-center px-4 overflow-hidden">
      {showConfetti && <Confetti recycle={false} numberOfPieces={400} />}

      <div className="max-w-md w-full text-center">
        <h1 className="text-2xl font-extrabold text-white mb-2">
          🎁 Tu caja está lista
        </h1>
        <p className="text-zinc-400 mb-8">
          Respirá… el resultado se revela ahora
        </p>

        <div className="relative flex justify-center mb-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={fase}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{
                scale:
                  fase === "opening"
                    ? [1, 1.1, 0.95, 1.05, 1]
                    : 1,
                opacity: 1,
                rotate:
                  fase === "opening"
                    ? [0, -4, 4, -2, 2, 0]
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
                  animate={{ opacity: [0.3, 0.9, 0.3] }}
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

        {fase === "idle" && (
          <button
            onClick={() => setFase("opening")}
            className="w-full py-4 rounded-xl font-extrabold text-lg
              bg-gradient-to-r from-yellow-400 to-orange-500
              text-black shadow-2xl
              hover:scale-[1.03] active:scale-95 transition"
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
