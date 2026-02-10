// /Users/mustamusic/web/sorteos-lxm/src/components/SorteoDetalle.js
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PacksChancesPublicos from "./PacksChancesPublicos";

export default function SorteoDetalle() {
  const { id } = useParams();
  const [sorteo, setSorteo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSorteo = async () => {
      try {
        const res = await fetch(`http://localhost:4000/sorteos/${id}`);
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

      <PacksChancesPublicos
        sorteoId={id}
        onComprar={(pack) => {
          console.log("Comprar pack:", pack);
          // después conectamos MercadoPago
        }}
      />
    </div>
  );
}
