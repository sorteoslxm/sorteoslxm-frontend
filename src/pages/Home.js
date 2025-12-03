// FILE: src/pages/Home.js
import React, { useEffect, useState } from "react";
import { API_URL } from "../config";
import { Link } from "react-router-dom";

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
        const principal = lista.find(s => s.sorteoPrincipal === true) || null;
        setSorteoPrincipal(principal);

        // ⭐ DESTACADOS (numerados)
        const destacados = lista
          .filter(s => s.destacado === true && !s.sorteoPrincipal)
          .map((s, index) => ({
            ...s,
            numeroDestacado: index + 1
          }));

        // OTROS SORTEOS (no destacados)
        const otros = lista.filter(
          s => !s.sorteoPrincipal && !s.destacado
        );

        // ORDEN FINAL DEL RESTO
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

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-6">

      {/* ---------------------------
          🖼️ BANNER PRINCIPAL
      ---------------------------- */}
      {bannerPrincipal && (
        <div className="mb-10">
          <img
            src={bannerPrincipal.url}
            alt="Banner principal"
            className="w-full max-h-72 object-contain rounded-2xl shadow-xl"
