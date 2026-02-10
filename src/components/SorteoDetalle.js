// /Users/mustamusic/web/sorteos-lxm/src/components/SorteoDetalle.js
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function SorteoDetalle() {
  const { id } = useParams();
  const [sorteo, setSorteo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSorteo = async () => {
      try {
        const res = await fetch(`http://localhost:4000/api/sorteos/${id}`);
        const data = await res.json();
        setSorteo(data);
      } catch (err) {
        console.error("Error cargando sorteo:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSorteo();
  }, [id]);

  if (loading)
    return <div className="text-center text-gray-400">Cargando sorteo…</div>;

  if (!sorteo)
    return (
      <div className="text-center text-red-400">
        No se encontró el sorteo
      </div>
    );

  return (
    <div className="max-w-xl mx-auto px-4 py-6 text-center">
      <h2 className="text-2xl font-extrabold mb-4">{sorteo.titulo}</h2>

      {sorteo.imagenUrl && (
        <img
          src={sorteo.imagenUrl}
          alt={sorteo.titulo}
          className="w-full rounded-xl mb-4"
        />
      )}

      {sorteo.descripcion && (
        <p className="text-gray-300 mb-6">{sorteo.descripcion}</p>
      )}

      {/* 🔥 PACKS DE CHANCES */}
      <h3 className="text-xl font-extrabold text-yellow-400 mb-4">
        Elegí tu pack de chances
      </h3>

      {sorteo.ofertas?.length > 0 ? (
        <div className="grid gap-4">
          {sorteo.ofertas
            .sort((a, b) => (a.orden ?? 0) - (b.orden ?? 0))
            .map((oferta, i) => (
              <div
                key={i}
                className={`p-5 rounded-xl border ${
                  oferta.destacado
                    ? "border-yellow-400 bg-gradient-to-b from-yellow-400/10 to-black"
                    : "border-zinc-700 bg-zinc-900"
                }`}
              >
                {oferta.destacado && (
                  <span className="inline-block mb-2 text-xs bg-yellow-400 text-black px-2 py-1 rounded font-bold">
                    MÁS VENDIDO
                  </span>
                )}

                <h4 className="text-lg font-bold">
                  {oferta.nombre ||
                    `${oferta.cantidad} chance${
                      oferta.cantidad > 1 ? "s" : ""
                    }`}
                </h4>

                <p className="text-3xl font-extrabold text-yellow-400 my-2">
                  ${oferta.precio}
                </p>

                <p className="text-sm text-gray-300 mb-4">
                  🍀 {oferta.cantidad} chance
                  {oferta.cantidad > 1 ? "s" : ""}
                </p>

                <button
                  onClick={() => {
                    console.log("Comprar oferta:", oferta);
                    // acá después conectamos MercadoPago
                  }}
                  className="w-full bg-yellow-400 hover:bg-yellow-300 text-black font-bold py-2 rounded"
                >
                  Comprar
                </button>
              </div>
            ))}
        </div>
      ) : (
        <p className="text-gray-400 mt-6">
          No hay ofertas configuradas
        </p>
      )}
    </div>
  );
}
