import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API_URL from "../config/api";

export default function CajaDetalle() {
  const { slug } = useParams();
  const [caja, setCaja] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`${API_URL}/cajas/${slug}`);
        if (!res.ok) throw new Error("Caja no encontrada");
        const data = await res.json();
        setCaja(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [slug]);

  if (loading) {
    return <p className="p-10 text-white">Cargando caja…</p>;
  }

  if (!caja) {
    return <p className="p-10 text-white">Caja no encontrada</p>;
  }

  return (
    <div className="min-h-screen p-8 text-white bg-gradient-to-b from-zinc-900 to-black">
      <h1 className="text-4xl font-extrabold mb-4">
        🎁 {caja.titulo}
      </h1>

      <p className="text-gray-300 mb-8">
        {caja.cajasVendidas ?? 0} / {caja.totalCajas} cajas vendidas
      </p>

      <div className="bg-zinc-900 rounded-2xl p-6 mb-10">
        <h2 className="text-2xl font-bold mb-4">🎁 Premios</h2>

        <div className="space-y-3">
          {caja.premios?.map((p, i) => (
            <div
              key={i}
              className="flex justify-between bg-black/40 p-3 rounded"
            >
              <span>{p.nombre}</span>
              <span className="font-bold">
                ${p.monto?.toLocaleString("es-AR")}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="text-center">
        <button className="bg-yellow-500 text-black px-10 py-4 rounded-2xl font-extrabold text-xl">
          COMPRAR CAJA
        </button>
      </div>
    </div>
  );
}
