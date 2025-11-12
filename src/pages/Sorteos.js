// web/sorteos-lxm/client/src/pages/Sorteos.js

import React, { useEffect, useState } from "react";
import SorteoCard from "../components/SorteoCard";
import API_URL from "../config/api";

export default function Sorteos() {
  const [sorteos, setSorteos] = useState([]);
  const [bannerPrincipal, setBannerPrincipal] = useState(
    "https://res.cloudinary.com/demo/image/upload/v1712345678/banner-principal.jpg"
  );
  const [banners, setBanners] = useState([
    {
      id: 1,
      imagen:
        "https://res.cloudinary.com/demo/image/upload/v1712345678/banner1.jpg",
      link: "https://instagram.com/sorteoslxm",
    },
    {
      id: 2,
      imagen:
        "https://res.cloudinary.com/demo/image/upload/v1712345678/banner2.jpg",
      link: "https://sorteoslxm.com",
    },
  ]);

  useEffect(() => {
    fetch(`${API_URL}/sorteos`)
      .then((res) => res.json())
      .then((data) => setSorteos(data))
      .catch((err) => console.error("Error cargando sorteos:", err));
  }, []);

  if (!sorteos.length) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-500 text-lg">No hay sorteos disponibles</p>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-screen-lg mx-auto">
      {/* 🟦 Banner Principal */}
      <div className="w-full mb-6">
        <img
          src={bannerPrincipal}
          alt="Banner Principal"
          className="w-full rounded-2xl shadow-lg hover:shadow-2xl transition-transform hover:scale-105 duration-300"
        />
      </div>

      {/* 🟩 Grid de sorteos + banners intermedios */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-2">
        {sorteos.map((sorteo, index) => (
          <React.Fragment key={sorteo.id}>
            <SorteoCard sorteo={sorteo} />

            {/* Banner intermedio cada 2 sorteos */}
            {(index + 1) % 2 === 0 &&
              index + 1 < sorteos.length &&
              banners[Math.floor(index / 2)] && (
                <div className="col-span-2 my-4">
                  <a
                    href={banners[Math.floor(index / 2)].link}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img
                      src={banners[Math.floor(index / 2)].imagen}
                      alt={`Banner ${index / 2}`}
                      className="w-full rounded-2xl shadow-md hover:shadow-xl transition-transform hover:scale-105 duration-300"
                    />
                  </a>
                </div>
              )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
