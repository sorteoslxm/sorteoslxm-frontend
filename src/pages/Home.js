// FILE: src/pages/Home.js
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
        const principal =
          lista.find((s) => s.sorteoPrincipal === true) || null;
        setSorteoPrincipal(principal);

        // ⭐ DESTACADOS NUMERADOS
        const destacados = lista
          .filter((s) => s.destacado && !s.sorteoPrincipal)
          .map((s, index) => ({
            ...s,
            numeroDestacado: index + 1,
          }));

        // 👉 Resto
        const otros = lista.filter(
          (s) => !s.sorteoPrincipal && !s.destacado
        );

        setResto([...destacados, ...otros]);

        // 🔵 BANNERS
        const resBanners = await fetch(`${API_URL}/banners`);
        const banners = await resBanners.json();

        // 🥇 Banner principal = destacado === true
        const bPrincipal =
          banners.find((b) => b.destacado === true) || null;
        setBannerPrincipal(bPrincipal);

        // restantes
        setBannersSecundarios(
          banners.filter((b) => b.destacado !== true)
        );
      } catch (err) {
        console.error("Error cargando home:", err);
      }
    };

    load();
  }, []);

  // 🧩 Crear bloques de 1 banner + 2 sorteos
  const bloques = [];
  for (let i = 0; i < resto.length; i += 2) {
    const banner = bannersSecundarios[Math.floor(i / 2)];
    const s1 = resto[i];
    const s2 = resto[i + 1];

    bloques.push({
      banner,
      sorteos: [s1, s2].filter(Boolean),
    });
  }

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-6">

      {/* BANNER PRINCIPAL */}
      {bannerPrincipal && (
        <div className="mb-10">
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
        <div className="relative rounded-2xl overflow-hidden shadow-2xl mb-12 bg-gradient-to-br from-blue-900 via-[#0e1525] to-black">
          <img
            src={sorteoPrincipal.imagenUrl}
            alt={sorteoPrincipal.titulo}
            className="w-full h-80 object-cover opacity-70"
          />

          <div className="absolute inset-0 flex flex-col justify-end p-6 text-white bg-gradient-to-t from-black/80 via-black/40 to-transparent">
            <span className="text-sm bg-red-600 px-3 py-1 rounded-full w-fit mb-3 shadow-lg">
              🥇 SORTEO PRINCIPAL
            </span>

            <h2 className="text-3xl font-extrabold drop-shadow-xl">
              {sorteoPrincipal.titulo}
            </h2>
          </div>
        </div>
      )}

      {/* BLOQUES */}
      {bloques.map((bloque, i) => (
        <section key={i} className="mb-14">

          {/* Banner secundario */}
          {bloque.banner && (
            <div className="mb-6">
              <a href={bloque.banner.link || "#"} target="_blank" rel="noreferrer">
                <img
                  src={bloque.banner.url}
                  alt="Banner"
                  className="w-full rounded-2xl shadow-xl object-contain max-h-48"
                />
              </a>
            </div>
          )}

          {/* 2 sorteos */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {bloque.sorteos.map((s) => (
              <Link
                to={`/sorteo/${s.id}`}
                key={s.id}
                className="relative bg-[#0e1525]/80 rounded-2xl overflow-hidden shadow-xl hover:scale-[1.03] transition"
              >
                {s.destacado && (
                  <span className="absolute bg-yellow-500 text-black px-3 py-1 rounded-br-xl font-bold text-sm z-10">
                    ⭐ DESTACADO #{s.numeroDestacado}
                  </span>
                )}

                <img
                  src={s.imagenUrl}
                  alt={s.titulo}
                  className="w-full h-44 object-cover"
                />

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
