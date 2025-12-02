// FILE: /Users/mustamusic/web/sorteos-lxm/src/pages/Home.js

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
        // --- SORTEOS ---
        const s = await fetch(`${API_URL}/sorteos`);
        if (!s.ok) throw new Error("Error cargando sorteos");
        const sorteosData = await s.json();
        setSorteos(Array.isArray(sorteosData) ? sorteosData : []);

        // --- BANNERS ---
        const resBanners = await fetch(`${API_URL}/banners`);
        if (!resBanners.ok) throw new Error("Error cargando banners");
        const bannersData = await resBanners.json();

        const bannersValidos = Array.isArray(bannersData)
          ? bannersData.filter(b => b && b.url)
          : [];

        const principal = bannersValidos.find(b => b.destacado === true) || null;
        const secundarios = bannersValidos.filter(b => b.destacado !== true);

        setBannerPrincipal(principal);
        setBannersSecundarios(secundarios);

      } catch (err) {
        console.error("Error cargando home:", err.message);
      }
    };

    load();
  }, []);

  const formatPrice = (value) =>
    `$ ${Number(value).toLocaleString("es-AR")}`;

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-6">

      {/* Banner Principal */}
      {bannerPrincipal?.url && (
        bannerPrincipal.link ? (
          <a
            href={bannerPrincipal.link}
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src={bannerPrincipal.url}
              alt="banner principal"
              className="w-full max-h-72 object-contain rounded-2xl shadow-2xl mb-10 cursor-pointer transition-all hover:scale-[1.01]"
            />
          </a>
        ) : (
          <img
            src={bannerPrincipal.url}
            alt="banner principal"
            className="w-full max-h-72 object-contain rounded-2xl shadow-2xl mb-10"
          />
        )
      )}

      {/* Sorteo destacado */}
      {sorteos[0] && (
        <div className="relative rounded-2xl overflow-hidden shadow-2xl mb-12 bg-[#0e1525]/90 backdrop-blur-md transition hover:scale-[1.01]">
          
          {/* Imagen */}
          <img
            src={sorteos[0].imagenUrl}
            alt={sorteos[0].titulo}
            className="w-full h-72 object-cover"
          />

          {/* Degradado */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0e1525] via-[#0e1525]/60 to-transparent" />

          {/* Contenido */}
          <div className="absolute bottom-0 p-5 text-white">
            <h2 className="text-2xl font-bold drop-shadow-lg">{sorteos[0].titulo}</h2>
            <p className="opacity-80 text-sm line-clamp-2">{sorteos[0].descripcion}</p>

            <p className="mt-2 font-bold text-blue-400 text-2xl drop-shadow-lg">
              {formatPrice(sorteos[0].precio)}
            </p>

            <Link
              to={`/sorteo/${sorteos[0].id}`}
              className="inline-block mt-4 bg-blue-600 hover:bg-blue-700 px-5 py-2.5 rounded-lg shadow-md font-semibold transition"
            >
              Ver sorteo
            </Link>
          </div>
        </div>
      )}

      {/* Banners secundarios + miniaturas */}
      <div className="flex flex-col gap-10">
        {sorteos
          .slice(1)
          .reduce((rows, item, i) => {
            if (i % 2 === 0) rows.push([item]);
            else rows[rows.length - 1].push(item);
            return rows;
          }, [])
          .map((pair, idx) => {
            const banner = bannersSecundarios[idx % bannersSecundarios.length];

            return (
              <React.Fragment key={idx}>

                {/* Banner Secundario */}
                {banner?.url && (
                  banner.link ? (
                    <a
                      href={banner.link}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <img
                        src={banner.url}
                        alt="banner secundario"
                        className="w-full h-44 md:h-56 object-contain rounded-2xl shadow-xl cursor-pointer transition hover:scale-[1.01]"
                      />
                    </a>
                  ) : (
                    <img
                      src={banner.url}
                      alt="banner secundario"
                      className="w-full h-44 md:h-56 object-contain rounded-2xl shadow-xl"
                    />
                  )
                )}

                {/* Miniaturas */}
                <div className="grid grid-cols-2 gap-5">
                  {pair.map((sorteo) => (
                    <Link
                      key={sorteo.id}
                      to={`/sorteo/${sorteo.id}`}
                      className="bg-[#0e1525]/80 backdrop-blur-md rounded-2xl overflow-hidden shadow-xl hover:scale-[1.03] transition-all"
                    >
                      <img
                        src={sorteo.imagenUrl}
                        alt={sorteo.titulo}
                        className="w-full h-44 object-cover"
                      />

                      <div className="p-4 text-white">
                        <h3 className="font-semibold text-base line-clamp-1">{sorteo.titulo}</h3>

                        <p className="text-xs opacity-70 line-clamp-2">
                          {sorteo.descripcion}
                        </p>

                        <p className="mt-2 font-bold text-blue-400 text-lg">
                          {formatPrice(sorteo.precio)}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>

              </React.Fragment>
            );
          })}
      </div>
    </div>
  );
}
