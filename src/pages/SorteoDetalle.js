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
      <div className="min-h-screen flex items-center justify-center bg-zinc-950 text-white">
        Cargando sorteo…
      </div>
    );
  }

  const sorteoCerrado =
    sorteo.cerrado === true || sorteo.chancesDisponibles <= 0;

  const packs = [
    { cantidad: sorteo.oferta1Chances, precio: sorteo.oferta1Precio, index: 1 },
    { cantidad: sorteo.oferta2Chances, precio: sorteo.oferta2Precio, index: 2 },
    { cantidad: sorteo.oferta3Chances, precio: sorteo.oferta3Precio, index: 3 },
  ].filter((p) => p.cantidad && p.precio);

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
      const res = await fetch(`${API_URL}/compras`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sorteoId: sorteo.id,
          telefono,
          cantidad: ofertaSeleccionada.cantidad,
          precio: ofertaSeleccionada.precio,
          aliasPago: sorteo.aliasPago,
        }),
      });

      if (!res.ok) throw new Error("Error compra");
      setConfirmado(true);
    } catch {
      alert("Error registrando la compra");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .fade-up { animation: fadeUp .45s ease-out; }
      `}</style>

      <div className="max-w-5xl mx-auto px-4 py-6 fade-up">
        <img
          src={sorteo.imagenUrl}
          alt={sorteo.titulo}
          className="w-full rounded-2xl shadow-2xl mb-6"
        />

        <h1 className="text-4xl font-extrabold">{sorteo.titulo}</h1>

        {sorteo.descripcion && (
          <p className="text-zinc-300 mt-3 whitespace-pre-line">
            {sorteo.descripcion}
          </p>
        )}

        {/* 🔥 BARRA DE PROGRESO MANUAL */}
        {typeof sorteo.porcentajeVendido === "number" && (
          <div className="mt-6">
            <p className="mb-2 font-bold">
              🔥 {sorteo.porcentajeVendido}% del sorteo vendido
            </p>
            <div className="w-full bg-zinc-800 rounded-full h-4 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-yellow-400 to-yellow-300 transition-all"
                style={{ width: `${sorteo.porcentajeVendido}%` }}
              />
            </div>
          </div>
        )}

        {!sorteoCerrado && (
          <div className="grid md:grid-cols-3 gap-6 mt-10">
            {packs.map((p, i) => {
              const esMasVendido = sorteo.masVendido === p.index;

              return (
                <div
                  key={i}
                  className={`relative rounded-2xl p-6 border transition-all
                    ${
                      esMasVendido
                        ? "border-yellow-400 bg-gradient-to-br from-yellow-400/20 to-black scale-105 shadow-2xl"
                        : "border-zinc-800 bg-zinc-900"
                    }`}
                >
                  {esMasVendido && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-yellow-400 text-black px-4 py-1 rounded-full text-xs font-extrabold">
                      🔥 MÁS VENDIDO
                    </div>
                  )}

                  <h3 className="text-xl font-bold">
                    {p.cantidad} chance{p.cantidad > 1 ? "s" : ""}
                  </h3>

                  <p className="text-4xl font-extrabold text-yellow-400 mt-4">
                    ${p.precio}
                  </p>

                  <button
                    onClick={() => abrirModal(p)}
                    className="mt-6 w-full bg-gradient-to-r from-yellow-400 to-yellow-300 text-black font-extrabold py-3 rounded-xl hover:scale-105 transition"
                  >
                    COMPRAR AHORA
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 🧾 MODAL COMPRA */}
      {mostrarModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">
          <div className="bg-white text-black rounded-2xl p-6 w-full max-w-md fade-up">
            {!confirmado ? (
              <>
                <h2 className="text-2xl font-extrabold mb-1">
                  {ofertaSeleccionada.cantidad} chance
                  {ofertaSeleccionada.cantidad > 1 ? "s" : ""}
                </h2>

                <p className="text-lg font-bold mb-3">
                  Total: ${ofertaSeleccionada.precio}
                </p>

                <p className="text-sm text-gray-700 mb-3">
                  Transferí al alias y luego confirmá el pago.
                  <br />
                  <span className="font-bold text-red-600">
                    Las chances se acreditan cuando llega la transferencia.
                  </span>
                </p>

                <div className="bg-gray-100 rounded-lg p-3 mb-4 font-bold text-center">
                  {sorteo.aliasPago}
                </div>

                <input
                  className="w-full border rounded-lg p-3 mb-1"
                  placeholder="Tu WhatsApp"
                  value={telefono}
                  onChange={(e) => setTelefono(e.target.value)}
                />
                <p className="text-xs text-gray-500 mb-4">
                  Para comunicarnos por si ganás
                </p>

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
                <p className="text-center mt-3 text-gray-700">
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
