// FILE: src/pages/Home.js
import React, { useEffect, useState, useRef } from "react";
import API_URL from "../config/api";
import { Link } from "react-router-dom";

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [sorteoPrincipal, setSorteoPrincipal] = useState(null);
  const [resto, setResto] = useState([]);
  const [bannerPrincipal, setBannerPrincipal] = useState(null);
  const [bannersSecundarios, setBannersSecundarios] = useState([]);
  const canvasRef = useRef(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);

        // =========================
        // SORTEOS
        // =========================
        const res = await fetch(`${API_URL}/sorteos`);
        const lista = await res.json();

        setSorteoPrincipal(lista.find((s) => s.sorteoPrincipal) || null);

        const destacados = lista
          .filter((s) => s.destacado && !s.sorteoPrincipal)
          .sort((a, b) => (a.ordenDestacado || 0) - (b.ordenDestacado || 0));

        const otros = lista.filter((s) => !s.destacado && !s.sorteoPrincipal);

        setResto([...destacados, ...otros]);

        // =========================
        // BANNERS
        // =========================
        const resPrincipal = await fetch(`${API_URL}/banners/principal`);
        const principal = await resPrincipal.json();

        const resInferiores = await fetch(`${API_URL}/banners/inferiores`);
        let inferiores = await resInferiores.json();

        // 👉 filtramos solo banners válidos
        inferiores = inferiores.filter(b => b.url);

        // Ordenamos inferiores por 'orden'
        inferiores.sort((a, b) => (a.orden ?? 0) - (b.orden ?? 0));

        setBannerPrincipal(principal || null);
        setBannersSecundarios(inferiores || []);
      } catch (err) {
        console.error("Error cargando home:", err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  // =========================
  // BLOQUES DE SORTEOS CON BANNERS SECUNDARIOS
  // =========================
  const bloques = [];
  let bannerIndex = 0;

  for (let i = 0; i < resto.length; i += 2) {
    let banner = null;

    // Primer bloque debajo del sorteo principal toma el primer banner secundario
    if (i === 0 && bannersSecundarios.length) {
      banner = bannersSecundarios[0];
    } else {
      banner = bannersSecundarios[bannerIndex] || null;
      bannerIndex++;
    }

    bloques.push({
      banner,
      sorteos: resto.slice(i, i + 2),
    });
  }

  // =========================
  // MONEDAS ANIMADAS
  // =========================
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const coins = Array.from({ length: 50 }).map(() => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 2 + 1,
      v: Math.random() * 0.5 + 0.2,
      a: Math.random() * 0.3 + 0.1,
    }));

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      coins.forEach((c) => {
        c.y += c.v;
        if (c.y > canvas.height) {
          c.y = 0;
          c.x = Math.random() * canvas.width;
        }
        ctx.beginPath();
        ctx.arc(c.x, c.y, c.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,215,0,${c.a})`;
        ctx.fill();
      });
      requestAnimationFrame(animate);
    }

    animate();
  }, []);

  if (loading) {
    return (
      <div className="w-full h-screen flex flex-col items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mb-4"></div>
        <h2 className="text-xl font-bold text-gray-700">
          Cargando sorteos...
        </h2>
      </div>
    );
  }

  return (
    <div
      className="w-full min-h-screen px-4 py-6 relative overflow-hidden"
      style={{ background: "linear-gradient(180deg, #2563eb 0%, #ffffff 60%)" }}
    >
      <canvas
        ref={canvasRef}
        className="pointer-events-none absolute inset-0 z-0"
      />

      {/* 🔥 BANNER PRINCIPAL */}
      {bannerPrincipal && (
        <div className="mb-14 relative z-10">
          <a href={bannerPrincipal.link || "#"} target="_blank" rel="noreferrer">
            <div className="w-full aspect-[16/9] max-h-[300px] rounded-3xl overflow-hidden shadow-2xl mx-auto">
              <img
                src={bannerPrincipal.url}
                alt="Banner principal"
                className="w-full h-full object-cover"
              />
            </div>
          </a>
        </div>
      )}

      {/* 🥇 SORTEO PRINCIPAL */}
      {sorteoPrincipal && (
        <Link
          to={`/sorteo/${sorteoPrincipal.id}`}
          className="block relative rounded-3xl overflow-hidden shadow-2xl mb-16 hover:scale-[1.02] transition z-10"
        >
          <img
            src={sorteoPrincipal.imagenUrl || sorteoPrincipal.imagen}
            alt={sorteoPrincipal.titulo}
            className="w-full h-96 object-cover"
          />
          <div className="absolute inset-0 flex flex-col justify-end p-6 text-white bg-gradient-to-t from-black/40 to-transparent">
            <span className="bg-red-500 px-4 py-1 rounded-full w-fit mb-3 animate-pulse">
              🥇 SORTEO PRINCIPAL
            </span>
            <h2 className="text-4xl font-extrabold drop-shadow-xl">
              {sorteoPrincipal.titulo}
            </h2>
          </div>
        </Link>
      )}

      {/* BLOQUES */}
      {bloques.map((bloque, index) => (
        <section key={index} className="mb-16 relative z-10">
          {bloque.banner && (
            <div className="mb-8">
              <a href={bloque.banner.link || "#"} target="_blank" rel="noreferrer">
                <div className="w-full h-[140px] md:h-[200px] rounded-3xl overflow-hidden shadow-xl hover:scale-[1.02] transition mx-auto">
                  <img
                    src={bloque.banner.url}
                    alt="Banner secundario"
                    className="w-full h-full object-cover"
                  />
                </div>
              </a>
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {bloque.sorteos.map((s) => (
              <Link
                key={s.id}
                to={`/sorteo/${s.id}`}
                className="bg-white rounded-2xl overflow-hidden shadow-lg hover:scale-[1.03] transition"
              >
                <div className="h-52 bg-gray-100">
                  <img
                    src={s.imagenUrl || s.imagen}
                    alt={s.titulo}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="p-4">
                  <h4 className="font-bold text-lg text-gray-800">{s.titulo}</h4>
                </div>
              </Link>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
