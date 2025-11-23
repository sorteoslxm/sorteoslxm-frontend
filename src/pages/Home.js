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

      const destacados = dataSorteos.filter((s) => s.featured);
      const normales = dataSorteos.filter((s) => !s.featured);

      setSorteos([...destacados, ...normales]);

      const principal = dataBanners.find((b) => b.principal);
      setBannerPrincipal(principal ?? null);

      setBannersDestacados(dataBanners.filter((b) => b.destacado));
      setBanners(dataBanners);
    } catch (error) {
      console.error("Error en Home:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const generarListaConBanners = () => {
    if (bannersDestacados.length === 0) return sorteos;

    let resultado = [];
    let iBanner = 0;

    sorteos.forEach((s, idx) => {
      resultado.push(s);

      if ((idx + 1) % 2 === 0) {
        resultado.push({
          tipo: "banner",
          ...bannersDestacados[iBanner % bannersDestacados.length],
        });
        iBanner++;
      }
    });

    return resultado;
  };

  const listaFinal = generarListaConBanners();

  return (
    <div className="w-full max-w-3xl mx-auto p-4 pb-20">

      {/* Título de test (opcional)
      <h1 className="text-2xl font-bold text-center mb-4">
        🎉 Sorteos LXM
      </h1>
      */}

      {/* 🏆 Banner principal */}
      {bannerPrincipal && (
        <div className="mb-4">
          <img
            src={bannerPrincipal.imagenUrl}
            className="w-full rounded-xl shadow-lg object-cover max-h-52"
            alt="banner principal"
          />
        </div>
      )}

      {/* LISTADO: sorteos + banners */}
      <div className="grid grid-cols-1 gap-3">
        {listaFinal.map((item, index) => {
          if (item.tipo === "banner") {
            return (
              <div key={"banner-" + index} className="w-full">
                <img
                  src={item.imagenUrl}
                  alt="banner destacado"
                  className="w-full rounded-xl shadow object-cover max-h-40"
                />
              </div>
            );
          }

          return (
            <div
              key={item.id}
              className="bg-white rounded-xl shadow overflow-hidden flex"
            >
              <img
                src={item.imagenUrl}
                className="w-36 h-36 object-cover"
                alt={item.titulo}
              />

              <div className="p-3 flex flex-col justify-between w-full">
                <div>
                  <h3 className="text-md font-bold leading-tight">
                    {item.titulo}
                  </h3>

                  <p className="text-gray-600 text-xs mt-1 line-clamp-2">
                    {item.descripcion}
                  </p>

                  {item.featured && (
                    <span className="inline-block mt-1 px-2 py-0.5 bg-yellow-400 text-white text-[10px] rounded">
                      ⭐ Destacado
                    </span>
                  )}
                </div>

                <button
                  onClick={() => (window.location = `/sorteo/${item.id}`)}
                  className="mt-2 w-full bg-blue-600 text-white py-1.5 rounded-md text-sm font-semibold"
                >
                  Ver sorteo
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="h-16"></div>
    </div>
  );
}
