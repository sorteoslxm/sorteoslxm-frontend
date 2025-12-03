// FILE: /Users/mustamusic/web/sorteos-lxm/src/pages/Home.js

import React, { useEffect, useState } from "react";
import API_URL from "../config/api";
import { Link } from "react-router-dom";

export default function Home() {
  const [sorteoPrincipal, setSorteoPrincipal] = useState(null);
  const [resto, setResto] = useState([]);
  const [bannerPrincipal, setBannerPrincipal] = useState(null);
  const [bannersSecundarios, setBannersSecundarios] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        // 🔵 SORTEOS
        const res = await fetch(`${API_URL}/sorteos`);
        const lista = await res.json();

        // 🥇 PRINCIPAL
        const principal = lista.find((s) => s.sorteoPrincipal) || null;
        setSorteoPrincipal(principal);

        // ORDEN
        const destacados = lista
          .filter((s) => s.destacado && !s.sorteoPrincipal)
          .map((s, index) => ({ ...s, numeroDestacado: index + 1 }));

        const otros = lista.filter(
          (s) => !s.destacado && !s.sorteoPrincipal
        );

        setResto([...destacados, ...otros]);

        // 🔵 BANNERS
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

  // 🧩 Generar bloques
  const bloques = [];
  for (let i = 0; i < resto.length; i += 2) {
    bloques.push({
      banner: bannersSecundarios[Math.floor(i / 2)],
      sorteos: resto.slice(i, i + 2),
    });
  }

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-6">

      {/* BANNER PRINCIPAL */}
      {bannerPrincipal && (
        <div className="mb-12">
          <a href={bannerPrincipal.link || "#"} target="_blank" rel="noreferrer">
            <img
              src={bannerPrincipal.url}
              alt="Banner principal"
              className="w-full max-h-72 object-contain rounded-2xl shadow-xl"
            />
          </a>
        </div>
      )}

      {/* SORTEO PRINCIPAL */}
      {sorteoPrincipal && (
        <Link
          to={`/sorteo/${sorteoPrincipal.id}`}
          className="block relative rounded-2xl overflow-hidden shadow-2xl mb-14 bg-gradient-to-br from-blue-900 via-[#0e1525] to-black"
        >
          <img
            src={sorteoPrincipal.imagenUrl || sorteoPrincipal.imagen}
            alt={sorteoPrincipal.titulo}
            className="w-full h-80 object-cover brightness-110 saturate-125"
          />

          <div className="absolute inset-0 flex flex-col justify-end p-6 text-white bg-gradient-to-t from-black/40 via-black/10 to-transparent">
            <span className="text-sm bg-red-600 px-3 py-1 rounded-full w-fit mb-3 shadow-lg">
              🥇 SORTEO PRINCIPAL
            </span>

            <h2 className="text-3xl font-extrabold drop-shadow-xl">
              {sorteoPrincipal.titulo}
            </h2>
          </div>
        </Link>
      )}

      {/* BLOQUES */}
      {bloques.map((bloque, index) => (
        <section key={index} className="mb-16">
          
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
                  className="w-full rounded-2xl shadow-xl object-contain max-h-48"
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
                className="relative bg-[#0e1525]/80 rounded-2xl overflow-hidden shadow-xl hover:scale-[1.03] transition"
              >
                <div className="w-full h-44 bg-black/40 flex items-center justify-center overflow-hidden">
                  <img
                    src={s.imagenUrl || s.imagen}
                    alt={s.titulo}
                    className="w-full h-full object-contain"
                  />
                </div>

                <div className="p-4 text-white">
                  <h4 className="font-bold text-lg">{s.titulo}</h4>
                </div>
              </Link>
            ))}
          </div>

        </section>
      ))}
    </div>
  );
}
