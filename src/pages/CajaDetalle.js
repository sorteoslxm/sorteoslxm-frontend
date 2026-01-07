// FILE: src/pages/CajaDetalle.js
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import API_URL from "../config/api";

export default function CajaDetalle() {
  const { id } = useParams();

  const [caja, setCaja] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;

    const loadCaja = async () => {
      try {
        const res = await fetch(`${API_URL}/cajas/${id}`);
        if (!res.ok) throw new Error("Caja no encontrada");
        const data = await res.json();
        setCaja(data);
      } catch (err) {
        console.error(err);
        setError("Caja no encontrada");
      } finally {
        setLoading(false);
      }
    };

    loadCaja();
  }, [id]);

  if (loading) {
    return (
      <div className="text-center py-20 text-gray-400">
        Cargando caja...
      </div>
    );
  }

  if (error || !caja) {
    return (
      <div className="text-center py-20 text-red-400">
        {error || "Error al cargar la caja"}
      </div>
    );
  }

  const premios = Array.isArray(caja.premios)
    ? caja.premios.filter(p => p?.nombre && p?.monto)
    : [];

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">

      {/* TITULO */}
      <h1 className="text-3xl font-bold mb-2">
        {caja.nombre}
      </h1>

      {caja.descripcion && (
        <p className="text-gray-400 mb-6">
          {caja.descripcion}
        </p>
      )}

      {/* IMAGEN */}
      {caja.imagen && (
        <div className="mb-8 rounded-xl overflow-hidden">
          <img
            src={caja.imagen}
            alt={caja.nombre}
            className="w-full object-cover"
          />
        </div>
      )}

      {/* PREMIOS (solo lo cargado en admin) */}
      {premios.length > 0 && (
        <div className="mb-10">
          <div className="grid gap-4 sm:grid-cols-2">
            {premios.map((premio, index) => (
              <div
                key={index}
                className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 flex justify-between items-center"
              >
                <span className="font-medium">
                  {premio.nombre}
                </span>
                <span className="text-green-400 font-semibold">
                  ${Number(premio.monto).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CTA (comprar, NO abrir) */}
      <div className="mb-12">
        <Link
          to={`/comprar/${id}`}
          className="block w-full text-center bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-4 rounded-xl transition-all"
        >
          Comprar caja
        </Link>
      </div>

      {/* TEXTO INFERIOR */}
      <div className="text-center text-sm text-gray-400 space-y-1">
        <p>🔥 Premios importantes aún en juego</p>
        <p>⚡ Abrís la caja y ves el resultado al instante</p>
        <p>🎯 Todo es automático y transparente</p>
      </div>
    </div>
  );
}
