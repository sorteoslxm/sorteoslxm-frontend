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
    return <p className="p-4 text-center">Cargando…</p>;
  }

  const sorteoCerrado =
    sorteo.cerrado === true || sorteo.chancesDisponibles <= 0;

  const abrirModal = (oferta) => {
    if (sorteoCerrado) return;
    setOfertaSeleccionada(oferta);
    setMostrarModal(true);
    setConfirmado(false);
  };

  /* ==========================
     CONFIRMAR PAGO (TRANSFER)
  =========================== */
  const confirmarPago = async () => {
    if (!telefono) return alert("Ingresá tu WhatsApp");
    if (!/^\d{10,13}$/.test(telefono))
      return alert("Ingresá un WhatsApp válido (solo números)");

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

      if (!res.ok) throw new Error("Error creando compra");

      setConfirmado(true);
    } catch (err) {
      console.error(err);
      alert("❌ Error registrando la compra");
    } finally {
      setLoading(false);
    }
  };

  const copiarAlias = () => {
    navigator.clipboard.writeText(sorteo.aliasPago);
    alert("Alias copiado ✅");
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <img
        src={sorteo.imagenUrl}
        alt={sorteo.titulo}
        className="rounded-xl w-full"
      />

      <h1 className="text-3xl font-bold mt-3">{sorteo.titulo}</h1>

      {sorteo.descripcion && (
        <p className="text-gray-700 mt-2 whitespace-pre-line">
          {sorteo.descripcion}
        </p>
      )}

      {/* 🔥 ÚLTIMAS CHANCES */}
      {sorteo.chancesDisponibles > 0 &&
        sorteo.chancesDisponibles <= 10 && (
          <div className="bg-red-600 text-white text-center py-2 rounded-xl font-bold animate-pulse my-4">
            🔥 Últimas {sorteo.chancesDisponibles} chances disponibles
          </div>
        )}

      {sorteoCerrado && (
        <div className="bg-gray-300 text-gray-800 text-center py-3 rounded-xl font-bold my-4">
          ⛔ Sorteo cerrado
        </div>
      )}

      {/* 🎟️ OFERTAS */}
      {!sorteoCerrado && (
        <div className="grid grid-cols-1 gap-3 my-6">
          {sorteo.ofertas?.map((oferta, i) => (
            <button
              key={i}
              onClick={() => abrirModal(oferta)}
              className="bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-bold text-lg"
            >
              {oferta.cantidad} chance{oferta.cantidad > 1 ? "s" : ""} · $
              {oferta.precio}
            </button>
          ))}
        </div>
      )}

      {/* 🪟 MODAL */}
      {mostrarModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
          <div className="bg-white p-6 rounded-xl w-full max-w-md">
            {!confirmado ? (
              <>
                <h2 className="text-xl font-bold mb-2">
                  {ofertaSeleccionada.cantidad} chance
                  {ofertaSeleccionada.cantidad > 1 ? "s" : ""} · $
                  {ofertaSeleccionada.precio}
                </h2>

                <p className="text-gray-600 mb-3">
                  Transferí al siguiente alias y luego confirmá el pago.
                </p>

                <div className="bg-gray-100 p-3 rounded flex justify-between items-center mb-3">
                  <span className="font-bold">{sorteo.aliasPago}</span>
                  <button
                    onClick={copiarAlias}
                    className="text-blue-600 underline text-sm"
                  >
                    Copiar
                  </button>
                </div>

                <input
                  className="border p-3 w-full mb-4 rounded"
                  placeholder="Tu WhatsApp (solo números)"
                  value={telefono}
                  onChange={(e) => setTelefono(e.target.value)}
                />

                <button
                  onClick={confirmarPago}
                  disabled={loading}
                  className="w-full bg-green-600 text-white py-3 rounded-xl font-bold"
                >
                  {loading ? "Confirmando..." : "Ya pagué"}
                </button>

                <button
                  onClick={() => setMostrarModal(false)}
                  className="underline text-gray-600 mt-3 block mx-auto"
                >
                  Cancelar
                </button>
              </>
            ) : (
              <>
                <h2 className="text-xl font-bold text-green-600 mb-2">
                  ✅ Pago informado
                </h2>
                <p className="text-gray-700 text-center">
                  En breve validamos tu pago y se acreditan tus chances.
                </p>

                <button
                  onClick={() => setMostrarModal(false)}
                  className="mt-4 bg-blue-600 text-white py-2 px-4 rounded mx-auto block"
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
