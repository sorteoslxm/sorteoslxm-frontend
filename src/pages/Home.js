// FILE: src/pages/Home.js

import React, { useEffect, useState } from "react";
import { API_URL } from "../config";

export default function Home() {
  const [sorteoPrincipal, setSorteoPrincipal] = useState(null);
  const [resto, setResto] = useState([]);
  const [bannerPrincipal, setBannerPrincipal] = useState(null);
  const [bannersSecundarios, setBannersSecundarios] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        // ==============================
        //   🔵 OBTENER LISTA DE SORTEOS
        // ==============================
        const res = await fetch(`${API_URL}/sorteos`);
        const lista = await res.json();

        // 🥇 SORTEO PRINCIPAL
        const principal = lista.find(s => s.sorteoPrincipal) || null;
        setSorteoPrincipal(principal);

        // ⭐ DESTACADOS
        const destacados = lista
          .filter(s => s.destacado && !s.sorteoPrincipal)
          .map((s, index) => ({
            ...s,
            numeroDestacado: index + 1
          }));

        // OTROS SORTEOS
        const otros = lista.filter(
          s => !s.sorteoPrincipal && !s.destacado
        );

        setResto([...destacados, ...otros]);

        // ==============================
        //   🖼️ BANNERS
        // ==============================
        const resBanners = await fetch(`${API_URL}/banners`);
        const banners = await resBanners.json();
        const validos = banners.filter(b => b?.url);

        setBannerPrincipal(
          validos.find(b => b.bannerPrincipal === true) || null
        );

        setBannersSecundarios(
          validos.filter(b => !b.bannerPrincipal)
        );
      } catch (err) {
        console.error("Error cargando home:", err);
      }
    };

    load();
  }, []);

  // ================================================
  // 🧩 ARMAR BLOQUES: 1 banner + 2 sorteos
  // ================================================

  const bloques = [];
  for (let i = 0; i < resto.length; i += 2) {
    const banner = bannersSecundarios[Math.floor(i / 2)];
    const s1 = resto[i];
    const s2 = resto[i + 1];

    bloques.push({
      banner,
      sorteos: [s1, s2].filter(Boolean)
    });
  }

  // ====================================
  //   🔽 RENDER DEL HOME
  // ====================================

  return (
    <div className="home-container">

      {/* ---------------------------
          🖼️ BANNER PRINCIPAL
      ---------------------------- */}
      {bannerPrincipal && (
        <section className="banner-principal">
          <img src={bannerPrincipal.url} alt="Banner principal" />
        </section>
      )}

      {/* ---------------------------
          🥇 SORTEO PRINCIPAL
      ---------------------------- */}
      {sorteoPrincipal && (
        <section className="sorteo-principal">
          <h2>🥇 SORTEO PRINCIPAL</h2>
          <img src={sorteoPrincipal.imagen} alt={sorteoPrincipal.titulo} />
          <h3>{sorteoPrincipal.titulo}</h3>
        </section>
      )}

      {/* -------------------------------------
          🔁 BLOQUES: 1 banner + 2 sorteos
      -------------------------------------- */}
      {bloques.map((bloque, i) => (
        <section key={i} className="bloque-home">

          {/* Banner secundario */}
          {bloque.banner && (
            <div className="banner-secundario">
              <img src={bloque.banner.url} alt="Banner" />
            </div>
          )}

          {/* 2 sorteos */}
          <div className="fila-sorteos grid grid-cols-2 gap-4 px-4">

            {bloque.sorteos.map((s) => (
              <div key={s.id} className={`item-sorteo ${s.destacado ? "destacado" : ""}`}>
                {s.destacado && (
                  <span className="badge-destacado">
                    ⭐ DESTACADO #{s.numeroDestacado}
                  </span>
                )}
                <img src={s.imagen} alt={s.titulo} />
                <h4>{s.titulo}</h4>
              </div>
            ))}
          </div>

        </section>
      ))}

    </div>
  );
}
