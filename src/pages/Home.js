// FILE: src/pages/Home.js

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API_URL from "../config/api";

export default function Home() {
  const [sorteos, setSorteos] = useState([]);
  const [bannerPrincipal, setBannerPrincipal] = useState(null);
  const [bannersSecundarios, setBannersSecundarios] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        // Sorteos
        const s = await fetch(`${API_URL}/sorteos`);
        const sorteosData = await s.json();
        setSorteos(sorteosData);

        // Banner principal
        const b1 = await fetch(`${API_URL}/banners/principal`);
        setBannerPrincipal(await b1.json());

        // Banners secundarios (USAMOS /inferiores)
        const b2 = await fetch(`${API_URL}/banners/inferiores`);
        setBannersSecundarios(await b2.json());
      } catch (err) {
        console.error("Error cargando home:", err);
      }
    };
    load();
  }, []);

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-6">

      {/* 🟦 Banner Principal */}
      {bannerPrincipal?.imagenUrl && (
        <img
          src={bannerPrincipal.imagenUrl}
          alt="banner principal"
          className="w-full h-56 md:h-72 object-cover rounded-xl shadow-lg mb-8"
        />
      )}

      {/* 🟦 Sorteo destacado */}
      {sorteos[0] && (
        <div className="bg-[#0e1525] rounded-xl overflow-hidden shadow-lg mb-10">
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
              className="inline-block mt-4 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg shadow-md"
            >
              Ver sorteo
            </Link>
          </div>
        </div>
      )}

      {/* 🟦 Banners secundarios + 2 sorteos */}
      <div className="flex flex-col gap-8">
        {sorteos.slice(1).reduce((rows, item, index) => {
          if (index % 2 === 0) rows.push([item]);
          else rows[rows.length - 1].push(item);
          return rows;
        }, []).map((pair, idx) => (
          <React.Fragment key={idx}>

            {/* Banner Secundario */}
            {bannersSecundarios.length > 0 && bannersSecundarios[idx % bannersSecundarios.length]?.imagenUrl && (
              <img
                src={bannersSecundarios[idx % bannersSecundarios.length].imagenUrl}
                alt="banner secundario"
                className="w-full h-40 md:h-52 object-cover rounded-xl shadow-lg"
              />
            )}

            {/* 2 Miniaturas */}
            <div className="grid grid-cols-2 gap-4">
              {pair.map((sorteo) => (
                <Link
                  key={sorteo.id}
                  to={`/sorteo/${sorteo.id}`}
                  className="bg-[#0e1525] rounded-xl overflow-hidden shadow-lg hover:scale-105 transition"
                >
                  <img
                    src={sorteo.imagenUrl}
                    alt={sorteo.titulo}
                    className="w-full h-40 object-cover"
                  />
                  <div className="p-3 text-white">
                    <h3 className="font-semibold text-sm">{sorteo.titulo}</h3>
                    <p className="text-xs opacity-70 line-clamp-2">{sorteo.descripcion}</p>
                    <p className="mt-2 font-bold text-blue-400">${sorteo.precio}</p>
                  </div>
                </Link>
              ))}
            </div>

          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
