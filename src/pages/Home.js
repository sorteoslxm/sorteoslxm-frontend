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

        // Validamos que sea array
        const bannersValidos = Array.isArray(bannersData)
          ? bannersData.filter(b => b && b.url)
          : [];

        // Principal destacado
        const principal =
          bannersValidos.find(b => b.destacado === true) || null;
        setBannerPrincipal(principal);

        // Secundarios
        const secundarios = bannersValidos.filter(b => b.destacado !== true);
        setBannersSecundarios(secundarios);

      } catch (err) {
        console.error("Error cargando home:", err.message);
      }
    };

    load();
  }, []);

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-6">

      {/* Banner Principal */}
      {bannerPrincipal && bannerPrincipal.url && (
        bannerPrincipal.link ? (
          <a
            href={bannerPrincipal.link}
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src={bannerPrincipal.url}
              alt="banner principal"
              className="w-full h-56 md:h-72 object-cover rounded-xl shadow-lg mb-8 cursor-pointer"
            />
          </a>
        ) : (
          <img
            src={bannerPrincipal.url}
            alt="banner principal"
            className="w-full h-56 md:h-72 object-cover rounded-xl shadow-lg mb-8"
          />
        )
      )}

      {/* Sorteo destacado */}
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

      {/* Banners secundarios + miniaturas */}
      <div className="flex flex-col gap-8">
        {sorteos
          .slice(1)
          .reduce((rows, item, index) => {
            if (index % 2 === 0) rows.push([item]);
            else rows[rows.length - 1].push(item);
            return rows;
          }, [])
          .map((pair, idx) => {
            const banner = bannersSecundarios[idx % bannersSecundarios.length];

            return (
              <React.Fragment key={idx}>

                {/* Banner Secundario */}
                {banner && banner.url && (
                  banner.link ? (
                    <a
                      href={banner.link}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <img
                        src={banner.url}
                        alt="banner secundario"
                        className="w-full h-40 md:h-52 object-cover rounded-xl shadow-lg cursor-pointer"
                      />
                    </a>
                  ) : (
                    <img
                      src={banner.url}
                      alt="banner secundario"
                      className="w-full h-40 md:h-52 object-cover rounded-xl shadow-lg"
                    />
                  )
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
                        <p className="text-xs opacity-70 line-clamp-2">
                          {sorteo.descripcion}
                        </p>
                        <p className="mt-2 font-bold text-blue-400">
                          ${sorteos[0].precio}
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
