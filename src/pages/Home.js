// FILE: /Users/mustamusic/web/sorteos-lxm/src/pages/Home.js

import React, { useEffect, useState } from "react";
import API_URL from "../config/api";

export default function Home() {
  const [sorteos, setSorteos] = useState([]);
  const [banners, setBanners] = useState([]);
  const [bannerPrincipal, setBannerPrincipal] = useState(null);
  const [bannersDestacados, setBannersDestacados] = useState([]);

  const fetchData = async () => {
    try {
      const resSorteos = await fetch(`${API_URL}/sorteos`);
      const dataSorteos = await resSorteos.json();

      const resBanners = await fetch(`${API_URL}/banners`);
      const dataBanners = await resBanners.json();

      // DESTACADOS PRIMERO
      const destacados = dataSorteos.filter((s) => s.featured);
      const normales = dataSorteos.filter((s) => !s.featured);

      setSorteos([...destacados, ...normales]);

      // BANNER PRINCIPAL
      const principal = dataBanners.find((b) => b.principal);
      setBannerPrincipal(principal ?? null);

      // BANNERS DESTACADOS
      const destacadosBanners = dataBanners.filter((b) => b.destacado);
      setBannersDestacados(destacadosBanners);

      setBanners(dataBanners);
    } catch (error) {
      console.error("Error en Home:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Insertar banner destacado cada 2 sorteos
  const generarListaConBanners = () => {
    if (bannersDestacados.length === 0) return sorteos;

    let resultado = [];
    let indexBanner = 0;

    sorteos.forEach((s, i) => {
      resultado.push(s);

      if ((i + 1) % 2 === 0) {
        const banner = bannersDestacados[indexBanner % bannersDestacados.length];
        resultado.push({ tipo: "banner", ...banner });
        indexBanner++;
      }
    });

    return resultado;
  };

  const listaFinal = generarListaConBanners();

  return (
    <div className="w-full max-w-4xl mx-auto p-4 pb-20">

      {/* 👇 TÍTULO PARA TESTEAR DEPLOY */}
      <h1 className="text-3xl font-bold text-center mb-6">
        🎉 Sorteos LXM — VERCEL DEPLOY TEST
      </h1>

      {/* 🏆 Banner principal */}
      {bannerPrincipal && (
        <div className="mb-6">
          <img
            src={bannerPrincipal.imagenUrl}
            className="w-full rounded-xl shadow-lg object-cover max-h-64"
            alt="banner principal"
          />
        </div>
      )}

      {/* LISTADO: SORTEOS + BANNERS */}
      <div className="grid grid-cols-1 gap-4">
        {listaFinal.map((item, index) => {
          if (item.tipo === "banner") {
            return (
              <div key={"banner-" + index} className="w-full">
                <img
                  src={item.imagenUrl}
                  alt="banner destacado"
                  className="w-full rounded-xl shadow-md object-cover max-h-48"
                />
              </div>
            );
          }

          return (
            <div
              key={item.id}
              className="bg-white rounded-xl shadow-lg overflow-hidden"
            >
              <img
                src={item.imagenUrl}
                className="w-full h-48 object-cover"
                alt={item.titulo}
              />

              <div className="p-4">
                <h3 className="text-lg font-bold">{item.titulo}</h3>

                <p className="text-gray-600 text-sm mt-1 line-clamp-2">
                  {item.descripcion}
                </p>

                {item.featured && (
                  <span className="inline-block mt-2 px-3 py-1 bg-yellow-400 text-white text-xs rounded">
                    ⭐ Destacado
                  </span>
                )}

                <button
                  onClick={() => (window.location = `/sorteo/${item.id}`)}
                  className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg font-semibold"
                >
                  Ver sorteo
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="h-20"></div>
    </div>
  );
}
