// FILE: /Users/mustamusic/web/sorteos-lxm/src/pages/Home.js
import React, { useEffect, useState, useRef } from "react";
import API_URL from "../config/api";
import { Link } from "react-router-dom";

export default function Home() {
  const [sorteoPrincipal, setSorteoPrincipal] = useState(null);
  const [resto, setResto] = useState([]);
  const [bannerPrincipal, setBannerPrincipal] = useState(null);
  const [bannersSecundarios, setBannersSecundarios] = useState([]);
  const canvasRef = useRef(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`${API_URL}/sorteos`);
        const lista = await res.json();

        const principal = lista.find((s) => s.sorteoPrincipal) || null;
        setSorteoPrincipal(principal);

        // Destacados ordenados por ordenDestacado asc
        const destacados = lista
          .filter((s) => s.destacado && !s.sorteoPrincipal)
          .sort((a, b) => (a.ordenDestacado || 0) - (b.ordenDestacado || 0));

        const otros = lista.filter(
          (s) => !s.destacado && !s.sorteoPrincipal
        );

        setResto([...destacados, ...otros]);

        const resBanners = await fetch(`${API_URL}/banners`);
        const banners = await resBanners.json();

        setBannerPrincipal(banners.find((b) => b.destacado) || null);
        setBannersSecundarios(banners.filter((b) => !b.destacado));
      } catch (err) {
        console.error("Error cargando home:", err);
      }
    };

    load();
  }, []);

  // Bloques
  const bloques = [];
  for (let i = 0; i < resto.length; i += 2) {
    bloques.push({
      banner: bannersSecundarios[Math.floor(i / 2)],
      sorteos: resto.slice(i, i + 2),
    });
  }

  // 💰 Animación de monedas doradas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const coins = [];
    const coinCount = 80;

    for (let i = 0; i < coinCount; i++) {
      coins.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 4 + 2,
        vy: Math.random() * 1 + 0.5,
        bounce: Math.random() * 0.6 + 0.3,
        alpha: Math.random() * 0.8 + 0.2,
      });
    }

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      coins.forEach((c) => {
        c.y += c.vy;
        if (c.y > canvas.height) {
          c.y = 0;
          c.x = Math.random() * canvas.width;
        }
        ctx.beginPath();
        ctx.arc(c.x, c.y, c.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,215,0,${c.alpha})`;
        ctx.shadowColor = "rgba(255,215,0,0.7)";
        ctx.shadowBlur = 4;
        ctx.fill();
      });

      requestAnimationFrame(animate);
    }

    animate();

    window.addEventListener("resize", () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    });
  }, []);

  return (
    <div
      className="w-full min-h-screen px-4 py-6 relative overflow-hidden"
      style={{
        background: "linear-gradient(180deg, #0b0b0b, #1f1f1f 50%, #3b2e00)",
      }}
    >
      {/* 💰 Canvas de partículas */}
      <canvas
        ref={canvasRef}
        className="pointer-events-none absolute inset-0 z-0"
      />

      {/* BANNER PRINCIPAL */}
      {bannerPrincipal && (
        <div className="mb-12 relative z-10">
          <a href={bannerPrincipal.link || "#"} target="_blank" rel="noreferrer">
            <img
              src={bannerPrincipal.url}
              alt="Banner principal"
              className="w-full max-h-72 object-contain rounded-3xl shadow-2xl transition-transform hover:scale-105"
            />
          </a>
        </div>
      )}

      {/* SORTEO PRINCIPAL */}
      {sorteoPrincipal && (
        <Link
          to={`/sorteo/${sorteoPrincipal.id}`}
          className="block relative rounded-3xl overflow-hidden shadow-2xl mb-14 transform hover:scale-105 transition z-10"
        >
          <img
            src={sorteoPrincipal.imagenUrl || sorteoPrincipal.imagen}
            alt={sorteoPrincipal.titulo}
            className="w-full h-96 object-cover brightness-125 saturate-150"
          />

          <div className="absolute inset-0 flex flex-col justify-end p-6 text-white bg-gradient-to-t from-black/20 via-black/0 to-transparent">
            <span className="text-sm bg-red-500 px-4 py-1 rounded-full w-fit mb-3 shadow-lg animate-pulse">
              🥇 SORTEO PRINCIPAL
            </span>

            <h2 className="text-4xl font-extrabold drop-shadow-2xl">
              {sorteoPrincipal.titulo}
            </h2>
          </div>
        </Link>
      )}

      {/* BLOQUES */}
      {bloques.map((bloque, index) => (
        <section key={index} className="mb-16 relative z-10">
          {/* Banner */}
          {bloque.banner && (
            <div className="mb-8">
              <a
                href={bloque.banner.link || "#"}
                target="_blank"
                rel="noreferrer"
              >
                <img
                  src={bloque.banner.url}
                  alt="Banner"
                  className="w-full rounded-3xl shadow-xl object-contain max-h-52 transition-transform hover:scale-105"
                />
              </a>
            </div>
          )}

          {/* Miniaturas de sorteos */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {bloque.sorteos.map((s) => (
              <Link
                key={s.id}
                to={`/sorteo/${s.id}`}
                className="relative bg-gradient-to-br from-[#1f1f1f] to-[#0b0b0b] rounded-2xl overflow-hidden shadow-lg hover:scale-[1.03] transition transform"
              >
                <div className="w-full h-52 bg-gradient-to-tr from-black/30 to-transparent flex items-center justify-center overflow-hidden">
                  <img
                    src={s.imagenUrl || s.imagen}
                    alt={s.titulo}
                    className="w-full h-full object-contain transition-transform hover:scale-105"
                  />
                </div>

                <div className="p-4 text-white">
                  <h4 className="font-bold text-lg drop-shadow-md">{s.titulo}</h4>
                </div>
              </Link>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
