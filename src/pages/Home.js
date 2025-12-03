// FILE: /Users/mustamusic/web/sorteos-lxm/src/pages/Home.js
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API_URL from "../config/api";

export default function Home() {
  const [sorteos, setSorteos] = useState([]);
  const [destacado, setDestacado] = useState(null);
  const [resto, setResto] = useState([]);
  const [bannerPrincipal, setBannerPrincipal] = useState(null);
  const [bannersSecundarios, setBannersSecundarios] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const s = await fetch(`${API_URL}/sorteos`);
        const sorteosData = await s.json();
        const lista = Array.isArray(sorteosData) ? sorteosData : [];

        // 🥇 BUSCAR SORTEO PRINCIPAL
        const principal =
          lista.find((s) => s.sorteoPrincipal === true) ||
          lista.find((s) => s.destacado === true) ||
          lista[0] ||
          null;

        const otros = lista.filter((s) => s.id !== principal?.id);

        setDestacado(principal);
        setResto(otros);

        // BANNERS
        const resBanners = await fetch(`${API_URL}/banners`);
        const bannersData = await resBanners.json();

        const validos = bannersData.filter(b => b && b.url);

        setBannerPrincipal(
          validos.find(b => b.bannerPrincipal === true) ||
          validos.find(b => b.destacado === true) ||
          null
        );

        setBannersSecundarios(
          validos.filter(b => b.bannerPrincipal !== true && b.destacado !== true)
        );

      } catch (err) {
        console.error("Error cargando home:", err);
      }
    };

    load();
  }, []);

  const formatPrice = (value) =>
    `$ ${Number(value).toLocaleString("es-AR")}`;

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-6">

      {/* 🟥 Banner Principal */}
      {bannerPrincipal?.url && (
        <img
          src={bannerPrincipal.url}
          alt="banner principal"
          className="w-full max-h-72 object-contain rounded-2xl shadow-2xl mb-10"
        />
      )}

      {/* 🎉 Sorteo Principal (MUCHO MÁS LLAMATIVO) */}
      {destacado && (
        <div className="relative rounded-2xl overflow-hidden shadow-2xl mb-12 bg-gradient-to-br from-blue-900 via-[#0e1525] to-black">

          <img
            src={destacado.imagen || destacado.imagenUrl}
            alt={destacado.titulo}
            className="w-full h-80 object-cover opacity-70"
          />

          <div className="absolute inset-0 flex flex-col justify-end p-6 text-white bg-gradient-to-t from-black/80 via-black/40 to-transparent">

            <span className="text-sm bg-red-600 px-3 py-1 rounded-full w-fit mb-3 shadow-lg">
              🥇 SORTEO PRINCIPAL
            </span>

            <h2 className="text-3xl font-extrabold drop-shadow-xl">
              {destacado.titulo}
            </h2>

            <p className="opacity-90 text-base mt-1 line-clamp-2">
              {destacado.descripcion}
            </p>

            <p className="mt-3 font-extrabold text-blue-400 text-3xl drop-shadow-xl">
              {formatPrice(destacado.precio)}
            </p>

            <Link
              to={`/sorteo/${destacado.id}`}
              className="mt-4 inline-block bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-xl shadow-xl font-bold transition text-lg"
            >
              Ver sorteo
            </Link>
          </div>
        </div>
      )}

      {/* Miniaturas + banners secundarios */}
      <div className="flex flex-col gap-10">
        {resto.map((sorteo, idx) => {
          const banner = bannersSecundarios[idx % bannersSecundarios.length];

          return (
            <React.Fragment key={sorteo.id}>

              {/* Banner Secundario */}
              {banner?.url && (
                <img
                  src={banner.url}
                  alt="banner secundario"
                  className="w-full h-44 object-contain rounded-2xl shadow-xl"
                />
              )}

              {/* Miniatura */}
              <Link
                to={`/sorteo/${sorteo.id}`}
                className="bg-[#0e1525]/80 rounded-2xl overflow-hidden shadow-xl hover:scale-[1.03] transition"
              >
                <img
                  src={sorteo.imagen || sorteo.imagenUrl}
                  alt={sorteo.titulo}
                  className="w-full h-44 object-cover"
                />
                <div className="p-4 text-white">
                  <h3 className="font-semibold text-base">{sorteo.titulo}</h3>
                  <p className="text-xs opacity-70">{sorteo.descripcion}</p>
                  <p className="mt-2 font-bold text-blue-400 text-lg">
                    {formatPrice(sorteo.precio)}
                  </p>
                </div>
              </Link>
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
