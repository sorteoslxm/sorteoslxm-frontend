import { useEffect, useState } from "react";
import API_URL from "../config/api";

export default function Home() {
  const [banner, setBanner] = useState(null);
  const [destacados, setDestacados] = useState([]);
  const [sorteos, setSorteos] = useState([]);
  const [bannerIntermedio, setBannerIntermedio] = useState(null);

  useEffect(() => {
    fetch(`${API_URL}/api/sorteos`)
      .then((res) => res.json())
      .then((data) => {
        setBanner(data.bannerPrincipal);
        setBannerIntermedio(data.bannerIntermedio || null);

        setDestacados(data.sorteos.filter((s) => s.destacado));
        setSorteos(data.sorteos.filter((s) => !s.destacado));
      });
  }, []);

  return (
    <div className="p-4">

      {/* Banner principal */}
      {banner && (
        <div className="bg-gradient-to-br from-indigo-600 to-blue-600 text-white p-6 rounded-xl mb-4">
          <h1 className="text-2xl font-bold">{banner.titulo}</h1>
          <p className="text-sm">{banner.subtitulo}</p>
          {banner.imagen && (
            <img
              src={banner.imagen}
              className="w-full h-40 object-cover rounded-lg mt-3"
            />
          )}
        </div>
      )}

      {/* Destacados */}
      {destacados.length > 0 && (
        <>
          <h2 className="text-xl font-bold mb-3">Destacados ⭐</h2>

          {/* 1 principal */}
          <div className="mb-4">
            <SorteoCard big data={destacados[0]} />
          </div>

          {/* 2 secundarios */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            {destacados.slice(1).map((s) => (
              <SorteoCard key={s._id} data={s} />
            ))}
          </div>
        </>
      )}

      {/* Banner intermedio antes de la lista */}
      {bannerIntermedio && (
        <img
          src={bannerIntermedio}
          className="w-full rounded-xl object-cover h-32 mb-4"
        />
      )}

      {/* Lista con banner cada 2 sorteos */}
      <h2 className="text-xl font-bold mb-3">Todos los sorteos</h2>

      {(() => {
        const blocks = [];
        for (let i = 0; i < sorteos.length; i += 2) {
          const par = sorteos.slice(i, i + 2);

          blocks.push(
            <div key={`sorteos_${i}`} className="grid grid-cols-2 gap-3 mb-3">
              {par.map((s) => (
                <SorteoCard key={s._id} data={s} />
              ))}
            </div>
          );

          // Banner después de cada par
          if (bannerIntermedio) {
            blocks.push(
              <img
                key={`banner_${i}`}
                src={bannerIntermedio}
                className="w-full rounded-xl object-cover h-32 mb-4"
              />
            );
          }
        }
        return blocks;
      })()}

    </div>
  );
}

function SorteoCard({ data, big }) {
  return (
    <div
      className={`bg-white rounded-xl shadow-md p-2 ${
        big ? "col-span-2" : ""
      } transition hover:scale-[1.02]`}
    >
      <img
        src={data.imagenUrl}
        className={`w-full object-cover rounded-lg ${
          big ? "h-48" : "h-32"
        }`}
      />
      <h3 className="font-bold mt-2">{data.titulo}</h3>
      <p className="text-blue-600 font-semibold">${data.precio}</p>
    </div>
  );
}
