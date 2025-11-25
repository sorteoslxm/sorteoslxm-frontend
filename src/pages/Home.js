// FILE: /Users/mustamusic/web/sorteos-lxm/src/pages/Home.js

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API_URL from "../config/api";

export default function Home() {
  const [sorteos, setSorteos] = useState([]);
  const [bannerPrincipal, setBannerPrincipal] = useState(null);
  const [bannersSecundarios, setBannersSecundarios] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const s = await fetch(`${API_URL}/sorteos`);
        const sorteosData = await s.json();
        setSorteos(sorteosData);

        const b1 = await fetch(`${API_URL}/banners/principal`);
        const b1data = await b1.json();
        setBannerPrincipal(b1data);

        const b2 = await fetch(`${API_URL}/banners/secundarios`);
        const b2data = await b2.json();
        setBannersSecundarios(b2data);
      } catch (err) {
        console.error("Error cargando home:", err);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-6">

      {/* 🟦 TÍTULO NUEVO */}
      <h1 className="text-3xl font-bold text-yellow-400 mb-4 text-center">
        🚀 TEST NUEVO HOME — VERSIÓN 2 ok 🚀
      </h1>

      {/* 🟦 Banner principal */}
      {bannerPrincipal?.imagenUrl && (
        <img
          src={bannerPrincipal.imagenUrl}
          alt="banner principal"
          className="w-full h-56 md:h-72 object-cover rounded-xl shadow-lg mb-6"
        />
      )}

      {/* 🟦 Sorteo destacado */}
      {sorteos[0] && (
        <div className="bg-[#0e1525] rounded-xl shadow-xl overflow-hidden mb-10">
          <img
            src={sorteos[0].imagenUrl}
            alt={sorteos[0].titulo}
            className="w-full h-64 object-cover"
          />
          <div className="p-4 text-white">
            <h2 className="text-xl font-bold">{sorteos[0].titulo}</h2>
            <p className="opacity-70 text-sm">{sorteos[0].descripcion}</p>
            <p className="mt-2 font-bold text-blue-400 text-lg">
              ${sorteos[0].precio}
            </p>

            <Link
              to={`/sorteo/${sorteos[0].id}`}
              className="inline-block mt-4 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg shadow-md transition"
            >
              Ver sorteo
            </Link>
          </div>
        </div>
      )}

      {/* 🟦 Lista de sorteos + banners */}
      <div className="flex flex-col gap-10">
        {sorteos.slice(1).map((sorteo, index) => (
          <React.Fragment key={sorteo.id}>
            {index % 2 === 0 && bannersSecundarios.length > 0 && (
              <img
                src={
                  bannersSecundarios[(index / 2) % bannersSecundarios.length]
                    ?.imagenUrl
                }
                alt="banner"
                className="w-full h-40 md:h-52 object-cover rounded-xl shadow-lg"
              />
            )}

            <Link
              to={`/sorteo/${sorteo.id}`}
              className="bg-[#0e1525] rounded-xl overflow-hidden shadow-lg hover:scale-105 transition mx-auto w-full max-w-[300px]"
            >
              <img
                src={sorteo.imagenUrl}
                alt={sorteo.titulo}
                className="w-full h-40 object-cover"
              />

              <div className="p-3 text-white">
                <h3 className="font-semibold text-sm">{sorteo.titulo}</h3>
                <p className="text-xs opacity-70 line-clamp-2">
                  {sorteo.descripcion}
                </p>
                <p className="mt-2 font-bold text-blue-400">
                  ${sorteo.precio}
                </p>
              </div>
            </Link>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
