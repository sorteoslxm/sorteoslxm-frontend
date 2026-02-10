// FILE: src/pages/SorteoDetalle.js
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API_URL from "../config/api";

export default function SorteoDetalle() {
  const { id } = useParams();
  const [sorteo, setSorteo] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [telefono, setTelefono] = useState("");
  const [ofertaSeleccionada, setOfertaSeleccionada] = useState(null);
  const [loading, setLoading] = useState(false);
  const [confirmado, setConfirmado] = useState(false);

  useEffect(() => {
    fetch(`${API_URL}/sorteos/${id}`)
      .then((res) => res.json())
      .then(setSorteo)
      .catch((err) => console.error("ERROR sorteo:", err));
  }, [id]);

  if (!sorteo) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Cargando sorteo…
      </div>
    );
  }

  const sorteoCerrado =
    sorteo.cerrado === true || sorteo.chancesDisponibles <= 0;

  const packs = sorteo.ofertas?.filter(p => p.cantidad && p.precio) || [];

  const abrirModal = (oferta) => {
    if (sorteoCerrado) return;
    setOfertaSeleccionada(oferta);
    setMostrarModal(true);
    setConfirmado(false);
  };

  const confirmarPago = async () => {
    if (!telefono) return alert("Ingresá tu WhatsApp");
    if (!/^\d{10,13}$/.test(telefono))
      return alert("WhatsApp inválido (solo números)");

    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/compras/crear`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sorteoId: sorteo.id,
          telefono,
          cantidad: ofertaSeleccionada.cantidad,
          mpAccount: "transferencia",
        }),
      });

      if (!res.ok) throw new Error("Error compra");
      setConfirmado(true);
    } catch (err) {
      alert("Error registrando la compra");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <div className="max-w-5xl mx-auto px-4 py-6">

        {/* IMAGEN */}
        <img
          src={sorteo.imagenUrl}
          alt={sorteo.titulo}
          className="w-full rounded-2xl shadow-2xl mb-6"
        />

        {/* TITULO */}
        <h1 className="text-4xl font-extrabold tracking-tight">
          {sorteo.titulo}
        </h1>

        {sorteo.descripcion && (
          <p className="text-zinc-300 mt-3 whitespace-pre-line">
            {sorteo.descripcion}
          </p>
        )}

        {/* ALERTA CHANCES */}
        {!sorteoCerrado && sorteo.chancesDisponibles <= 10 && (
          <div className="mt-6 bg-red-600 text-white text-center py-3 rounded-xl font-bold animate-pulse">
            🔥 ÚLTIMAS {sorteo.chancesDisponibles} CHANCES DISPONIBLES
          </div>
        )}

        {sorteoCerrado && (
          <div className="mt-6 bg-zinc-300 text-black text-center py-3 rounded-xl font-bold">
            ⛔ Sorteo cerrado
          </div>
        )}

        {/* PACKS */}
        {!sorteoCerrado && (
          <div className="grid md:grid-cols-3 gap-6 mt-10">

            {packs.map((p, i) => {
              const destacado = p.destacado;

              return (
                <div
                  key={i}
                  className={`relative rounded-2xl p-6 border transition-all duration-300
                    ${destacado
                      ? "border-yellow-400 bg-gradient-to-br from-yellow-400/20 to-black scale-105 shadow-yellow-400/30 shadow-2xl"
                      : "border-zinc-800 bg-zinc-900 hover:border-zinc-600"
                    }
                  `}
                >
                  {destacado && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-yellow-400 text-black px-4 py-1 rounded-full text-xs font-extrabold tracking-wide">
                      🔥 MÁS VENDIDO
                    </div>
                  )}

                  <h3 className="text-xl font-bold mt-2">
                    {p.cantidad} chance{p.cantidad > 1 ? "s" : ""}
                  </h3>

                  <p className="text-4xl font-extrabold text-yellow-400 mt-4">
                    ${p.precio}
                  </p>

                  <button
                    onClick={() => abrirModal(p)}
                    className="mt-6 w-full bg-gradient-to-r from-yellow-400 to-yellow-300 text-black font-extrabold py-3 rounded-xl
                    hover:scale-105 transition-transform shadow-lg"
                  >
                    COMPRAR AHORA
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* MODAL */}
      {mostrarModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">
          <div className="bg-white text-black rounded-2xl p-6 w-full max-w-md">

            {!confirmado ? (
              <>
                <h2 className="text-2xl font-extrabold mb-2">
                  {ofertaSeleccionada.cantidad} chances
                </h2>

                <p className="text-lg font-bold text-yellow-600 mb-4">
                  Total: ${ofertaSeleccionada.precio}
                </p>

                <p className="text-sm text-gray-600 mb-3">
                  Transferí al alias y luego confirmá el pago
                </p>

                <div className="bg-gray-100 rounded-lg p-3 mb-4 font-bold text-center">
                  {sorteo.aliasPago}
                </div>

                <input
                  className="w-full border rounded-lg p-3 mb-4"
                  placeholder="Tu WhatsApp"
                  value={telefono}
                  onChange={(e) => setTelefono(e.target.value)}
                />

                <button
                  onClick={confirmarPago}
                  disabled={loading}
                  className="w-full bg-green-600 text-white font-bold py-3 rounded-xl"
                >
                  {loading ? "Confirmando..." : "YA PAGUÉ"}
                </button>

                <button
                  onClick={() => setMostrarModal(false)}
                  className="block mx-auto mt-4 text-sm underline text-gray-500"
                >
                  Cancelar
                </button>
              </>
            ) : (
              <>
                <h2 className="text-2xl font-extrabold text-green-600 text-center">
                  ✅ Pago informado
                </h2>

                <p className="text-center text-gray-700 mt-3">
                  En breve validamos tu pago y se acreditan tus chances.
                </p>

                <button
                  onClick={() => setMostrarModal(false)}
                  className="mt-6 w-full bg-blue-600 text-white py-2 rounded-lg font-bold"
                >
                  Cerrar
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
